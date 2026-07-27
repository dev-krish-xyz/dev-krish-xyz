/**
 * Low-level SVG primitives.
 *
 * Pure string builders with no layout knowledge. They are the only place that
 * emits SVG syntax, so escaping and number formatting live here once.
 */

import type { Rgb } from "../image/mosaic.js";

/** Escape text for use in XML content. */
export function escape(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Trim insignificant decimals to keep the output small. */
function num(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, "");
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const h = (v: number) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`;
}

export interface RectAttrs {
  x: number;
  y: number;
  width: number;
  height: number;
  fill: string;
  rx?: number;
}

export function rect(a: RectAttrs): string {
  const rx = a.rx ? ` rx="${num(a.rx)}"` : "";
  return `<rect x="${num(a.x)}" y="${num(a.y)}" width="${num(a.width)}" height="${num(a.height)}" fill="${a.fill}"${rx}/>`;
}

export function circle(cx: number, cy: number, r: number, fill: string): string {
  return `<circle cx="${num(cx)}" cy="${num(cy)}" r="${num(r)}" fill="${fill}"/>`;
}

/** A coloured inline run inside a text line, referencing a CSS class. */
export function tspanRun(text: string, className: string): string {
  return `<tspan class="${className}">${escape(text)}</tspan>`;
}

/** A positioned line container; `x` resets the caret, `y` sets the baseline. */
export function tspanLine(x: number, y: number, inner: string): string {
  return `<tspan x="${num(x)}" y="${num(y)}">${inner}</tspan>`;
}
