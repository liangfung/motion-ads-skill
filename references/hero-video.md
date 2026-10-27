# Advertising Video (Remotion)

The MP4 must carry the advertisement: recognizable brand/product, a hook, supported benefits or annotations, an intentional visual sequence and transitions, and CTA artwork. Assess its message without supporting HTML copy. A camera move over a product photo or gallery is useful raw material, but does not by itself communicate a complete ad.

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

1. **Resolve design early.** Set the aspect ratio and author the opening plus one representative information-rich beat. Compare type, product scale, crop, palette and spacing together at the intended display size. Check what the viewer learns, not just whether the text fits. Render only those frame indices, for example:

```sh
node <skill-root>/scripts/project.mjs stills <out> --frames=0,180
```

`--frames` accepts comma-separated integer indices at 30fps (also `--frames 0,180`), replaces automatic sampling for that invocation and leaves other QA files intact. Choose actual frames from the authored timing. Retained stills are not current evidence for changed shots.

Test a new transition mechanism, including the closing-to-opening text handoff, on these shots before extending the sequence. Separate artwork motion from text visibility when a full-scene dissolve would show two headlines together.

2. **Complete the story and inspect it once.** For custom timing, set `qaFrames` in `props.json`: one settled hold per beat, a midpoint of each distinct transition mechanism, and the loop handoff. Add boundary frames only around a suspected fault; a frame-count target is not a quality target. Without an authored list the helper samples first/middle/last plus default scene holds and cuts. Run local typechecking after source edits and generate the set:

```sh
node <skill-root>/scripts/project.mjs stills <out>
```

With the starter configuration, stills bundle once and share one render browser; owned browser/bundle resources are cleaned up on success or failure. Custom `remotion.config.*` files or extra Remotion CLI flags retain the CLI path and may be slower. A full run refreshes `qa/hero-<frame>.jpg`; a selective run replaces only requested frames. Other evidence is retained.

Use the exact image paths and times printed by the command. Review the holds together for information progression and consistency, then inspect dense text or suspect transitions at the intended display size. An available image tool can assemble a contact sheet; creating a separate HTML review page or browser session for stills is unnecessary. A thumbnail overview cannot establish small-text readability. Frame 0 becomes the poster and must communicate a useful ad state. Batch related corrections and rerun only affected frames. Retained stills from changed shots are stale evidence.

3. **Render and package the accepted composition.** The normal final chain is:

```sh
node <skill-root>/scripts/project.mjs render <out>
node <skill-root>/scripts/project.mjs package <out>
```

`package` already runs `check` and `verify`; calling all three in sequence repeats work. Use the separate commands for intermediate diagnosis when needed. `check` validates resources and known scaffold copy/artwork, not source truth or design. `brief.json` is a lightweight provenance/decision record, not a fixed-schema or URL-required validator; user-supplied files are valid sources. `verify` probes encoded media, checks dimensions/duration/codec/silence, fully decodes the video and writes current hashes in `qa/media-check.json`.

