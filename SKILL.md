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

Use file reading/writing and image inspection, commands that can download/run Node and Remotion, and a browser with the [research and QA capabilities](references/hero-video.md#browser-tool-capabilities). Map these capabilities to the host agent's available tools; no specific tool names or delegation API are required. Ask unresolved questions through the available clarification tool or directly in the conversation. Track long-running jobs through completion.

Resolve `<skill-root>` to the directory containing this loaded `SKILL.md`; resolve its references, scripts and assets from there, independently of the workspace or current directory. Browser work can run directly or through an available browser worker. When delegating, pass the relevant source/artifact paths, checks and user constraints; use absolute skill-resource paths when they are needed. Use existing browser infrastructure; the render helper blocks Chrome downloads. Image generation, audio tools, additional skills and system FFmpeg are optional rather than prerequisites.

## 1. Research and record

Read [source-analysis.md](references/source-analysis.md). Inspect the real product/game source, exact variant and candidate assets; view the images before choosing them. Keep sourced claims and qualifiers, preserve intentional CTA query parameters, and omit unsupported price/offers/reviews. With Steam stills, describe the result as screenshot/artwork animation rather than gameplay footage.

Gather facts, asset provenance and assumptions for a lightweight `brief.json`. For a new project, keep preliminary notes/files outside the output directory until initialization; then update the scaffold's brief. Use [working-file roles](references/source-analysis.md#working-files) to separate research, render inputs, QA and publication resources.

## 2. Resolve material choices

Read [question-guide.md](references/question-guide.md) before asking. Clarify only choices that materially affect the product story, audience, destination, direction or output. Distinguish a card from a landing page when “ad page” is ambiguous. Skip supplied or delegated decisions and optional offer fields. An explicitly delegated format can start with a card, the source URL as CTA, brand-derived styling and silent playback.

## 3. Establish the visual story

Read [design-guidelines.md](references/design-guidelines.md) and the matching [motion structure](references/examples.md): a stable **single-stage** layout with directed local changes, or a **story** with different compositions inside one coherent theme. For a story or feature-rich card, inspect the matching runnable composition before authoring; learn its timing and attention mechanisms without inheriting its look. Both structures can fit one embedded card. Consult [style presets](references/style-presets.md) or [page patterns](references/page-patterns.md) only when useful.

In the brief, record one persuasive idea, selected asset roles, palette/type/grid/image-treatment constants, and what each beat teaches through visual evidence and motion. Include entrances, readable holds, transitions and a closing action. Judge theme colors after viewing selected material together; give a short [palette rationale](references/design-guidelines.md#choose-color-from-the-material). Ask about materially different unresolved directions, otherwise decide and proceed.

Even with a short prompt, compare [type and complete composition](references/design-guidelines.md#typography-and-color) in an opener and a representative information-rich beat before extending the sequence. Resolve the strongest design weakness early. Vary the information and composition while preserving the chosen visual identity. Duration follows the story, not the HTML page length.

## 4. Build and render

Follow [hero-video.md](references/hero-video.md) for setup, props, render commands and browser requirements. Resolve `<out>` to the project root, not its `hero-video/` subdirectory.

```sh
node <skill-root>/scripts/project.mjs init <out> --layout card
# Or: --layout landing, --example single-stage, --example story
```

Initialize once the mode is known, before writing under `<out>`; edit existing initialized projects in place. Default output is `motion-ads/<product-slug>/` unless specified. Install the scaffold's pinned dependencies in `hero-video/`, configure props and customize `src/Ad.tsx`. Replace scaffold copy/artwork and assign meaningful image roles.

For a card, align the real HTML link with the [video CTA artwork](references/hero-video.md#cta-artwork-and-real-link). Keep the checker IDs `hero-video` and `cta`. Use selective stills for early design and corrections, then inspect authored holds/transitions and the loop before the full render; custom timing needs matching `qaFrames`. See the [staged workflow](references/hero-video.md#render-and-inspect). The final MP4 must tell the story independently of HTML copy.

## 5. Verify and improve

Review source/variant/claims and exact CTA, then render and package. Packaging already performs structural and encoded-media checks; separate `check` or `verify` calls are useful for diagnosis, not a required duplicate chain.

```sh
node <skill-root>/scripts/project.mjs render <out>
node <skill-root>/scripts/project.mjs package <out>
```

Use one final packaged-page session for playback/interaction and [creative review](references/design-guidelines.md#self-critique-before-delivery). Inspect the actual video, holds, transitions and loop at the intended size through the [supported local-artifact preview](references/hero-video.md#open-the-local-artifact). A poster or successful navigation does not establish playback or pacing. Fix findings and [repeat only affected checks](references/hero-video.md#recheck-only-what-changed). Keep one concise [QA report](references/hero-video.md#review-evidence); mark unavailable checks honestly.

## 6. Deliver

Deliver the whole `dist/` folder after review and retain the working project for edits. Failed media verification preserves an existing delivery; packaging alone does not approve browser behavior or design. Do not publish or add tracking unless requested.

Report the output path, chosen story/style/mode/CTA, source assumptions, and separate verification results or blockers. For a slow run, distinguish setup/user waits from authoring, rendering and QA time. Completion includes a narrative local MP4/poster and inspected browser output; identify partial results precisely. Public hosting and sharing are separate outcomes.
