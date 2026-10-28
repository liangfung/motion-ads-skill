// Original vector-world study; reuse its information and attention mechanisms.
import {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { AdProps } from "../types";

export type AdScene = {
  eyebrow: string;
  headline: string;
  body?: string;
  image?: string;
  labels?: string[];
  details?: { heading: string; body: string }[];
};
const LIGHT = "#a5d8cf";
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const ease = Easing.inOut(Easing.cubic);
// Authored shot boundaries in frames; transitions begin before each boundary.
const TRANSITION = 18;

// Original vector world. Replace with verified artwork for a real campaign.
const World = ({
  frame,
  colors,
  variant = 0,
}: {
  frame: number;
  colors: Pick<AdProps, "bg" | "accent" | "text">;
  variant?: number;
}) => {
  const { bg: INK, text: BONE, accent: GOLD } = colors;
  const drift = Math.sin((frame / 450) * Math.PI * 2) * 9;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 720 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`sky-${variant}`}>
          <stop stopColor={variant === 1 ? "#426260" : "#325f70"} />
          <stop offset="1" stopColor={INK} />
        </radialGradient>
        <linearGradient id={`portal-${variant}`} x2="0" y2="1">
          <stop stopColor="#d9ead4" />
          <stop offset="1" stopColor="#4c9b9c" />
        </linearGradient>
      </defs>
      <rect width="720" height="800" fill={`url(#sky-${variant})`} />
      <circle cx={360 + drift} cy="244" r="116" fill="#d8e0c0" opacity=".12" />
      {[0, 1, 2].map((i) => (
        <g
          key={i}
          transform={`translate(${drift * (i + 1) * 0.5}, ${i * 24})`}
          opacity={0.28 + i * 0.22}
          fill={["#497171", "#244b54", "#102f3d"][i]}
        >
          <path
            d={`M-40 0H${170 - i * 30}Q${115 + i * 15} 177 ${190 - i * 23} 325T${124 - i * 12} 620L230 800H-40Z`}
          />
          <path
            d={`M760 0H${568 + i * 28}Q${620 - i * 20} 190 ${530 + i * 18} 345T${602 + i * 12} 625L491 800H760Z`}
          />
        </g>
      ))}
      {variant === 0 ? (
        <g transform={`translate(${drift * 0.4}, 0)`}>
          <path
            d="M270 582V333a90 90 0 0 1 180 0v249Z"
            fill="#102f3c"
            stroke="#7ba9a4"
            strokeWidth="2"
          />
          <path
            d="M292 582V335a68 68 0 0 1 136 0v247Z"
            fill={`url(#portal-${variant})`}
            opacity=".8"
          />
          <path
            d="M360 580Q279 672 396 800H491Q353 665 379 580Z"
            fill="#668e8c"
          />
          {[0, 1, 2, 3].map((i) => (
            <path
              key={i}
              d={`M${320 - i * 7} ${627 + i * 37}h${83 + i * 10}`}
              stroke="#d2ddc0"
              strokeWidth="2"
              opacity=".35"
            />
          ))}
          <path d="M360 582v-34" stroke={GOLD} strokeWidth="4" />
          <path d="M350 548l10-13 10 13-10 13Z" fill={GOLD} />
        </g>
      ) : (
        <g transform={`translate(${drift * 0.5}, 0)`}>
          <path
            d="M120 650Q325 570 285 480T465 365Q550 340 535 250"
            fill="none"
            stroke="#acc8b7"
            strokeWidth="27"
            opacity=".22"
          />
          <path
            d="M120 650Q325 570 285 480T465 365Q550 340 535 250"
            fill="none"
            stroke={GOLD}
            strokeWidth="2"
            strokeDasharray="5 11"
          />
          {[
            [165, 634],
            [286, 475],
            [472, 360],
            [535, 250],
          ].map(([x, y], j) => (
            <g key={j}>
              <ellipse
                cx={x}
                cy={y + 16}
                rx={45 - j * 7}
                ry="9"
                fill="#497879"
              />
              <path d={`M${x} ${y}v-42`} stroke={GOLD} strokeWidth="3" />
              <circle cx={x} cy={y - 45} r="5" fill={BONE} />
            </g>
          ))}
        </g>
      )}
      <path d="M0 735Q160 678 304 756T720 713V800H0Z" fill={INK} />
      {Array.from({ length: 22 }, (_, i) => (
        <circle
          key={i}
          cx={48 + ((i * 131) % 620) + Math.sin(frame / 65 + i) * 7}
          cy={75 + ((i * 83) % 600) - Math.sin(frame / 90 + i) * 10}
          r={i % 3 === 0 ? 2.6 : 1.4}
          fill={BONE}
          opacity={0.18 + (i % 5) * 0.08}
        />
      ))}
    </svg>
  );
};

