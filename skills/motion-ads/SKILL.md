---
name: motion-ads
description: Use when the user wants an animated promotional H5 page, embedded motion advertisement, product story, interactive campaign, or game promotion from a URL, brief, or supplied assets.
---

# Motion Ads

Create a compelling H5 using React components, Remotion animation and the real `@remotion/player`. The skill includes a ready browser runtime. Generation requires no Node/npm, JSX/TSX compiler, dependency installation, video render or encoding. Deliver local HTML, JavaScript, CSS and selected assets. Do not substitute a handwritten Canvas engine or MP4 wrapper for this Player experience.

User direction and the material determine the identity. The page can be compact or include useful surrounding HTML; no card/landing classification is required. Keep playback silent and transport controls hidden unless requested. Strong animation needs a recognizable subject, useful information, readable holds, a coherent sequence and a real action.

## Roles and paths

The main agent needs file reading/writing and ordinary file commands. It owns the brief, design, editable source and delivery. Prefer a browser-capable subagent for source research, image inspection, an early visual checkpoint and final acceptance. Reuse that worker/session when supported; batch related work rather than creating a worker for each image/check. Use the main browser when delegation is unavailable.

In a shared filesystem, pass canonical absolute paths and exchange assets, source notes and review evidence there. No project copy or artifact upload is needed between agents. The browser worker opens the H5 and observes it; running the page's JavaScript is normal browser behavior, not a separate build task. Its shell access is unnecessary. Follow the host's delegation/connection instructions and track started jobs through completion.

Resolve `<skill-root>` from this loaded `SKILL.md`, independently of the current directory. Image generation and audio tools are optional. Read [player-h5.md](references/player-h5.md) for runtime APIs, file operations and bounded review.

## 1. Research the source

Choose `<out>` (default `motion-ads/<subject-slug>/`) and initialize a new project before any worker writes under it:

```sh
bash <skill-root>/scripts/project.sh init <out>
# Optional complete reference: --example single-stage, bright or atmospheric
```

Continue existing projects in place. If script invocation is unavailable, use the equivalent [file copies](references/player-h5.md#project-and-runtime); no runtime installation is needed. If initial lookup is needed to choose the output path, keep it in shared scratch space outside `<out>` until initialization.

Read [source-analysis.md](references/source-analysis.md). Give the browser worker the source URL, intended outcome and shared research path. Incorporate its sourced facts, qualifiers, asset provenance, visual observations, actual destination and assumptions into `brief.json`. Stop when the planned information has suitable evidence. Do not invent offers, numbers, gameplay or results.

## 2. Resolve material choices

Use [question-guide.md](references/question-guide.md). Ask only when the answer materially changes audience, message, destination, visual direction, placement or interaction. When the user delegates decisions, choose a sensible canvas, page flow and concise loop from the material and proceed.

## 3. Establish the visual story

Read [design-guidelines.md](references/design-guidelines.md) and the [example guide](references/examples.md); inspect only the relevant complete `ad.js` and `config.js`, rather than loading every implementation. **Examples guide design reasoning and implementation; they do not define the allowed outcomes.** Let the actual product, selected material, audience and message determine the presentation. The original, unbranded **single-stage** study teaches a fixed background with flexible arrangements of a subject, supporting elements and changing information; its package/content split is only one composition. **Bright** teaches scale, grouping and color changes; **atmospheric** teaches world continuity, information rows and paired cards. Borrow, combine or depart from these techniques; no study, look, scene count, beat order or transition sequence is required.

Keep a compact visual contract in the brief: persuasive idea, asset roles, palette/type rationale, spacing/image treatment and what each beat teaches. Judge colors from the selected material together. Use the [font selection and loading guidance](references/player-h5.md#fonts) and compare 2–3 plausible type treatments in the opener and dense hold during one early browser checkpoint. Batch corrections before extending the story.

## 4. Author directly in the delivery

Edit `<out>/dist/config.js`, `ad.js`, `styles.css` and `index.html`; selected runtime resources go in `dist/assets/`. Write plain JavaScript React components with `React.createElement` (or its local `h` alias), real Remotion APIs and `MotionAds.mount`. No JSX/TSX, bare npm imports, CommonJS `require`, or remote runtime dependencies. Keep the supplied runtime unchanged. Style, timing, scene structure and interactions remain freely programmable.

The edited H5 is already the delivery. Refresh the same page to see changes; no compile/package step or second output copy is needed. Add surrounding HTML when it helps understanding/action; the motion must itself communicate a useful argument.

## 5. Check once and review selectively

```sh
bash <skill-root>/scripts/project.sh check <out>
```

This only checks required files and known scaffold inputs. Browser startup catches config/JavaScript/loading problems; the runtime's validation does not establish facts or appearance. Use one browser reviewer for the [combined pass](references/player-h5.md#browser-acceptance): loading/errors, one normal-speed cycle through wrap, actual action/focus, initial/live reduced motion and a representative second viewport. Reuse early inspected holds and record only new findings.

The main agent checks artifact identity and coverage rather than replaying it or routinely rereading screenshots. Fix blocking loading, factual, interaction, legibility and continuity issues; batch changes and recheck affected states. Timing/sequence changes need a new cycle. Keep one short [QA record](references/player-h5.md#review-evidence); unavailable capability stays blocked/partial. Record optional polish instead of opening another full design round.

## 6. Deliver

Deliver the whole reviewed `dist/` folder, which also contains the editable source. Keep `brief.json`, research and QA outside it. Report the path, design/story decisions, material source assumptions and verification outcome or blockers. Retain dependency notices and link the [runtime licensing note](references/player-h5.md#runtime-licensing) when handing off for publication or commercial use. Do not publish or add tracking unless requested. If a video file is explicitly requested, plan it as a separate export; it is not part of default H5 acceptance.
