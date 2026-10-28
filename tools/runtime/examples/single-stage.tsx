// Original fixed-stage study: one moving subject, complementary views and local information changes.
import * as React from "react";
import { AbsoluteFill, Easing, useCurrentFrame, useVideoConfig } from "remotion";
import type { AdProps } from "../types";

const BODY = "M118 90H438L468 582Q470 615 435 622H125Q90 615 94 582Z";
const clamp = (n: number) => Math.max(0, Math.min(1, n));

const Pouch = ({
  inside,
  phase,
  colors,
}: {
  inside: boolean;
  phase: number;
  colors: AdProps;
}) => {
  const { bg, surface, accent, text } = colors;
  const id = `blend-${React.useId().replace(/\W/g, "")}`;
  return (
    <svg
      viewBox="0 0 560 660"
      width="100%"
      height="100%"
      aria-label={inside ? "Unwrapped botanical blend" : "Wrapped botanical pouch"}
    >
      <defs>
        <clipPath id={`${id}-body`}><path d={BODY} /></clipPath>
        <linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2=".2">
          <stop stopColor="#fffdf3" />
          <stop offset=".7" stopColor={bg} />
          <stop offset="1" stopColor="#dfd5bc" />
        </linearGradient>
        <pattern id={`${id}-grain`} width="17" height="19" patternUnits="userSpaceOnUse">
          <path d="M2 3l3 1M12 14l2-1" stroke={text} strokeWidth=".6" opacity=".12" />
        </pattern>
      </defs>
      <ellipse cx="281" cy="637" rx="175" ry="12" fill={text} opacity=".1" />
      {inside ? (
        <>
          <path d={BODY} fill="none" stroke={text} strokeWidth="2" strokeDasharray="3 10" opacity=".16" />
          <g clipPath={`url(#${id}-body)`}>
            {/* All ingredients belong to this invented illustration, not a real product claim. */}
            {[
              [178, 184, -26, 1.1], [351, 154, 52, .8],
              [367, 395, 22, 1.2], [185, 496, -38, .9], [321, 568, 58, .75],
            ].map(([x, y, angle, scale], i) => (
              <g key={i} transform={`translate(${x}, ${y + Math.sin(phase + i) * 3}) rotate(${angle}) scale(${scale})`}>
                <path d="M0 50Q-62 2 0-57Q59 1 0 50Z" fill={i % 2 ? surface : text} />
                <path d="M0 46V-42M0 4l-22-20M0 24l24-22" stroke={bg} strokeWidth="2" fill="none" opacity=".6" />
              </g>
            ))}
            {[[194, 354, -14], [362, 258, 18]].map(([x, y, angle], i) => (
              <g key={i} transform={`translate(${x}, ${y + Math.sin(phase + i + .7) * 3}) rotate(${angle})`}>
                <circle r="54" fill="#c4794b" />
                <circle r="46" fill={accent} />
                <circle r="39" fill="#f4df9d" />
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <path key={a} d="M0 0V-38" stroke="#c4794b" strokeWidth="2" opacity=".55" transform={`rotate(${a})`} />
                ))}
                <circle r="5" fill={bg} />
              </g>
            ))}
            {[[287, 288, 1], [346, 487, 1.1], [165, 584, .8]].map(([x, y, scale], i) => (
              <g key={i} transform={`translate(${x}, ${y}) rotate(${Math.sin(phase + i) * 4}) scale(${scale})`}>
                {[0, 60, 120, 180, 240, 300].map((a) => (
                  <ellipse key={a} cy="-20" rx="12" ry="24" fill="#f4e6ba" stroke="#d2b56b" strokeWidth="1.5" transform={`rotate(${a})`} />
                ))}
                <circle r="13" fill="#bb8b30" />
                <circle r="7" fill={accent} />
              </g>
            ))}
          </g>
        </>
      ) : (
        <>
          <path d={BODY} fill={`url(#${id}-paper)`} stroke={text} strokeWidth="2" />
          <path d={BODY} fill={`url(#${id}-grain)`} />
          <path d="M118 90l22-28h276l22 28-5 20H123Z" fill={bg} stroke={text} strokeWidth="2" />
          <path d="M139 77h278M125 108h308" stroke={text} strokeWidth="2" opacity=".3" />
          <path d="M101 576q179 38 362 0l-28 46H125Z" fill={text} opacity=".08" />
          <g transform="translate(282,251) rotate(-8)" fill={surface}>
            <path d="M0 42Q-60 3-9-49Q31-9 0 42Z" />
            <path d="M7 33Q8-39 59-43Q74 9 7 33Z" />
            <path d="M-1 42V-10" fill="none" stroke={bg} strokeWidth="2" />
          </g>
          <rect x="148" y="355" width="264" height="132" fill={bg} />
          <text x="280" y="403" textAnchor="middle" fill={text} style={{ fontFamily: "var(--font-display, Georgia, serif)", fontSize: 34, letterSpacing: 2 }}>BOTANICAL</text>
          <text x="280" y="446" textAnchor="middle" fill={text} style={{ fontFamily: "var(--font-text, Arial, sans-serif)", fontSize: 24, letterSpacing: 7 }}>BLEND</text>
          <path d="M204 535h152M222 549h116" stroke={text} strokeWidth="2" opacity=".4" />
        </>
      )}
    </svg>
  );
};

