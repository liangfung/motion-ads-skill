# Design Guidelines

The advertisement should work as moving communication, not just attractive HTML around an animated image. User direction and brand identity take precedence over templates and presets.

## One deliberate H5 experience

Build a coherent motion-led page with Remotion Player and local runtime assets. Choose its canvas, surrounding HTML and interaction from the placement, subject and information; no mandatory card/landing split is needed. The composition must communicate a useful idea, while normal HTML can supply natural reading flow and responsive supporting sections.

Deliver editable HTML/JS/CSS, the supplied runtime and selected local assets. Set language, meaningful title/description and viewport metadata. Use system or supplied/licensed local fonts, and avoid runtime CDN/font/image/tracker requests. CTA navigation is expected. Viewer-side building is unnecessary. Respect safe areas and supplied dimensions; a generic H5 is not platform certification.

Preserve the subject and action across display sizes. Fixed-canvas artwork scales rather than automatically reflowing; recompose an unsuitable aspect ratio and keep long reading content in natural HTML. A compact portrait stage can be centered on a wide screen. Avoid accidental scrolling on a short viewport and use desktop space deliberately when surrounding content is useful.

## Persuasive and temporal hierarchy

Choose who should click, why they should care, and what happens next before adding decoration. Build a compact visual argument: a recognizable subject and hook, a development that makes the benefit or experience concrete, and a closing action. These are story functions, not a mandatory scene count.

- Let each beat have a clear focal point. Introduce a detail crop, supporting image, annotation, or changed arrangement when the story advances; avoid repeating the same float under new words.
- Arrange time as **entrance → readable hold → exit/transition**. Budget reading time after text has settled. Dense text needs more hold or less copy; making every scene equally long is only a scaffold.
- A transition should explain a relationship: matching a product's position into its detail, revealing a UI feature, moving between game environments, or resolving benefit copy into an action. Cuts, wipes, masks, dissolves and camera moves are all available; choose for the subject.
- Keep product, text and annotation movement coordinated. For example, reveal a detail before its label, then let both rest while read. Do not move every layer continuously.
- Make the opening and reduced-motion still useful, with subject identity and a legible idea. Make the ending resolve the argument and provide a clear next action. Inspect the wrap when looping; a reset should feel coherent.
- Use only sourced price, reviews, awards, compatibility, deadlines and testimonials. Preserve important qualifiers in rendered copy; omit a claim rather than shrinking its conditions into unreadable text.

The same product can support different styles: calm editorial cuts and large serif statements, crisp technical detail callouts, playful poster typography, or immersive game-world reveals. More floating shapes, rings or glow are not a substitute for choosing the right sequence.

## Composition through time

### Choose color from the material

View the selected product shots, packaging/logo and supporting scenes together before fixing theme colors. Distinguish the product's own colors, photographic background/lighting, and established brand colors. Marketplace navigation, unrelated variants and a large white image margin do not establish brand identity; an automatic dominant-pixel palette alone is insufficient.

Choose background/surface colors that preserve subject edges and materials, foreground colors that support reading, and an accent that connects with the brand or imagery and gives the CTA emphasis. A brand color can be an accent rather than a full-canvas background. Keep the real product/food/game art faithful; do not recolor it to fit a preset or claim a chosen editorial accent is an official brand color. Different scene colors may remain within a shared frame, type and CTA palette.

Record a short rationale in the existing brief: which selected assets informed the palette, the main color roles, and why they work together. Test those colors with the actual image, headline and CTA in an early rendered still at about 360px display width before extending the sequence; inspect both subject separation and text contrast, then compare later scene holds for continuity. If materially different directions remain plausible, show the user two or three source-informed choices and recommend one. Otherwise make and explain the decision without adding a routine color-approval step.

### Fix the theme before changing the shots

Write a small visual contract before coding: **one organizing idea**, palette roles, display/reading type roles, margins/alignment, image treatment, recurring visual anchor, and motion character. Keep it short in the brief/chat; it is a decision aid, not a separate approval document. Category alone is not a style decision: black headphones photographed on white can support clean white editorial design; “technology” does not imply a dark neon canvas.

