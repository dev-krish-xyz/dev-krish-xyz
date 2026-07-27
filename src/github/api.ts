/**
 * GitHub integration.
 *
 * Fetches the counters that can be computed cheaply from the public REST API
 * (repos, stars, followers) and the avatar image. Everything is best-effort:
 * on any network or auth failure the caller keeps the values already present in
 * the profile data, so generation never hard-fails offline.
 */

import type { ProfileData, StatsSection } from "../data/profile.js";

export interface LiveStats {
  repos?: number;
  stars?: number;
  followers?: number;
}

function authHeaders(token: string | undefined): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "profile-svg-generator",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

/** Fetch repos / stars / followers. Returns `{}` if the API is unreachable. */
export async function fetchStats(
  username: string,
  token: string | undefined,
): Promise<LiveStats> {
  const headers = authHeaders(token);
  try {
    const user = (await fetch(`https://api.github.com/users/${username}`, {
      headers,
    }).then((r) => r.json())) as { public_repos?: number; followers?: number };

    const repos = (await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&type=owner`,
      { headers },
    ).then((r) => r.json())) as { stargazers_count?: number }[];

    const stats: LiveStats = {};
    if (typeof user.public_repos === "number") stats.repos = user.public_repos;
    if (typeof user.followers === "number") stats.followers = user.followers;
    if (Array.isArray(repos)) {
      stats.stars = repos.reduce((sum, r) => sum + (r.stargazers_count ?? 0), 0);
    }
    return stats;
  } catch {
    return {};
  }
}

/** Download the avatar bytes for mosaic processing. */
export async function fetchAvatar(url: string): Promise<Buffer> {
  const res = await fetch(url, {
    headers: { "User-Agent": "profile-svg-generator" },
  });
  if (!res.ok) throw new Error(`avatar fetch failed: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

/**
 * Return a copy of `profile` with live stats merged into the stats section.
 * Only the fetched fields are overwritten; the rest are left untouched.
 */
export function applyStats(profile: ProfileData, live: LiveStats): ProfileData {
  const overrides: Record<string, string> = {};
  if (live.repos !== undefined) overrides.Repos = formatCount(live.repos);
  if (live.stars !== undefined) overrides.Stars = formatCount(live.stars);
  if (live.followers !== undefined)
    overrides.Followers = formatCount(live.followers);

  const sections = profile.sections.map((section) => {
    if (section.kind !== "stats") return section;
    const updated: StatsSection = {
      ...section,
      pairs: section.pairs.map(
        ([a, b]) =>
          [
            { ...a, value: overrides[a.key] ?? a.value },
            { ...b, value: overrides[b.key] ?? b.value },
          ] as [typeof a, typeof b],
      ),
    };
    return updated;
  });

  return { ...profile, sections };
}
