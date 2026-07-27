/**
 * Central theme configuration.
 *
 * Every colour, font metric, spacing value and border size used anywhere in the
 * renderer lives here. Nothing downstream is allowed to invent a "magic number":
 * layout and rendering read exclusively from this object, so the whole look of
 * the card can be retuned from one place.
 */

/** Named colour roles. Renderers reference roles, never raw hex. */
export interface Palette {
  /** Page background (near-black terminal blue). */
  background: string;
  /** Bullets and field keys. */
  key: string;
  /** Dotted leaders and inline separators. */
  leader: string;
  /** Field values / links. */
  value: string;
  /** Section titles and the profile handle header. */
  heading: string;
  /** Horizontal rule dashes that trail a heading. */
  rule: string;
  /** Additions in the lines-of-code stat. */
  additions: string;
  /** Deletions in the lines-of-code stat. */
  deletions: string;
  /** Decorative dot-matrix beneath the avatar. */
  matrix: string;
}

/** Monospace text metrics. Everything on the card lays out on this grid. */
export interface Typography {
  /** Font stack. Kept to widely available monospaces so GitHub renders it. */
  fontFamily: string;
  /** Glyph height in px. */
  fontSize: number;
  /** Advance width as a fraction of `fontSize` (monospace aspect ratio). */
  charAspect: number;
  /** Baseline-to-baseline distance as a multiple of `fontSize`. */
  lineSpacing: number;
  /** Baseline offset from the top of a line, as a fraction of `fontSize`. */
  baselineRatio: number;
}

/** Avatar mosaic parameters. */
export interface AvatarStyle {
  /** Number of mosaic cells per side. */
  cells: number;
  /** Cell pitch in px (cell + gap). */
  cellSize: number;
  /** Dark gap between cells in px, giving the terminal-grid look. */
  cellGap: number;
}

/** Decorative dot-matrix filler beneath the avatar. */
export interface MatrixStyle {
  /** Spacing between dots in px. */
  pitch: number;
  /** Dot radius in px. */
  radius: number;
}

/** Outer page geometry. */
export interface Layout {
  /** Horizontal page padding in px. */
  paddingX: number;
  /** Vertical page padding in px. */
  paddingY: number;
  /** Gap between the avatar column and the text column in px. */
  columnGap: number;
  /** Corner radius of the page background in px. */
  cornerRadius: number;
}

export interface Theme {
  palette: Palette;
  typography: Typography;
  avatar: AvatarStyle;
  matrix: MatrixStyle;
  layout: Layout;
}

export const theme: Theme = {
  palette: {
    background: "#080b12",
    key: "#f2a65a",
    leader: "#38536f",
    value: "#82c0ff",
    heading: "#d7dee6",
    rule: "#3d4b59",
    additions: "#56d364",
    deletions: "#f0736a",
    matrix: "#273543",
  },
  typography: {
    fontFamily: '"DejaVu Sans Mono", "Consolas", "Menlo", monospace',
    fontSize: 22,
    charAspect: 0.6,
    lineSpacing: 1.4,
    baselineRatio: 0.78,
  },
  avatar: {
    cells: 48,
    cellSize: 11,
    cellGap: 1,
  },
  matrix: {
    pitch: 22,
    radius: 1.5,
  },
  layout: {
    paddingX: 30,
    paddingY: 26,
    columnGap: 30,
    cornerRadius: 0,
  },
};

/** Derived metric: advance width of one monospace glyph in px. */
export const charWidth = (t: Theme): number =>
  t.typography.fontSize * t.typography.charAspect;

/** Derived metric: line height in px. */
export const lineHeight = (t: Theme): number =>
  t.typography.fontSize * t.typography.lineSpacing;

/** Derived metric: avatar side length in px. */
export const avatarSize = (t: Theme): number =>
  t.avatar.cells * t.avatar.cellSize;
