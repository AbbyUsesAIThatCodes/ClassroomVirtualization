# Historical Recovery Notes — September 26, 2026

These notes describe the earlier archive repair. The GitHub transfer status below
is historical; see [the September 29 report](docs/recovery/2026-09-29.md) for the
completed repository recovery and fresh checks.

# Classroom Virtualization — recovery notes

Recovered September 26, 2026 from First Light v0.1.0 downloads.
This is the original implementation repackaged, not a redesigned classroom.

## Start here

- Open `Classroom-Walkthrough.html` in a browser with WebGL 2.
- Import `public/assets/classroom.glb` into a game or 3D editor.
- Open `godot/project.godot` in Godot 4.5+ for the native demo.
- Editable source is in `src/`; see `docs/INTEGRATION.md` for integration.

## Recovery

All 115 intact ZIP members passed their original CRC32 and length checks.
They include browser source, the model builder, textures, exported GLB, Godot
project and scene, scripts, tests, previews, and documentation. The standalone
walkthrough and GLB match the recovered copies byte for byte.

The original 22,312,976-byte ZIP lacks its closing directory. Its final member,
`ClassroomVirtualization.git.bundle`, is incomplete: 5,259,413 of its declared
9,502,275 uncompressed bytes can be decoded. That damaged history bundle is
excluded from this repaired ZIP. Source can be committed afresh. Original
saved files remain unchanged.

## Fresh checks

- All 115 original recovered members: checksum and length checks passed.
- Five collision, spawn-clearance, and activity-placement tests: passed.
- All recovered JavaScript source, scripts, and tests: syntax checks passed.
- GLB chunk boundaries, embedded buffers and images, six named integration
  markers, and matching standalone/browser/Godot copies: structural checks passed.
- Browser and Godot runtime tests were not rerun: executables are unavailable
  in the recovery environment. Earlier reports in `docs/VERIFICATION.md` and
  `docs/check-results/` describe the earlier run, not new results.
- Repaired ZIP was closed, reopened, and checked for CRC errors.

## Current repository status

https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization

Checked September 26, 2026: `main` and `rowan/classroom-first-light` both point
to `e45e1c6c9a00621e76fd425959089a2e6c315f3a`, containing only `README.md`.
There are no pull requests, and GitHub Pages is not enabled. Source transfer
was unfinished. This recovery audit made no repository changes.

The original `docs/REPOSITORY-STATUS.md` predates the README and remote branch.
Its claim that a usable Git bundle is included does not apply to this repaired
package. These notes supersede those older status details.

Next: commit recovered implementation on the feature branch and open a PR.
Room dimensions remain estimates: 7 x 14 x 3.6 metres.
