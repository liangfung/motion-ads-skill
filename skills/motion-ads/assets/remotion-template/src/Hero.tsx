import {
  AbsoluteFill,
  Img,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { Ad, type AdScene } from "./Ad";

// How the product image is composited:
// - "cutout":   transparent PNG/SVG, drawn as-is with a drop shadow
// - "white-bg": product photo on a pure white background (typical marketplace main image);
//               preserve its white field instead of blending product detail into `bg`
// - "photo":    photo with its own background (lifestyle shot); rounded card + shine sweep
export type ImageMode = "cutout" | "white-bg" | "photo";
// Ambient motion behind the product:
// - "rings":   soft pulse rings (neutral default)
// - "airflow": orbiting air-stream arcs (fans, air movers, wind, speed)
export type Motif = "rings" | "airflow" | "none";

export type HeroProps = {
  width: number;
  height: number;
  durationSeconds: number;
  image: string;
  images?: string[];
  presentation?: "ad" | "product" | "gallery";
  brand?: string;
  ctaLabel?: string;
  text?: string;
  ctaText?: string;
  scenes?: AdScene[];
  imageMode: ImageMode;
  motif: Motif;
  bg: string;
  surface: string;
  accent: string;
};

const TAU = Math.PI * 2;

// The finished ad uses Ad; image-only modes are supporting visual material.
export const Hero = (props: HeroProps) => {
  const { image, images, presentation, imageMode, motif, bg, surface, accent } = props;
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const p = frame / durationInFrames;
  const unit = Math.min(width, height); // size things off the short side so any aspect ratio works
  const phase = p * TAU;

  const floatY = Math.sin(phase) * unit * 0.018;
  const tilt = Math.sin(phase) * 2.2;
  const breathe = 1 + Math.sin(phase + 1.2) * 0.012;
  const productSize = unit * 0.72;

  if (presentation === "ad") return <Ad {...props} />;

  // A screenshot montage preserves the supplied artwork; it is not simulated gameplay.
  if (presentation === "gallery") {
    const gallery = images?.length ? images : [image];
    const position = p * gallery.length;
    const index = Math.floor(position) % gallery.length;
    const blend = Math.max(0, Math.min(1, ((position % 1) - 0.72) / 0.28));
    const eased = blend * blend * (3 - 2 * blend);
    const camera = `scale(${1.04 + Math.sin(phase) * 0.012}) translateX(${Math.sin(phase) * 0.6}%)`;
    return (
      <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
        {[gallery[index], gallery[(index + 1) % gallery.length]].map((source, layer) => (
          <Img key={layer} src={staticFile(source)} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "contain", transform: camera, opacity: layer === 0 ? 1 : eased }} />
        ))}
        <AbsoluteFill style={{ background: `linear-gradient(0deg, ${bg}, transparent 28%, transparent 88%, ${bg})` }} />
      </AbsoluteFill>
    );
  }

  const blob = (k: number, color: string, size: number, ox: number, oy: number) => ({
    position: "absolute" as const,
    width: size,
    height: size,
    borderRadius: "50%",
    background: `radial-gradient(circle, ${color} 0%, transparent 68%)`,
    left: width / 2 - size / 2 + Math.cos(phase + k) * ox,
    top: height / 2 - size / 2 + Math.sin(phase + k) * oy,
  });

  // Two pulse rings, each cycling twice per loop, offset by half a cycle.
  const ring = (offset: number) => {
    const t = (p * 2 + offset) % 1;
    const s = unit * (0.5 + t * 0.55);
    return (
      <div
        key={offset}
        style={{
          position: "absolute",
          left: width / 2 - s / 2,
          top: height / 2 - s / 2,
          width: s,
          height: s,
          borderRadius: "50%",
          border: `${Math.max(2, unit * 0.004)}px solid ${accent}`,
          opacity: Math.sin(Math.PI * t) ** 2 * 0.22,
        }}
      />
    );
  };

  // Airflow: elliptical arcs rotating a whole number of turns per loop (k = ±1, ±2), seamless.
  const airflow = (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ position: "absolute", inset: 0 }}
    >
      {[
        { rx: 0.42, ry: 0.37, k: 1, dash: 0.34, o: 0.6 },
        { rx: 0.47, ry: 0.3, k: -1, dash: 0.26, o: 0.45 },
        { rx: 0.37, ry: 0.42, k: 2, dash: 0.2, o: 0.38 },
      ].map(({ rx, ry, k, dash, o }, i) => {
        const a = width * rx;
        const b = unit * ry;
        const circ = Math.PI * (3 * (a + b) - Math.sqrt((3 * a + b) * (a + 3 * b)));
        return (
          <ellipse
            key={i}
            cx={width / 2}
            cy={height / 2}
            rx={a}
            ry={b}
            fill="none"
            stroke={accent}
            strokeOpacity={o}
            strokeWidth={Math.max(4, unit * 0.011)}
            strokeLinecap="round"
            strokeDasharray={`${circ * dash} ${circ * (1 - dash)}`}
            transform={`rotate(${(i - 1) * 14} ${width / 2} ${height / 2}) rotate(${k * p * 360} ${width / 2} ${height / 2})`}
          />
        );
      })}
    </svg>
  );

  const shineX = -150 + p * 300; // resets while completely outside the photo

  return (
    <AbsoluteFill style={{ background: bg, overflow: "hidden" }}>
      <div style={blob(0, surface, unit * 1.3, width * 0.08, height * 0.06)} />
      <div style={blob(2, `color-mix(in srgb, ${accent} 14%, transparent)`, unit * 0.9, width * 0.12, height * 0.1)} />
      {motif === "airflow" ? airflow : motif === "rings" ? [ring(0), ring(0.5)] : null}

      {/* contact shadow breathes opposite to the float */}
      <div
        style={{
          position: "absolute",
          left: width / 2 - productSize * 0.3,
          top: height / 2 + productSize * 0.5,
          width: productSize * 0.6,
          height: productSize * 0.06,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.18)",
          filter: `blur(${unit * 0.02}px)`,
          transform: `scaleX(${1 - Math.sin(phase) * 0.06})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: width / 2 - productSize / 2,
          top: height / 2 - productSize / 2 + floatY,
          width: productSize,
          height: productSize,
          transform: `rotate(${tilt}deg) scale(${breathe})`,
          background: imageMode === "white-bg" ? "#ffffff" : undefined,
        }}
      >
        {imageMode === "cutout" || imageMode === "white-bg" ? (
          <Img
            src={staticFile(image)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter:
                imageMode === "cutout"
                  ? `drop-shadow(0 ${unit * 0.025}px ${unit * 0.03}px rgba(0,0,0,0.22))`
                  : undefined,
            }}
          />
        ) : (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              borderRadius: unit * 0.05,
              overflow: "hidden",
              boxShadow: `0 ${unit * 0.03}px ${unit * 0.06}px rgba(0,0,0,0.25)`,
            }}
          >
            <Img
              src={staticFile(image)}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.35) 50%, transparent 60%)",
                transform: `translateX(${shineX}%)`,
              }}
            />
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
