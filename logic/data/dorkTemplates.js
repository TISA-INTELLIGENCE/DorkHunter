/**
 * Bug-bounty recon dork template library.
 *
 * Each template uses the `{domain}` placeholder, which is replaced with the
 * target domain at expansion time. Templates are grouped into categories so a
 * campaign can request only the recon angles that matter for a program.
 *
 * `cache:` and `link:` operators are intentionally excluded — the search API
 * does not support them and they return 0 results.
 *
 * `weight` is the baseline severity contribution of a category. The per-result
 * severity scorer (see ../lib/severity.js) combines this with signals found in
 * the actual result URL/snippet.
 */

const CATEGORIES = [
  {
    key: "exposed_files",
    label: "Exposed Files & Backups",
    description:
      "Config, database dumps, archives and backups accidentally left web-accessible.",
    weight: 3,
    templates: [
      "site:{domain} ext:env OR ext:ini OR ext:conf OR ext:cfg",
      "site:{domain} ext:sql OR ext:dump OR ext:bak OR ext:backup",
      "site:{domain} ext:log OR ext:old OR ext:tmp OR ext:swp",
      "site:{domain} ext:zip OR ext:tar OR ext:gz OR ext:rar",
      'site:{domain} intitle:"index of" (backup OR dump OR db OR ".git")',
    ],
  },
  {
    key: "secrets",
    label: "Secrets & Credentials",
    description:
      "API keys, tokens, passwords and credential files exposed in indexed content.",
    weight: 4,
    templates: [
      'site:{domain} intext:"api_key" OR intext:"apikey" OR intext:"client_secret"',
      'site:{domain} intext:"password" filetype:log OR filetype:txt',
      'site:{domain} ext:env intext:"DB_PASSWORD" OR intext:"SECRET"',
      'site:{domain} intext:"BEGIN RSA PRIVATE KEY"',
      'site:{domain} (intext:"aws_access_key_id" OR intext:"aws_secret_access_key")',
    ],
  },
  {
    key: "admin_panels",
    label: "Admin & Login Panels",
    description:
      "Administrative interfaces, dashboards and auth portals worth probing.",
    weight: 2,
    templates: [
      "site:{domain} inurl:admin OR inurl:administrator OR inurl:adminpanel",
      'site:{domain} inurl:login OR inurl:signin OR intitle:"login"',
      "site:{domain} inurl:dashboard OR inurl:cpanel OR inurl:wp-admin",
      'site:{domain} intitle:"admin" (inurl:panel OR inurl:console)',
    ],
  },
  {
    key: "dev_staging",
    label: "Dev / Staging / Non-Prod Hosts",
    description:
      "Pre-production hosts and subdomains that are often less hardened.",
    weight: 3,
    templates: [
      "site:dev.{domain} OR site:staging.{domain} OR site:test.{domain}",
      "site:{domain} (inurl:dev OR inurl:staging OR inurl:qa OR inurl:uat)",
      "site:{domain} inurl:test OR inurl:sandbox OR inurl:demo",
      "site:{domain} -www",
    ],
  },
  {
    key: "api_docs",
    label: "API Docs & Endpoints",
    description:
      "Swagger/OpenAPI, GraphQL and other API surfaces that reveal attack surface.",
    weight: 2,
    templates: [
      "site:{domain} inurl:swagger OR inurl:api-docs OR inurl:openapi",
      'site:{domain} intitle:"swagger ui" OR inurl:"swagger.json"',
      "site:{domain} inurl:graphql OR inurl:graphiql",
      "site:{domain} inurl:api inurl:v1 OR inurl:v2 OR inurl:v3",
      "site:{domain} ext:wadl OR ext:wsdl",
    ],
  },
  {
    key: "error_leaks",
    label: "Errors & Info Disclosure",
    description:
      "Stack traces, debug output and error pages that leak internals.",
    weight: 2,
    templates: [
      'site:{domain} intext:"stack trace" OR intext:"Fatal error"',
      'site:{domain} intext:"Warning: mysql" OR intext:"SQL syntax"',
      'site:{domain} intext:"Whoops, looks like something went wrong"',
      'site:{domain} intext:"phpinfo()" OR intitle:"phpinfo()"',
      'site:{domain} intext:"Index of /" intext:"Parent Directory"',
    ],
  },
  {
    key: "saas_thirdparty",
    label: "Third-Party SaaS Exposure",
    description:
      "Target data indexed on external SaaS/collab platforms (Trello, Jira, S3, etc.).",
    weight: 3,
    templates: [
      'site:trello.com "{domain}"',
      'site:s3.amazonaws.com "{domain}"',
      'site:atlassian.net "{domain}"',
      'site:pastebin.com "{domain}"',
      'site:docs.google.com "{domain}"',
    ],
  },
  {
    key: "code_paste",
    label: "Source Code & Paste Sites",
    description:
      "Leaked source, configs and internal references on code/paste hosts.",
    weight: 3,
    templates: [
      'site:github.com "{domain}"',
      'site:gitlab.com "{domain}"',
      'site:github.com "{domain}" (password OR secret OR api_key)',
      'site:pastebin.com OR site:ghostbin.com "{domain}"',
    ],
  },
];

/** Expand selected categories into { dork, category } pairs for a domain. */
function expandDorks(domain, categoryKeys) {
  const selected =
    !categoryKeys || categoryKeys.length === 0
      ? CATEGORIES
      : CATEGORIES.filter((c) => categoryKeys.includes(c.key));

  const dorks = [];
  for (const cat of selected) {
    for (const tpl of cat.templates) {
      dorks.push({
        category: cat.key,
        categoryLabel: cat.label,
        weight: cat.weight,
        dork: tpl.replaceAll("{domain}", domain),
      });
    }
  }
  return dorks;
}

/** Public-facing category metadata (no template expansion). */
function listCategories() {
  return CATEGORIES.map(({ key, label, description, weight, templates }) => ({
    key,
    label,
    description,
    weight,
    dorkCount: templates.length,
  }));
}

module.exports = { CATEGORIES, expandDorks, listCategories };
