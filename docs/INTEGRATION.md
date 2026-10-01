# Use The Classroom In A Game

The environment and walkthrough are separate. The room owns geometry, materials,
named anchors and collision data. The host game owns its camera, input, activity,
lighting, renderer and update loop.

## Portable GLB

`public/assets/classroom.glb` is a glTF 2.0 binary with embedded textures. It has no
external image dependencies. One unit is one metre. Y is up; the window wall is
at Z = −7 and the teacher nook is at Z = +7. Its origin is the centre of the main
room at floor level. The side preparation recess extends beyond the main room.

The asset includes the ceiling and all four walls. A camera outside the room will
see its exterior. Use `PlayerSpawn` for a first-person camera, or hide `Ceiling`,
`LeftWall` and `BackWall` for the cutaway used in the preview. The GLB has no camera
or scene lights. Emissive lamp surfaces do not illuminate the room by themselves.

### Three.js

```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AmbientLight, DirectionalLight } from 'three';

const { scene: classroom } = await new GLTFLoader().loadAsync('./classroom.glb');
scene.add(classroom);
classroom.traverse(object => {
  if (object.isMesh) {
    object.castShadow = true;
    object.receiveShadow = true;
  }
});
scene.add(new AmbientLight(0xfff8e8, 2));
const daylight = new DirectionalLight(0xffffff, 2);
daylight.position.set(0, 5, 0);
scene.add(daylight);

// leverActivity is your own activity root, modelled in metres.
const workbench = classroom.getObjectByName('GameAnchor_Lever');
workbench.add(leverActivity);
leverActivity.position.set(0, 0, 0);
```

The sample light intentionally does not cast shadows; ceiling geometry can block
a light above it. In a custom lighting setup, either place lights inside the room
or disable ceiling shadow casting. `addClassroomLighting()` and `createClassroom()`
in `src/classroom.js` are an alternative to loading the GLB when using the source.

The GLB contains ordinary geometry rather than a physics engine. Load the
`colliders` array in `classroom-layout.json` into your engine's collision system.
`src/collision.js` supplies the horizontal circle/AABB controller used by this demo.
It is for flat-floor walking; use a real physics controller for jumping or stairs.

Existing lever games can use different scene units. Convert the activity's root
scale to metres once, or uniformly scale the classroom and its colliders. Do not
silently change torque, length or mass calculations when changing visual scale.

## Godot 4.5+

1. Copy the entire `godot/classroom/` directory into your project as
   `res://classroom/`. Keep these paths, or update the external resource in the
   `.tscn` when relocating it.
2. Let Godot import `classroom.glb`.
3. Drag `classroom/classroom.tscn` into your game scene. This wrapper adds 44 simple
   collision shapes and six native `Marker3D` anchors to the portable visual model.
4. Supply your game's camera, `WorldEnvironment` and lights.
5. Add the activity beneath an anchor:

```gdscript
var activity = preload("res://activities/lever.tscn").instantiate()
$Classroom/Anchors/GameAnchor_Lever.add_child(activity)
activity.position = Vector3.ZERO
```

`PlayerSpawn` specifies eye height. For a player root at its feet, use the spawn
X/Z with Y = 0 and place the camera at Y = 1.65. The demo uses a radius-0.22 m
capsule, collision layer 1, and the compatibility renderer.

To run the included example, import `godot/project.godot` and press F6 on
`demo/walkthrough.tscn`, or F5 from anywhere. Click to look, WASD/arrow keys to walk,
Shift to move faster, Escape to release the mouse, R to return to the entrance.
The native demo is designed for keyboard/mouse; touch controls belong to the
browser walkthrough. Fresh native validation is recorded in CURRENT-REVIEW.md. Historical 0.1.0 checks used Godot 4.5.1. No Godot executable export or online-editor import is claimed.

## Attachment points

| Name | Position in metres | Purpose |
|---|---|---|
| `PlayerSpawn` | 0, 1.65, 4.35 | Standing camera, initially facing −Z |
| `GameAnchor_Lever` | −2.24, 0.983, 0.3 | Third wooden workbench, top surface |
| `GameAnchor_Design` | 1.05, 0.931, −0.8 | Middle lab table, top surface |
| `GameAnchor_Skimmer` | 0, 0.015, −1.5 | Floor point; clear a route for a race |
| `ViewBoard_Surface` | 3.025, 1.79, −1.5 | Display centre; screen faces −X |
| `MakerCorner` | −0.3, 1.35, 6.4 | Printer-area point of interest |

The lever shown by the preview's “Place a lever example” button is a separate,
static integration example. It is excluded from the exported environment and
does not implement the existing games' balance simulation.

## Editing and regeneration

Placements and anchors live in `src/layout.js`; architecture and furniture are
constructed in `src/classroom.js`. Most dimensions of architecture are explicit
in the builder, so editing the `ROOM` metadata alone does not resize geometry.
Edit both if changing room dimensions. Textures are procedurally drawn in
`src/textures.js`; the approved supplied poster portraits are embedded in `src/assets/quote-posters-data.js`. No private source classroom photograph is needed at runtime. Await the returned `classroom.ready` promise before rendering or exporting a newly created procedural room so the embedded poster atlas is decoded.

After changing geometry, materials or anchors:

```sh
npm ci
npx playwright install chromium
npm run review
npm test
npm run test:browser
```

`npm run export` writes both GLB copies, both layout manifests and the native
collision scene. Commit all of these together. The walkthrough generates its
geometry from the source; ordinary `npm run build` deliberately does not
regenerate the importable GLB. Avoid stale asset exports when editing the model.

The design anchor keeps its name but moves to the corrected desktop. See CLASSROOM-PROVENANCE.md for this intentional coordinate correction. All 38 poster nodes preserve their PDF page numbers.
