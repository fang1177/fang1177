// scripts/update-projects.js
// Fetches all public repos for the user, sorts by last updated,
// and injects a formatted table into README.md between the marker comments.

const fs = require("fs");
const https = require("https");

const USERNAME = "fang1177";
const README_PATH = "README.md";
const START_MARKER = "<!--START_AUTO_PROJECTS-->";
const END_MARKER = "<!--END_AUTO_PROJECTS-->";

function fetchRepos() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "api.github.com",
      path: `/users/${USERNAME}/repos?per_page=100&sort=updated`,
      headers: {
        "User-Agent": "profile-readme-bot",
        Accept: "application/vnd.github+json",
        ...(process.env.GH_TOKEN
          ? { Authorization: `Bearer ${process.env.GH_TOKEN}` }
          : {}),
      },
    };

    https
      .get(options, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          if (res.statusCode !== 200) {
            return reject(new Error(`GitHub API error: ${res.statusCode} ${data}`));
          }
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function buildTable(repos) {
  const visible = repos.filter((r) => !r.fork && !r.archived);

  if (visible.length === 0) {
    return "_No public repositories found yet._";
  }

  const header = "| Repository | Description | Language | ⭐ Stars | Last Updated |\n|---|---|---|---|---|";
  const rows = visible.map((r) => {
    const name = `[${r.name}](${r.html_url})`;
    const desc = (r.description || "—").replace(/\|/g, "-");
    const lang = r.language || "—";
    const stars = r.stargazers_count ?? 0;
    const updated = formatDate(r.updated_at);
    return `| ${name} | ${desc} | ${lang} | ${stars} | ${updated} |`;
  });

  return [header, ...rows].join("\n");
}

async function main() {
  const repos = await fetchRepos();
  const table = buildTable(repos);

  const readme = fs.readFileSync(README_PATH, "utf8");
  const startIdx = readme.indexOf(START_MARKER);
  const endIdx = readme.indexOf(END_MARKER);

  if (startIdx === -1 || endIdx === -1) {
    throw new Error("Markers not found in README.md");
  }

  const before = readme.slice(0, startIdx + START_MARKER.length);
  const after = readme.slice(endIdx);

  const updated = `${before}\n\n${table}\n\n${after}`;
  fs.writeFileSync(README_PATH, updated);
  console.log(`Updated README with ${repos.length} repos.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
