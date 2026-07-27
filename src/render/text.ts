/**
 * Text renderer.
 *
 * Emits the whole card as one `<text>` element. Each resolved line becomes a
 * positioned `<tspan>` (x resets the caret, y sets the baseline); each coloured
 * run becomes a nested `<tspan>` referencing its palette CSS class. Rendering
 * the entire line as a single monospace string is what keeps the dotted leaders
 * and right-aligned values perfectly aligned regardless of the viewer's font.
 */

import type { DocumentLayout } from "../layout/document.js";
import type { ResolvedLine } from "../layout/inline.js";
import { tspanLine, tspanRun } from "../svg/primitives.js";

export function renderText(
  lines: ResolvedLine[],
  card: DocumentLayout["card"],
): string {
  const rows = lines
    .map((line, i) => {
      if (line.runs.length === 0) return "";
      const y = card.top + i * card.lineHeight + card.baselineOffset;
      const inner = line.runs.map((r) => tspanRun(r.text, r.color)).join("");
      return tspanLine(card.x, y, inner);
    })
    .filter((s) => s.length > 0)
    .join("\n");

  return `<text xml:space="preserve">\n${rows}\n</text>`;
}
