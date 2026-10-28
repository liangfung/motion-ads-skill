# Style Presets

Presets are **starting points**, not requirements. Use them to avoid a blank-page default and keep a coherent look. Precedence:

1. The user's explicit style direction or reference image.
2. The product's own brand (colors, logo mood, tone), interpreted alongside the selected product/packaging and photographic material.
3. A preset chosen for the audience/category; ask only when the visual decision materially needs clarification.

Derive a coherent direction, not just a palette swap. Change composition, type scale, framing, surfaces, and choreography when the subject calls for it. Apply the direction to the Player narrative, not only HTML. The starter is a baseline, not the required layout.

Apply [material-led color selection](design-guidelines.md#choose-color-from-the-material) before using a preset's tokens. Clean light can be right for premium technology; dark tech is not the default for every electronic product. Replace preset colors when they fight the actual images. Keep the chosen type, palette roles, imagery treatment and framing consistent across the sequence. Presets do not require extra decoration, a second skill, or a design-system search.

## Token structure

Set page tokens on `:root` or a wrapper and coordinate them with Remotion props/composition styles. Player and surrounding HTML should share visual roles. CSS outside a fixed-canvas composition does not automatically recompose its content.

| Token | Meaning |
|-------|---------|
| `--bg` | Page background |
| `--surface` | Cards / chips / elevated areas |
| `--text` | Primary text |
| `--muted` | Secondary text |
| `--accent` | Primary action and selected emphasis |
| `--on-accent` | Text on accent (check ≥ 4.5:1) |
| `--radius` | Card/chip radius; CTA uses `--radius-cta` |
| `--font-display` / `--font-text` | Real font stacks; supplied/licensed local fonts are also allowed |
| `--shadow` | Single shadow style |
| `--display-weight` / `--display-tracking` | Headline weight and letter-spacing |

System stacks:
- Sans: `ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Rounded: `ui-rounded, "SF Pro Rounded", system-ui, sans-serif`
- Serif: `ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif`
- Mono: `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

## Presets

### 1. Clean light — bright, minimal, retail
Best for: general retail, household, kitchen, grocery, anything without a strong brand.
```
--bg:#ffffff; --surface:#f4f5f7; --text:#111318; --muted:#5b6270;
--accent:#111318; --on-accent:#ffffff;
--radius:16px; --radius-cta:14px; --shadow:0 8px 24px rgba(17,19,24,.08);
--font-display:ui-sans-serif,system-ui,sans-serif; --font-text:ui-sans-serif,system-ui,sans-serif;
--display-weight:700; --display-tracking:-0.02em;
```
Feel: whitespace, product on a soft surface, black CTA (swap for brand color). Video idea: clear hook, large product framing, precise detail cuts and calm readable holds.

### 2. Bold pop — loud, high-contrast, sticker energy
Best for: promos, sales, impulse buys, toys & recreation, young audiences.
```
--bg:#ffe94a; --surface:#ffffff; --text:#101010; --muted:#3a3a3a;
--accent:#ff3d2e; --on-accent:#101010;
--radius:20px; --radius-cta:999px; --shadow:0 6px 0 #101010;
--font-display:ui-sans-serif,system-ui,sans-serif; --font-text:ui-sans-serif,system-ui,sans-serif;
--display-weight:900; --display-tracking:-0.03em;
```
Feel: giant headline, hard offset shadows, occasional rotated label, selective outlines. Video idea: punchy type/image cuts and short springy reveals; let the message and CTA settle to read.

### 3. Editorial luxe — calm, premium, serif
Best for: beauty, fragrance, fashion, jewelry, premium home.
```
--bg:#f6f1ea; --surface:#ece4d8; --text:#1c1814; --muted:#6f655a;
--accent:#1c1814; --on-accent:#f6f1ea;
--radius:2px; --radius-cta:2px; --shadow:none;
--font-display:ui-serif,Georgia,serif; --font-text:ui-sans-serif,system-ui,sans-serif;
--display-weight:500; --display-tracking:-0.01em;
```
Feel: large serif headline, fine rules, restrained labels, generous margins, intentional photo crops. Video idea: tactile detail studies, measured type reveals and quiet dissolves; hold short statements rather than filling every frame.

### 4. Soft playful — friendly, rounded, pastel
Best for: kids & baby, pets, wellness apps, casual consumer services.
```
--bg:#fff4ec; --surface:#ffffff; --text:#2b2140; --muted:#6c6283;
--accent:#ff7a59; --on-accent:#2b2140;
--radius:28px; --radius-cta:999px; --shadow:0 10px 30px rgba(255,122,89,.22);
--font-display:ui-rounded,system-ui,sans-serif; --font-text:ui-rounded,system-ui,sans-serif;
--display-weight:800; --display-tracking:-0.01em;
```
Feel: round shapes and chunky useful labels. Video idea: friendly visual transformations and brief playful entrances, followed by stable reading; keep decoration subordinate to product and benefit.

### 5. Dark tech — sleek, glowing, product-forward
Best for: electronics, gadgets, apps, digital services, or games whose own art supports this direction.
```
--bg:#0b0d12; --surface:#151923; --text:#f2f4f8; --muted:#9aa3b5;
--accent:#6ee7ff; --on-accent:#04222b;
--radius:18px; --radius-cta:14px; --shadow:0 0 0 1px rgba(255,255,255,.06), 0 12px 40px rgba(0,0,0,.5);
--font-display:ui-sans-serif,system-ui,sans-serif; --font-text:ui-sans-serif,system-ui,sans-serif;
--display-weight:700; --display-tracking:-0.02em;
```
Feel: dark surface, restrained material lighting, clear silhouette, precise spec labels. Video idea: controlled reveals, scale changes into real details, crisp annotation choreography; glow is optional, not a required gaming effect.

### 6. Warm natural — earthy, honest, food & wellness
Best for: grocery, food, supplements, health & wellness, home & living, personal care.
```
--bg:#f3efe6; --surface:#e7dfcf; --text:#25301f; --muted:#56634e;
--accent:#3f6b3a; --on-accent:#ffffff;
--radius:22px; --radius-cta:999px; --shadow:0 8px 20px rgba(37,48,31,.12);
--font-display:ui-serif,Georgia,serif; --font-text:ui-sans-serif,system-ui,sans-serif;
--display-weight:600; --display-tracking:-0.01em;
```
Feel: organic forms, muted greens/terracotta and real photography. Video idea: inviting use-context opening, ingredient/detail beats with supported labels, and an unhurried action resolution.

## Category → recommended preset

| Category | Default | Alternates |
|----------|---------|------------|
| Beauty (cosmetics, skincare, fragrance) | Editorial luxe | Soft playful, Clean light |
| Clothing / shoes / accessories | Editorial luxe | Bold pop, Clean light |
| Electronics / digital services / apps | Dark tech | Clean light |
| Grocery / health & wellness / personal care | Warm natural | Clean light, Soft playful |
| Home / kitchen / household | Clean light | Warm natural |
| Kids & baby / pets | Soft playful | Warm natural, Bold pop |
| Toys & recreation | Bold pop | Soft playful |
| Sales / flash promos (any) | Bold pop | — |

## Game directions

Use game key art and the actual audience as the strongest reference. These directions can mix with the presets; they do not imply new rendering capabilities.

| Direction | Visual language | Layout and motion |
|-----------|-----------------|-------------------|
| Cozy field guide | Warm paper/forest tones, serif or friendly readable type, small illustrated rules, real game art | Asymmetric journal composition; world/experience beats, gentle image/type reveals and readable feature holds |
| Cinematic world | Colors sampled from the world, large restrained title, negative space and immersive landscape | Scenic opening into distinct story beats; sparse meaningful copy, careful scrims and slow reveals |
| Arcade poster | High-contrast limited palette, condensed/heavy display type, crisp labels | Poster blocks and screenshot rhythm; sharp cuts, short supported statements, stable CTA, no flashing |
| Strategy dossier | Parchment or charcoal from the game art, measured type hierarchy, restrained mono labels | Systems/detail grids, ordered annotations and precise cuts that explain supported play features |

Horror, fantasy, sports, and other genres should derive their own direction from real art rather than inherit a generic “gaming” skin. Screenshot-based ads remain artwork animation regardless of style; the narrative and rendered copy make them advertisements, not gameplay footage.

## Applying a preset

- Keep color roles consistent; introduce additional colors only when the imagery, brand or information hierarchy warrants them.
- Derive hover/active states deliberately and recheck contrast; darkening an accent can make dark button text less readable.
- Harmonize the palette with the actual image. Adapt radius, type, layout and motion as a coherent direction instead of preserving a preset by habit.
- Check all text/background pairs, including muted text on surfaces and CTA states. Bold pop and Soft playful use dark text on their warm accents; white is not automatically accessible. Adjust text color, surface or accent treatment as needed after brand changes.
- Expand font choices into real stacks and include CJK fallbacks for Chinese pages. No remote font request is required.
- Inspect Player typography at its displayed size and during transitions. A coherent palette cannot compensate for unreadable holds or an image sequence with no persuasive development.
