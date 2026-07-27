/**
 * Reusable line components.
 *
 * Each function returns a {@link Line} built from generic inline segments. These
 * are the composable building blocks — heading, field, dotted-leader row,
 * divider — that the card assembler arranges. None of them know about the
 * profile data shape; they take plain strings, so they stay reusable.
 */

import { fill, span, type Line } from "../layout/inline.js";

/**
 * Non-breaking space. SVG renderers collapse leading/trailing whitespace inside
 * an individual `<tspan>`, so every intentional gap between coloured runs uses
 * NBSP, which is never collapsed. It occupies exactly one monospace column, so
 * alignment on the character grid is unaffected.
 */
const NB = " ";

/** A single space + dotted leader + trailing space, in leader colour. */
function dottedLeader(weight = 1) {
  return [span(NB, "leader"), fill(".", "leader", weight, 3), span(NB, "leader")];
}

/**
 * Heading row: `text ─────────────…` — title text followed by a rule that
 * stretches to the block edge. Doubles as the divider between sections.
 */
export function headingLine(text: string): Line {
  return {
    segments: [span(`${text}${NB}`, "heading"), fill("─", "rule", 1, 0)],
  };
}

/** Field row: `• Key:: …… value` with the value right-aligned. */
export function fieldLine(key: string, value: string): Line {
  return {
    segments: [
      span(`•${NB}`, "key"),
      span(`${key}::`, "key"),
      ...dottedLeader(),
      span(value, "value"),
    ],
  };
}

/** Two-up stat row: `• A:: … n | B:: … m`, each half self-aligning. */
export function statPairLine(
  k1: string,
  v1: string,
  k2: string,
  v2: string,
): Line {
  return {
    segments: [
      span(`•${NB}`, "key"),
      span(`${k1}::`, "key"),
      ...dottedLeader(),
      span(v1, "value"),
      span(`${NB}|${NB}`, "leader"),
      span(`${k2}::`, "key"),
      ...dottedLeader(),
      span(v2, "value"),
    ],
  };
}

/** Lines-of-code row with coloured additions/deletions pinned to the right. */
export function linesOfCodeLine(
  total: string,
  additions: string,
  deletions: string,
): Line {
  return {
    segments: [
      span(`•${NB}`, "key"),
      span("Lines of Code::", "key"),
      ...dottedLeader(),
      span(total, "value"),
      span(`${NB}(${NB}`, "leader"),
      span(`${additions}++`, "additions"),
      span(`${NB},${NB}`, "leader"),
      span(`${deletions}--`, "deletions"),
      span(`${NB})`, "leader"),
    ],
  };
}