Keep background family, typography, grid, CTA geometry and imagery treatment coherent across shots; composition can change with the message. A different crop, framed feature window, scale, annotation or typographic emphasis can add information without adding a new theme. Change a theme deliberately only when the story needs that contrast. Use a dominant focal point, a supporting layer and optional atmosphere rather than three equally loud ideas.

Review selected assets together before animating. A packshot, warm lifestyle photo and technical diagram may all be accurate but still clash; choose compatible material or give it a consistent frame/crop/grade and reading area. Do not insert a lifestyle scene merely because the image is available. Never force a dark/transparent look by blending a white-background black product into the stage. Keep its white field intentional or obtain a clean cutout.

For a **stable stage**, keep the main layout, brand/promise and action stable while directing attention through local changes: replace a photograph within its frame, cycle a coordinated product grid, draw labels towards parts, reveal a detail inset or gently move the packshot. A clean stage can contain several images, a short benefit group and a proof rail when their roles and alignment are clear. Bright color, split fields and full-bleed photography are equally valid; clean does not require a white canvas or sparse content. Let one region develop at a time, keep text still during its reading hold, and preserve useful separation between groups. See the clean arrangements in [examples.md](examples.md); a stable layout is one option, not a separate output mode.

For a **multi-scene story**, each shot should develop a different argument within the same visual language. Tie its visual mechanism to that argument: a world tour can reveal distinct locations, a real feature can use a focused crop/annotation, and a food promise can move from recognizable product to texture and use context. Choose [information arrangements](examples.md#turn-source-material-into-information) for the evidence rather than putting every message in the same title/image layout. A new headline over another slow image push does not by itself develop the story. Give transitions a connection, prepare entrances before the reading hold, and avoid headline collisions.

Pick a product-specific organizing idea: oversized silhouette, tactile detail study, crisp UI tour, immersive scene, specimen grid, or editorial split. Change scale, crop, alignment, depth, negative space, and image/text relationship when the beat needs it. Maintain enough continuity that scene changes feel like one campaign.

Use a consistent grid and spacing rhythm, with intentional margins and alignment. Leave a stable readable region for scene copy; reserve product labels near the details they describe. A label must not cover the detail or chase a rapidly moving object. Keep faces, silhouettes, UI and key artwork clear of the CTA and controls.

For a fixed-canvas animation, design at the authored aspect ratio and judge it at about **360px displayed width**. A 720px render makes a 36px label appear around 18px at that size. Inspect actual rendered text, not just source font values. Reduce words or alter composition before shrinking text. Test long names, translated copy and wrapped labels.

In surrounding HTML, use responsive type and comfortable reading measures. Typical body text is 16–18px, supporting labels around 13–14px, and useful legal copy around 11–12px. Preserve reading order and CTA clarity on mobile; remove accidental horizontal scrolling and overlaps.

## Typography and color

Choose typography from the selected material, brand/genre and message; examples supply techniques, not a fixed font or weight. Use a small coherent type system with display and reading roles and appropriate glyph coverage for the output language.

Use supplied brand fonts with suitable embedding rights, or search [Google Fonts](https://fonts.google.com/) and [Fontsource](https://fontsource.org/) by the material's visual qualities, language coverage and available weights. A site's typography is a visual reference, not permission to redistribute its font files. Reuse the research worker/session for a small lookup when existing faces do not fit; stop with a credible shortlist rather than browsing a whole catalog. One family can serve both roles; two are useful when their jobs differ.

1. Compare 2–3 plausible type treatments inside an early complete composition using actual imagery, headline, supporting label and CTA. Combine this with the opener/information-rich beat check rather than building a separate font project. Vary family, available weight and intentional line breaks; type contrast should reinforce this material and message.
2. Inspect rendered previews at the target display size (about 360px wide for a compact placement). Judge product prominence, crop, palette relationships and reading hierarchy together with stroke weight, line balance, line-height, spacing and the actual fonts/weights rendered. A readable font choice cannot rescue a weak image/text arrangement. Recompose or shorten copy before shrinking text.
3. Record the chosen type roles, rationale, source/version and license alongside other assets in the existing brief. Keep only selected faces in the delivery and apply them coherently across scenes through the [font roles](player-h5.md#fonts). Recheck dense reading holds and transition frames for clipping, collisions and legibility within the existing checkpoint.

Animate typography to establish emphasis, then let it read. Short word/line reveals can suit a bold ad; a calm statement may only need a cut or dissolve. Avoid a long typewriter entrance for a paragraph, constantly shifting baselines, and transitions that leave overlapping headlines on screen.

Assign clear palette roles: background, surface, foreground, muted text, accent and text-on-accent. Coordinate HTML and Remotion colors. Check normal text contrast around 4.5:1 and large text around 3:1, including over photography and on the CTA. Use a restrained scrim or solid reading area when image contrast changes; inspect the worst frame during motion.

## Images and motion character

Real imagery is the anchor. Open candidates first: a marketplace infographic may supply claims but rarely makes a good hero. Preserve white-background packshot edges; do not simulate transparency with a damaging blend mode. A supplied UI screenshot should stay crisp and truthful.

Choose motion character for the source: tactile scale/rotation for an object, restrained camera drift for landscape, precise cuts/masks for app details, warm dissolves for a cozy game, sharp poster rhythm for arcade art. Decoration should express material, use or genre. Airflow arcs can suggest a fan's category but cannot prove measured airflow.

Default to silent playback and no flashing. There is no bundled audio or caption pipeline. Under `prefers-reduced-motion`, stop nonessential CSS motion and hold a useful opening state; handle initial load and later preference changes. Playback controls stay hidden by default; if requested, give them accessible names and keyboard behavior.

## CTA, interaction and accessibility

Use real semantic links and buttons inside the composition or surrounding HTML. Their visible artwork and interaction bounds belong to the same element; a transparent video-overlay link is unnecessary. Keep the action usable during loading and reduced motion, with an accurate accessible name and visible keyboard focus. Avoid masking or clipping its focus ring.

Use semantic links for navigation and buttons for state changes. Aim for a CTA at least 48px high at the intended display size and other controls about 44×44px with separation. Verify selected states, keyboard support, accessible names and useful alt text. Never use `innerHTML` for user-provided copy.

Add a gallery, real variant selector, feature tabs or genuine comparison only when it helps the viewer. A compact experience may need only its action. Do not add interactions merely to satisfy a count. A screenshot is not a playable game; a decorative control that changes nothing weakens trust.

Use the actual destination and preserve intentional query parameters. A missing destination calls for clarification, not `href="#"`. Keep secondary controls quieter than the action; avoid fake close buttons, reward wheels and invented urgency.

## Self-critique before delivery

Inspect the final Player H5 during the browser pass, and answer with evidence:

1. With supporting HTML copy hidden, does the opening establish a recognizable subject and a compelling reason to keep watching, followed by a clear next action?
2. Can you name the new fact, experience or use case each beat communicates? Is it visible in the imagery or information groups, with enough reading time? Merge repetitive beats instead of stretching the duration.
3. Do product prominence, typography, palette relationships and motion reflect this brand or world? Identify any generic image-swap sequence or decoration that contributes no meaning.
4. Are visible action elements readable, usable and keyboard accessible across agreed sizes?
5. Does the whole H5 have coherent responsive reading flow, reduced-motion handling and working authored interactions?
6. Are claims, images, animation and destination consistent with the sourced facts recorded in the brief?

Resolve the strongest creative weakness in early frame previews, then refresh the final H5. In the final normal-speed pass, fix blocking loading, action, legibility, continuity and factual defects; record optional polish instead of restarting design. A readable but generic draft is not creative success merely because nothing overlaps. Compare all holds for palette and information continuity. Reuse unchanged evidence with the [staged H5 workflow](player-h5.md#browser-acceptance).

## Clean presentation and deliberate spacing

Keep progress indicators, scene counters, and playback buttons hidden by default; show them only when requested. Honor reduced-motion preferences even with hidden transport controls. Inspect actual text bounds at reading holds and sample intermediate animation frames. Separate eyebrow, headline, underline, body, imagery, annotations and CTA into clear groups; leave breathing room between groups rather than merely preventing overlap. Shorten copy or recompose the shot when it does not fit comfortably.

Match motion density to the product. A restrained object ad may use a few precise moves; a bright food or playful product can support staggered object entrances, ingredient layers, tracked labels, masked reveals, and coordinated scene transitions. Build richer motion in the Remotion composition, preserve reading holds, and avoid applying the same float-and-slide pattern to every product.
