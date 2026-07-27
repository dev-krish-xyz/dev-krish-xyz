/**
 * Card assembler.
 *
 * Turns the declarative {@link ProfileData} into an ordered list of lines by
 * composing the reusable components. This is the only place that knows the
 * profile's section shapes; the components below it stay generic.
 */

import type { ProfileData, Section } from "../data/profile.js";
import { blank, type Line } from "../layout/inline.js";
import {
  fieldLine,
  headingLine,
  linesOfCodeLine,
  statPairLine,
} from "./components.js";

function sectionLines(section: Section): Line[] {
  const lines: Line[] = [headingLine(section.heading)];

  if (section.kind === "fields") {
    for (const f of section.fields) lines.push(fieldLine(f.key, f.value));
  } else {
    for (const [a, b] of section.pairs) {
      lines.push(statPairLine(a.key, a.value, b.key, b.value));
    }
    const { total, additions, deletions } = section.linesOfCode;
    lines.push(linesOfCodeLine(total, additions, deletions));
  }

  return lines;
}

/** Build the full card as lines, inserting a blank spacer before each section
 * after the first. */
export function buildCard(profile: ProfileData): Line[] {
  const lines: Line[] = [];
  profile.sections.forEach((section, i) => {
    if (i > 0) lines.push(blank());
    lines.push(...sectionLines(section));
  });
  return lines;
}