4. **Accept the packaged page.** Use the [browser acceptance pass](#browser-acceptance), combining playback, interaction and creative review. Fix specific findings and recheck affected states; a checklist or report is not creative approval.

For landing pages, keep `.hero` in `index.html` at the same aspect ratio as `props.json` width/height; the starter's 5/3 matches 1200×720. The card wrapper also needs its aspect ratio and viewport-fit sizing updated when the placement changes.

Outputs are **`<out>/hero.mp4` and `<out>/poster.jpg`**, already beside `index.html`. Use the helper, not a separate `npm run render`/`poster` pipeline. `stills` and `render` accept additional Remotion CLI arguments, for example:

```sh
node <skill-root>/scripts/project.mjs render <out> --browser-executable=/path/to/chrome
```

### Recheck only what changed

| Change | Repeat |
|---|---|
| Composition, props or source imagery | Affected stills; typecheck after code edits; render and package. Inspect changed holds/transitions and alignment; repeat a full playback cycle when timing or sequence changed. |
| HTML, playback behavior, CTA destination or hit region | Package and affected browser checks. Keep the existing MP4 when the composition is unchanged. |
| Packaging of already-reviewed identical HTML/media | Packaged resource loading and a short playback smoke check. Reuse the recorded creative/interaction evidence for the identical files. |

Unchanged source facts, destination activation and preference behavior need not be re-researched or retested after a video-only fix. Check CTA alignment again if the artwork moves. Reuse evidence only when its tested inputs are unchanged; record the scope honestly. Fixing the loop usually needs a few closing/opening frames, not another full stills sweep.

### Browser acceptance

For a normal card, use one mobile-sized viewport (about 360px wide) and one desktop viewport unless the user specifies others. Landing pages also need checks for their authored interactions and layout breakpoints. Use one session and this finite pass:

| Check | Sufficient evidence |
|---|---|
| Load | Packaged HTML, poster and MP4 load; expected video dimensions, advancing time and no relevant media/resource errors |
| Watch | One uninterrupted normal-speed cycle through the wrap at the intended size; assess each beat's message, readable holds and transitions together. Allow the video's full duration plus the wrap. Capture and inspect a few representative moments or suspected faults in that pass; the existing still set need not be recaptured. Do not replay raw MP4 separately. |
| Interact | Real CTA activation reaches the intended destination or its expected login/checkpoint; keyboard focus is visible; the link aligns with its video artwork |
| Preferences | Initial reduced-motion load shows the poster and remains paused; one change back to normal resumes and one change to reduced pauses again |
| Resize | At the other viewport, check a representative hold, overflow and CTA alignment; no second full-cycle watch is needed |

Use supported batching for independent observations; confirm unfamiliar batch syntax before composing a long command. A few direct state reads alongside playback are sufficient to confirm progression and wrap; routine acceptance needs no injected polling timer or custom sampling script. The browser tests user-visible behavior; `media-check.json` already covers hashes, codec, duration, audio and full decoding. Re-parsing MP4 samples, collecting frame-callback statistics, profiling dropped frames or testing a browser/device matrix are diagnostics for a reported fault or explicit requirement, not routine acceptance. Inspect local failures; unrelated destination-site errors and optional favicon requests do not invalidate the video. Avoid intercepting navigation to test a real CTA.

If delegating, pass the packaged path, duration, target sizes, completed media/still evidence and this checklist to one worker. The worker owns playback, interaction and final visual inspection. Return a compact result: tested artifact/viewports, status and decisive observation for each check, evidence paths, unresolved findings and cleanup status. Detailed samples and logs can stay in existing tool output; another narrative report is unnecessary.

The main agent checks that the result covers the current delivery and all required checks, then incorporates it into the single QA report. Reopen evidence or repeat a check only for a specific finding, missing/contradictory observation or changed artifact. Do not routinely reread the worker's screenshots, replay the video or reread successful command logs merely to restate them. Missing capability remains blocked or partial, not passed. Stop after the pass when no loading, interaction, legibility, continuity, source or material storytelling issue remains. A visible defect still needs correction; elapsed time alone never makes a failed check pass.

### Open the local artifact

Open the absolute path to `<out>/dist/index.html` for final QA with the available browser tool; the working `<out>/index.html` is useful for an earlier diagnosis, not a mandatory extra full review. Use the tool's supported local-file or built-in preview according to the host's system instructions and tool descriptions. If delegating, pass the same path and checks to the browser worker. Keep HTML and relative resources together. Confirm actual MP4/poster loading and advancing time before reviewing motion.

### Browser tool capabilities

Use the browser tool's supported actions and inspection APIs. Native browser actions, DOM/accessibility inspection or permitted page-side JavaScript may supply these capabilities; arbitrary CDP access and a separate browser worker with shell execution are not requirements.

| Capability | Required use |
|---|---|
| Navigate and inspect sources | Open external product/manufacturer/store URLs, wait for rendered content, scroll/click relevant galleries or variant controls, read facts and exact links, and obtain usable original asset URLs |
| Reach the delivered page | Open final packaged HTML through the [local-artifact preview](#open-the-local-artifact), or working HTML for diagnosis; verify JavaScript, relative resources and H.264 MP4 playback |
| Capture and resize | Set the agreed mobile/desktop sizes and capture useful moments during the single playback pass |
| Observe runtime state | Inspect loaded video dimensions, readiness, paused/error state and time advancing naturally across observations, including loop behavior; inspect element bounds, destination URLs and focus state |
| Exercise interaction and preferences | Perform real pointer and keyboard actions, observe CTA navigation/new tabs, and test initial/live reduced motion as described in [browser acceptance](#browser-acceptance) |
| Diagnose and clean up | Inspect console/page errors and failed resource requests through available diagnostics; close task-created tabs/sessions when finished |

Asset downloads and report writes may use the main agent's command/file tools; a browser worker can return URLs, observations and screenshots. Browser-side JavaScript evaluation is useful, but an equivalent tool inspection API is sufficient. A fetch-only browser cannot establish responsive rendering, autoplay, real clicks or preference handling. If a capability or connection is unavailable, mark the affected QA as blocked or partial instead of substituting a static screenshot for runtime evidence.

### Browser tool and render browser

Follow the browser tool's own instructions for connection and runtime selection; this skill requires no host-specific configuration file. Remotion rendering separately needs an existing local Chrome/Chromium executable visible to the render process. Reuse a confirmed executable path when available. A browser session or CDP URL is not that executable, and the helper does not attach to an arbitrary existing browser session.

Resolution order is explicit `--browser-executable`, then `REMOTION_BROWSER_EXECUTABLE` / `CHROME_PATH`, common installed Chrome/Chromium locations and PATH, then Remotion's existing matching cache. Both flag forms (`--browser-executable=/absolute/path` and `--browser-executable /absolute/path`) accept spaces without shell splitting when quoted. Remotion's `ensureBrowser()` is called with a callback that throws before any browser download; its returned existing path is passed explicitly to each still/render command. An explicit invalid path fails instead of triggering a download.

**Do not automatically download Chrome**, run `remotion browser ensure`, or invoke a browser tool's install command as a render repair. If the path is unavailable or incompatible, report the actual environment mismatch and the required path/setup. Diagnose launch errors instead of silently downloading a replacement or repeatedly rerunning an unchanged failing command. If rendering remains blocked, deliver an explicitly incomplete draft and concrete blocker; an image, CSS motion, or gallery-only render cannot silently replace the finished ad.

## Encoding and playback

- Use silent H.264 with `yuv420p` for browser compatibility. Optimize dimensions, duration and quality for the actual placement; aim for a few MB when practical, and use a confirmed platform limit when one exists.
- Use `<video muted loop playsinline poster="./poster.jpg">` with autoplay handling and reduced-motion handling; playback controls are optional. Preserve a visible poster for loading failure, disabled autoplay, and reduced motion; verify time progression in the browser.
- For loops, make the closing state return coherently to the opening. First and last frames need not be identical, but avoid empty frames, sudden flashes, and abrupt text collisions at the wrap.

`package` reruns `verify` against the current HTML-selected video/poster, then copies and checks a staging directory before replacing `dist/`. It copies validated internal file symlinks as actual files and restores the previous delivery if replacement fails. Media, copy or staging-check failures leave an existing `dist/` intact; invalid media also removes the obsolete media-success report. It requires the working project's installed Remotion dependencies but does not launch/download Chrome. This is a media gate, not browser or creative approval. Keep source, props, research, QA and dependencies out of runtime references and `assets/`; the whole `assets/` folder ships.

## Review evidence

Keep one report under `qa/` (for example `review.md`), with one owner. For a successful card, four short rows below plus unresolved limits are usually enough; aim for roughly 150–250 words, expanding only to explain actionable findings or partial coverage. Link existing evidence instead of copying probe output, playback samples, screenshot inventories or the history of resolved edits. Record final results once the pass returns; if interrupted, retain honest partial status.

| Review | Evidence |
|---|---|
| Source | Link the brief/provenance record; state whether variant, claims and exact CTA agree |
| Media | Link current `media-check.json` and state the render/package outcome; do not transcribe its fields |
| Browser | Tested artifact, preview mode and viewports; concise outcome for load, full-cycle/wrap, CTA/focus/alignment, reduced motion and resize/errors, with representative evidence links |
| Creative | Reference authored stills and the playback review; summarize readability, information progression and continuity, with any remaining weakness |

Mark each result `passed`, `failed`, `blocked` or `not run`; state partial coverage within its row. A media success, screenshot or report cannot substitute for playback/interaction evidence. Incorporate the worker's checked observations without a second inspection by the report owner. If the worker can write the report, the main agent adds only missing source/media context; otherwise the main agent persists its result. A separate typecheck, focus or preference section is unnecessary when the relevant row already covers it.

After changes, recheck affected evidence and update the report. A new `media-check.json` does not refresh earlier browser/creative conclusions. If a required review is blocked, keep the partial artifact and report the blocker; packaging success alone does not mean the ad is complete.

When timing is requested or a run is slow, add one line with already-available stage timings and full render count; mark unknown durations rather than reconstructing a detailed timeline at delivery. Tool-job durations and user approval delays are different measurements; avoid attributing all elapsed time to rendering. The user handoff needs the delivery path, outcome and material limits, not a second QA report. Clean up task-owned resources as part of the same pass.

For clean player presentation, spacing and product-appropriate motion density, follow [design-guidelines.md](design-guidelines.md#clean-presentation-and-deliberate-spacing).

## Execution and failure recovery

Use the scaffold's local dependencies and bundled helpers before writing a new render/verification pipeline. Node.js, the pinned Remotion installation and a usable browser are sufficient for rendering; image manipulation is optional and should use an available tool. Do not install a test framework merely to generate an ad or route its tests through the host monorepo. Specialized skills are optional, not dependencies of this workflow.

- Discover tools independently (`command -v node`, then other needed tools); one missing optional command in an `&&` chain must not hide successful probes. Missing Pillow, ImageMagick or system FFmpeg is not a render blocker. On macOS, `sips` can make previews; use installed image tooling elsewhere. Preserve originals.
- Install in `<out>/hero-video/`, normally `npm install --workspaces=false --no-audit --no-fund`. Inspect completion/exit status. A started background job is not a successful install; wait for the terminal notification. Do not launch two installers against the same directory. On a transient fetch failure, retry once with the same manager after inspecting the actual error; persistent failures need a concrete blocker, not unbounded retries or cache/config deletion.
- Reuse an established research browser session for later QA. If connection setup is pending, inspect that job before starting another connection; surface a required user action promptly and continue independent work where possible. Use the host's supported completion/wait mechanism rather than starting extra poller jobs or repeatedly rechecking unchanged status.
- Keep `render`, `verify` and browser checks as distinguishable stages. Save their logs/status. If render succeeded but the verifier failed, diagnose the verifier and reuse the existing MP4 unless encoding itself is wrong. Passing a self-authored source regex test cannot establish browser playback or visual quality.

`verify` contains a small adapter to the **pinned 4.0.538** renderer's binary resolution; when changing Remotion versions, check that adapter and run the [real-media integration tests](../evals/bench-prompts.md#helper-integration-tests). Do not copy absolute binary paths from another machine. A local ad delivery and a publicly accessible share/HTML preview are separate outcomes.
