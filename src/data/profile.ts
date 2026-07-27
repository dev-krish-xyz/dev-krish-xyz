/**
 * Profile content — the single source of truth for everything displayed.
 *
 * Presentation is deliberately kept out of this file: there are no colours,
 * coordinates or dot counts here, only what the card should say. The card
 * builder turns this data into styled lines.
 */

/** A `key:: value` row. */
export interface Field {
  key: string;
  value: string;
}

/** A block of `key:: value` rows under a heading. */
export interface FieldSection {
  kind: "fields";
  /** Text shown before the trailing rule, e.g. `- Stack`. */
  heading: string;
  fields: Field[];
}

/** Repository / activity counters, rendered as two-up rows. */
export interface StatsSection {
  kind: "stats";
  heading: string;
  /** Left/right stat pairs rendered as `a:: .. n | b:: .. m`. */
  pairs: [Field, Field][];
  /** Lines-of-code summary rendered with coloured add/delete counts. */
  linesOfCode: {
    total: string;
    additions: string;
    deletions: string;
  };
}

export type Section = FieldSection | StatsSection;

export interface ProfileData {
  /** GitHub handle; also used for the API lookup and header line. */
  username: string;
  /** Avatar image URL (fetched and turned into a mosaic). */
  avatarUrl: string;
  /** Ordered sections. The first is rendered without a leading spacer. */
  sections: Section[];
}

export const profile: ProfileData = {
  username: "dev-krish-xyz",
  avatarUrl: "https://github.com/dev-krish-xyz.png",
  sections: [
    {
      kind: "fields",
      heading: "dev-krish-xyz@github",
      fields: [
        { key: "Role", value: "Full-Stack AI Engineer" },
        { key: "Location", value: "India" },
        { key: "Building", value: "LeadPilot" },
        { key: "Focus", value: "AI Automation, Full-Stack Apps, SaaS" },
        { key: "Mission", value: "Building AI products that automate work." },
      ],
    },
    {
      kind: "fields",
      heading: "- Stack",
      fields: [
        { key: "Languages", value: "TypeScript, Python, C, C++" },
        { key: "Frontend", value: "Next.js, React, Tailwind CSS" },
        { key: "Backend", value: "Node.js, Hono, FastAPI, Express" },
        { key: "Databases", value: "PostgreSQL, MongoDB, Qdrant" },
        { key: "AI", value: "OpenAI, Anthropic, RAG, MCP" },
        { key: "DevOps", value: "Docker, GitHub Actions, n8n, Linux" },
      ],
    },
    {
      kind: "fields",
      heading: "- Current",
      fields: [
        { key: "Building", value: "LeadPilot" },
        {
          key: "Learning & Interests",
          value: "Agentic AI, Open Source, AI Automation",
        },
      ],
    },
    {
      kind: "fields",
      heading: "- Contact",
      fields: [
        { key: "Website", value: "https://krishx.dev" },
        { key: "GitHub", value: "https://github.com/dev-krish-xyz" },
        { key: "Twitter", value: "https://x.com/krishdotdev" },
        { key: "LinkedIn", value: "https://linkedin.com/in/kalpatarubehera/" },
      ],
    },
    {
      kind: "stats",
      heading: "- GitHub Stats",
      pairs: [
        [
          { key: "Repos", value: "28" },
          { key: "Stars", value: "48" },
        ],
        [
          { key: "Commits", value: "1,400" },
          { key: "Followers", value: "103" },
        ],
      ],
      linesOfCode: {
        total: "60,800",
        additions: "72,960",
        deletions: "12,160",
      },
    },
  ],
};
