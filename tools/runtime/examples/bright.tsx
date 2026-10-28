// Original vector study. Adapt its attention, spacing and reveals, not its palette or object.
import * as React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
  interpolate,
} from "remotion";
import type { AdProps } from "../types";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const Vessel = ({
  colors,
  tone = colors.bg,
}: {
  colors: Pick<AdProps, "bg" | "surface" | "accent" | "text">;
  tone?: string;
}) => {
  const { surface: PAPER, bg: SUN, text: INK, accent: RED } = colors;
  const gradientId = `vessel-${React.useId().replace(/\W/g, "")}`;
  return (
    <svg
      viewBox="0 0 400 470"
      width="100%"
      height="100%"
      aria-label="Original unbranded container illustration"
    >
      <defs>
        <linearGradient id={gradientId}>
          <stop stopColor="#fff9e5" />
          <stop offset=".4" stopColor={tone} />
          <stop offset="1" stopColor="#b9975b" />
        </linearGradient>
      </defs>
      <ellipse cx="200" cy="438" rx="125" ry="16" fill={INK} opacity=".12" />
      <path d="M112 73Q104 46 134 38H266Q296 46 288 73V99H112Z" fill={INK} />
      <path
        d="M116 99H284L302 141V385Q300 423 266 425H134Q100 423 98 385V141Z"
        fill={`url(#${gradientId})`}
        stroke={INK}
        strokeWidth="4"
      />
      <path
        d="M123 148V381"
        stroke="#fffbe9"
        strokeWidth="11"
        opacity=".5"
        strokeLinecap="round"
      />
      <rect x="99" y="213" width="202" height="137" fill={PAPER} />
      <circle cx="200" cy="281" r="42" fill={RED} />
      <path d="M183 284q17-45 35-7q-15 28-35 7" fill={SUN} />
      <path
        d="M144 372H256M156 389H244"
        stroke={INK}
        strokeWidth="3"
        opacity=".35"
      />
    </svg>
  );
};
const Leaf = ({ color, vein }: { color: string; vein: string }) => (
  <svg viewBox="0 0 110 150" width="100%" height="100%">
    <path d="M20 130Q-8 30 95 12Q118 105 20 130Z" fill={color} />
    <path d="M18 139 80 33" stroke={vein} strokeWidth="3" />
  </svg>
);
export const Ad = (props: AdProps) => {
  // Config controls theme roles; illustration highlights and alternate tones stay authored.
  const { surface: PAPER, bg: SUN, text: INK, accent: RED } = props;
  const frame = useCurrentFrame(),
    { width, height, fps, durationInFrames } = useVideoConfig();
  const starts = [0, 0.26, 0.53, 0.8].map((n) =>
    Math.round(n * durationInFrames),
  );
  const index = starts.reduce((a, s, i) => (frame >= s ? i : a), 0),
    next = (index + 1) % 4;
  const end = next === 0 ? durationInFrames : starts[next],
    transition = Math.min(
      Math.round(fps * 0.8),
      Math.floor(durationInFrames * 0.07),
    );
  const progress = clamp((frame - end + transition) / transition);
  const p = Easing.inOut(Easing.cubic)(progress);
  const visibleIndex = progress < 0.5 ? index : next;
  // Keep the diagonal sweep's direction when returning to the opener.
  const band = index === 0 || index === 3;
  const sweepX = interpolate(progress, [0, 0.5, 1], [-1300, -170, 1000]);
  const rise = (age: number, delay = 0) =>
    clamp(
      spring({
        frame: Math.max(0, age - delay),
        fps,
        config: { damping: 22, stiffness: 125 },
      }),
    );
  const render = (i: number) => {
    const scene = props.scenes[i],
      // Keep the opener settled on both sides of the final wipe/loop seam.
      age = i === 0 ? fps * 3 : frame - starts[i] + transition;
    const enter = rise(age),
      copy = p ? (i === index ? 1 - clamp(p * 2) : clamp((p - 0.5) * 2)) : 1;
    return (
      <AbsoluteFill
        aria-hidden="true"
        style={{
          background: [SUN, PAPER, RED, PAPER][i],
          color: i === 2 ? PAPER : INK,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 58,
            fontSize: 29,
            fontWeight: 800,
            letterSpacing: 3,
            borderBottom: "2px solid currentColor",
            paddingBottom: 23,
          }}
        >
          FORM / COLOR / MOTION
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 176,
            opacity: copy,
          }}
        >
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 2,
              marginBottom: 25,
            }}
          >
            {scene.eyebrow}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display, var(--font-text, Arial, Helvetica, sans-serif))",
              fontSize: 80,
              fontWeight: "var(--display-weight, 900)",
              lineHeight: 1.02,
              letterSpacing: "var(--display-tracking, -3px)",
              whiteSpace: "pre-line",
              transform: `translateY(${(1 - enter) * 30}px)`,
            }}
          >
            {scene.headline}
          </div>
        </div>
        {i === 0 && (
          <>
            <div
              style={{
                position: "absolute",
                left: -25,
                top: 570,
                width: 170,
                height: 220,
                transform: `rotate(${-28 + enter * 8}deg) translateY(${(1 - rise(age, 8)) * 160}px)`,
              }}
            >
              <Leaf color={INK} vein={PAPER} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 558,
                top: 784,
                width: 140,
                height: 180,
                transform: `rotate(120deg) translateX(${(1 - rise(age, 16)) * 140}px)`,
              }}
            >
              <Leaf color={RED} vein={PAPER} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 128,
                top: 442,
                width: 464,
                height: 570,
                transform: `rotate(${-7 + enter * 5}deg) scale(${0.93 + enter * 0.07})`,
              }}
            >
              <Vessel colors={props} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 58,
                right: 58,
                top: 1028,
                display: "flex",
                gap: 18,
              }}
            >
              {scene.labels?.map((label, j) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    border: `2px solid ${INK}`,
                    borderRadius: 40,
                    padding: "10px 0",
                    textAlign: "center",
                    fontSize: 28,
                    fontWeight: 700,
                    opacity: rise(age, 18 + j * 6),
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </>
        )}
        {i === 1 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 190,
                top: 446,
                width: 340,
                height: 410,
                transform: `scale(${0.9 + enter * 0.1})`,
              }}
            >
              <Vessel colors={props} tone="#d8b56f" />
            </div>
            <svg
              viewBox="0 0 720 1280"
              width="720"
              height="1280"
              style={{ position: "absolute", inset: 0 }}
              aria-hidden="true"
            >
              <path
                d="M115 585H210M510 720H607"
                fill="none"
                stroke={RED}
                strokeWidth="3"
                strokeDasharray="120"
                strokeDashoffset={(1 - rise(age, 12)) * 120}
              />
              <circle cx="210" cy="585" r="5" fill={RED} />
              <circle cx="510" cy="720" r="5" fill={RED} />
            </svg>
            {scene.details?.map((detail, j) => (
              <div
                key={detail.heading}
                style={{
                  position: "absolute",
                  left: j ? 418 : 56,
                  top: j ? 868 : 868,
                  width: 246,
                  borderTop: `3px solid ${RED}`,
                  paddingTop: 19,
                  opacity: copy * rise(age, 20 + j * 10),
                  transform: `translateY(${(1 - rise(age, 20 + j * 10)) * 28}px)`,
                }}
              >
                <div
                  style={{ fontSize: 36, fontWeight: 800, marginBottom: 13 }}
                >
                  {detail.heading}
                </div>
                <div style={{ fontSize: 29, lineHeight: 1.35 }}>
                  {detail.body}
                </div>
              </div>
            ))}
          </>
        )}
        {i === 2 && (
          <>
            {[0, 1, 2].map((j) => (
              <div
                key={j}
                style={{
                  position: "absolute",
                  left: 56 + j * 210,
                  top: 500 + (j % 2) * 54,
                  width: 188,
                  height: 390,
                  borderRadius: 94,
                  background: [PAPER, SUN, "#e5b9a5"][j],
                  padding: "15px 4px",
                  transform: `translateY(${(1 - rise(age, 12 + j * 10)) * 140}px) rotate(${(j - 1) * 4}deg)`,
                }}
              >
                <Vessel colors={props} tone={[SUN, "#d8b56f", "#e5b9a5"][j]} />
              </div>
            ))}
            <div
              style={{
                position: "absolute",
                left: 56,
                right: 56,
                top: 982,
                fontSize: 33,
                lineHeight: 1.4,
                opacity: copy * rise(age, 24),
              }}
            >
              {scene.body}
            </div>
          </>
        )}
        {i === 3 && (
          <>
            <div
              style={{
                position: "absolute",
                left: 126,
                top: 458,
                width: 470,
                height: 490,
                borderRadius: "50%",
                background: SUN,
                transform: `scale(${0.9 + enter * 0.1})`,
              }}
            />
            <div
              style={{
                position: "absolute",
                left: 200,
                top: 435,
                width: 320,
                height: 480,
                transform: `rotate(${(1 - enter) * 8}deg)`,
              }}
            >
              <Vessel colors={props} />
            </div>
            <div
              style={{
                position: "absolute",
                left: 56,
                right: 56,
                top: 991,
                fontSize: 32,
                textAlign: "center",
                opacity: copy * rise(age, 18),
              }}
            >
              {scene.body}
            </div>
          </>
        )}
        <div
          style={{
            position: "absolute",
            bottom: 25,
            width: 720,
            textAlign: "center",
            fontSize: 22,
            letterSpacing: 2,
          }}
        >
          ORIGINAL VECTOR STUDY
        </div>
      </AbsoluteFill>
    );
  };
  return (
    <AbsoluteFill
      style={{
        background: INK,
        overflow: "hidden",
        fontFamily: "var(--font-text, Arial, Helvetica, sans-serif)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 1280,
          transform: `scale(${width / 720},${height / 1280})`,
          transformOrigin: "top left",
        }}
      >
        {render(band ? visibleIndex : index)}
        {progress > 0 && (band ? (
          // A wide band hides the cut and carries the same momentum into the loop.
          <AbsoluteFill
            aria-hidden="true"
            style={{
              width: 1050,
              background: RED,
              transform: `translateX(${sweepX}px) skewX(-12deg)`,
              transformOrigin: "center",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
        ) : (
          <AbsoluteFill
            style={{
              // Build the product row upward, then gather attention around the hero.
              clipPath: index === 1
                ? `inset(${(1 - p) * 100}% 0 0 0)`
                : `circle(${p * 900}px at 360px 700px)`,
            }}
          >
            {render(next)}
          </AbsoluteFill>
        ))}
        <a
          href={props.ctaHref}
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            bottom: 78,
            height: 96,
            padding: "0 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            border: `2px solid ${SUN}`,
            borderRadius: 12,
            background: INK,
            color: PAPER,
            fontSize: 33,
            fontWeight: 700,
            textDecoration: "none",
            zIndex: 2,
          }}
        >
          {props.ctaLabel}
          <span aria-hidden="true">↗</span>
        </a>
      </div>
    </AbsoluteFill>
  );
};
