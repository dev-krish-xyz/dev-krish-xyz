const username = "dev-krish-xyz";
const token = process.env.GITHUB_TOKEN;

const authHeader = token ? { Authorization: `bearer ${token}` } : {};

const user = await fetch(`https://api.github.com/users/${username}`, {
  headers: authHeader,
}).then((r) => r.json());

const repos = await fetch(
  `https://api.github.com/users/${username}/repos?per_page=100`,
  { headers: authHeader },
).then((r) => r.json());

const stars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

const stats = {
  repos: user.public_repos,
  followers: user.followers,
  stars,
  // Total commits and lines-of-code diff across all repos require walking
  // full commit history per repo; not computed live, kept as rough estimates.
  commits: "1,400",
  loc: "60,800",
  locAdd: "72,960",
  locDel: "12,160",
};

const COLORS = {
  bg: "#0d1117",
  bullet: "#ffa657",
  key: "#ffa657",
  dots: "#6e7681",
  value: "#79c0ff",
  header: "#c9d1d9",
  addColor: "#3fb950",
  delColor: "#f85149",
};

const FONT_SIZE = 16;
const LINE_HEIGHT = 20;
const CHAR_WIDTH = 9.6;
const PAD_X = 20;
const TOP_PAD = 30;
const BOTTOM_PAD = 20;
const RIGHT_X = PAD_X;

// Column all values align to, based on the longest key across every row.
const ALIGN_COL = 24;

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fieldRow(key, value) {
  const label = `${key}::`;
  const dots = ".".repeat(Math.max(3, ALIGN_COL - label.length));
  return `<tspan class="bullet">&#8226; </tspan><tspan class="key">${esc(key)}</tspan><tspan class="dots">${esc(":: " + dots + " ")}</tspan><tspan class="value">${esc(value)}</tspan>`;
}

function statPairRow(k1, v1, k2, v2) {
  const half = 20;
  const l1 = `${k1}::`;
  const d1 = ".".repeat(Math.max(3, half - l1.length));
  const l2 = `${k2}::`;
  const d2 = ".".repeat(Math.max(3, half - l2.length));
  return `<tspan class="bullet">&#8226; </tspan><tspan class="key">${esc(k1)}</tspan><tspan class="dots">${esc(":: " + d1 + " ")}</tspan><tspan class="value">${esc(v1)}</tspan><tspan class="dots"> | </tspan><tspan class="key">${esc(k2)}</tspan><tspan class="dots">${esc(":: " + d2 + " ")}</tspan><tspan class="value">${esc(v2)}</tspan>`;
}

function sectionHeader(title) {
  return `<tspan class="header">${esc(title)} </tspan>`;
}

const rows = [];
rows.push({ type: "header", text: `${username}@github` });
rows.push({ type: "field", content: fieldRow("Role", "Full-Stack AI Engineer") });
rows.push({ type: "field", content: fieldRow("Location", "India") });
rows.push({ type: "field", content: fieldRow("Building", "LeadPilot") });
rows.push({ type: "field", content: fieldRow("Focus", "AI Automation, Full-Stack Apps, SaaS") });
rows.push({ type: "field", content: fieldRow("Mission", "Building AI products that automate work.") });

rows.push({ type: "section", content: sectionHeader("- Stack") });
rows.push({ type: "field", content: fieldRow("Languages", "TypeScript, Python, C, C++") });
rows.push({ type: "field", content: fieldRow("Frontend", "Next.js, React, Tailwind CSS") });
rows.push({ type: "field", content: fieldRow("Backend", "Node.js, Hono, FastAPI, Express") });
rows.push({ type: "field", content: fieldRow("Databases", "PostgreSQL, MongoDB, Qdrant") });
rows.push({ type: "field", content: fieldRow("AI", "OpenAI, Anthropic, RAG, MCP") });
rows.push({ type: "field", content: fieldRow("DevOps", "Docker, GitHub Actions, n8n, Linux") });

