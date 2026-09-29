# Our Classroom · First Light

**A walkable, reusable 3D version of the North College Hill / Great Oaks classroom.**

Reconstructed from ten classroom photos, with cream block walls, a tiled ceiling,
wooden workbenches, gray lab tables, yellow and red stools, the ViewBoard teaching
wall, light strings, robotics shelves, a teacher nook and four printers.

![The classroom walkthrough](docs/classroom-preview.jpg)

## Walk Around

The release package contains `Classroom-Walkthrough.html`. Download it and open
it in a browser with WebGL 2. It is self-contained, works offline, and needs no
installation or local server. If an attachment preview does not run scripts,
save it and open it in your browser. On a phone, the hosted version is usually
more convenient than opening a downloaded HTML file.

- **WASD / arrows** move; **drag** looks around; **Shift** moves faster.
- “Walk into the classroom” captures the mouse on desktop; **Esc** releases it.
- **Room overview** opens an orbitable cutaway. Scroll or pinch to zoom.
- Use the viewpoint menu to jump to the board, benches, window or printer corner.
- **Scene** toggles room details, ceiling, lights, map and activity markers.
- **Place a lever example** puts a separate demonstration object on a workbench.
- On a phone, use the arrow pad and drag the scene to look.

## Use It In An Educational Game

| Deliverable | Use |
|---|---|
| `public/assets/classroom.glb` | Importable visual scene for Three.js, Godot, Blender and other glTF tools |
| `public/assets/classroom-layout.json` | Units, bounds, camera positions, attachment markers and collision boxes |
| `godot/classroom/classroom.tscn` | Native wrapper with collisions and `Marker3D` attachment points |
| `godot/project.godot` | Ready-to-open Godot walkthrough example |
| `src/classroom.js` | Editable procedural environment builder |

**One unit = one metre.** Room dimensions are estimated at 7 × 14 × 3.6 m. This
first pass is a recognizable stylized reconstruction, not a surveyed digital
twin. Reference limitations and inferred placements are in
[photo notes](docs/PHOTO-NOTES.md).

See the [integration guide](docs/INTEGRATION.md) for Three.js and Godot examples.
The environment has named anchors on tables and the floor; games keep their own
camera, input and simulation. The demo lever is static and is excluded from the
GLB. The existing lever-game repositories are not modified.

## Develop

The scripts below are the recovered original pipeline. Before producing a new
review/release build, implement the pending [build-identity convention](docs/BUILD_IDENTITY.md).
The saved HTML and GLB are original artifacts, not new builds from this recovery.

Node 22+:

```sh
npm ci
npm run dev
```

Open the loopback address printed in the terminal. `npm run build` creates the
hostable `dist/` folder and the self-contained HTML. Three.js is bundled locally;
there are no runtime CDN, font, analytics or network requirements.

After changing the model, run `npx playwright install chromium` once, then
`npm run export` to regenerate GLB, collision scene and manifest files.

```sh
npm test
npm run build
npm run test:browser
```

Tests cover GLB validation and embedded assets, named anchors, spawn clearance,
collision tunnelling and sliding, actual browser movement, camera modes,
activity placement, downloads and touch controls. See
[verification notes](docs/VERIFICATION.md) for what was tested and remaining limits.

## Publish After Review

This repository includes a manual **Deploy Pages** workflow. After the first PR
is reviewed and merged, choose **Settings → Pages → Source: GitHub Actions**, then
run **Actions → Deploy Pages → Run workflow** from `main`. The preview uses
relative URLs, so it works under the repository's Pages subpath. A live site is
not deployed by the initial implementation.

Recovered source and assets are saved on `rowan/classroom-first-light` in
[PR #1](https://github.com/AbbyUsesAIThatCodes/ClassroomVirtualization/pull/1).
See the [September 29 recovery report](docs/recovery/2026-09-29.md) for integrity
checks, remote checkpoints, and remaining limitations. The implementation stays
on the feature branch pending review; this recovery does not deploy the site.

## Next Calibration Pass

A measured room width/length, ceiling height and one bench's dimensions will
provide a much stronger scale reference than photographs alone. Furniture can
then be adjusted against your walkthrough feedback. Beyond that, individual
game integrations can be added without changing this environment's contract.
