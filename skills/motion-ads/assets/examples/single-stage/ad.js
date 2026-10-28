// Editable React/Remotion composition. No compilation is required.
(() => {
const {React} = MotionAds;
const h = React.createElement;
const { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } = MotionAds.Remotion;
const BODY = "M118 90H438L468 582Q470 615 435 622H125Q90 615 94 582Z";
const clamp = (n) => Math.max(0, Math.min(1, n));
const Pouch = ({
  inside,
  phase,
  colors
}) => {
  const { bg, surface, accent, text } = colors;
  const id = `blend-${React.useId().replace(/\W/g, "")}`;
  return h(
    "svg",
    {
      viewBox: "0 0 560 660",
      width: "100%",
      height: "100%",
      "aria-label": inside ? "Unwrapped botanical blend" : "Wrapped botanical pouch"
    },
    h("defs", null, h("clipPath", { id: `${id}-body` }, h("path", { d: BODY })), h("linearGradient", { id: `${id}-paper`, x1: "0", y1: "0", x2: "1", y2: ".2" }, h("stop", { stopColor: "#fffdf3" }), h("stop", { offset: ".7", stopColor: bg }), h("stop", { offset: "1", stopColor: "#dfd5bc" })), h("pattern", { id: `${id}-grain`, width: "17", height: "19", patternUnits: "userSpaceOnUse" }, h("path", { d: "M2 3l3 1M12 14l2-1", stroke: text, strokeWidth: ".6", opacity: ".12" }))),
    h("ellipse", { cx: "281", cy: "637", rx: "175", ry: "12", fill: text, opacity: ".1" }),
    inside ? h(React.Fragment, null, h("path", { d: BODY, fill: "none", stroke: text, strokeWidth: "2", strokeDasharray: "3 10", opacity: ".16" }), h("g", { clipPath: `url(#${id}-body)` }, [
      [178, 184, -26, 1.1],
      [351, 154, 52, 0.8],
      [367, 395, 22, 1.2],
      [185, 496, -38, 0.9],
      [321, 568, 58, 0.75]
    ].map(([x, y, angle, scale], i) => h("g", { key: i, transform: `translate(${x}, ${y + Math.sin(phase + i) * 3}) rotate(${angle}) scale(${scale})` }, h("path", { d: "M0 50Q-62 2 0-57Q59 1 0 50Z", fill: i % 2 ? surface : text }), h("path", { d: "M0 46V-42M0 4l-22-20M0 24l24-22", stroke: bg, strokeWidth: "2", fill: "none", opacity: ".6" }))), [[194, 354, -14], [362, 258, 18]].map(([x, y, angle], i) => h("g", { key: i, transform: `translate(${x}, ${y + Math.sin(phase + i + 0.7) * 3}) rotate(${angle})` }, h("circle", { r: "54", fill: "#c4794b" }), h("circle", { r: "46", fill: accent }), h("circle", { r: "39", fill: "#f4df9d" }), [0, 60, 120, 180, 240, 300].map((a) => h("path", { key: a, d: "M0 0V-38", stroke: "#c4794b", strokeWidth: "2", opacity: ".55", transform: `rotate(${a})` })), h("circle", { r: "5", fill: bg }))), [[287, 288, 1], [346, 487, 1.1], [165, 584, 0.8]].map(([x, y, scale], i) => h("g", { key: i, transform: `translate(${x}, ${y}) rotate(${Math.sin(phase + i) * 4}) scale(${scale})` }, [0, 60, 120, 180, 240, 300].map((a) => h("ellipse", { key: a, cy: "-20", rx: "12", ry: "24", fill: "#f4e6ba", stroke: "#d2b56b", strokeWidth: "1.5", transform: `rotate(${a})` })), h("circle", { r: "13", fill: "#bb8b30" }), h("circle", { r: "7", fill: accent }))))) : h(React.Fragment, null, h("path", { d: BODY, fill: `url(#${id}-paper)`, stroke: text, strokeWidth: "2" }), h("path", { d: BODY, fill: `url(#${id}-grain)` }), h("path", { d: "M118 90l22-28h276l22 28-5 20H123Z", fill: bg, stroke: text, strokeWidth: "2" }), h("path", { d: "M139 77h278M125 108h308", stroke: text, strokeWidth: "2", opacity: ".3" }), h("path", { d: "M101 576q179 38 362 0l-28 46H125Z", fill: text, opacity: ".08" }), h("g", { transform: "translate(282,251) rotate(-8)", fill: surface }, h("path", { d: "M0 42Q-60 3-9-49Q31-9 0 42Z" }), h("path", { d: "M7 33Q8-39 59-43Q74 9 7 33Z" }), h("path", { d: "M-1 42V-10", fill: "none", stroke: bg, strokeWidth: "2" })), h("rect", { x: "148", y: "355", width: "264", height: "132", fill: bg }), h("text", { x: "280", y: "403", textAnchor: "middle", fill: text, style: { fontFamily: "var(--font-display, Georgia, serif)", fontSize: 34, letterSpacing: 2 } }, "BOTANICAL"), h("text", { x: "280", y: "446", textAnchor: "middle", fill: text, style: { fontFamily: "var(--font-text, Arial, sans-serif)", fontSize: 24, letterSpacing: 7 } }, "BLEND"), h("path", { d: "M204 535h152M222 549h116", stroke: text, strokeWidth: "2", opacity: ".4" }))
  );
};
const Ad = (props) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const phase = frame / durationInFrames * Math.PI * 2;
  const scene = props.scenes[0];
  const details = scene.details ?? [];
  const count = Math.max(1, details.length);
  const span = durationInFrames / count;
  const index = Math.min(count - 1, Math.floor(frame / span));
  const next = (index + 1) % count;
  const handoff = Math.min(fps * 0.4, span * 0.2);
  const blend = Easing.inOut(Easing.cubic)(clamp((frame - (index + 1) * span + handoff) / handoff));
  const motion = `translate(${Math.sin(phase) * 84}px, ${Math.sin(phase * 2) * 4}px) rotate(${-6 + Math.sin(phase) * 2}deg)`;
  return h(AbsoluteFill, { style: { background: props.bg, overflow: "hidden", fontFamily: "var(--font-text, Arial, sans-serif)" } }, h("div", { style: { position: "absolute", width: 720, height: 1280, transform: `scale(${width / 720}, ${height / 1280})`, transformOrigin: "top left" } }, h(AbsoluteFill, { "aria-hidden": "true" }, h("div", { style: { position: "absolute", inset: "0 0 0 50%", background: props.surface } }), h("div", { style: { position: "absolute", left: 48, top: 63, width: 264, textAlign: "center", color: props.text, fontSize: 26, lineHeight: 1.2, letterSpacing: 1 } }, scene.eyebrow), h("div", { style: { position: "absolute", left: 48, top: 132, width: 264, textAlign: "center", color: props.text, fontFamily: "var(--font-display, Georgia, serif)", fontWeight: "var(--display-weight, 400)", letterSpacing: "var(--display-tracking, -.035em)", fontSize: 70, lineHeight: 1.03, whiteSpace: "pre-line" } }, scene.headline), h("div", { style: { position: "absolute", left: 408, top: 80, width: 264, textAlign: "center", color: props.bg, fontFamily: "var(--font-display, Georgia, serif)", fontSize: 32, lineHeight: 1.2, letterSpacing: 2, whiteSpace: "pre-line" } }, props.brand), h("div", { style: { position: "absolute", left: 408, top: 190, width: 264, textAlign: "center", color: props.bg, fontSize: 26, lineHeight: 1.3, whiteSpace: "pre-line" } }, scene.body), [true, false].map((inside) => h(AbsoluteFill, { key: String(inside), style: { clipPath: inside ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" } }, h("div", { style: { position: "absolute", left: 60, top: 235, width: 600, height: 707, transform: motion, transformOrigin: "50% 55%" } }, h(Pouch, { inside, phase, colors: props })))), ["heading", "body"].map((field, column) => h("div", { key: field, style: { position: "absolute", left: column ? 408 : 48, top: 974, width: 264, textAlign: "center", color: column ? props.bg : props.text } }, h("div", { style: { fontSize: 26, lineHeight: 1.2, letterSpacing: 1.5 } }, scene.labels?.[column]), [
    { detail: details[index], opacity: 1 - clamp(blend * 2), y: -blend * 6 },
    { detail: details[next], opacity: clamp((blend - 0.5) * 2), y: (1 - blend) * 6 }
  ].map(({ detail, opacity, y }, i) => detail && h("div", { key: i, style: { position: "absolute", top: 44, width: 264, fontSize: 32, lineHeight: 1.15, opacity, transform: `translateY(${y}px)` } }, detail[field]))))), h("a", { href: props.ctaHref, style: { position: "absolute", left: 48, right: 48, bottom: 82, height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", background: props.accent, color: props.text, borderRadius: 8, fontSize: 30, fontWeight: 600, textDecoration: "none" } }, props.ctaLabel, h("span", { "aria-hidden": "true" }, "\u2197")), h("div", { "aria-hidden": "true", style: { position: "absolute", left: 48, bottom: 29, width: 264, textAlign: "center", color: props.text, fontSize: 20, letterSpacing: ".04em" } }, "ORIGINAL VECTOR STUDY")));
};

MotionAds.mount(Ad, window.motionAd);
})();
