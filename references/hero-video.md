# Advertising Video (Remotion)

The MP4 must carry the advertisement: recognizable brand/product, a hook, supported benefits or annotations, an intentional visual sequence and transitions, and CTA artwork. Review it independently of the HTML. A camera move over a product photo or gallery is useful raw material, but does not by itself communicate a complete ad.

## Scaffold and props

`node <skill-root>/scripts/project.mjs init <out> --layout card` creates the thin card wrapper, asset folder, and editable `hero-video/` project; omit the flag for the same default or choose `--layout landing`. `endcard` is an alias for `card`. Use Node.js 20+; the starter pins Remotion 4.0.538. Install dependencies separately with `npm install` from `<out>/hero-video/`. Locate an existing render browser before starting; the helper blocks automatic browser downloads.

Put render inputs in `<out>/hero-video/public/`. Paths in `props.json` are relative to that directory, for example `"image": "product.jpg"`. Keep publication assets in `<out>/assets/`; copy a shared original rather than hotlinking it. Helper commands take the project root `<out>`; from inside `hero-video/`, pass its parent's absolute path, not `.`.

Configure **`<out>/hero-video/props.json`**, not hardcoded default props in `Root.tsx`:

| Property | Purpose |
|----------|---------|
| `presentation` | `"ad"` by default: narrative ad in `src/Ad.tsx`. `"product"` and `"gallery"` remain optional supporting presentations in `src/Hero.tsx`. |
| `brand`, `ctaLabel` | Persistent brand identity and primary action wording rendered in the ad |
| `scenes` | Ordered objects with `eyebrow`, `headline`, optional `body`, `image`, and `labels: string[]` |
| `image` | Primary local image path; scene images can override it |
| `images` | Optional local screenshot/gallery paths for the gallery presentation |
| `imageMode` | `"cutout"`, `"white-bg"`, or `"photo"`; describe the real asset, not the desired one |
| `motif` | `"rings"`, `"airflow"`, or `"none"` for supporting product imagery; atmosphere is not proof of performance |
| `bg`, `surface`, `accent` | Video palette, coordinated with the wrapper or landing page |
| `text`, `ctaText` | Foreground/text color and text-on-accent color; `ctaLabel` supplies the CTA words |
| `width`, `height` | Even pixel dimensions matched to the video slot |
| `durationSeconds` | Duration chosen for the story and readable holds |

Card starts at 720×1280, landing at 1200×720, both at 12 seconds. User dimensions and placement needs override these starting values. They are not a rule that both modes need the same duration. Do not pass the removed `cutout` boolean. New behavior beyond the supported props belongs in the editable composition.

## Build the story in the composition

Start with a small beat sequence: introduce a recognizable subject and hook, develop the supported reason to care through changing visuals/annotations, and resolve to the action. A short card may combine beats; a game or feature tour may need more. Choose duration from the content and reading time, rather than stretching a montage or making landing videos automatically longer.

`src/Ad.tsx` gives scenes equal slots over `durationSeconds`. This is an editable baseline. Change scene timing, layout, image treatment, typography, labels, and transitions when the brief calls for a different rhythm. A headline replacement and new accent color do not make the starter a product-specific ad. Keep longer copy visible after its entrance; a moving text animation is not a readable hold.

For richer runnable code, choose a [single-stage or story example](examples.md). Keep a compact visual contract (theme constants, asset roles, beat development) before implementing. Neither example is a mandatory look or duration.

The wide baseline uses larger type and cycles feature labels one at a time so they remain legible in mobile landing slots; the portrait baseline builds its labels together. The helper samples those wide label holds too. Inspect every label and its actual reading time; use shorter copy, more time, or a different layout when needed.

