/**
 * SVG document builder.
 *
 * Collects body fragments and serialises a complete, self-contained SVG:
 * a `<style>` block mapping palette roles to CSS classes, a background rect,
 * then the accumulated body. Keeping serialisation here means renderers only
 * append primitive strings and never touch the document envelope.
 */

import type { Palette, Typography } from "../config/theme.js";
import { rect } from "./primitives.js";

export interface SvgDocumentOptions {
  width: number;
  height: number;
  background: string;
  cornerRadius: number;
  palette: Palette;
  typography: Typography;
}

export class SvgDocument {
  private readonly body: string[] = [];

  constructor(private readonly opts: SvgDocumentOptions) {}

  /** Append a raw SVG fragment to the document body. */
  add(fragment: string): this {
    this.body.push(fragment);
    return this;
  }

  /** One CSS class per palette role; renderers reference these by name. */
  private styleBlock(): string {
    const { palette, typography } = this.opts;
    const rules = (Object.keys(palette) as (keyof Palette)[])
      .map((role) => `.${role}{fill:${palette[role]}}`)
      .join("");
    return `<style>text{font-family:${typography.fontFamily};font-size:${typography.fontSize}px}tspan{white-space:pre}${rules}</style>`;
  }

  serialize(): string {
    const { width, height, background, cornerRadius } = this.opts;
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
      this.styleBlock(),
      rect({ x: 0, y: 0, width, height, fill: background, rx: cornerRadius }),
      ...this.body,
      `</svg>`,
    ].join("\n");
  }
}
