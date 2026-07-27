/**
 * Rendering pipeline: data -> layout -> render -> SVG string.
 *
 *   ProfileData ─▶ buildCard ─▶ resolveLines ─▶ layoutDocument ─▶ SvgDocument
 *
 * This module wires the stages together and owns none of their logic, so each
 * stage stays independently testable and replaceable.
 */

import type { Theme } from "./config/theme.js";
import type { ProfileData } from "./data/profile.js";
import type { Mosaic } from "./image/mosaic.js";
import { layoutDocument } from "./layout/document.js";
import { resolveLines } from "./layout/inline.js";
import { buildCard } from "./render/card.js";
import { renderMatrix, renderMosaic } from "./render/mosaic.js";
import { renderText } from "./render/text.js";
import { SvgDocument } from "./svg/document.js";

export interface RenderInput {
  profile: ProfileData;
  theme: Theme;
  mosaic: Mosaic;
}

export function renderProfile({ profile, theme, mosaic }: RenderInput): string {
  // Layout stage.
  const lines = buildCard(profile);
  const { columns, resolved } = resolveLines(lines);
  const layout = layoutDocument(theme, columns, lines.length);

  // Render stage.
  const doc = new SvgDocument({
    width: layout.canvas.width,
    height: layout.canvas.height,
    background: theme.palette.background,
    cornerRadius: theme.layout.cornerRadius,
    palette: theme.palette,
    typography: theme.typography,
  });

  doc
    .add(renderMosaic(mosaic, layout.avatar, theme.avatar))
    .add(renderMatrix(layout.matrix, theme.matrix, theme.palette.matrix))
    .add(renderText(resolved, layout.card));

  return doc.serialize();
}
