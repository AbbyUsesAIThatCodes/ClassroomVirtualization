# Current Review

## Exact Review Build

Issue [#2](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/issues/2) / draft PR [#3](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/pull/3), branch `update/canonical-classroom`.

**0.1.1 First Light (development)**, full build ID:

`0.1.1_First-Light_pr-3_build-002_20261001T003328Z_g477fe2d4b138_web-glb-godot-source`

Clean runtime/source revision: `477fe2d4b138410dd033168e5f36360d6f55772b`. UTC captured before export/bundling: `2026-10-01T00:33:28.019Z`. Input fingerprint: `92c1fb1b5563dde820e90c23d27e34d94427f18babbeb8b840b4468f613fa13f`. Later reservation/export/evidence commits do not change these build inputs. Build 001 remains preserved as a dirty implementation-check attempt; build 002 is the final review. Both reservations remain in `build/ledger.json`.

## Changes And Fresh Verification

- Four independent pale desks in two pairs; front projecting push bar and distinct rear latch; detailed extinguisher; shallow prep recess; corrected design-anchor position. Canonical source provenance is in [Classroom Provenance](CLASSROOM-PROVENANCE.md).
- All 38 finished supplied quote posters, in the existing left-wall decoration area, and steady six-color string lights. Text/attributions are preserved; page 39 is excluded. Placement is approximate. Source/license limits are in [Poster Art](POSTER-ART.md).
- Eight local Node tests pass. Khronos glTF Validator: **zero errors and zero warnings**. Both GLB copies match. No apparatus is included in the reusable asset.
- Browser: actual input movement, collision stop without penetration (Z = 1.02 m), overview/return, viewpoint jumps, optional lever placement, scene controls, hosted GLB download, offline HTML and local layout export; no JavaScript errors.
- Phone 390 × 844: touch movement/look, scene settings, no horizontal overflow, wrapping build ID without overlapping controls. Visual inspection confirms the fixed caption position.
- Geometry inventory: 508 meshes, 289523 vertices, four desk groups, six anchors, 38 poster nodes, six bulb colors, 43 horizontal colliders. All named camera spawns clear furniture/walls. Native wrapper adds the floor, for **44 collision shapes**.
- Godot **4.5.1**: headless import and native scene instantiation pass; named push bar/poster 38, anchors/collision count and actual interface build-label text checked. No import warnings/errors were found.
- Console, versioned output folder, web/offline label, GLB extras, layout metadata, native manifest/label and generated build report identify the same build. Concurrent allocator tests, per-scope counters and failure retention pass. Package identity test passes without rebuilding.

## Format Status And Limits

| Format | This Review |
| --- | --- |
| Procedural Room, Web Bundle, Offline HTML | Rebuilt and browser-tested; root `Classroom-Walkthrough.html` matches the reviewed offline file |
| Portable GLB And Layout | Regenerated from the standalone room; 11,958,296 bytes; embedded resources and six anchors validated |
| Godot GLB, Layout, Collision Wrapper, Extracted Textures | Regenerated through the existing pipeline and Godot import; headless instantiation checked |
| Godot Playable Project Source | Included; build-label check passes; manual native mouse/keyboard playthrough and native render comparison not performed |
| Godot Executable, Other Engine-Specific Exports | Not built; no supported executable export preset or other export pipeline existed |
| Historical 0.1.0 HTML, GLB, Native Assets, Evidence | Preserved in Git at `1f25638e64861424a52f8bf381cea2a247cfe74e`; not rebuilt or relabeled |

The current GLB embeds 15 images. Godot imports current image slots 0–14; older remaining numbered PNGs are retained legacy assets, not newly regenerated textures and not referenced by the current GLB. Room dimensions, hardware dimensions and poster order are approximate. Poster readability is limited by in-room size and source texture resolution; the art is for faithful room decoration, not a verified quotation reference. Original PDF and private classroom photographs are excluded.

## Evidence And Production

[Local check records and representative renders](review/pr-3-build-002/) preserve this build's fresh evidence. The playable ZIP contains `site/Classroom-Walkthrough.html`, hostable site files, portable assets, Godot project source, notices, provenance and QA renders/logs. Open the HTML locally; no server or network is required.

Main remains `1f25638e64861424a52f8bf381cea2a247cfe74e`. PR #1 was merged and Pages run [36637247202](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/actions/runs/36637247202) succeeded September 29. **This review performs no merge, deploy, workflow dispatch or other-repository change.** Draft jobs skip; local evidence supplies validation.

## Output SHA-256

- `Classroom-Walkthrough.html`: `31799a04a569ffe72cda2599a8aae8bff1d1c68f5b795859b78cb94a26793429`
- `public/assets/classroom.glb`: `ef9c8636209a080b3e115e07a57808fb492d8dd788a2d3ba38885c3b99d6edfe`
- `public/assets/classroom-layout.json`: `644914e319336b2bb8de84641902aaf33d0f510b20d29d0241add48e6d0697b4`
- `godot/classroom/classroom.glb`: `ef9c8636209a080b3e115e07a57808fb492d8dd788a2d3ba38885c3b99d6edfe`
- `godot/classroom/classroom.tscn`: `ac6a4f4a66033dea3e83fbdabac9d18da7914c30d47e08d1009ad21dfcd7ed54`
