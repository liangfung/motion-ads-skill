# Prebuilt Remotion Player H5

## Project and runtime

Generation edits ordinary files. React, React DOM, Remotion and `@remotion/player` are already bundled together in `assets/runtime/motion-runtime.js`, sharing their actual dependency instances. This is a library runtime, not a fixed scene engine or JSON-only template. Node is used by skill maintainers to publish that runtime, not by the main agent or browser worker when generating an H5.

| Path | Purpose |
|---|---|
| `<out>/dist/index.html` | Document structure, metadata, supporting HTML and ordered classic scripts |
| `dist/config.js` | `window.motionAd`: dimensions, fps, duration, title, action, scene inputs and selected asset URLs |
| `dist/ad.js` | Editable plain-JavaScript React composition; mounts it in the real Player |
| `dist/styles.css` | Page styles and local `@font-face` declarations |
| `dist/runtime.js` | Supplied dependency/runtime bundle; copy unchanged |
| `dist/assets/` | Only the selected local runtime images, fonts and other resources |
| `dist/runtime-version.json`, `THIRD-PARTY-NOTICES.txt` | Runtime version/hash metadata and dependency notices; retain both |
| `brief.json`, `research/`, `qa/` | Working facts, assets and review evidence outside the delivery |

Initialize once with `bash <skill-root>/scripts/project.sh init <out>`; `--example single-stage`, `--example bright` or `--example atmospheric` copies one complete study. Choose the relevant [reference](examples.md) without loading all implementations. The helper refuses existing output and removes its own incomplete initialization on failure. Continue existing work in place.

If the host cannot invoke a shell script, create a new `<out>/dist/assets/`, copy the four files from `assets/player-template/` into `dist/`, copy `assets/runtime/motion-runtime.js` there as `runtime.js`, retain the runtime version/notices files under the names above, and create the brief outside `dist/`. Inspect an existing directory before writing; never overwrite unrelated work. Copy a study's `ad.js`/`config.js` pair when useful.

No project dependency installation, bundling, typecheck process, render browser, MP4, poster, encoder or decode is part of this workflow. Do not route file operations through a host monorepo task or attempt binary-download workarounds. Missing preview capability is a browser-review blocker, not a reason to change the framework.

## Author the composition

The provided runtime exposes `MotionAds.React`, `ReactDOMClient`, `Remotion`, `Player`, `validate(config)` and `mount(component, config)`. Use the copies it provides; do not load another React/Remotion instance. The complete examples use:

```js
(() => {
  const {React, Remotion} = MotionAds;
  const h = React.createElement;
  const {AbsoluteFill, useCurrentFrame, interpolate} = Remotion;
  function Ad(props) {
    const frame = useCurrentFrame();
    return h(AbsoluteFill, {style: {background: props.bg}},
      h('div', {'aria-hidden': true, style: {opacity: interpolate(frame, [0, 15], [0, 1], {extrapolateRight: 'clamp'})}}, props.title));
  }
  MotionAds.mount(Ad, window.motionAd);
})();
```

Plain JS still supports arbitrary components, hooks, SVG, styles, information groups, scene structures and real links/buttons. Use the local `h` alias, descriptive helper components and arrays with stable keys to keep nested layouts readable. Neither the examples nor the config schema dictates a product style. The short snippet above demonstrates the API, not a finished advertisement.

Do not put JSX, TypeScript annotations or npm imports into delivery scripts. New libraries are not automatically available in the runtime. Prefer provided APIs; a genuinely required new dependency needs a deliberate compatible runtime update, not a second CDN copy or a silent fallback to another engine. Maintain source frame/fps values for deterministic motion; uncontrolled timers/CSS animation should not make frozen-frame review unpredictable.

Keep script order `runtime.js` → `config.js` → `ad.js` with `defer`. Metadata and the template's `page-title`/`page-description` nodes are populated from the config when mounted; customize supporting HTML for the brief. The starter has a portrait stage and a visually hidden heading/description; an ad card needs no visible section below the Player. Make supporting HTML visible only when the brief asks for a page or the content genuinely needs natural reading flow, and then design it with the composition rather than as a fact list repeating the animation. Fixed-canvas artwork scales, not reflows: recompose for a different aspect ratio and keep natural reading content in ordinary HTML.