export const Ad = (props: AdProps) => {
  // Config controls the theme; world lighting and secondary tints remain artwork choices.
  const {
    brand = "ILLUSTRATED JOURNEY",
    ctaLabel = "Explore the study",
    ctaHref,
    scenes = [],
    bg: INK,
    text: BONE,
    accent: GOLD,
    surface,
  } = props;
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const STARTS = [0, 1 / 6, 7 / 15, 0.8].map((n) =>
    Math.round(n * durationInFrames),
  );
  const index = STARTS.reduce((n, start, i) => (frame >= start ? i : n), 0);
  const next = (index + 1) % STARTS.length;
  const boundary = next === 0 ? durationInFrames : STARTS[next];
  const p = ease(clamp((frame - boundary + TRANSITION) / TRANSITION));
  const entrance = (age: number, delay = 0) =>
    spring({
      frame: Math.max(0, age - delay),
      fps,
      config: { damping: 23, stiffness: 115 },
    });
  // Each shot shares the same world, typography, frame and persistent action.
  const render = (i: number) => {
    const scene = scenes[i];
    if (!scene) throw new Error("Story example needs four scenes");
    const age = i === 0 ? 99 : frame - STARTS[i] + TRANSITION;
    const e = entrance(age);
    // Hand copy over once; artwork can continue moving through the whole mask.
    const copyOpacity =
      p === 0 ? 1 : i === index ? 1 - clamp(p * 2) : clamp((p - 0.5) * 2);
    const line = (text: string, j: number) => {
      const r = entrance(age, 4 + j * 7);
      return (
        <div key={j} style={{ overflow: "hidden", paddingBottom: 7 }}>
          <div
            style={{
              transform: `translateY(${(1 - r) * 110}%)`,
              opacity: clamp(r),
            }}
          >
            {text}
          </div>
        </div>
      );
    };
    return (
      <AbsoluteFill aria-hidden="true" style={{ background: INK }}>
        {i === 0 ? (
          <>
            <div
              style={{
                position: "absolute",
                top: 18,
                left: 0,
                width: 720,
                height: 935,
              }}
            >
              <World frame={frame} colors={props} />
            </div>
            <AbsoluteFill
              style={{
                background: `linear-gradient(180deg, transparent 46%, ${INK} 74%)`,
              }}
            />
          </>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                left: 56,
                right: 56,
                top: 414,
                height: i === 3 ? 335 : 346,
                clipPath:
                  "polygon(22px 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%,0 22px)",
                borderTop: `1px solid ${LIGHT}88`,
                opacity: e,
                transform: `translateY(${(1 - e) * 22}px)`,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: -25,
                  transform: `scale(${1.02 + clamp(age / 140) * 0.07})`,
                }}
              >
                <World
                  frame={frame + i * 13}
                  colors={props}
                  variant={i === 1 ? 1 : 0}
                />
              </div>
              <AbsoluteFill
                style={{
                  background:
                    "linear-gradient(180deg, transparent 70%, #091b2560)",
                }}
              />
              {i === 2 && (
                <svg
                  width="160"
                  height="220"
                  viewBox="0 0 160 220"
                  style={{
                    position: "absolute",
                    left: 224,
                    top: 55,
                    transform: `translateY(${Math.sin(frame / 40) * 5}px)`,
                  }}
                >
                  <path
                    d="M80 18v29M51 58l29-21 29 21v110l-29 27-29-27Z"
                    fill="#d5b88112"
                    stroke={GOLD}
                    strokeWidth="3"
                  />
                  <path d="M67 74h26v77H67Z" fill={GOLD} />
                  <path d="M45 168h70M51 57h58" stroke={GOLD} strokeWidth="4" />
                </svg>
              )}
            </div>
          </>
        )}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: i === 0 ? 776 : 192,
            width: 608,
            opacity: copyOpacity,
          }}
        >
          <div
            style={{
              color: GOLD,
              fontSize: 28,
              letterSpacing: ".14em",
              marginBottom: 24,
              opacity: e,
            }}
          >
            {scene.eyebrow}
          </div>
          <div
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontWeight: "var(--display-weight, 400)",
              fontSize: i === 0 ? 75 : 69,
              lineHeight: 1.03,
              letterSpacing: "var(--display-tracking, -.035em)",
              color: BONE,
            }}
          >
            {scene.headline.split("\n").map(line)}
          </div>
        </div>
        {/* Exploration: readable rows build in order underneath the shared image window. */}
        {i === 1 && (
          <div
            style={{
              position: "absolute",
              left: 56,
              top: 805,
              width: 608,
              opacity: copyOpacity,
            }}
          >
            {(scene.labels ?? []).map((label, j) => {
              const r = entrance(age, 18 + j * 12);
              return (
                <div
                  key={label}
                  style={{
                    borderLeft: `3px solid ${GOLD}`,
                    marginBottom: 18,
                    padding: "18px 22px",
                    background: surface,
                    color: BONE,
                    fontSize: 28,
                    lineHeight: 1.25,
                    opacity: r,
                    transform: `translateX(${(1 - r) * 28}px)`,
                  }}
                >
                  <span style={{ color: GOLD, marginRight: 20 }}>◇</span>
                  {label}
                </div>
              );
            })}
          </div>
        )}
        {/* Detail: paired cards separate the visual cue from its meaning; no invented metrics. */}
        {i === 2 && (
          <div
            style={{
              position: "absolute",
              left: 56,
              top: 805,
              width: 608,
              display: "flex",
              gap: 20,
              color: BONE,
              opacity: copyOpacity,
            }}
          >
            {(scene.details ?? []).map(({ heading, body }, j) => {
              const r = entrance(age, 20 + j * 12);
              return (
                <div
                  key={heading}
                  style={{
                    flex: 1,
                    minWidth: 0,
                    padding: "24px 22px",
                    borderTop: `2px solid ${GOLD}`,
                    background: surface,
                    opacity: clamp(r),
                    transform: `translateY(${(1 - r) * 24}px)`,
                  }}
                >
                  <div
                    style={{
                      color: GOLD,
                      fontFamily: "var(--font-display, Georgia, serif)",
                      fontSize: 42,
                      marginBottom: 18,
                    }}
                  >
                    {heading}
                  </div>
                  <div style={{ fontSize: 29, lineHeight: 1.3 }}>{body}</div>
                </div>
              );
            })}
          </div>
        )}
        {/* Close: a short synthesis and compact tags leave the action prominent. */}
        {i === 3 && (
          <div
            style={{
              position: "absolute",
              left: 56,
              top: 805,
              width: 608,
              opacity: copyOpacity,
            }}
          >
            <div
              style={{
                color: BONE,
                fontSize: 34,
                lineHeight: 1.3,
                marginBottom: 28,
                opacity: clamp(entrance(age, 15)),
              }}
            >
              {scene.body}
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              {(scene.labels ?? []).map((label, j) => (
                <div
                  key={label}
                  style={{
                    padding: "12px 18px",
                    border: `1px solid ${LIGHT}66`,
                    color: LIGHT,
                    fontSize: 28,
                    opacity: clamp(entrance(age, 24 + j * 8)),
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>
        )}
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 55,
            right: 56,
            display: "flex",
            alignItems: "center",
            gap: 22,
            color: BONE,
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-display, Georgia, serif)",
              fontSize: 34,
              letterSpacing: ".16em",
            }}
          >
            {brand}
          </span>
          <span style={{ flex: 1, height: 1, background: "#eee8d740" }} />
          <span style={{ color: GOLD }}>◇</span>
        </div>
      </AbsoluteFill>
    );
  };
  // Composite outgoing/incoming shots; the final iris returns to the opening world.
  const iris = next === 0 || next === 2;
  const clip = iris
    ? `circle(${p * 1550}px at 360px 565px)`
    : `inset(${(1 - p) * 1280}px 0 0 0)`;
  return (
    <AbsoluteFill
      style={{
        background: INK,
        overflow: "hidden",
        fontFamily: "var(--font-text, Arial, sans-serif)",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 1280,
          transform: `scale(${width / 720}, ${height / 1280})`,
          transformOrigin: "top left",
        }}
      >
        <AbsoluteFill
          style={{ filter: p ? `brightness(${1 - p * 0.18})` : undefined }}
        >
          {render(index)}
        </AbsoluteFill>
        {p > 0 && (
          <AbsoluteFill style={{ clipPath: clip }}>{render(next)}</AbsoluteFill>
        )}
        {!iris && p > 0 && (
          <div
            style={{
              position: "absolute",
              left: 0,
              top: (1 - p) * 1280,
              width: 720,
              height: 2,
              background: GOLD,
              opacity: Math.sin(p * Math.PI),
            }}
          />
        )}
        <a
          href={ctaHref}
          style={{
            textDecoration: "none",
            position: "absolute",
            left: "8%",
            width: "84%",
            bottom: "7%",
            height: "7.5%",
            boxSizing: "border-box",
            background: BONE,
            color: INK,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 30px",
            fontSize: 30,
            fontWeight: 600,
            clipPath:
              "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)",
          }}
        >
          {ctaLabel}
          <span aria-hidden="true">↗</span>
        </a>
        <div
          style={{
            position: "absolute",
            width: "100%",
            bottom: 30,
            textAlign: "center",
            color: "#aec3c0",
            fontSize: 22,
            letterSpacing: ".09em",
          }}
        >
          ORIGINAL VECTOR WORLD · MOTION STUDY
        </div>
      </div>
    </AbsoluteFill>
  );
};
