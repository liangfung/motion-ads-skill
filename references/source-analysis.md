# Source Analysis

Turn a URL, game link, brief, or supplied files into sourced ad copy, local assets, and a visual story. Extract enough to make decisions; do not scrape an entire site by default. Gather material for the video itself, not only the surrounding HTML.

## Read the real source

Use the available browser to inspect the source directly, or delegate when the host supports browser workers. Collect product facts with source URLs, original image/video URLs where available, and screenshots. Inspect downloaded images and browser screenshots with an available image-viewing tool. Use fetch/download tools where useful; tool names and delegation mechanisms depend on the host.

For a source that is blocked or login-walled, report the access limit. For a retail product, look for the official manufacturer source for the exact model/variant, and use supplied material when available; keep that fallback provenance explicit. Do not transfer another model's features or assume an unverified selected color. Ask for missing copy/assets only when the unresolved information materially blocks the ad. Never infer that a failed fetch means an attached image URL is unavailable: inspect the message for the actual URL and try downloading it to a local file. Copy workspace assets rather than modifying their originals.

Keep the user's CTA URL exactly when intentional; do not automatically strip query parameters. A separate normalized URL may be useful for source lookup, but it must not silently replace a campaign/affiliate destination. Do not expose session tokens, private signed URLs, cookies, or API secrets in HTML, `brief.json`, or `dist/`.

## Lightweight brief

Record these in `<out>/brief.json` without creating a large schema or research report:

| Field | What matters |
|-------|--------------|
| Sources/facts | Product name, brand, category, useful claims and qualifiers, with source URL or “user supplied” |
| Audience/story | Who should care, supported core benefit/experience, proposed hook and visual beats |
| Assets | Local filename, source URL/path, type, selected purpose; note derivatives |
| Decisions | Card or landing purpose, dimensions if specified, language, visual direction, CTA URL/label, narrative video treatment |
| Assumptions | Unverified gaps and the chosen treatment, such as omitting volatile price |

No price/offer found → no price/offer module. Do not fill a brief with fabricated values or sample numbers. A private working brief is excluded from the publishable package, but it must still contain no secrets.

## Working files

For a new output, inspect sources first and run `init` once the mode is known, before writing under `<out>`: initialization refuses an existing directory. Keep early notes in the conversation or temporary files, then update the generated `brief.json`. Continue an existing initialized project in place.

