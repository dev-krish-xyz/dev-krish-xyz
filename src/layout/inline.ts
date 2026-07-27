/**
 * Inline layout engine.
 *
 * The text column is laid out on a monospace character grid measured in
 * columns, not pixels. A line is a sequence of coloured runs plus optional
 * "fills" — flexible leaders (dotted `.` or dashed `─`) that stretch to absorb
 * slack so that values right-align and rules reach the edge.
 *
 * The engine measures every line, picks the natural column width for the whole
 * block (auto section sizing), then resolves each line's fills to that width
 * (automatic text flow). It never positions in pixels; that is the document
 * layer's job.
 */

import type { Palette } from "../config/theme.js";

/** A colour role from the palette. */
export type ColorToken = keyof Palette;

/** A fixed run of text in one colour. */
export interface Span {
  type: "span";
  text: string;
  color: ColorToken;
}

/** A flexible leader that grows to fill available columns. */
export interface Fill {
  type: "fill";
  /** Character repeated to fill, e.g. `.` or `─`. */
  char: string;
  color: ColorToken;
  /** Share of the slack relative to other fills on the same line. */
  weight: number;
  /** Minimum column count even when there is no slack. */
  min: number;
}

export type Segment = Span | Fill;

/** A single line of the card. An empty segment list renders as a blank row. */
export interface Line {
  segments: Segment[];
}

/** A resolved, ready-to-render coloured run. */
export interface ResolvedRun {
  text: string;
  color: ColorToken;
}

export interface ResolvedLine {
  runs: ResolvedRun[];
}

/** Convenience constructors keep the card builder terse and declarative. */
export const span = (text: string, color: ColorToken): Span => ({
  type: "span",
  text,
  color,
});

export const fill = (
  char: string,
  color: ColorToken,
  weight = 1,
  min = 0,
): Fill => ({ type: "fill", char, color, weight, min });

/** Blank spacer row. */
export const blank = (): Line => ({ segments: [] });

/** Columns consumed by a line's non-flexible content, including fill minimums. */
function fixedWidth(line: Line): number {
  return line.segments.reduce(
    (sum, seg) => sum + (seg.type === "span" ? seg.text.length : seg.min),
    0,
  );
}

/**
 * Resolve every line to a common column width.
 *
 * @returns the chosen column count and the resolved lines. The column count is
 *   the widest line's fixed width, so the block sizes itself to its content.
 */
export function resolveLines(lines: Line[]): {
  columns: number;
  resolved: ResolvedLine[];
} {
  const columns = lines.reduce((max, line) => Math.max(max, fixedWidth(line)), 0);

  const resolved = lines.map<ResolvedLine>((line) => {
    if (line.segments.length === 0) return { runs: [] };

    const fills = line.segments.filter((s): s is Fill => s.type === "fill");
    const totalWeight = fills.reduce((sum, f) => sum + f.weight, 0);
    const slack = Math.max(0, columns - fixedWidth(line));

    // Distribute slack across fills by weight; give rounding remainder to the
    // last fill so the line lands exactly on `columns`.
    const extra = new Map<Fill, number>();
    let handed = 0;
    fills.forEach((f, i) => {
      const share =
        totalWeight === 0
          ? 0
          : i === fills.length - 1
            ? slack - handed
            : Math.floor((slack * f.weight) / totalWeight);
      handed += share;
      extra.set(f, share);
    });

    const runs: ResolvedRun[] = line.segments.map((seg) =>
      seg.type === "span"
        ? { text: seg.text, color: seg.color }
        : {
            text: seg.char.repeat(seg.min + (extra.get(seg) ?? 0)),
            color: seg.color,
          },
    );

    return { runs: runs.filter((r) => r.text.length > 0) };
  });

  return { columns, resolved };
}