The studies use `bg`, `surface`, `accent` and `text` for base theme roles; artwork lighting and secondary tones remain authored choices. Optional `qaFrames` lists useful inspection frames for the reviewer, opened with `?frame=N`. It does not affect playback or require a capture for every entry; update or remove stale hints when timing changes.

Keep a stable page heading and concise semantic description in HTML; the starter's `visually-hidden` section serves assistive technology without adding visible copy. Hide redundant animated copy/artwork at its visual layer with `aria-hidden`, while keeping actual links/buttons outside that hidden subtree. Do not hide the whole interactive Player.

## Assets, loading and behavior

Use local URLs such as `./assets/product.jpg` in `image` fields/`Img` sources and list selected image URLs in config `assets`. Those images decode before playback; remove unused material to avoid waiting for a whole gallery. Use URL encoding for reserved filename characters. `staticFile(name)` can resolve listed assets under `assets/`, but direct local URLs are simpler. For font resources, use [Fonts](#fonts).

The runtime checks dimensions, duration, required copy, known placeholders, selected asset paths and action destination. It cannot discover every dynamically constructed JavaScript request, prove image quality or verify product claims. Inspect actual selected resources and relevant page errors in the browser. Runtime version metadata does not assert that custom code or assets passed review.

The default Player is silent, loops, hides transport controls, pauses when the document is hidden and retains readable loading/error states. Reduced motion holds a useful opener; a live change pauses/resets and normal mode resumes. Real CTA links/buttons remain usable. A `?frame=N` URL freezes that frame for inspection, including under reduced motion; delivery without the parameter loops. Frame/state attributes on `#motion-stage` help observation but do not alone prove visual playback.

Development is edit → refresh → observe. Confirm changed copy/artwork actually appears using the browser tool's supported reload/cache behavior. There is no generated second copy to rebuild or synchronize. The helper `check` only establishes required nonempty files, absence of known working-evidence locations and replacement of common scaffold inputs. It does not execute or typecheck JS, inspect every resource or establish runtime success. Reusing a starter is allowed; changing its bytes does not establish a product-specific visual story.

H5 is not automatically smaller/faster than MP4. Budget selected image dimensions, compression, font weights and expensive visual effects. Routine acceptance needs no profiler or frame-sampling script. Investigate a visible load/stutter problem with scoped evidence; a warm local desktop result is not a phone/network benchmark.

## Fonts

Choose faces using the [material-led typography guidance](design-guidelines.md#typography-and-color). Fetch only the styles/subsets needed for comparison, then retain the selected files and their licenses in `dist/assets/fonts/`. Prefer existing WOFF2 downloads; [Fontsource](https://fontsource.org/docs/getting-started/cdn) provides versioned direct font URLs without a package install. Download resources during authoring and use local URLs in the H5. Use a supported supplied format when appropriate rather than adding a conversion toolchain.

Set `--font-display` and `--font-text` once in `styles.css`; the starter and all studies bind their display copy and reading/action text to these roles. `--display-weight` and `--display-tracking` control primary headline emphasis. Unset roles preserve each composition's defaults. The example below shows one static display face and a system reading stack; replace the filename/families with the selected treatment:

```css
@font-face {
  font-family: "Campaign Display";
  src: url("./assets/fonts/display-700.woff2") format("woff2");
  font-style: normal;
  font-weight: 700;
  font-display: swap;
}
:root {
  --font-display: "Campaign Display", sans-serif;
  --font-text: system-ui, sans-serif;
  --display-weight: 700;
  --display-tracking: -0.02em;
}
```

Match declarations and composition weights to real files; for a variable font, declare its actual weight range. Check the language, numbers and punctuation used in the ad. Prefer an available language subset over per-task subsetting. A small font may be embedded as a `data:font/woff2;base64,...` URL when an authorized preview supports inline fonts but cannot load its local font file; generate it directly into CSS with available file commands, without printing font data into the conversation. Base64 adds about one third to the bytes, so avoid routinely embedding full large character-set fonts.

Declared faces are attempted before playback. Font failures allow CSS fallback playback, with a console warning and `data-fonts="fallback"` on `#motion-stage`; `ready` means declared-face loading completed, including when no faces were declared. Confirm that the intended face is registered and loaded as well as inspecting actual text: a CSS `font-family` string or `ready` alone does not establish font use. Resolve a failure or inspect and record the fallback's wrapping/spacing during the existing typography checkpoint. Keep the result in the same brief/QA record; no separate font project or acceptance round is needed.

## Browser acceptance

Prefer one browser-capable subagent. Give it the absolute `dist/index.html`, current config/duration, target sizes, early inspected holds, relevant brief and a shared `qa/` evidence path. No project copying or worker shell is needed. Open through the host's supported local-file/built-in preview, retaining relative resources. If no authorized preview is available across the team, mark the affected checks blocked; static review or a simulated DOM does not replace actual playback.

Use an early opener/dense-hold checkpoint to choose type, scale and spacing. For the final artifact, combine the checks in one session:

| Check | Sufficient evidence |
|---|---|
| Start | Actual composition/selected images appear; loading ends; no blocking JavaScript/resource error or error screen remains; declared fonts load or the fallback typography is inspected and recorded |
| Story | One uninterrupted normal-speed cycle through wrap at the intended narrow width (around 360px unless specified); readable holds, distinct information and coherent transitions |
| Action/preferences | Actual action reaches its destination/target, visible keyboard focus; initial reduced motion is useful, normal resumes and a live change pauses again |
| Resize | A representative hold and surrounding HTML at a desktop size: no accidental overflow, clipping, lost action or broken reading order; no second full cycle |

Take only captures useful to assess a hold or finding. Fold creative observations and sourced-claim consistency into that same pass; reuse earlier hold conclusions. Return statuses, decisive observations, evidence paths and unresolved issues without editing the composition. Main checks coverage/identity and does not routinely reopen screenshots or repeat playback. Inspect further only for missing/contradictory evidence, a concrete finding or changed content. Do not intercept navigation to simulate an action.

Batch blocking corrections: startup/asset failure, wrong fact/variant/action, unreadable/colliding copy, missing layers, abrupt/blank handoff, broken preference/interaction or unusable layout. Refresh and check affected states; timing/sequence changes need one new full cycle. Do not repeat unrelated research or acceptance. Aim for one corrective batch; report any surviving blocker as incomplete. Optional taste-level decoration, easing or alternative type goes into polish notes.

## Review evidence

Keep one short `qa/` record with four rows: **Source** (brief consistency), **Files** (helper outcome/runtime identity), **Browser** (tested artifact, combined checks and evidence), **Creative** (information progression/readability/continuity and remaining weakness). Usually 100–150 words suffice; do not fill a word quota or copy logs/hashes/capture inventories. Use passed/failed/blocked/not run and mark partial coverage. One reviewer supplies browser/creative observations; main adds missing source/file context without a second inspection.

Handoff includes the editable `dist/`, outcome and meaningful limits. Add timing only from available evidence when evaluating a slow run. Close only task-created tabs/sessions. Do not call static checks or JSDOM tests browser acceptance.

## Browser capabilities

The worker needs source reading/navigation, relevant galleries/variants, original asset URLs, image inspection, JavaScript H5 and relative-resource preview, viewport/capture tools, relevant diagnostics, real pointer/keyboard actions and initial/live reduced-motion control. Native actions, DOM/accessibility or supported inspection can supply these. Arbitrary CDP or worker shell is unnecessary. Reuse authorized login state/CDP only when supported by the host; no host-specific config file is required. Missing main-agent browser tools do not block work when a capable subagent exists. Do not automatically download a browser to repair an environment mismatch.

## Runtime licensing

Retain `THIRD-PARTY-NOTICES.txt`: bundling the runtime does not grant additional rights to its dependencies. For publication or commercial use, check the applicable Remotion license and eligibility in the [official license FAQ](https://www.remotion.dev/docs/license/faq). The Remotion license also applies to Player usage, even when no MP4 is exported. This is a release consideration, not another generation or browser-QA round.
