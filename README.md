# motion-ads-skill

Agent skill for animated promotional H5 experiences using real React, Remotion and Remotion Player. Generation needs file tools and a browser worker; Node/npm and video encoding are not prerequisites. Includes a prebuilt local browser runtime and three original unbranded reference studies: one stable stage, an object-led sequence and an atmospheric world.

| Path | Purpose |
|---|---|
| `skills/motion-ads/` | Distributable instructions, file-only helper, editable templates/examples and ready runtime |
| `tools/runtime/` | Maintainer source for runtime and reference compositions; not shipped |
| `tools/build-runtime.mjs` | Reproducible dependency/runtime and plain JS reference preparation |
| `evals/` | Maintainer prompts and workflow checks; not shipped |
| `.well-known/agent-skills/` | Generated discovery index/archive |

## Generation

Use the loaded skill. Initialization copies the ready runtime and editable HTML/JS/CSS into the project's `dist/`. Main authors and runs file commands; browser worker researches and reviews that same folder. Editing and refreshing replaces compilation. Deliver `dist/`; keep research and QA outside it.

## Maintainer publishing

Use Node 20.19+ to install the locked development dependencies and prepare distributable files:

```sh
npm ci
npm run hooks:install
npm test
npm run build
npm run check
```

Install the pre-commit hook once per clone with `npm run hooks:install`. It rebuilds and stages `.well-known/agent-skills/index.json` and the archives before each commit. Stage or stash all changes under `skills/` and to `tools/build-well-known.mjs` first; the hook rejects unstaged/untracked inputs, including ignored files, so archives match committed sources. Keep private/local files outside `skills/`. Installation does not change Git config or overwrite a different existing hook; integrate `.githooks/pre-commit` manually if one exists. Runtime/example source changes still require `npm run build` before committing.

The runtime pins React/React DOM and all Remotion packages, preserves dependency notices and records a hash/version file. Changes to maintainer source require regenerating runtime/examples and the archive. Commit generated artifacts alongside sources when publishing. Helper/runtime tests do not prove real-browser visual acceptance.

Retain dependency notices in distributed H5 folders. For publication or commercial use, see the [runtime licensing note](skills/motion-ads/references/player-h5.md#runtime-licensing) and Remotion's applicable license; the prebuilt runtime does not grant additional usage rights.

The discovery index is available at `https://raw.githubusercontent.com/liangfung/motion-ads-skill/main/.well-known/agent-skills/index.json`. Archives are reproducible, with `SKILL.md` at archive root. `node_modules` and maintainer tests are excluded.
