/**
 * Document layout.
 *
 * Converts the character-grid card metrics into an absolute pixel layout: a
 * left column (avatar mosaic above a decorative dot-matrix) beside a right
 * column (the text card). Everything derives from the theme and the resolved
 * card size, so the canvas grows or shrinks automatically with the content.
 */

import {
  avatarSize,
  charWidth,
  lineHeight,
  type Theme,
} from "../config/theme.js";

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DocumentLayout {
  canvas: { width: number; height: number };
  /** Avatar mosaic bounds. */
  avatar: Rect;
  /** Dot-matrix filler bounds beneath the avatar. */
  matrix: Rect;
  /** Text column origin and grid metrics. */
  card: {
    x: number;
    top: number;
    columnWidth: number;
    /** Baseline of line `i` = top + i * lineHeight + baselineOffset. */
    lineHeight: number;
    baselineOffset: number;
  };
}

export function layoutDocument(
  theme: Theme,
  columns: number,
  lineCount: number,
): DocumentLayout {
  const { paddingX, paddingY, columnGap } = theme.layout;
  const cw = charWidth(theme);
  const lh = lineHeight(theme);
  const avatar = avatarSize(theme);

  const cardWidth = Math.ceil(columns * cw);
  const cardHeight = lineCount * lh;
  const contentHeight = Math.max(avatar, cardHeight);

  const cardX = paddingX + avatar + columnGap;

  return {
    canvas: {
      width: paddingX + avatar + columnGap + cardWidth + paddingX,
      height: paddingY + contentHeight + paddingY,
    },
    avatar: { x: paddingX, y: paddingY, width: avatar, height: avatar },
    matrix: {
      x: paddingX,
      y: paddingY + avatar,
      width: avatar,
      height: Math.max(0, contentHeight - avatar),
    },
    card: {
      x: cardX,
      top: paddingY,
      columnWidth: cardWidth,
      lineHeight: lh,
      baselineOffset: theme.typography.fontSize * theme.typography.baselineRatio,
    },
  };
}
