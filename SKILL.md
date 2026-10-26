---
name: motion-ads
description: Use when the user wants an embedded advertising video card, product landing page, interactive promo, ad end-card, or Steam game promotion from a product URL, game link, brief, or supplied assets.
---

# Motion Ads

Create an advertisement whose brand/product, hook, sourced benefits or annotations, visual sequence, transitions and CTA artwork are rendered into the MP4. A complete result includes local video and poster, a working HTML experience, and inspected output.

Choose the surface:
- **Video card:** a complete ad video with thin responsive HTML for playback, a real CTA link and reduced-motion handling.
- **Landing page:** a deliberately designed HTML experience plus a complete narrative ad video.

User direction and brand identity take precedence over presets. Derive the design from the selected material. Keep player controls/progress hidden and playback silent unless requested. A floating image or screenshot montage alone does not develop a complete advertisement.

## Capabilities

Use file reading and image inspection, commands that can write/download/run Node and Remotion, and a browser with the [research and QA capabilities](references/hero-video.md#browser-tool-capabilities). Tool names are environment-specific. In Pochi, browser access normally uses `newTask` with `agentType: "browser"`; clarification can use `askFollowupQuestion`. Track long-running jobs through completion and stop task-created services when finished.

Browser children need the confirmed runtime mode and relevant user constraints. Use existing browser infrastructure; the render helper blocks Chrome downloads. The parent can save reports or execute commands unavailable to a browser child. Image generation, audio tools, additional skills and system FFmpeg are optional rather than prerequisites.

## 1. Research and record

Read [source-analysis.md](references/source-analysis.md). Inspect the real product/game source, exact variant and candidate assets; view the images before choosing them. Keep sourced claims and qualifiers, preserve intentional CTA query parameters, and omit unsupported price/offers/reviews. With Steam stills, describe the result as screenshot/artwork animation rather than gameplay footage.

Gather facts, asset provenance and assumptions for a lightweight `brief.json`. For a new project, keep preliminary notes/files outside the output directory until initialization; then update the scaffold's brief. Use [working-file roles](references/source-analysis.md#working-files) to separate research, render inputs, QA and publication resources.

## 2. Resolve material choices

Read [question-guide.md](references/question-guide.md) before asking. Clarify only choices that materially affect the product story, audience, destination, direction or output. Distinguish a card from a landing page when “ad page” is ambiguous. Skip supplied or delegated decisions and optional offer fields. An explicitly delegated format can start with a card, the source URL as CTA, brand-derived styling and silent playback.

## 3. Establish the visual story

Read [design-guidelines.md](references/design-guidelines.md) and the matching [motion structure](references/examples.md): a stable **single-stage** layout with directed local changes, or a **story** with different compositions inside one coherent theme. Both can fit one embedded card. Consult [style presets](references/style-presets.md) or [page patterns](references/page-patterns.md) only when useful.

In the brief, record one persuasive idea, selected asset roles, palette/type/grid/image-treatment constants, and beats with entrances, readable holds, transitions and a closing action. Judge theme colors after viewing selected material together; give a short [palette rationale](references/design-guidelines.md#choose-color-from-the-material). Ask about materially different unresolved directions, otherwise decide and proceed.

Even with a short prompt, run the [type comparison](references/design-guidelines.md#typography-and-color) before extending the sequence. Vary the information and composition while preserving the chosen visual identity. Duration follows the story, not the HTML page length. A different product should require more than a title and accent-color swap.

## 4. Build and render

Follow [hero-video.md](references/hero-video.md) for setup, props, render commands and browser requirements. Resolve `<skill-root>` to the installed skill directory and `<out>` to the project root, not its `hero-video/` subdirectory.

```sh
node <skill-root>/scripts/project.mjs init <out> --layout card
# Or: --layout landing, --example single-stage, --example story
```

Initialize once the mode is known, before writing under `<out>`; edit existing initialized projects in place. Default output is `motion-ads/<product-slug>/` unless specified. Install the scaffold's pinned dependencies in `hero-video/`, configure props and customize `src/Ad.tsx`. Replace scaffold copy/artwork and assign meaningful image roles.

For a card, align the real HTML link with the [video CTA artwork](references/hero-video.md#cta-artwork-and-real-link). Keep the checker IDs `hero-video` and `cta`. Generate and inspect authored hold/transition stills before the full render; custom timing needs matching `qaFrames`. The final MP4 must tell the story independently of HTML copy.

## 5. Verify and improve

Complete checks in order: source/variant/claims and exact CTA, structural `check`, encoded-media `verify`, browser playback/interaction, then [creative review](references/design-guidelines.md#self-critique-before-delivery). Use the detailed [render and inspection workflow](references/hero-video.md#render-and-inspect).

Inspect the actual MP4, scene holds, transitions and loop at the intended display size. Give the browser agent the absolute HTML path for its [supported local-artifact preview](references/hero-video.md#open-the-local-artifact). A poster or successful navigation does not establish playback or pacing. Fix findings and recheck affected output. Keep one concise [QA report](references/hero-video.md#review-evidence) separating source, media, browser and creative evidence; mark unavailable checks honestly.

## 6. Package and deliver

```sh
node <skill-root>/scripts/project.mjs package <out>
```

Packaging reruns media verification before replacing `dist/`; failed verification preserves an existing delivery. It does not perform browser or creative approval. Have the browser agent open the packaged `dist/index.html` for a final interaction/playback check and deliver the whole folder. Retain the working project for edits. Do not publish or add tracking unless requested.

Report the output path, chosen story/style/mode/CTA, source assumptions, and separate verification results or blockers. Completion includes a narrative local MP4/poster and inspected browser output; identify partial results precisely. Public hosting and task/share-page sync are separate outcomes.
