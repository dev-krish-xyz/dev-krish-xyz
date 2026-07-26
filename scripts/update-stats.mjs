const username = "dev-krish-xyz";
const token = process.env.GITHUB_TOKEN;

const user = await fetch(`https://api.github.com/users/${username}`, {
  headers: { Authorization: `bearer ${token}` },
}).then((r) => r.json());

const graphql = await fetch("https://api.github.com/graphql", {
  method: "POST",
  headers: {
    Authorization: `bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: `query { user(login: "${username}") { contributionsCollection { contributionCalendar { totalContributions } } } }`,
  }),
}).then((r) => r.json());

const repos = user.public_repos;
const followers = user.followers;
const contributions =
  graphql.data.user.contributionsCollection.contributionCalendar.totalContributions;

const fs = await import("node:fs/promises");
let readme = await fs.readFile("README.md", "utf8");

readme = readme.replace(/^(Repositories\.+ ).*/m, `$1${repos}`);
readme = readme.replace(/^(Contributions\.+ ).*/m, `$1${contributions}`);
readme = readme.replace(/^(Followers\.+ ).*/m, `$1${followers}`);

await fs.writeFile("README.md", readme);
