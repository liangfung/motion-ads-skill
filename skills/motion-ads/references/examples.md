# Complete H5 reference studies

Three original, unbranded vector studies share the same Player project. They contain no third-party product photos, logos, game characters or sourced performance claims. They are teaching material, not advertisements for real products, and do not establish a legal clearance for assets later supplied by a user.

```sh
bash <skill-root>/scripts/project.sh init <out> --example bright
bash <skill-root>/scripts/project.sh init <another-out> --example atmospheric
bash <skill-root>/scripts/project.sh init <single-stage-out> --example single-stage
```

Initialization only copies the ready runtime and editable files; follow [the authoring and review workflow](player-h5.md). Each has a working in-page action leading to the HTML study description. Real outputs use the actual subject, supporting assets, copy and intended destination.

## Learn mechanisms, not a fixed look

**These studies are references, not an exhaustive style menu or a required structure.** Start with what this product needs to communicate and what the actual material can show. Inspect the complete `ad.js` and `config.js` for useful techniques; combine them, adapt them or author a different presentation. The study names do not assign styles to product categories. Keep an asset-role and beat plan in the brief. Do not recolor a study, swap a title and call it a product-specific result. Palette, typeface, canvas, duration, scene count, beat order, transition sequence and subject illustration are all illustrative; runtime, accessibility and acceptance requirements still apply. Recompose when aspect ratio changes; scaling preserves a composition, not responsive reading layout.

Choose relevant mechanisms before reading an implementation: **single-stage** keeps a fixed background while subject views and information develop locally; **bright** develops an object through changing arrangements; **atmospheric** develops information within one world. Reading all three implementations is unnecessary.

### Single-stage — a fixed stage with flexible information groups

`assets/examples/single-stage/` is an 8-second, 720×1280 study with an original botanical pouch and a fixed two-field background.

**The package/content split is one specialized composition. The reusable lesson is coordinating a subject, supporting elements and changing information on a stable background.** Choose the central arrangement from what viewers need to understand: a hero with detail insets, a variant/accessory cluster, contextual imagery, short feature cards, a sourced figure or a real UI/use sequence. Combine only useful elements, with a clear focal hierarchy and enough reading time; the [arrangements below](#clean-single-stage-arrangements) are starting points.

| Remains stable | Develops locally |
|---|---|
| Background, dividing line, headline and semantic action | One subject moves across the split: one side reveals illustrated ingredients, the other its wrapper |
| The two views share the same size, position and movement | Fixed screen-space masks determine which representation appears; this is one registered subject, not two independently moving objects |
| Reserved information areas and reading hierarchy | Three pairs of short ingredient/packaging details hand over locally with a fade and small positional change |

The first frame already contains a useful message, recognizable subject, information pair and action. Subject motion is periodic and the last local handoff returns to the first pair, so the loop needs no closing screen or whole-page transition. A single stage can develop several facts; text, images, callouts or whole supporting groups may enter, leave or replace one another locally. A real output needs neither packaging nor an inside/outside view. Use verified material for the selected elements; the invented ingredients do not establish facts about a product.

### Bright — object, detail, context, action

`assets/examples/bright/` is a 14-second, 720×1280 study: an original unbranded container, illustrated leaves, warm fields, strong type, a stable semantic action and four unequal beats.

| Beat | Information and motion |
|---|---|
| Recognize | A large silhouette, short hook and three settled tags; the useful opening state also matches the loop handoff |
| Inspect | A diagonal band bridges the change in scale; the smaller object, restrained leader lines and paired groups give detail room |
| Relate | A bottom-up reveal follows the rising product group; three coordinated views, stagger and alignment develop the collection |
| Resolve | A mask expands from the central product into the hero composition; synthesis and action settle before a diagonal sweep continues in the same direction into the opener |

The useful lesson is palette continuity with controlled contrast, product scale changes, local annotation and information groups. Handoffs respond to these specific layouts: a diagonal chapter change, an upward group reveal, a product-centered expansion and a same-direction diagonal return. The action stays above them and artwork remains upright. These are examples of choosing a relationship, not a sequence of effects to copy. A real food/household/fashion campaign may instead use ingredient cutouts, a real serving/use image, material detail or variants. Never infer those facts from the study's drawing.

### Atmospheric — one world, several arguments

`assets/examples/atmospheric/` is a 15-second, 720×1280 original vector landscape. Recurring light, shared margins/type, framed artwork, parallax and a real action connect changing compositions.

| Beat | Information and motion |
|---|---|
| Invite | A tall environmental illustration establishes a subject and a quiet hook |
| Explore | A soft dissolve enters a framed view, then ordered short rows develop the evidence |
| Explain | A dissolve shifts attention to a detail; paired cards distinguish a landmark from a path |
| Resolve | An unframed route draws through three waypoints beneath a centered closing statement; a short invitation leads to the action, then a dissolve reconnects with the opening world |

The useful lesson is a stable art direction with new information per beat. Dissolves preserve the continuous illustrated space without imposing a geometric sweep; copy hands off separately so headlines do not compete. This can inform games, travel, architecture or an editorial product story. It does not prescribe dark colors, serif type, invented lore, dissolves or a game-like treatment for every subject.

## Clean single-stage arrangements

A full-page scene change is optional. Compose the central area around the material and message; these arrangements can be combined or adapted while selected regions develop:

| Source material | Arrangement | Directed local change |
|---|---|---|
| Several real product/room views | Aligned image/type pairs on split fields | Swap one image or emphasize a detail while headline and action stay stable |
| Real variants or a coordinated set | Hero plus a tidy 2×2 selection grid | Cycle the selected variant or reveal one coordinated row |
| One strong cutout | Large object, concise benefit group and quiet proof rail | Bring in the object, then attach only verified labels/badges |
| Part, ingredient or construction detail | Object-led annotations or magnified inset | Reveal the detail before its leader and label, then hold both still |
| Verified features, measurements or comparisons | Hero with concise fact groups, relevant icons or a small diagram | Replace or emphasize a related group; keep units and qualifiers beside the claim |
| Real UI states or a documented use sequence | Subject/use window with short step labels or supporting crops | Change the window content and related labels while the background and action remain stable |
| A real lifestyle/food image | Full-bleed subject-aware crop and short contrasting headline | Gentle image motion or one crop change, with a stable high-contrast action |
| A small useful choice | Calm options on a consistent reading plane | Reveal the next question/result only after a real selection |

These abstract the hierarchy, generous spacing, strong subject and stable action of good interactive advertising. Do not copy another brand's trade dress, screenshot, offer, review, logo or certification badge into a distributed example. A quiet white composition, a saturated field, a split palette and a photographic scene can all be clean.

## Turn source material into information

Choose **viewer learns → visual evidence → information arrangement → reveal and hold**. Useful mechanisms include a short benefit group, a source-backed comparison, detail callouts, a use sequence or a synthesis with tags. A number earns space only when its meaning, unit and qualifier are sourced and legible; headings work when no useful statistic exists. Merge repeated messages rather than extending the loop.

The studies are complete examples of implementation, not evidence for a real product. For a new output, derive palette, typography, imagery, hierarchy and movement from the selected material; compare a dense hold early. Player and the surrounding HTML must form one deliberate experience, with real links and useful interactions.
