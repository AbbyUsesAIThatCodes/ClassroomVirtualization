# Add First Light classroom environment and walkthrough

Educational games currently use generic surroundings. This change supplies a
reusable, recognizable reconstruction of the user's real classroom from ten
reference photos, so activities can share a consistent place.

The environment includes the room shell, tables and benches, red/yellow stools,
teaching wall, storage, string lights and four-printer teacher nook. It is shipped
as an embedded-texture GLB, editable procedural source, a collision/anchor
manifest, and a native Godot wrapper. The browser walkthrough has first-person
movement, collision, touch input, camera presets, a cutaway overview and a separate
lever-placement example. A standalone HTML works offline.

Validation: six Node tests pass; glTF Validator reports zero errors/warnings;
desktop/mobile browser interaction checks pass; Godot 4.5.1 imports, instantiates
and runs the native demo headlessly. See docs/VERIFICATION.md for precise limits.
Dimensions are photo estimates and should be calibrated with classroom feedback.
The static lever example is not the existing balance simulation.

No other game repositories are modified. A manual Pages workflow is included
for publication after review. This change has not been published or merged.
