# Architecture

A data-driven generator that renders a neofetch-style GitHub profile card as a
single, self-contained SVG. Everything except the avatar's colours is drawn with
vector primitives; the avatar is downsampled into an SVG pixel mosaic (no raster
image is embedded, no ASCII art).

## Pipeline

```
ProfileData ─▶ buildCard ─▶ resolveLines ─▶ layoutDocument ─▶ SvgDocument ─▶ profile.svg
   (data)      (components)   (inline layout)  (document layout)   (render)
```

1. **Data** describes *what* the card says.
2. **Card assembler** turns sections into styled lines via reusable components.
3. **Inline layout** measures the lines on a monospace character grid, picks a
   common column width (auto section sizing) and stretches the dotted/dashed
   leaders to align values (automatic text flow).
4. **Document layout** places the avatar column and text column in absolute
   pixels; the canvas grows with the content.
5. **Renderers** emit SVG primitives for the mosaic, the dot-matrix filler and
   the text.
6. **SVG document** wraps it all in one self-contained file.

## Modules (single responsibility each)

| Path | Responsibility |
| --- | --- |
| `src/config/theme.ts` | All colours, fonts, spacing, sizes. No magic numbers elsewhere. |
| `src/data/profile.ts` | The displayed content, free of presentation. |
| `src/github/api.ts` | Fetch live stats + avatar; merge stats into the data. |
| `src/image/mosaic.ts` | Downsample the avatar to an N×N colour grid. |
| `src/layout/inline.ts` | Character-grid inline layout: spans, flexible fills, sizing. |
| `src/layout/document.ts` | Pixel layout of the two columns and the canvas. |
| `src/render/components.ts` | Reusable line builders (heading, field, stat, leader). |
| `src/render/card.ts` | Assemble profile data into ordered lines. |
| `src/render/mosaic.ts` | Mosaic rectangles + decorative dot-matrix. |
| `src/render/text.ts` | The text card as one `<text>` element. |
| `src/svg/primitives.ts` | Low-level SVG string builders + escaping. |
| `src/svg/document.ts` | Document envelope: `<style>`, background, serialize. |
| `src/pipeline.ts` | Wire the stages together. |
| `src/index.ts` | Entry point: fetch → mosaic → render → write. |

## Design notes

- **Alignment is font-independent.** Each line is one monospace string, so
  dotted leaders and right-aligned values stay aligned in any viewer's
  monospace font. Intentional gaps use ` ` (NBSP) because SVG renderers
  collapse ordinary leading/trailing whitespace inside a `<tspan>`.
- **Colours are CSS classes.** The palette becomes one class per role; runs
  reference the class, keeping the markup small.
- **Best-effort networking.** Missing token or offline? Live stats fall back to
  the static data and the avatar falls back to a local cache, so a run never
  hard-fails.

## Usage

```bash
npm install
npm run generate   # writes assets/profile.svg
npm run typecheck
```

`GITHUB_TOKEN` is optional locally; the scheduled workflow
(`.github/workflows/generate-profile.yml`) provides one and commits the result.

## Tuning the look

Edit `src/config/theme.ts` (colours, font size, mosaic resolution, spacing) or
`src/data/profile.ts` (content). Nothing else needs to change — the layout
re-sizes automatically.
