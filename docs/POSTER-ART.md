# Quote Poster Art

## Source And Permission Scope

The owner supplied `Quotes Document.pdf` and approved its finished poster images for this classroom review PR on October 1, 2026. The 39-page PDF was materialized privately from Library and all pages were visually inspected. Pages 1–38 are finished designs; page 39 is a text-only candidate page and is excluded. The original PDF remains outside the repository.

Source SHA-256: `c45b352fd8aff78b6f41c19dcad74961bad8794c8b50308dea97f3b26b34c31f`.

This is a faithful reproduction of the supplied wall art. Text, quoted wording, biographical details and attributions are rendered as supplied, without silent correction. Their inclusion is not an endorsement of quote accuracy. The document provides no comprehensive image-license record; third-party image rights have not been independently verified, and copyright clearance is not asserted. No license for third-party portraits is granted by this repository.

## Texture And Placement

`src/assets/quote-posters-atlas.jpg` is a 3072 × 1536 JPEG atlas, about 1 MB. Each landscape page is proportionally downsampled to 376 × 291 pixels, surrounded by white gutters. `quote-posters.json` maps every included PDF page to its atlas rectangle and records hashes. `quote-posters-data.js` embeds the same atlas bytes for the existing offline HTML. Runtime GPU storage is approximately 24 MiB including mipmaps.

`src/posters.js` shares one texture and material across 38 planes, using UV rectangles and mipmaps; no per-poster network request or dynamic canvas texture. Following the owner's playtest correction, `POSTER_LAYOUT` in `src/layout.js` runs clockwise around the entire room: north pages 1-5, east 6-17, south 18-25 and west 26-38. The pages alternate high and low, including the final-to-first transition, with lower positions beneath the teacher-nook ceiling. Widths range from 0.58 to 0.84 m, preserving each image's aspect ratio. Door/window openings, racks and teaching fixtures constrain spacing; the clock requires a slightly raised lower poster. Corners stay clear and all fronts face inward. The original atlas and every source page are unchanged. Placement is a review arrangement, not an assertion of the photographs' exact poster order.

The small procedural Maker Corner sign is compacted below the south-wall art. The south cupboard moves into the vacated southeast space to clear the corrected southwest door. The printer counter, north door, teaching displays and existing light paths retain their locations.

`QuotePoster_01` through `QuotePoster_38` retain page numbers in node metadata. The Room Details toggle and cutaway wall hiding include the posters. Source classroom photographs and student data remain excluded; the portrait photographs embedded in the approved poster art are distinct from those private classroom references.

The string lights use six steady colors (red, orange, yellow, green, blue, violet), no flicker and no additional light objects. Their source material colors and emissive values are retained in the GLB; engine tone mapping can alter the apparent brightness.

## Reproduction

Render only the first 38 pages with Poppler at a 600-pixel long edge. Proportionally reduce each to 376 × 291, place in a 384 × 304 cell with a four-pixel gutter (eight columns), and save the 3072 × 1536 atlas as JPEG quality 88, no chroma subsampling. The original private PDF is needed only to regenerate artwork; all normal build/export paths use the checked-in atlas. Never substitute a text transcription or include the unfinished page.
