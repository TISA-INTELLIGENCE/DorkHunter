import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SeverityBadge } from "./severityBadge";
import { STATUSES } from "./severityConstants";

const VITE_API_URL = import.meta.env.VITE_API_URL;
const SEV_ORDER = ["critical", "high", "medium", "low", "info"];

const STATUS_STYLE = {
  new: "border-gray-300",
  reviewing: "border-yellow-400 bg-yellow-50",
  reported: "border-green-500 bg-green-50",
  "false-positive": "border-gray-300 bg-gray-50 opacity-60",
};

const CampaignDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sevFilter, setSevFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`${VITE_API_URL}recon/${id}`);
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch campaign");
        }
        setCampaign(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaign();
  }, [id]);

  const updateFinding = async (fid, patch) => {
    // optimistic update
    setCampaign((prev) => ({
      ...prev,
      findings: prev.findings.map((f) =>
        f._id === fid ? { ...f, ...patch } : f,
      ),
    }));
    try {
      await fetch(`${VITE_API_URL}recon/${id}/findings/${fid}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
    } catch {
      /* keep optimistic value; a reload will reconcile */
    }
  };

  const exportUrl = (format) =>
    `${VITE_API_URL}recon/${id}/export?format=${format}`;

  const handleDelete = async () => {
    if (!window.confirm("Delete this campaign? This cannot be undone.")) return;
    await fetch(`${VITE_API_URL}recon/${id}`, { method: "DELETE" });
    navigate("/campaigns");
  };

  const filtered = useMemo(() => {
    if (!campaign) return [];
    return campaign.findings.filter(
      (f) =>
        (sevFilter === "all" || f.severity === sevFilter) &&
        (statusFilter === "all" || f.status === statusFilter),
    );
  }, [campaign, sevFilter, statusFilter]);

  if (loading) return <p className="text-center mt-8">Loading campaign…</p>;
  if (error && !campaign)
    return <p className="text-center mt-8 text-red-500">{error}</p>;
  if (!campaign) return <p className="text-center mt-8">Not found.</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-2xl font-bold">{campaign.domain}</h3>
          <p className="text-sm text-gray-500">
            {campaign.stats?.totalFindings} findings ·{" "}
            {campaign.stats?.dorksRun} dorks ·{" "}
            {new Date(campaign.createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <a
            href={exportUrl("csv")}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-100"
          >
            Export CSV
          </a>
          <a
            href={exportUrl("json")}
            className="text-sm border rounded px-3 py-1.5 hover:bg-gray-100"
          >
            Export JSON
          </a>
          <button
            onClick={handleDelete}
            className="text-sm bg-red-600 text-white rounded px-3 py-1.5 hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>

      {/* severity summary */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SEV_ORDER.map((s) => (
          <span key={s} className="text-xs">
            <SeverityBadge severity={s} />{" "}
            <span className="text-gray-600">
              {campaign.stats?.bySeverity?.[s] ?? 0}
            </span>
          </span>
        ))}
      </div>

      {campaign.runErrors?.length > 0 && (
        <details className="mb-4 text-xs text-gray-500">
          <summary className="cursor-pointer">
            {campaign.runErrors.length} dork(s) errored
          </summary>
          <ul className="mt-1 list-disc list-inside">
            {campaign.runErrors.map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </details>
      )}

      {/* filters */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <select
          value={sevFilter}
          onChange={(e) => setSevFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All severities</option>
          {SEV_ORDER.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="all">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="text-gray-500 self-center">
          {filtered.length} shown
        </span>
      </div>

      {/* findings */}
      <ul className="space-y-3">
        {filtered.map((f) => (
          <li
            key={f._id}
            className={`border rounded-lg p-3 ${STATUS_STYLE[f.status] || ""}`}
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <SeverityBadge severity={f.severity} />
              <select
                value={f.status}
                onChange={(e) =>
                  updateFinding(f._id, { status: e.target.value })
                }
                className="text-xs border rounded px-2 py-1"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <a
              href={f.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-semibold hover:underline break-words"
            >
              {f.title || f.link}
            </a>
            <p className="text-sm text-gray-700 mt-1">{f.snippet}</p>
            <p className="text-xs text-gray-400 mt-1 break-all">{f.link}</p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="text-xs bg-gray-100 rounded px-2 py-0.5">
                {f.categoryLabel || f.category}
              </span>
              {(f.tags || []).map((t) => (
                <span
                  key={t}
                  className="text-xs bg-purple-100 text-purple-800 rounded px-2 py-0.5"
                >
                  {t}
                </span>
              ))}
            </div>

            <details className="mt-2 text-xs text-gray-500">
              <summary className="cursor-pointer">dork</summary>
              <code className="block mt-1 break-all">{f.dork}</code>
            </details>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="text-center mt-8 text-gray-500">
          No findings match the current filters.
        </p>
      )}
    </div>
  );
};

export default CampaignDetails;