| Source | Useful visual treatment inside the narrative |
|--------|---------------------------------------------|
| Transparent object cutout | Product scale/framing changes, detail crops and precise labels; restrained rotation where suitable |
| White-background packshot | Intentional white composition with clean edges; do not fake a transparent cutout |
| Lifestyle/model/room photo | Subject-aware crop or camera movement with anchored copy and deliberate contrast |
| App UI | Crisp screenshot focus, supported feature annotations, deliberate device framing if helpful |
| Steam key art/screenshots | Distinct world/experience beats with supported feature copy and genre-aware cuts or dissolves |

Do not generate product results, gameplay footage, or fake UI states to fill gaps. Steam stills can support a narrative **animated screenshot/artwork advertisement**, but motion over them does not create real gameplay. If gameplay or an official trailer is required, obtain an allowed official video or user file. Keep the handoff accurate about the source.

See [design-guidelines.md](design-guidelines.md) for temporal typography and composition. Default to silence; no audio or caption pipeline is provided. Add sound only when requested and a usable licensed file/tool actually exists.

## CTA artwork and real link

Render the CTA artwork in the MP4. The card HTML supplies its real anchor with an accessible name and visible keyboard focus. In the starter, artwork and transparent anchor share left **8%**, width **84%**, bottom **7%**, height **7.5%** of the video stage. If the design changes the region, update the Remotion composition and HTML together; verify alignment at mobile and desktop sizes. Keep this region clear of moving content and optional playback controls.

The destination belongs to the real HTML link, preserving intentional query parameters. A rendered button cannot navigate on its own. In landing mode, HTML can add supporting copy, useful interactions, and repeated links, while the video still contains its own narrative and CTA artwork.

## Render and inspect

1. Choose the video aspect ratio and safe subject/text area for the selected mode. Avoid stretching a square render into a portrait or wide slot. Set `props.json` and edit `src/Ad.tsx` as needed, then run:

```sh
node <skill-root>/scripts/project.mjs stills <out>
```

2. Inspect the images under `<out>/qa/` with `readFile`. Stills currently launch one Remotion CLI process per frame, so dense sampling has startup/bundling overhead; choose meaningful frames and allow the job to finish. Without an authored frame list, the helper samples first/middle/last plus default ad-scene holds and transitions. For custom timing set `qaFrames: [0, ...]` in `props.json` to include actual holds and each transition's start/middle/end, plus the loop wrap; frames are integer indices at 30fps. Read the **actual rendered words** in every scene. Check cropped subjects, text wraps, label overlap, and the CTA region. Frame 0 becomes the poster and must already communicate a useful ad state.
3. Render and check:

```sh
node <skill-root>/scripts/project.mjs render <out>
node <skill-root>/scripts/project.mjs check <out>
node <skill-root>/scripts/project.mjs verify <out>
```

4. `check` validates package structure/resources and known untouched template copy. In a working project it also checks props and referenced scaffold artwork; explicitly illustrative studies remain supported. This is not a semantic completeness or source-truth check. `brief.json` records facts/provenance but is not a fixed-schema or URL-required validator. User-supplied local files are valid sources.

`verify` probes the **encoded** MP4/poster, checks dimensions/duration/codec/silence, fully decodes the video, and writes hashes in `qa/media-check.json`. These checks do not inspect claims or design. Finish the source/CTA review and browser playback/interaction checks before approving quality. Then watch **`<out>/hero.mp4` by itself**, without adjacent HTML copy, at roughly 360px displayed card width or the target landing slot. Inspect every text hold, theme consistency, complete story, transition, CTA, and final-to-first wrap; stills do not establish pacing. Check the final packaged folder too, and repeat affected checks after edits.

For landing pages, keep `.hero` in `index.html` at the same aspect ratio as `props.json` width/height; the starter's 5/3 matches 1200×720. The card wrapper also needs its aspect ratio and viewport-fit sizing updated when the placement changes.

Outputs are **`<out>/hero.mp4` and `<out>/poster.jpg`**, already beside `index.html`. Use the helper, not a separate `npm run render`/`poster` pipeline. Each `stills` run refreshes only its own `qa/hero-<frame>.jpg` files; browser screenshots and review reports are retained and must be reassessed when affected. `stills` and `render` forward additional Remotion CLI arguments, for example:

