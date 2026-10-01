# Build Identity

## Authoritative Records And Allocation

`release.json` is the authoritative release record: **0.1.1 First Light**, development. `package.json` and the root lockfile mirror its version. First Light remains the accepted codename for 0.1.x; PR #1 closed the 0.1.0 recovery milestone before this compatible correction. Anchor names and metre units remain stable; the design anchor follows the corrected desk position. There is no saved-game format.

`scripts/build-identity.mjs` reserves an ordinal in tracked `build/ledger.json` under an exclusive file lock, shared by worktrees through the primary checkout. Failed attempts keep reservations. This task is the sole allocator for PR #3. Commit and push the ledger at checkpoints. Another clone/machine must synchronize that ledger and coordinate allocator ownership before using the PR scope; otherwise use an explicit local scope. No distributed counter service is installed.

Set `BUILD_SCOPE=pr-3` only for this known PR, or `local-review` for uncoordinated local work. CI defaults to `local-ci-<run>-<attempt>` so it never invents PR-local ordinals. The lock is never automatically deleted after a timeout; establish that its owning process has stopped before stale-lock recovery.

Each build captures UTC once after reservation and immediately before metadata injection. The manifest contains full Git SHA, PR head when available in CI, dirty-input state, SHA-256 fingerprint of all source/script/test/native-demo inputs, target, development status, and full ID:

`<version>_<codename-slug>_<scope>_build-<ordinal>_<UTC>_g<12-character-revision>[-dirty-<fingerprint>]_<target>`

The fingerprint excludes generated exports, report text and the allocator ledger to avoid a metadata rebuild loop. `dirty` describes the listed build inputs, not unrelated report edits. Reopening/copying/retesting an artifact keeps its existing identity; a new build invocation reserves another ordinal.

## Entry Points

- `npm run review`: one manifest for GLB/layout, Godot source wrapper and web/offline bundle, preserved under `review-packages/<full-ID>/`.
- `npm run export`: one identified GLB/Godot-source export. It does not bundle a browser preview or export a native executable.
- `npm run build`: one identified web build. It copies the currently saved assets and does not regenerate their separate export identity; use `review` after model changes.
- `npm run dev`: visibly labeled **Live Development — Unpackaged**. It does not claim a frozen build identity. A child server used by an export receives that export's manifest.
- Direct invocation of `scripts/godot-scene.mjs` is rejected; the export entrypoint ensures consistent native and GLB identities.
- Offline user-triggered downloads receive an explicit unique `local-browser-<UUID>` scope, ordinal 1, export UTC, source revision and `parentBuild`; they never reuse a PR ordinal. Hosted asset downloads reuse their saved export identity.

## Location Inventory

| Surface | Exact Location | Status |
| --- | --- | --- |
| Release | `release.json`, `package.json`, `package-lock.json` | Implemented |
| Counter | `build/ledger.json`, exclusive `build/allocator.lock` | Implemented, one coordinated primary checkout |
| Immutable Invocation Manifest | `artifacts/builds/<ID>/build-manifest.json` | Implemented |
| Console And Failure Log | `runBuild()` in `scripts/build-identity.mjs` | Full ID at start/success/failure; CI summary |
| Web And Offline UI | `src/build-info.js`, `src/app.js`, `index.html#build-identity`, `style.css` | Persistent, selectable, wrapping full ID |
| GLB And Layout | `src/app.js:exportGLB`, `scripts/export.mjs`, root GLB extras and JSON `build` | Same manifest on unified review builds |
| Godot UI | `godot/demo/build_identity.gd`, `demo/walkthrough.tscn`, `godot/build-manifest.json` | Visible selectable label; no native executable build claimed |
| Artifact Names | `review-packages/<ID>/`, matching review ZIP | Stable inner entrypoints preserved |
| Report | `site/BUILD-REPORT.txt`, `site/build-manifest.json`, invocation report | Derived from manifest |
| Current Handoff | `docs/CURRENT-REVIEW.md`, `docs/REPOSITORY-STATUS.md`, README, PR #3 | Exact review and deployed baseline kept separate |
| CI | `.github/workflows/check.yml`, `.github/workflows/pages.yml` call identified build | Draft job skips; no workflow dispatched by this task |
| Agent And PR Instructions | `AGENTS.md`, `.github/PULL_REQUEST_TEMPLATE.md` | Linked |
| Historical Artifacts | Baseline `1f25638e64861424a52f8bf381cea2a247cfe74e` and recovery reports | Preserved; unknown original metadata never invented |

## Verification

`tests/build-identity.test.mjs` checks concurrent reservations, independent PR counters and failure retention. Package/browser checks compare the visible label, manifest, filename, report and source fingerprint. Actual attempt identities, current format validation and remaining limits are recorded in Current Review. Retesting and packaging use already-built bytes; they do not silently rebuild them.
