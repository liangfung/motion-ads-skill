// Motion study: 720x1280, 30fps, 12s. Same-aspect resolution scaling is supported.
// Retiming requires changing the frame constants and props.qaFrames; other aspect ratios need recomposition.
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { HeroProps } from "./Hero";

export type AdScene = {
  eyebrow: string;
  headline: string;
  body?: string;
  image?: string;
  labels?: string[];
};
const INK = "#202521",
  PAPER = "#f3f0e8",
  ACCENT = "#b94c2e";

// Original illustrative headphone, not a photo or a claim about any real product.
const Headphone = () => (
  <svg viewBox="0 0 600 650" width="100%" height="100%">
    <defs>
      <linearGradient id="band" x1="0" x2="1">
        <stop stopColor="#161d1a" />
        <stop offset=".48" stopColor="#535b53" />
        <stop offset="1" stopColor="#151c18" />
      </linearGradient>
      <linearGradient id="cup" x1="0" x2="1" y2="1">
        <stop stopColor="#697064" />
        <stop offset=".45" stopColor="#333e34" />
        <stop offset="1" stopColor="#151d17" />
      </linearGradient>
      <radialGradient id="pad">
        <stop stopColor="#121813" />
        <stop offset=".7" stopColor="#252d25" />
        <stop offset="1" stopColor="#080d0a" />
      </radialGradient>
    </defs>
    <path
      d="M112 352V255C112 24 488 24 488 255V352"
      stroke="#131b16"
      strokeWidth="53"
      fill="none"
    />
    <path
      d="M112 333V255C112 24 488 24 488 255V333"
      stroke="url(#band)"
      strokeWidth="41"
      fill="none"
    />
    <path
      d="M145 202C180 93 420 93 455 202"
      stroke="#8d9684"
      strokeWidth="5"
      strokeLinecap="round"
      fill="none"
      opacity=".5"
    />
    <path
      d="M113 287v146M487 287v146"
      stroke="#8c9489"
      strokeWidth="14"
      strokeLinecap="round"
    />
    <g transform="rotate(13 141 430)">
      <rect x="72" y="315" width="152" height="258" rx="73" fill="url(#pad)" />
      <rect x="68" y="329" width="110" height="231" rx="53" fill="url(#cup)" />
      <path d="M89 366v143" stroke="#8a9581" strokeWidth="3" opacity=".4" />
    </g>
    <g transform="rotate(-15 458 430)">
      <rect x="379" y="315" width="152" height="258" rx="73" fill="url(#pad)" />
      <rect x="420" y="329" width="112" height="231" rx="53" fill="url(#cup)" />
      <path d="M446 371v138" stroke="#8a9581" strokeWidth="3" opacity=".4" />
      <circle cx="479" cy="520" r="4" fill="#b2b8a7" />
    </g>
  </svg>
);

