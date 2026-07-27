/**
 * Mosaic + dot-matrix renderers.
 *
 * Turns the avatar {@link Mosaic} into a grid of coloured rectangles and fills
 * the space beneath it with a decorative dot lattice. Both are pure SVG
 * primitives — no raster image is embedded.
 */

import type { AvatarStyle, MatrixStyle } from "../config/theme.js";
import type { Mosaic } from "../image/mosaic.js";
import type { Rect as Bounds } from "../layout/document.js";
import { circle, rect, rgbToHex } from "../svg/primitives.js";

/** Render the avatar as one rect per cell, leaving `cellGap` dark gaps that
 * read as terminal grid lines. */
export function renderMosaic(
  mosaic: Mosaic,
  bounds: Bounds,
  style: AvatarStyle,
): string {
  const { cellSize, cellGap } = style;
  const draw = cellSize - cellGap;
  const parts: string[] = [];

  for (let row = 0; row < mosaic.size; row++) {
    for (let col = 0; col < mosaic.size; col++) {
      const px = mosaic.pixels[row * mosaic.size + col];
      if (!px) continue;
      parts.push(
        rect({
          x: bounds.x + col * cellSize,
          y: bounds.y + row * cellSize,
          width: draw,
          height: draw,
          fill: rgbToHex(px),
        }),
      );
    }
  }

  return `<g>${parts.join("")}</g>`;
}

/** Fill `bounds` with a regularly spaced grid of dim dots. */
export function renderMatrix(
  bounds: Bounds,
  style: MatrixStyle,
  color: string,
): string {
  if (bounds.height <= 0) return "";
  const { pitch, radius } = style;
  const cols = Math.floor(bounds.width / pitch);
  const rows = Math.floor(bounds.height / pitch);
  const parts: string[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      parts.push(
        circle(
          bounds.x + radius + c * pitch,
          bounds.y + radius + r * pitch,
          radius,
          color,
        ),
      );
    }
  }

  return `<g>${parts.join("")}</g>`;
}
