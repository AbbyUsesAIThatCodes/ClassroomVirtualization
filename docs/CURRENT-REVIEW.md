# Current Review

## Exact Review Build

Issue [#2](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/issues/2) / draft PR [#3](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/pull/3), branch `update/canonical-classroom`.

**0.1.1 First Light (development)**:

`0.1.1_First-Light_pr-3_build-004_20261001T014014Z_g28e31ff0fbf0_web-glb-godot-source`

Frozen source: `28e31ff0fbf06ee5fd9fe58cb499f0ef0d757f9a`. UTC: `2026-10-01T01:40:14.827Z`. Input SHA-256: `b34f499c62d392106756baef86b5151e744e1deede47728a64cabd12c726ad4a`. Later export, evidence and documentation commits do not change the frozen build inputs. Build 002 remains the preserved earlier review. Build 003 is an intermediate correction build: a new test assumed separate GLB translations although the exporter uses matrices. Build 004 includes the corrected test. All reservations remain in the ledger; no artifact was relabeled.

## Owner Playtest Corrections

- All 38 original finished poster pages run clockwise around the perimeter: **north 5, east 12, south 8, west 13**. Heights alternate high/low through the final-to-first transition. Inward-facing planes clear corners, openings, teaching fixtures and the lower nook ceiling. The shared atlas is byte-for-byte unchanged; page 39 remains excluded.
- The south door is now southwest at **[-2.85, 0, +6.96]**. Its leaf, frame, latch, closer and EXIT sign move together. Actual wall/baseboard segments form the opening and lintel; the former southeast position is solid wall. Closed-leaf and wall collisions agree with the geometry. The north door stays at **[-2.15, 0, -6.96]**.
- The south cupboard moves into the vacated southeast space to clear the door approach; the printer counter and printers stay in place. The procedural Maker Corner sign is compacted below the art. Canonical desks, extinguisher, rainbow light path, teaching equipment, camera controls and optional separate lever remain intact.

## Fresh Verification

- **10 Node tests pass**. Khronos glTF Validator: **0 errors / 0 warnings**. Both GLB copies match; embedded resources, anchors, poster transforms and door positions are checked.
- Actual browser input, table collision, southwest closed-door stop (Z = 6.70 m), camera navigation, overview/return, optional lever, settings, hosted asset download and offline export pass. No JavaScript errors.
- Phone **390 x 844**: touch movement/look, settings and build label fit without horizontal overflow or overlapping controls.
- Geometry: **510 meshes, 289595 vertices, 46 room collision boxes**, six anchors, four desks, 38 posters and six steady bulb colors. Camera spawns and the southwest approach clear furniture. Real southwest aperture and solid old southeast position are checked against rendered mesh bounds.
- Godot **4.5.1** headless import and native scene instantiation pass: **47 shapes including floor**, all 38 poster fronts inward, both door positions and native build-label text verified.
- North-up top-down and north/east/south/west interior captures were inspected. Facing south reverses left/right on screen; the north-up capture establishes that the door is southwest.
- Package filename, console, manifests, web/offline UI, GLB extras, Godot label and report match. The browser-only distribution is copied from the tested HTML; no texture reduction or rebuild is performed while packaging.

## Format Status And Limits

| Format | This Review |
| --- | --- |
| Procedural Room, Web, Offline HTML | Rebuilt and browser-tested; root HTML matches tested offline bytes |
| GLB And Layout | Regenerated; 11,961,556 GLB bytes, fully embedded resources and six anchors validated |
| Godot GLB, Layout, Wrapper, Current Textures | Regenerated through the documented pipeline and headless import |
| Godot Playable Project Source | Included and instantiated; no manual native keyboard/mouse playthrough or native render comparison |
| Godot Executable, Other Engine Exports | Not built; no supported executable preset or other pipeline exists |
| Earlier Builds And Baseline | Previous ZIPs/evidence retained; 0.1.0 preserved at `1f25638e64861424a52f8bf381cea2a247cfe74e` |

The GLB embeds 15 images. Imported slots 0-14 are current; later numbered PNGs are retained legacy files, not newly rebuilt textures. Geometry remains estimated. Posters are the supplied art, with wording/attributions preserved and unknown third-party image licensing documented in [Poster Art](POSTER-ART.md). Their inclusion is not a quote-accuracy endorsement. No source classroom photos, student data or raw PDF are included.

## Evidence And Production

[Checks and representative renders](review/pr-3-build-004/) record this build. The small browser ZIP opens via `Classroom-Walkthrough.html` after extraction and requires no server or network. Full exports and older versions remain preserved. [Consumer Handoff](CONSUMER-HANDOFF.md) identifies the frozen procedural source and integration boundaries.

PR #3 remains draft. Main remains `1f25638e64861424a52f8bf381cea2a247cfe74e`; PR #1 merged and Pages run [36637247202](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/actions/runs/36637247202) succeeded September 29. No merge, deployment, workflow dispatch, main push or other-repository/shared-catalog write is performed.

## Output SHA-256

The browser-only ZIP is **1,214,074 bytes**. Its extracted HTML was rechecked with networking disabled at 1280 x 800 and 390 x 844: **zero HTTP requests, failed asset requests or JavaScript errors**. It replaces the existing private Library review item as version 1. Equivalent desk/poster/extinguisher renders retain their Library identities as replacement versions; top-down and southwest-door views are additional items. The older full Library ZIP remains unchanged.

- Browser ZIP: `133d6593919e4ef72793c5230010db80ce56d9eb82966081fab7c5346aed1ad7`.
- Full build 004 ZIP, 28,318,521 bytes: `294053735b81e020a4c42ac3e0a8d1aabd7eb75c6160581aeb331538cd149604`.
- Frozen procedural-source ZIP, 2,095,648 bytes: `1bebdce4ae3c63ebedf9d932d60c66dfaa2279e5e4ff0d2ccd4b7abb1292fb0c`.

- `Classroom-Walkthrough.html`: `e5497063f2ad2f2abb80c7e5f3f1300760ff2e17e789c251eda2188fd8791900`
- `public/assets/classroom.glb`: `da139cf50def483f05fe108fa285a7f7f46527ee124d019b23a49f760e249092`
- `public/assets/classroom-layout.json`: `55972b594a84b3953c916fd7ce6dfb06d2157beecb311387587eafcae875fec9`
- `godot/classroom/classroom.glb`: `da139cf50def483f05fe108fa285a7f7f46527ee124d019b23a49f760e249092`
- `godot/classroom/classroom.tscn`: `fb956866af6841d330d152b931f422448f2cf562ef4ec07dc0850bc4c35a70a3`
