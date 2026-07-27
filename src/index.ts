/**
 * Entry point.
 *
 * Orchestrates the full run: pull live GitHub stats and the avatar, turn the
 * avatar into a mosaic, render the profile SVG, and write it to disk. Network
 * work is best-effort — a cached avatar and the static data keep the generator
 * working offline and in CI without a token.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { theme } from "./config/theme.js";
import { profile } from "./data/profile.js";
import { applyStats, fetchAvatar, fetchStats } from "./github/api.js";
import { buildMosaic } from "./image/mosaic.js";
import { renderProfile } from "./pipeline.js";

const OUTPUT_PATH = "assets/profile.svg";
const AVATAR_CACHE = "assets/.avatar-cache";

/** Fetch the avatar, caching it so later offline runs still succeed. */
async function loadAvatar(url: string): Promise<Buffer> {
  try {
    const buffer = await fetchAvatar(url);
    await mkdir(dirname(AVATAR_CACHE), { recursive: true });
    await writeFile(AVATAR_CACHE, buffer);
    return buffer;
  } catch (err) {
    console.warn(`avatar fetch failed, using cache: ${(err as Error).message}`);
    return readFile(AVATAR_CACHE);
  }
}

async function main(): Promise<void> {
  const token = process.env.GITHUB_TOKEN;

  const [live, avatarBytes] = await Promise.all([
    fetchStats(profile.username, token),
    loadAvatar(profile.avatarUrl),
  ]);

  const data = applyStats(profile, live);
  const mosaic = await buildMosaic(avatarBytes, theme.avatar.cells);
  const svg = renderProfile({ profile: data, theme, mosaic });

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, svg);

  console.log(
    `Wrote ${OUTPUT_PATH} — repos=${live.repos ?? "?"} stars=${live.stars ?? "?"} followers=${live.followers ?? "?"}`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
