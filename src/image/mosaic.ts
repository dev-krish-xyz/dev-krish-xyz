/**
 * Image processing: avatar -> pixel mosaic.
 *
 * The avatar is downsampled to an N x N grid of average colours. The original
 * colours are preserved (no ASCII, no palette remap); each grid cell later
 * becomes one SVG rectangle, giving a terminal-style pixel mosaic.
 */

import sharp from "sharp";

export interface Rgb {
  r: number;
  g: number;
  b: number;
}

export interface Mosaic {
  /** Cells per side. */
  size: number;
  /** Row-major colours, length `size * size`. */
  pixels: Rgb[];
}

/**
 * Decode `input` and resize it to a `cells` x `cells` grid of averaged colours.
 * `fit: "fill"` squares non-square sources; avatars are already square.
 */
export async function buildMosaic(
  input: Buffer,
  cells: number,
): Promise<Mosaic> {
  const { data } = await sharp(input)
    .resize(cells, cells, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const pixels: Rgb[] = [];
  for (let i = 0; i < cells * cells; i++) {
    const o = i * 3;
    pixels.push({ r: data[o] ?? 0, g: data[o + 1] ?? 0, b: data[o + 2] ?? 0 });
  }

  return { size: cells, pixels };
}
