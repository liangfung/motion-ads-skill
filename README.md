# motion-ads-skill

Agent skill for building embedded advertising video cards and landing pages with Remotion.

## Layout

| Path | Purpose |
|---|---|
| `skills/motion-ads/` | Skill source (`SKILL.md`, `references/`, `scripts/`, `assets/`) |
| `evals/` | Maintainer bench prompts; not shipped |
| `tools/build-well-known.mjs` | Builds the discovery artifacts |
| `.well-known/agent-skills/` | Generated [Agent Skills Discovery v0.2.0](https://github.com/cloudflare/agent-skills-discovery-rfc) index and archives; do not edit by hand |

## Discovery

```
https://raw.githubusercontent.com/liangfung/motion-ads-skill/main/.well-known/agent-skills/index.json
```

Each skill is a `type: "archive"` `.tar.gz` with `SKILL.md` at its root; the index `url` is relative to the index location.

## Publishing

After changing anything under `skills/`, rebuild and commit the generated files together with the source:

```sh
npm run build   # write index.json and archives
npm run check   # fail if artifacts are stale
npm test        # helper tests (set REMOTION_TEST_PROJECT for media integration)
```

Archives are reproducible (sorted entries, fixed owner/mtime), so an unchanged skill keeps the same digest. `*.test.mjs` and `node_modules` are excluded.