export const Ad = ({
  brand = "FORM / 01",
  ctaLabel = "View the motion guide",
}: HeroProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const phase = (frame / durationInFrames) * Math.PI * 2;
  const reveal = (start: number, end: number) => {
    const enter = spring({
      frame: Math.max(0, frame - start),
      fps,
      config: { damping: 22 },
    });
    const exit = interpolate(frame, [end, end + 16], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    return frame < start ? 0 : enter * exit;
  };
  // Local attention sequence: silhouette labels, detail inset, closing takeaways.
  const profile = reveal(66, 151),
    detail = reveal(163, 256),
    close = reveal(270, 326);
  const intro = Math.max(
    interpolate(frame, [145, 160], [1, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
    interpolate(frame, [344, 358], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  // The subject, headline and CTA stay anchored while supporting layers change.
  return (
    <AbsoluteFill
      style={{
        background: PAPER,
        color: INK,
        overflow: "hidden",
        fontFamily: "Arial, sans-serif",
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
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 60,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #20252138",
            paddingBottom: 26,
          }}
        >
          <span
            style={{ fontSize: 33, fontWeight: 800, letterSpacing: "-.06em" }}
          >
            {brand}
          </span>
          <span style={{ fontSize: 19, letterSpacing: ".14em" }}>
            OBJECTS IN MOTION
          </span>
        </div>
        <div
          style={{
            position: "absolute",
            top: 161,
            left: 56,
            fontSize: 22,
            letterSpacing: ".15em",
            color: ACCENT,
          }}
        >
          A LISTENING STUDY
        </div>
        <div
          style={{
            position: "absolute",
            top: 210,
            left: 52,
            fontSize: 86,
            lineHeight: 0.98,
            letterSpacing: "-.06em",
            fontWeight: 750,
          }}
        >
          Find your
          <br />
          own rhythm.
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 958,
            width: 608,
            fontSize: 28,
            lineHeight: 1.4,
            color: "#63665f",
            opacity: intro,
          }}
        >
          Quiet lines. Considered details.
        </div>
        <svg
          width="608"
          height="190"
          style={{
            position: "absolute",
            left: 56,
            top: 594,
            opacity: 0.18 * (1 - detail),
          }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <path
              key={i}
              d={`M0 ${30 + i * 16} Q152 ${-36 + i * 14 + Math.sin(phase) * 18} 304 ${38 + i * 14} T608 ${36 + i * 14}`}
              fill="none"
              stroke={ACCENT}
              strokeWidth="1.5"
            />
          ))}
        </svg>
        <div
          style={{
            position: "absolute",
            left: 149,
            top: 410,
            width: 433,
            height: 470,
            transform: `translateY(${Math.sin(phase) * 9}px) rotate(${-5 + Math.sin(phase) * 1.8}deg)`,
            filter: "drop-shadow(0 28px 21px #19251a24)",
          }}
        >
          <Headphone />
        </div>
        <svg
          width="720"
          height="1050"
          style={{ position: "absolute", top: 0, left: 0, opacity: profile }}
        >
          <path
            d="M104 482H171L233 532"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeDasharray="220"
            strokeDashoffset={220 * (1 - profile)}
          />
          <circle cx="233" cy="532" r="6" fill={ACCENT} />
          <path
            d="M499 780L554 847H623"
            fill="none"
            stroke={ACCENT}
            strokeWidth="2"
            strokeDasharray="200"
            strokeDashoffset={200 * (1 - profile)}
          />
          <circle cx="499" cy="780" r="6" fill={ACCENT} />
        </svg>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 422,
            fontSize: 28,
            lineHeight: 1.3,
            opacity: profile,
          }}
        >
          Sculpted
          <br />
          profile
        </div>
        <div
          style={{
            position: "absolute",
            right: 56,
            top: 867,
            fontSize: 28,
            lineHeight: 1.3,
            textAlign: "right",
            opacity: profile,
          }}
        >
          Over-ear
          <br />
          silhouette
        </div>
        <div
          style={{
            position: "absolute",
            right: 47,
            top: 708,
            width: 180,
            height: 180,
            border: `2px solid ${ACCENT}`,
            borderRadius: "50%",
            overflow: "hidden",
            background: PAPER,
            opacity: detail,
            transform: `scale(${0.92 + detail * 0.08})`,
          }}
        >
          <div
            style={{
              position: "absolute",
              width: 710,
              height: 770,
              left: -475,
              top: -433,
            }}
          >
            <Headphone />
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 895,
            width: 330,
            opacity: detail,
            transform: `translateY(${(1 - detail) * 18}px)`,
          }}
        >
          <div
            style={{
              color: ACCENT,
              fontSize: 20,
              letterSpacing: ".12em",
              marginBottom: 14,
            }}
          >
            LOOK A LITTLE CLOSER
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.15,
              fontWeight: 650,
              letterSpacing: "-.035em",
            }}
          >
            Texture. Form.
            <br />A different perspective.
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 56,
            right: 56,
            top: 938,
            opacity: close,
            display: "flex",
            gap: 32,
            borderTop: "1px solid #20252138",
            paddingTop: 28,
          }}
        >
          {["One subject", "Layered details", "Room to breathe"].map(
            (label, i) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  fontSize: 28,
                  lineHeight: 1.3,
                  opacity: reveal(270 + i * 6, 326),
                }}
              >
                <span
                  style={{
                    display: "block",
                    color: ACCENT,
                    fontSize: 18,
                    marginBottom: 12,
                  }}
                >
                  0{i + 1}
                </span>
                {label}
              </div>
            ),
          )}
        </div>
        <div
          style={{
            position: "absolute",
            left: "8%",
            width: "84%",
            bottom: "7%",
            height: "7.5%",
            background: INK,
            color: PAPER,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 32px",
            boxSizing: "border-box",
            fontSize: 30,
            fontWeight: 600,
          }}
        >
          {ctaLabel}
          <span style={{ color: "#eaa58d", fontSize: 36 }}>↗</span>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 31,
            width: "100%",
            textAlign: "center",
            fontSize: 17,
            letterSpacing: ".1em",
            color: "#63665f",
          }}
        >
          ILLUSTRATIVE VECTOR STUDY · NOT A REAL PRODUCT
        </div>
      </div>
    </AbsoluteFill>
  );
};
