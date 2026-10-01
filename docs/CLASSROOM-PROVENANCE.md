# Classroom Source Provenance

## Canonical Port

Issue #2 ports the room improvements back from ThreeKindsOfLevers into their original standalone repository. On October 1, 2026, the following upstream blobs at `835d3b0f28efb0e650d29323db98077b9bd654ec` matched EdugamesGraphicsStorage's `packs/three-kinds-of-levers/source/d3d647fd204cebd9ac94d652fbada434a08d7a90/` snapshot exactly:

| Upstream File | Git Blob |
| --- | --- |
| `src/classroom/classroom.js` | `48e713328f5c4ef94bdc576847e13aaf74446107` |
| `src/classroom/layout.js` | `5d101514f10e206e255c0db397ccec34278d0e3c` |
| `src/classroom/textures.js` | `8180503639ef73ca7520d462d9c6a2cbc76f108e` |

The upstream room originally derives from this repository's `1f25638e64861424a52f8bf381cea2a247cfe74e`. The shared catalog was read at `b7f300a1810ed44867f1a755e54d6b203f6e7f71`; no other repository was changed.

## Adaptation Boundaries

- Four independent pale desktops in two pairs, each with its own apron, legs and shelf; distinct seams.
- Named front exit with two push-bar mounts and projecting bar; rear door keeps its separate latch and covered window.
- Named extinguisher with rounded body, white sleeve, neck, squeeze lever, gauge, bracket, band and curved hose.
- Only the shallow prep doorway/recess; remove the unsubstantiated prep cabinet.
- Simplified procedural texture noise and touched sign titles carried across. Retain standalone PBR materials and fonts for its established appearance and GLB export; do not import the lever game's toon shader, camera scaling, apparatus or UI.
- Preserve all six integration anchor names. Correct `GameAnchor_Design` to the near pair's left desktop: upstream retained a stale location between the new desks. This is an intentional placement correction; consumers should use the regenerated layout rather than hard-coded old coordinates. Metre units, room dimensions and remaining anchor positions are unchanged.

## Owner Playtest Corrections

The October 1 follow-up places the south door in the southwest corner (`x = -2.85`, `z = +6.96`; north is -Z). Its leaf, frame, latch, closer and EXIT sign move together. The south wall and baseboard now have a real opening with side spans and a lintel; the former southeast door location is solid. Collision boxes match the closed leaf and wall segments. The unrelated north door stays at `[-2.15, 0, -6.96]`. Only the south cupboard moves to clear the approach; the counter and printers stay in place. These owner corrections intentionally supersede the upstream source placement. All 38 finished posters now wrap the four walls in a high/low sequence; see [Poster Art](POSTER-ART.md).

## Reference Limits And Privacy

The upstream author inspected private classroom photographs; this port inspects the actual source and its provenance, not the original photographs. Dimensions remain estimates. The front push bar was owner-requested because the photographs partly obscure that hardware; it is not claimed photo-exact. No source photos, identifying labels, student work or private markings are published. Existing source/history and original recovered artifacts remain available at the baseline revision.