| Location | Role |
|---|---|
| `brief.json` | Compact facts, selected assets/provenance, decisions and story; maintained across revisions |
| `research/` (optional) | Source captures, candidate originals/previews and selection notes when useful; the name is a convention, not a required deliverable |
| `hero-video/public/` | Selected local render inputs; copy preserved originals here as needed |
| `assets/` | Only resources required by the delivered HTML; the packager copies this entire folder |
| `qa/` | Rendered inspection frames, media report and browser/creative evidence; see [review evidence](hero-video.md#review-evidence) |
| `dist/` | Packaged runtime output; do not edit it instead of the working source |

One compact brief is enough. Do not duplicate originals into several research folders, save whole sites, or create large manifests/reports without a concrete need. Keep research/QA/source files out of page references and publication `assets/`, otherwise they may ship with the page. Notes in `research/` establish provenance, not validation of the final video.

## Claim hygiene

- Preserve qualifiers and footnotes in rendered video copy as well as HTML: “up to,” tested conditions, region, variant, and supplied legal language. Do not keep a strong number while dropping its limitation. Omit a claim when its necessary qualification cannot be presented readably.
- Price/availability may vary by time, region, and variant. Include only when useful and currently supported; otherwise let the destination show them. Do not create a discount or struck-through old price.
- Ratings need the real figure, review count when used, and source attribution. Reviews can reveal audience priorities; do not turn them into invented testimonials.
- Marketplace badges, health/safety claims, compatibility, awards, and performance figures need exact support. Use conservative wording when sources conflict, or clarify a material conflict.
- Promotional motion is illustrative: airflow rings, glows, and a product float cannot prove a physical result.

## Choose assets by looking

Download original/high-resolution assets from supplied or official sources; avoid thumbnail upscaling and hotlinks. Open candidates before selection, including images with misleading filenames. Check resolution, background, baked-in copy, watermarks, and crop safety. Retain source provenance and use assets appropriate to the user's rights/brief. For several large candidates, create small local previews or a labeled contact sheet with an available image tool and inspect those first; open selected details only when needed. Preserve originals for rendering and record previews as derivatives. Avoid loading every full-resolution screenshot into the conversation.

| Type | Use |
|------|-----|
| Transparent cutout | Product composition with `imageMode: "cutout"` |
| White packshot | `imageMode: "white-bg"`; preserve the actual background/edges |
| Lifestyle/photo | `imageMode: "photo"`; use context, atmospheric opening, or supporting scene |
| Infographic | Extract supported facts; usually unsuitable as a video hero |
| Detail/UI screenshot | Focused video beat with truthful annotations, or a landing feature/gallery |
| Other real variant | Real selector only when image/copy/destination states can be represented accurately |

A sample SVG is scaffolding, not a finished product asset. If only a poor or unsuitable image exists, ask for a usable original or report the draft as incomplete. Do not quietly ship the placeholder.

## Product pages and marketplaces

Gather the short product name, selected variant, core benefits, exact specs, price only if needed, brand palette, and high-resolution packshot/lifestyle sources. For Amazon-like pages, distinguish selected-variant data from a range of options and location-specific shipping messages. Page selectors change; rely on observed content, not a remembered fixed DOM recipe.

Choose assets for different story functions: an instantly recognizable opening, a use context, a useful detail, or a supporting feature. A single image can support deliberate type, crop and annotation changes, but a float or motif alone does not make a finished ad. Do not choose `airflow`, rings, or another effect solely because the starter includes it.

Treat asset discovery and asset selection as different decisions. View a small candidate contact sheet, then assign each selected asset a specific beat/purpose and explain omitted material when relevant. More discovered images does not require more pictures in the video. For example, a white-background black headset can use several clean angles plus one earcup crop throughout; a warm model photo is optional if it breaks the campaign's visual language. For an immersive game, select genuinely different locations/experiences and bring them into one consistent frame, contrast treatment and type system.

## Steam games

Read the actual store page for title, genre/tags, short description, supported play modes/platforms, release/availability status, and the intended purchase/wishlist/demo destination. Tags guide mood but are not proof of a feature. Do not invent multiplayer, awards, controller support, review scores, or a demo.

Collect a clean key-art/logo asset and several original store screenshots. Choose screenshots showing distinct environments or experiences, preserve UI that matters, and avoid cropping out the game's subject. Inspect any age gate/access limitation rather than guessing. Record whether an asset is a screenshot, promotional art, or an official video.

With stills only, build `presentation: "ad"` scenes using distinct screenshots/artwork, supported experience copy and annotations, a hook, and a store CTA. Use `imageMode: "photo"` and usually `motif: "none"`. A gallery render can be supporting material; it is insufficient alone as the finished advertisement. Describe the result as an **animated screenshot/artwork advertisement** in the handoff. Never claim “real gameplay,” a “playable demo,” or “captured footage” from that result. If gameplay is explicitly required, obtain an allowed official video or user file; do not fabricate footage or assume a generation API.

Genre should change design: cozy farming can use warm paper, illustration and gentle dissolves; horror can use dark negative space and slow reveals; arcade action can use poster typography and sharp rhythm; strategy can use maps, measured labels and crisp grids. Brand identity and user direction still win.

## Synthesize

Choose one core promise/experience, useful supporting points, visuals that develop it, and an honest CTA. Present a compact source summary when clarification is needed, including card versus landing purpose when unresolved. Carry the sourced argument into the MP4; HTML either supplies the thin card wrapper or develops the chosen landing experience. Omit material that adds no useful fact or visual beat.
