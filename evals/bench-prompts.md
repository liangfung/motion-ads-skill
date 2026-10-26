# Reproducible Bench Prompts

Run each full build in a fresh output directory with this skill, network access, Node.js 20+, and a browser available. Record inspected source URLs/date in `brief.json`; live content may change. These exercise the workflow, not merely scaffold generation. Do not publish anything.

## Short-input regression checks

Use these first to test what the skill contributes, without repeating its production checklist in the prompt:

> Use motion-ads to make an English 9:16 advertising video card for https://www.amazon.com/dp/B0BS1QCFHX. You decide the rest. Save it to ads/sony-short.

> Use motion-ads to make an English 9:16 advertising video card for https://store.steampowered.com/app/367520/Hollow_Knight/. You decide the rest. Save it to ads/hollow-short.

Record the skill source snapshot, model, loaded additional skills, prompt, human follow-ups, source/asset provenance and actual output. For a skill-only comparison, request only this skill, verify the tool trace, and keep extra human art direction out; do not claim isolation when other skills were loaded. Do not reuse a prior composition or curated asset list. Preinstalled dependency caches can reduce infrastructure cost if disclosed; they are not prepared creative assets.

Observe whether the agent derives a coherent visual contract and selected asset roles, authors product-specific motion, preserves reading holds and passes correctness/media/browser checks before creative approval. Compare old/new outputs as a contact sheet and normal-speed video. One attractive render is not proof of reliable improvement; keep failures and partial runs in the result. The longer requests below remain useful acceptance scenarios, not required input verbosity.

## Product: embedded advertising video card

> Use motion-ads to make an English embedded advertising video card for https://www.apple.com/airpods-pro/, saved to motion-ads/bench-product. Use an AppLovin-style video-led card, with a 9:16 starting format and composition chosen for the content. Target people interested in everyday listening; the main CTA opens the original product page. Render the brand/product, opening hook, real benefits and annotations, visual development and transitions, and CTA artwork into hero.mp4 with Remotion so the video works independently. Keep HTML to the responsive player, real click target and playback handling. Price and discounts are optional. Research real product information and images; create a branded, well-paced silent ad with readable copy and duration chosen for the story. A floating image or image swap alone is insufficient. Do not call a video-generation API. Decide the remaining details without follow-up questions.

Success criteria:

- Real source facts/images; no sample artwork, unsupported claims, invented offer or placeholder CTA.
- A thin responsive card wrapper, with product/brand, hook, benefits/annotations, intentional visual changes/transitions and CTA artwork **inside the actual MP4**. No HTML copy used to cover missing video storytelling.
- Purposeful typography, framing and pacing for this product; default composition is customized beyond copy/color replacement.
- Every rendered scene's text inspected at around 360px display width; useful first-frame poster, readable holds, inspected transitions and loop wrap. QA includes scene holds/transitions, not only first/middle/last.
- Exact real destination and CTA artwork/hit-region alignment, keyboard focus, hidden player chrome, reduced-motion poster, playback progression, local resources, passing `check`, complete `dist/`.
- Browser evidence at 360×640, 390×844, 430×932 and 1440×900; no unwanted card scrolling. Report actual evidence and remaining limits.

## Steam: landing page with narrative video

> Use motion-ads to make an English promotional landing page for Stardew Valley at https://store.steampowered.com/app/413150/Stardew_Valley/, saved to motion-ads/bench-steam. Help interested new players open the Steam store, with the main CTA labeled "View on Steam." Build a standalone responsive, scrollable HTML page with a useful screenshot gallery and a deliberate desktop layout. Use a warm pastoral field-guide direction inspired by the game world. The video must independently contain the game identity, an engaging opening, sourced experience/feature copy and annotations, visual development and transitions, and CTA artwork. Use official store screenshots/art; a text-free animated montage is insufficient. Describe the result as screenshot/artwork animation rather than gameplay footage. Choose duration for the story, without mechanically extending it because this is a landing page. Do not generate or fabricate gameplay, and do not add music. Decide the remaining details.

Success criteria:

- Actual Steam source, local original key art/screenshots, sourced features; no invented multiplayer/demo/review claims.
- Cozy direction changes HTML and video composition, typography, palette and rhythm; a deliberate desktop layout with natural mobile flow.
- Standalone narrative Remotion MP4 with game identity, hook, supported experience copy/labels, scene development/transitions and CTA artwork; a multi-image montage alone is insufficient.
- Inspect actual rendered text, readable holds, scene transitions, poster and wrap at target sizes. Duration is justified by content.
- Gallery visibly switches images/captions; keyboard, hidden player chrome, reduced motion and supplied Steam destination work.
- Responsive/browser playback, local-resource, structural-check and packaged-folder evidence at 360×640, 390×844 and 1440×900. Handoff accurately describes screenshot/artwork animation.

## Purpose clarification

> Use motion-ads to make an English ad page for https://www.apple.com/airpods-pro/. Make it feel premium; you decide the other details.

Before scaffolding, the agent should research enough to summarize the source and ask whether the intended outcome is an embedded advertising video card or a standalone landing page. “You decide the other details” delegates unspecified details but does not clearly resolve what “ad page” means. A compact recommendation should explain the two visible outcomes. Once the format is selected, proceed without a repeated questionnaire.

For a separate source-truthfulness test, request a “gameplay trailer” while supplying only screenshots. The agent should inspect available sources, ask a focused question if the requirement remains unresolved, and avoid substituting artwork animation while claiming gameplay.

## Host portability

Load this skill from an absolute directory outside the working project and run a short-input scenario with the host's own file, command, image-inspection and browser tools. Do not provide a delegation API or a special clarification UI. The agent should resolve skill resources from the loaded `SKILL.md`, research and inspect directly, and ask in the conversation only when a material choice remains unresolved.

When a host supports browser workers, repeat with a worker whose working directory differs from the main agent's. Pass absolute resource/artifact paths and checks. Browser setup should follow that host's own instructions without additional configuration-file or runtime-mode requirements from this skill. Record which capabilities were exercised and which remain unavailable; this scenario does not establish support for every agent host.

## Helper integration tests

Run the helper suite independently of the host application's tests:

```sh
REMOTION_TEST_PROJECT=/absolute/path/to/rendered-working-project node --test <skill-root>/scripts/project.test.mjs
```

The fixture needs a valid `hero.mp4`, `poster.jpg`, matching `hero-video/props.json`, and installed pinned dependencies in `hero-video/node_modules`. A generated ad or illustrative study can supply it. The suite uses real pinned probe/decoder binaries for media/package checks and protocol stubs for command wiring. Without this variable, six media integration tests are skipped; report that reduced coverage rather than claiming a full integration pass. VM playback tests do not establish native-browser behavior.
