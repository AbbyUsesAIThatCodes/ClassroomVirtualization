# Build Identity

## Recovery Status

This PR preserves the existing **0.1.0 First Light** artifacts from September 25,
2026. It does not generate a new build or assign them a new identity. The original
Git bundle is damaged; the original build's source SHA, build time, and ordinal
are not recoverable from the available metadata. Recovery commits identify the
saved files, not the original build. See [the recovery report](recovery/2026-09-29.md).

The owner's September 27 build-identity convention is recorded below for the next
build-producing change. The recovered pipeline predates it. **Retrofitting the
pipeline is pending**, not claimed complete by this preservation PR.

## Identity Contract

- Release version: `package.json` → `version`, currently `0.1.0`.
- Codename: **First Light**, documented in `README.md` for the recovered 0.1.0
  milestone; safe slug `First-Light`. Preserve this accepted version and name.
- Compatibility: this is a development `0.y.z` environment. One unit is one metre;
  integration anchors and the layout/collision JSON are described in
  `docs/INTEGRATION.md`. No saved-game migration contract or new version bump is
  introduced by recovery. Document compatibility changes in future feature PRs.
- Future canonical format:
  `<version>_<codename-slug>_pr-<number>_build-<ordinal>_<UTC>_g<revision>_<target>`.
- Future ordinals must be reserved atomically in durable per-PR state, including
  local attempts. A rerun consumes a new ordinal; a failed attempt keeps its
  reservation. Allocator implementation is pending.
- Capture UTC once before bundling/export and propagate one immutable manifest.
  Retain the full Git SHA, abbreviated display, dirty state and input fingerprint;
  CI merge builds must retain both built SHA and PR-head SHA.
- Use an explicit local/main/release scope outside a PR. Never invent a PR number,
  original timestamp, source revision, or ordinal for a recovered artifact.
- Copying or retesting an identical artifact preserves its existing identity.
- Current review artifact: preserved `Classroom-Walkthrough.html` and
  `public/assets/classroom.glb`; exact SHA-256 values are in the recovery report.
- Deployed build: no deployment was performed by this recovery. The supplied
  manual Pages workflow was not invoked.

## Identifier Location Inventory

| Surface | Exact Location | Current State | Status |
| --- | --- | --- | --- |
| Release Version | `package.json`, `package-lock.json` | 0.1.0 recovered unchanged | Preserved |
| Codename | `README.md`, `index.html`, `godot/project.godot` | First Light | Preserved |
| Ordinal Allocation | No existing ledger | Durable per-scope allocator needed | Pending |
| Build Manifest | No existing manifest | One immutable manifest per invocation needed | Pending |
| Local Build Console | `scripts/build.mjs`, `scripts/export.mjs`, `scripts/godot-scene.mjs` | Legacy scripts have no full identifier | Pending |
| Development Server | `scripts/serve.mjs` | Live development labeling needed | Pending |
| CI Build Console | `.github/workflows/check.yml` | Recovered original workflow; not invoked for this save-only checkpoint | Pending |
| Deployment Build Console | `.github/workflows/pages.yml` | Manual workflow, not invoked | Pending |
| Delivered Filenames | `Classroom-Walkthrough.html`, `public/assets/classroom.glb`, `dist/` | Legacy stable names preserved; future enclosing output must carry full ID | Pending |
| Browser Identity Label | `index.html`, `src/app.js`, preserved HTML | Legacy First Light label; no complete canonical ID | Pending |
| Godot Identity Label | `godot/project.godot`, `godot/demo/walkthrough.tscn` | Legacy application name; no complete canonical ID | Pending |
| Reports And Handoff | `docs/recovery/2026-09-29.md`, `docs/REPOSITORY-STATUS.md` | Recovery and historical checks separated | Implemented For Recovery |
| Build Instructions | `README.md` | Links here before new artifact-producing work | Implemented For Recovery |
| PR Description | PR #1, `.github/PULL_REQUEST_TEMPLATE.md` | Preservation scope and pending retrofit documented | Implemented For Recovery |
| Existing Contributor Instructions | None existed in the recovered package | README and PR template expose the rule | N/A |

Before delivering the next new build, implement the pending items and verify the
same complete ID in console output, filename/enclosing folder, embedded manifest,
prominent UI, and current build report. Check distinct invocation ordinals and
safe concurrent allocation. Keep old artifacts and their historical evidence.