rows.push({ type: "section", content: sectionHeader("- Current") });
rows.push({ type: "field", content: fieldRow("Building", "LeadPilot") });
rows.push({ type: "field", content: fieldRow("Learning & Interests", "Agentic AI, Open Source, AI Automation") });

rows.push({ type: "section", content: sectionHeader("- Contact") });
rows.push({ type: "field", content: fieldRow("Website", "https://krishx.dev") });
rows.push({ type: "field", content: fieldRow("GitHub", "https://github.com/dev-krish-xyz") });
rows.push({ type: "field", content: fieldRow("Twitter", "https://x.com/krishdotdev") });
rows.push({ type: "field", content: fieldRow("LinkedIn", "https://www.linkedin.com/in/kalpatarubehera/") });

rows.push({ type: "section", content: sectionHeader("- GitHub Stats") });
rows.push({
  type: "field",
  content: statPairRow("Repos", stats.repos, "Stars", stats.stars),
});
rows.push({
  type: "field",
  content: statPairRow("Commits", stats.commits, "Followers", stats.followers),
});
rows.push({
  type: "field",
  content: `<tspan class="bullet">&#8226; </tspan><tspan class="key">Lines of Code</tspan><tspan class="dots">${esc(":: ...... ")}</tspan><tspan class="value">${stats.loc}</tspan><tspan class="dots"> ( </tspan><tspan class="addColor">${stats.locAdd}++</tspan><tspan class="dots">, </tspan><tspan class="delColor">${stats.locDel}--</tspan><tspan class="dots"> )</tspan>`,
});

const longestLineChars = Math.max(
  ...rows.map((r) => {
    const plain = (r.text || r.content || "").replace(/<[^>]+>/g, "").replace(/&#8226;/g, "-").replace(/&amp;/g, "&");
    return plain.length;
  }),
);

const rightWidth = Math.ceil(longestLineChars * CHAR_WIDTH) + 20;
const width = RIGHT_X + rightWidth + PAD_X;
const contentHeight = TOP_PAD + rows.length * LINE_HEIGHT + BOTTOM_PAD;

let textLines = "";
rows.forEach((row, i) => {
  const y = TOP_PAD + i * LINE_HEIGHT;
  if (row.type === "header") {
    const dashesLen = Math.max(0, Math.floor((rightWidth - row.text.length * CHAR_WIDTH) / CHAR_WIDTH));
    textLines += `<tspan x="${RIGHT_X}" y="${y}"><tspan class="header">${esc(row.text)} </tspan><tspan class="dots">${"─".repeat(dashesLen)}</tspan></tspan>\n`;
  } else if (row.type === "section") {
    const plain = row.content.replace(/<[^>]+>/g, "");
    const dashesLen = Math.max(0, Math.floor((rightWidth - plain.length * CHAR_WIDTH) / CHAR_WIDTH));
    textLines += `<tspan x="${RIGHT_X}" y="${y}">${row.content}<tspan class="dots">${"─".repeat(dashesLen)}</tspan></tspan>\n`;
  } else {
    textLines += `<tspan x="${RIGHT_X}" y="${y}">${row.content}</tspan>\n`;
  }
});

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}" height="${contentHeight}" font-family="Consolas, Monaco, monospace" font-size="${FONT_SIZE}px">
<style>
  .bullet, .key { fill: ${COLORS.key}; }
  .dots { fill: ${COLORS.dots}; }
  .value { fill: ${COLORS.value}; }
  .header { fill: ${COLORS.header}; }
  .addColor { fill: ${COLORS.addColor}; }
  .delColor { fill: ${COLORS.delColor}; }
  text, tspan { white-space: pre; }
</style>
<rect width="${width}" height="${contentHeight}" fill="${COLORS.bg}" rx="12" />
<text fill="${COLORS.header}">
${textLines}
</text>
</svg>
`;

const fs = await import("node:fs/promises");
await fs.writeFile("assets/card.svg", svg);
console.log(`Generated assets/card.svg (${width}x${contentHeight}), repos=${stats.repos} stars=${stats.stars} followers=${stats.followers}`);
