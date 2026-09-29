# Verification — First Light 0.1.0

Historical checks from September 25, 2026, preserved from the original package.
Fresh September 29 checks and current repository status are recorded in
[the recovery report](recovery/2026-09-29.md). Browser and Godot results below were
not rerun during recovery; they must not be presented as fresh validation.

## Portable asset

- Khronos glTF Validator: **0 errors, 0 warnings**.
- GLB size: **11,867,056 bytes** (about 11.3 MiB).
- Textures and buffers are embedded; all six named anchors are present.
- Native Godot and portable GLB copies are byte-identical.
- The separate demonstration lever is excluded from the exported classroom.

## Browser

- Built the bundled browser preview with Three.js 0.180.0 and esbuild 0.25.10.
- Desktop 1440 × 1000: scene renders, walking moves, a table stops the controller,
  overview removes the ceiling, return restores the previous walking position,
  viewpoint jumps work, and the separate lever example attaches to its bench.
- The table collision check stopped the camera at Z = 3.01982 m; its collision
  boundary plus player radius is Z = 3.01 m.
- Laptop 1280 × 720 and phone 390 × 844: visually inspected.
- Emulated mobile touch: directional controls move; dragging turns the camera;
  settings fit the viewport and there is no horizontal overflow.
- No JavaScript errors in the browser test. The GLB download URL returns a valid
  glTF binary from the built preview.
- Typical entrance frame: **378 draw calls, 94,166 triangles**. These are scene
  complexity counts, not a frame-rate guarantee for student hardware.
- Self-contained HTML is tested separately from a local `file://` URL, including
  runtime export of its GLB. Results are included in `docs/check-results/`.

## Collision and placement tests

Six Node tests pass, covering the portable asset, high-speed wall tunnelling,
wall sliding, circle/box corner contact, all preset camera spawn clearances, and
workbench/table attachment heights.

## Godot

Godot 4.5.1 headless editor imported the GLB and project. The native walkthrough
instantiated with 47 collision shapes and six native markers; a 120-frame
headless runtime completed without script errors. These are import/runtime checks,
not a visual Godot playtest or a Godot online-editor compatibility claim.

## Remaining limits

- Dimensions and furniture placement need owner feedback or measurements.
- Browser screenshots were produced in Chromium using software rendering;
  physical student Chromebooks, Android devices and Safari were not tested.
- The native demo targets keyboard/mouse. The browser has touch controls.
- Collision proxies are designed for flat-floor walking. They are not detailed
  furniture physics; ceilings and overhead fixtures do not have collision shapes.
- The prep-room recess is a simplified suggestion of an incompletely photographed
  space. Exterior rooms and corridors are not included.
- No existing educational-game repository was changed, and no site was published.