export const Ad = (props: AdProps) => {
  const frame = useCurrentFrame();
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const scene = props.scenes[0];
  const details = scene.details ?? [];
  const count = Math.max(1, details.length);
  const span = durationInFrames / count;
  const index = Math.min(count - 1, Math.floor(frame / span));
  const next = (index + 1) % count;
  const handoff = Math.min(fps * .4, span * .2);
  const blend = Easing.inOut(Easing.cubic)(clamp((frame - (index + 1) * span + handoff) / handoff));

  // Both representations use exactly this pose; the screen-space split never moves.
  const motion = `translate(${Math.sin(phase) * 84}px, ${Math.sin(phase * 2) * 4}px) rotate(${-6 + Math.sin(phase) * 2}deg)`;
  return (
    <AbsoluteFill style={{ background: props.bg, overflow: "hidden", fontFamily: "var(--font-text, Arial, sans-serif)" }}>
      <div style={{ position: "absolute", width: 720, height: 1280, transform: `scale(${width / 720}, ${height / 1280})`, transformOrigin: "top left" }}>
        <AbsoluteFill aria-hidden="true">
          <div style={{ position: "absolute", inset: "0 0 0 50%", background: props.surface }} />
          <div style={{ position: "absolute", left: 48, top: 63, width: 264, textAlign: "center", color: props.text, fontSize: 26, lineHeight: 1.2, letterSpacing: 1 }}>
            {scene.eyebrow}
          </div>
          <div style={{ position: "absolute", left: 48, top: 132, width: 264, textAlign: "center", color: props.text, fontFamily: "var(--font-display, Georgia, serif)", fontWeight: "var(--display-weight, 400)", letterSpacing: "var(--display-tracking, -.035em)", fontSize: 70, lineHeight: 1.03, whiteSpace: "pre-line" }}>
            {scene.headline}
          </div>
          <div style={{ position: "absolute", left: 408, top: 80, width: 264, textAlign: "center", color: props.bg, fontFamily: "var(--font-display, Georgia, serif)", fontSize: 32, lineHeight: 1.2, letterSpacing: 2, whiteSpace: "pre-line" }}>
            {props.brand}
          </div>
          <div style={{ position: "absolute", left: 408, top: 190, width: 264, textAlign: "center", color: props.bg, fontSize: 26, lineHeight: 1.3, whiteSpace: "pre-line" }}>
            {scene.body}
          </div>

          {[true, false].map((inside) => (
            <AbsoluteFill key={String(inside)} style={{ clipPath: inside ? "inset(0 50% 0 0)" : "inset(0 0 0 50%)" }}>
              <div style={{ position: "absolute", left: 60, top: 235, width: 600, height: 707, transform: motion, transformOrigin: "50% 55%" }}>
                <Pouch inside={inside} phase={phase} colors={props} />
              </div>
            </AbsoluteFill>
          ))}

          {/* Only these information slots change; the backdrop, subject registration and CTA stay stable. */}
          {(["heading", "body"] as const).map((field, column) => (
            <div key={field} style={{ position: "absolute", left: column ? 408 : 48, top: 974, width: 264, textAlign: "center", color: column ? props.bg : props.text }}>
              <div style={{ fontSize: 26, lineHeight: 1.2, letterSpacing: 1.5 }}>{scene.labels?.[column]}</div>
              {[
                { detail: details[index], opacity: 1 - clamp(blend * 2), y: -blend * 6 },
                { detail: details[next], opacity: clamp((blend - .5) * 2), y: (1 - blend) * 6 },
              ].map(({ detail, opacity, y }, i) => detail && (
                <div key={i} style={{ position: "absolute", top: 44, width: 264, fontSize: 32, lineHeight: 1.15, opacity, transform: `translateY(${y}px)` }}>
                  {detail[field]}
                </div>
              ))}
            </div>
          ))}
        </AbsoluteFill>
        <a href={props.ctaHref} style={{ position: "absolute", left: 48, right: 48, bottom: 82, height: 96, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 30px", background: props.accent, color: props.text, borderRadius: 8, fontSize: 30, fontWeight: 600, textDecoration: "none" }}>
          {props.ctaLabel}
          <span aria-hidden="true">↗</span>
        </a>
        <div aria-hidden="true" style={{ position: "absolute", left: 48, bottom: 29, width: 264, textAlign: "center", color: props.text, fontSize: 20, letterSpacing: ".04em" }}>
          ORIGINAL VECTOR STUDY
        </div>
      </div>
    </AbsoluteFill>
  );
};
