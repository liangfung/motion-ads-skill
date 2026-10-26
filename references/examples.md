# Two Runnable Motion Structures

Read the matching structure before composing. These examples teach choreography and continuity; they do not choose a customer's brand, assets, copy or exact scene count. Both are thin 9:16 HTML cards around actual Remotion MP4s. A multi-scene video still fits one embedded card; scrollable landing HTML is a separate choice.

For a story or feature-rich card, inspect its `Ad.tsx` and timing props as well as this overview. Adapt the relationships between evidence, attention and transitions; the basic `--layout card` scaffold is a functional starting point, not an equivalent creative reference. There is no need to render the unchanged study before working on the real brief.

The runnable examples use **original illustrative vector art**, with visible study labels, no real product claims and no downloaded commercial assets. Their CTA opens the Remotion guide. Replace the entire illustrative content and destination for a real ad; analyze the actual source using [source-analysis.md](source-analysis.md). Never deliver the study as a sourced product/game advertisement.

## Single-stage reference families

Cards in the [AppLovin Interactive Pages library](https://support.applovin.com/en/growth/promoting-your-websites/welcome-to-applovin/interactive-pages-library/interactive-pages-library) broaden what a clean single-stage ad can be. Clean means ordered attention: clear regions, a dominant promise, compatible imagery, comfortable spacing and a stable action. Color, image count and information density can vary with the product.

Choose one suitable family from the actual assets; do not combine all of them into one card:

| Family and reference | Stable composition | Local motion to adapt |
|---|---|---|
| Editorial collage — Ashley | Two coordinated photos alternate with short text blocks; brand, color fields and CTA define the grid | Replace imagery inside fixed windows, or reveal one image/text pair at a time; preserve the grid |
| Hero plus product grid — Quince | Large use-context photo above a compact set of coordinated variants and one CTA | Update variants within their cells, or stagger their entrances; keep crops and visual scale consistent |
| Product with explanation — Wild Alaskan, Blueland, apparel | Clear promise, large product/comparison, aligned labels or proof column, separated action | Reveal comparison/part labels in reading order, draw short leaders or gently move the product; hold labels steady once readable |
| Full-bleed lifestyle — Hungryroot, The Farmer's Dog | Recognizable real imagery under a strong brand/promise/CTA lockup | Change relevant photos or use an available source video while the text stays fixed; maintain contrast across all frames |
| Bold color or split field — immi, maev | Brand-derived color blocks group product, short facts and action | Introduce product/ingredient groups in sequence or cycle content within a stable module; retain breathing room around text |

These are layout references with suggested Remotion adaptations, not reconstructions of every reference video. Inspect a chosen reference over time when timing matters; one screenshot does not establish a motion sequence.

Keep the main hook and CTA easy to locate throughout the loop. New information may enter a reserved region without moving every existing element. A small image change, a label reveal and a reading pause can be sufficient; motion should develop the argument rather than meet an animation count. When more evidence requires a different composition, use the story structure below while preserving the visual contract.

Read original product sources for any offer, rating, comparison or certification used in the ad; reference artwork supplies design ideas, not claims for another product. Use a quiz only when the brief calls for real interaction and its behavior is implemented; a rendered video cannot supply working answer buttons.

## One stage, directed attention — FORM / 01

Source: `assets/examples/single-stage/Ad.tsx` and `props.json`.

```sh
node <skill-root>/scripts/project.mjs init <out> --example single-stage
```

12 seconds, one stable subject, headline and CTA. Warm paper, charcoal, one muted copper accent, precise sans type and a fixed margin grid remain constant. The choreography adds information without replacing the whole composition:

| Time | Visual development | Reading/continuity purpose |
|---|---|---|
| 0–2.2s | Product identity, headline, restrained contour traces | Useful poster; recognizable subject immediately |
| 2.2–5.6s | Two leaders draw towards actual parts; short labels settle | Direct the eye from silhouette to construction |
| 5.4–9.1s | A magnified inset shares the product's geometry; detail caption enters | Change information scale without changing the visual world |
| 9–11.3s | Three short grouped takeaways enter in sequence | Summarize while product, grid and CTA remain stable |
| 11.3–12s | Supporting layers clear gently to the opener | Coherent loop; no blank reset |

Useful for a clean technology/object ad, but minimalism still needs meaningful development. For real headphones, source-backed earcup/comfort/material details can replace study captions; a magnified crop must show the real part. Richness comes from attention and information, not an always-moving background or a new badge for every sentence. If a claim needs an unreadably small qualification, omit or simplify that claim.

Adapt: product photograph/cutout, part positions, annotation paths, detail crop, type rhythm, palette, copy and hold duration. Preserve coherent image edges and room around the CTA. The illustrative SVG is code-local so the reference runs offline after dependency installation; real product images belong in `public/` and use `Img` + `staticFile`.

## One world, different shots — NOCTURNE

Source: `assets/examples/story/Ad.tsx` and `props.json`.

```sh
node <skill-root>/scripts/project.mjs init <out> --example story
```

18 seconds, four unequal beats. Deep ink/teal, bone serif headlines, brass accents, cut-corner windows, recurring doorway/light, shared brand and CTA form one visual language. Different crops, depth layers, window treatments and information groups create development:

| Time | Story function | Composition and motion |
|---|---|---|
| 0–3.5s | Establish an intriguing world | Tall environmental illustration, subtle parallax, large lower headline |
| 3.5–8.5s | Show what to explore | A rising reveal enters a framed scene; two rows build after the image settles |
| 8.5–13s | Bring a detail into focus | An iris follows the recurring light; enlarged detail, coordinated lines/type and explanatory rows |
| 13–18s | Resolve to a next step | The same frame/type system supports closing copy; a final iris returns to the opening world |

The useful lesson from an immersive game ad such as Hollow Knight is **stable art direction plus new evidence per beat**: atmospheric opening → distinct environments/experience → meaningful feature/detail → clear action. A common frame, typography, contrast treatment and recurring motif can unify screenshots with different colors. Use supplied/official art for the real game, preserve important subjects/UI, source all features/numbers, and describe still-image animation honestly. The fixture's vector scenery is not gameplay.

The composition draws outgoing and incoming shots together during each transition, with the incoming shot masked as a whole. Its text age is measured from the transition's start, so it does not restart on the first hold frame. The CTA remains above that transition. Apply those mechanics as needed rather than copying every mask or prolonging a simple product story to 18 seconds.

## Run and inspect

Both examples are authored at 720×1280 and 30fps: 12 seconds for single-stage and 18 seconds for story. Same-aspect resolution scaling is supported; changing aspect ratio requires recomposition, and changing duration requires retiming the authored frame constants and `qaFrames`.

Both examples use the existing scaffold, dependencies, `Hero` composition ID, renderer and HTML CTA region. No new runtime library is needed. Install in `<out>/hero-video/`, then follow [staged inspection, rendering and final packaged-page QA](hero-video.md#render-and-inspect); packaging includes the structural/media checks.

Their `qaFrames` list includes entrances, holds, transitions and wrap. If timing/content changes, update that list. Start with selective opener/detail frames, then inspect the full authored set once; use [staged QA](hero-video.md#render-and-inspect) for corrections and final encoded playback. Source stills, media decoding and browser checks answer different questions.