```sh
node <skill-root>/scripts/project.mjs render <out> --browser-executable=/path/to/chrome
```

### Open the local artifact

Give the browser agent the absolute path to `<out>/index.html`, then `<out>/dist/index.html` after packaging. Let it choose a supported local-file or built-in preview according to its own system instructions and tool descriptions. Keep the HTML and relative resources together. Confirm the actual MP4/poster load and playback time advances before reviewing motion.

### Browser tool capabilities

Use the browser tool's supported actions and inspection APIs. Native browser actions, DOM/accessibility inspection or permitted page-side JavaScript may supply these capabilities; arbitrary CDP access and shell execution inside the browser agent are not requirements.

| Capability | Required use |
|---|---|
| Navigate and inspect sources | Open external product/manufacturer/store URLs, wait for rendered content, scroll/click relevant galleries or variant controls, read facts and exact links, and obtain usable original asset URLs |
| Reach the delivered page | Open working and packaged HTML through the [local-artifact preview](#open-the-local-artifact); verify JavaScript, relative resources and H.264 MP4 playback |
| Capture and resize | Set the specified mobile/desktop viewport sizes and return viewable screenshots at multiple moments for layout, spacing and motion inspection |
| Observe runtime state | Inspect loaded video dimensions, readiness, paused/error state and time advancing naturally across observations, including loop behavior; inspect element bounds, destination URLs and focus state |
| Exercise interaction and preferences | Perform real pointer and keyboard actions, observe CTA navigation/new tabs, and test reduced-motion preferences on initial load and after changes |
| Diagnose and clean up | Inspect console/page errors and failed resource requests through available diagnostics; close task-created tabs/sessions when finished |

Asset downloads and report writes may be performed by the parent command/file tools; the browser can return URLs, observations and screenshots. Browser-side JavaScript evaluation is useful, but an equivalent tool inspection API is sufficient. A fetch-only browser cannot establish responsive rendering, autoplay, real clicks or preference handling. If a capability or connection is unavailable, mark the affected QA as blocked or partial instead of substituting a static screenshot for runtime evidence.

### Browser tool and render browser

Inspect the browser tool's actual configuration first. In Pochi this can include `browserAgentSettings` in `~/.pochi/config.jsonc` and the browser agent's environment diagnosis. Read only the relevant browser settings and do not copy credentials into logs or delivery files. Follow the configured browser mode or its documented default, and pass the confirmed mode from research into later QA. Finding an installed Chrome does not select local CDP. The tool may already use managed Chrome or connect to local Chrome via CDP. Reuse a confirmed executable path visible to the render process. A remote/sandboxed browser may expose only a CDP session; that URL is not the local executable required by this scaffold, and the helper does not attach to an arbitrary existing browser session.

Resolution order is explicit `--browser-executable`, then `REMOTION_BROWSER_EXECUTABLE` / `CHROME_PATH`, common installed Chrome/Chromium locations and PATH, then Remotion's existing matching cache. Both flag forms (`--browser-executable=/absolute/path` and `--browser-executable /absolute/path`) accept spaces without shell splitting when quoted. Remotion's `ensureBrowser()` is called with a callback that throws before any browser download; its returned existing path is passed explicitly to each still/render command. An explicit invalid path fails instead of triggering a download.

**Do not automatically download Chrome**, run `remotion browser ensure`, or invoke a browser tool's install command as a render repair. If the path is unavailable or incompatible, report the actual environment mismatch and the required path/setup. Diagnose launch errors instead of silently downloading a replacement or repeatedly rerunning an unchanged failing command. If rendering remains blocked, deliver an explicitly incomplete draft and concrete blocker; an image, CSS motion, or gallery-only render cannot silently replace the finished ad.

## Encoding and playback

- Use silent H.264 with `yuv420p` for browser compatibility. Optimize dimensions, duration and quality for the actual placement; aim for a few MB when practical, and use a confirmed platform limit when one exists.
- Use `<video muted loop playsinline poster="./poster.jpg">` with autoplay handling and reduced-motion handling; playback controls are optional. Preserve a visible poster for loading failure, disabled autoplay, and reduced motion; verify time progression in the browser.
- For loops, make the closing state return coherently to the opening. First and last frames need not be identical, but avoid empty frames, sudden flashes, and abrupt text collisions at the wrap.

`package` reruns `verify` against the current HTML-selected video/poster before replacing `dist/`; it requires the working project's installed Remotion dependencies but does not launch/download Chrome. Invalid media leaves an existing `dist/` intact and removes the obsolete media-success report. This is a media gate, not browser or creative approval. Keep source, props, research, QA and dependencies out of runtime references and `assets/`; the whole `assets/` folder ships.

## Review evidence

Keep a single concise report under `qa/` (for example `review.md`, or update an existing report). Separate these results and give evidence paths/observations for each:

| Review | Evidence |
|---|---|
| Source | Exact model/variant, chosen asset provenance, used claims/qualifiers and CTA compared with the brief |
| Media | Current `media-check.json`: encoded dimensions/duration/format, full decode and checked HTML/video/poster hashes |
| Browser | Tested file path/URL, preview mode and viewports, loaded dimensions and advancing time, real CTA interaction/focus, reduced-motion behavior and resource/console findings |
| Creative | Inspected holds, transitions, wrap and normal-speed playback; readability, spacing, continuity and findings fixed |

Mark each result `passed`, `failed`, `blocked` or `not run`; state partial coverage within a row instead of hiding it behind an overall pass. A media success, screenshot or report file cannot substitute for playback/interaction evidence. If the browser child cannot write files or run commands, have it return observations/screenshots and let the parent persist the report; do not make it repeatedly attempt unavailable tools or install a test framework for routine ad QA.

After changes, recheck affected evidence and update the report. A new `media-check.json` does not refresh earlier browser/creative conclusions. If a required review is blocked, keep the partial artifact and report the blocker; packaging success alone does not mean the ad is complete.

For clean player presentation, spacing and product-appropriate motion density, follow [design-guidelines.md](design-guidelines.md#clean-presentation-and-deliberate-spacing).

## Execution and failure recovery

Use the scaffold's local dependencies and bundled helpers before writing a new render/verification pipeline. Node.js, the pinned Remotion installation and a usable browser are sufficient for rendering; image manipulation is optional and should use an available tool. Do not install a test framework merely to generate an ad or route its tests through the host monorepo. Specialized skills are optional, not dependencies of this workflow.

- Discover tools independently (`command -v node`, then other needed tools); one missing optional command in an `&&` chain must not hide successful probes. Missing Pillow, ImageMagick or system FFmpeg is not a render blocker. On macOS, `sips` can make previews; use installed image tooling elsewhere. Preserve originals.
- Install in `<out>/hero-video/`, normally `npm install --workspaces=false --no-audit --no-fund`. Inspect completion/exit status. A started background job is not a successful install; wait for the terminal notification. Do not launch two installers against the same directory. On a transient fetch failure, retry once with the same manager after inspecting the actual error; persistent failures need a concrete blocker, not unbounded retries or cache/config deletion.
- Keep `render`, `verify` and browser checks as distinguishable stages. Save their logs/status. If render succeeded but the verifier failed, diagnose the verifier and reuse the existing MP4 unless encoding itself is wrong. Passing a self-authored source regex test cannot establish browser playback or visual quality.

`verify` contains a small adapter to the **pinned 4.0.538** renderer's binary resolution; when changing Remotion versions, check that adapter and run the [real-media integration tests](../evals/bench-prompts.md#helper-integration-tests). Do not copy absolute binary paths from another machine. A local ad delivery and a publicly accessible share/HTML preview are separate outcomes.
