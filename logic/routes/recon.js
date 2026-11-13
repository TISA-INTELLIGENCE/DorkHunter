const express = require("express");
const router = express.Router();
const { getJson } = require("serpapi");

const Campaign = require("../models/campaign");
const ValidateObjectId = require("../middleware/validateObjectId");
const { expandDorks, listCategories } = require("../data/dorkTemplates");
const { scoreResult, RANK } = require("../lib/severity");

// Pages of SERP results to pull per individual dork. Kept low because a
// campaign fans out across many dorks and API calls are metered.
const PAGES_PER_DORK = 1;

/** Run one dork through SerpAPI and return normalized organic results. */
async function runDork(dork, { pages = PAGES_PER_DORK } = {}) {
  const results = [];
  let params = {
    engine: "google",
    api_key: process.env.SERPAPI_KEY,
    q: dork,
    location: "United States",
  };

  let page = 0;
  while (params && page < pages) {
    const json = await getJson(params);
    if (json.error) throw new Error(json.error);

    if (Array.isArray(json.organic_results)) {
      for (const r of json.organic_results) {
        results.push({ title: r.title, link: r.link, snippet: r.snippet });
      }
    }

    if (json.serpapi_pagination && json.serpapi_pagination.next) {
      const nextUrl = new URL(json.serpapi_pagination.next);
      params = Object.fromEntries(nextUrl.searchParams);
      params.api_key = process.env.SERPAPI_KEY;
      page++;
    } else {
      params = null;
    }
  }
  return results;
}

// GET /api/v1/recon/templates — available dork categories
router.get("/templates", (req, res) => {
  res.status(200).json({
    message: "Retrieved successfully",
    data: listCategories(),
    success: true,
  });
});

// POST /api/v1/recon — launch a recon campaign against a domain
// body: { domain: string, categories?: string[] }
router.post("/", async (req, res) => {
  try {
    const { domain, categories } = req.body || {};

    if (!domain || typeof domain !== "string" || !domain.trim()) {
      return res
        .status(400)
        .json({ message: "domain is required", success: false });
    }

    // Normalize: strip scheme/path, keep bare host.
    const cleanDomain = domain
      .trim()
      .replace(/^https?:\/\//i, "")
      .replace(/\/.*$/, "")
      .toLowerCase();

    const dorks = expandDorks(cleanDomain, categories);
    if (dorks.length === 0) {
      return res
        .status(400)
        .json({
          message: "No dorks matched the selected categories",
          success: false,
        });
    }

    const seen = new Set();
    const findings = [];
    const errors = [];
    const bySeverity = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };

    for (const d of dorks) {
      let results;
      try {
        results = await runDork(d.dork);
      } catch (err) {
        errors.push(`${d.dork} :: ${err.message || err}`);
        continue;
      }

      for (const r of results) {
        if (!r.link || seen.has(r.link)) continue; // dedupe by link
        seen.add(r.link);

        const { severity, score, tags } = scoreResult(r, d.weight);
        bySeverity[severity]++;
        findings.push({
          title: r.title,
          link: r.link,
          snippet: r.snippet,
          dork: d.dork,
          category: d.category,
          categoryLabel: d.categoryLabel,
          severity,
          score,
          tags,
          status: "new",
        });
      }
    }

    // Highest-signal findings first.
    findings.sort(
      (a, b) => RANK[b.severity] - RANK[a.severity] || b.score - a.score,
    );

    const campaign = await Campaign.create({
      domain: cleanDomain,
      categories: categories && categories.length ? categories : ["all"],
      stats: {
        dorksRun: dorks.length,
        totalFindings: findings.length,
        bySeverity,
      },
      runErrors: errors,
      findings,
    });

    res.status(201).json({
      message: "Recon campaign complete",
      data: campaign,
      success: true,
    });
  } catch (error) {
    console.error(`Recon Error: ${error.message}`);
    if (!res.headersSent) {
      res
        .status(500)
        .json({
          message: error.message || "Internal server error",
          success: false,
        });
    }
  }
});

// GET /api/v1/recon — list campaigns (summary only, no findings payload)
router.get("/", async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .select("-findings")
      .sort({ createdAt: -1 });

    if (campaigns.length === 0) {
      return res
        .status(404)
        .json({ message: "No campaigns stored", success: false });
    }

    res.status(200).json({
      message: "Retrieved successfully",
      data: campaigns,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// GET /api/v1/recon/:id — full campaign with findings
router.get("/:id", ValidateObjectId, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Not found", success: false });
    }
    res.status(200).json({
      message: "Retrieved successfully",
      data: campaign,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// PATCH /api/v1/recon/:id/findings/:fid — triage a single finding
// body: { status?, tags?, severity? }
router.patch("/:id/findings/:fid", ValidateObjectId, async (req, res) => {
  try {
    const { status, tags, severity } = req.body || {};
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res
        .status(404)
        .json({ message: "Campaign not found", success: false });
    }

    const finding = campaign.findings.id(req.params.fid);
    if (!finding) {
      return res
        .status(404)
        .json({ message: "Finding not found", success: false });
    }

    if (status !== undefined) finding.status = status;
    if (Array.isArray(tags)) finding.tags = tags;
    if (severity !== undefined) finding.severity = severity;

    await campaign.save();

    res.status(200).json({
      message: "Updated successfully",
      data: finding,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// GET /api/v1/recon/:id/export?format=csv|json — export findings
router.get("/:id/export", ValidateObjectId, async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ message: "Not found", success: false });
    }

    const format = (req.query.format || "json").toLowerCase();
    const base = `dorkhunter_${campaign.domain}_${campaign._id}`;

    if (format === "csv") {
      const header = [
        "severity",
        "status",
        "category",
        "title",
        "link",
        "dork",
        "tags",
        "snippet",
      ];
      const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
      const rows = campaign.findings.map((f) =>
        [
          f.severity,
          f.status,
          f.category,
          f.title,
          f.link,
          f.dork,
          (f.tags || []).join("|"),
          f.snippet,
        ]
          .map(esc)
          .join(","),
      );
      const csv = [header.join(","), ...rows].join("\n");
      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${base}.csv"`,
      );
      return res.status(200).send(csv);
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="${base}.json"`);
    return res.status(200).send(JSON.stringify(campaign, null, 2));
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

// DELETE /api/v1/recon/:id
router.delete("/:id", ValidateObjectId, async (req, res) => {
  try {
    const deleted = await Campaign.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Not found", success: false });
    }
    res.status(200).json({
      message: "Deleted successfully",
      data: deleted,
      success: true,
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: "Internal server error", success: false });
  }
});

module.exports = router;
