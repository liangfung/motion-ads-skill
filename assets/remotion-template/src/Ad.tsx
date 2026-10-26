import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
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

// An editable narrative baseline. Author a new composition when the brief calls for it.
// The MP4 carries the message; the card HTML supplies the real click target.
// Start with a two-line headline/body in portrait; inspect actual wraps before adding copy.
export const Ad = (props: HeroProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const wrapFrames = Math.min(
    Math.round(fps * 0.4),
    Math.floor(durationInFrames / (props.scenes?.length || 1) / 3),
  );
  const wrap =
    wrapFrames > 1
      ? interpolate(
          frame,
          [durationInFrames - wrapFrames, durationInFrames - 1],
          [0, 1],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
        )
      : 0;
  return (
    <AbsoluteFill>
      <AdFrame {...props} frame={frame} />
      {wrap > 0 && (
        <AbsoluteFill style={{ opacity: wrap }}>
          <AdFrame {...props} frame={0} />
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const AdFrame = ({
  frame,
  brand = "Product name",
  ctaLabel = "Learn more",
  scenes = [],
  image,
  imageMode,
  bg,
  accent,
  text = "#111318",
  ctaText = "#ffffff",
}: HeroProps & { frame: number }) => {
  const { width, height, fps, durationInFrames } = useVideoConfig();
  const unit = Math.min(width, height);
  const portrait = height > width;
  const copyGap = unit * (portrait ? 0.03 : 0.035);
  const index = Math.min(
    scenes.length - 1,
    Math.floor((frame * scenes.length) / durationInFrames),
  );
  const scene = scenes[index];
  if (!scene) throw new Error("Ad needs narrative scenes in props.json");
  const start = Math.ceil((index * durationInFrames) / scenes.length);
  const local = frame - start;
  const enter = (delay = 0) =>
    spring({
      frame: Math.max(0, local - delay),
      fps,
      config: { damping: 22, stiffness: 130 },
    });
  const entrance = index === 0 ? 0.9 + enter() * 0.1 : enter();
  const callouts = scene.labels ?? [];
  const detail = callouts.length > 0;
  const source = scene.image || image;
  const imageX = portrait ? (detail ? 0.035 : 0.12) : 0.57;
  const imageY = portrait ? 0.49 : 0.23;
  const imageW = portrait ? (detail ? 0.54 : 0.76) : 0.35;
  const imageH = portrait ? 0.3 : 0.48;
  const camera = interpolate(
    local,
    [0, durationInFrames / scenes.length],
    [1, 1.045],
    { extrapolateRight: "clamp" },
  );

  return (
    <AbsoluteFill
      style={{
        background: bg,
        color: text,
        fontFamily: "Arial, 'Noto Sans CJK SC', sans-serif",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          top: portrait ? "6%" : "3.5%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: unit * (portrait ? 0.045 : 0.065),
          fontWeight: 750,
          letterSpacing: -unit * 0.0015,
        }}
      >
        <span style={{ maxWidth: "75%" }}>{brand}</span>
      </div>

      <div
        key={index}
        style={{
          position: "absolute",
          left: "8%",
          top: portrait ? "14%" : "21%",
          width: portrait ? "84%" : "44%",
          transform: `translateY(${(1 - entrance) * unit * 0.06}px)`,
          opacity: index === 0 ? 1 : entrance,
        }}
      >
        <div
          style={{
            fontSize: unit * (portrait ? 0.04 : 0.05),
            letterSpacing: unit * 0.002,
            marginBottom: copyGap,
            fontWeight: 650,
            opacity: 0.75,
          }}
        >
          {scene.eyebrow}
        </div>
        <div
          style={{
            fontSize: unit * (portrait ? 0.08 : 0.12),
            fontWeight: 750,
            lineHeight: portrait ? 1.05 : 1.1,
            letterSpacing: -unit * 0.0025,
            whiteSpace: "pre-line",
          }}
        >
          {scene.headline}
        </div>
        <div
          style={{
            width: unit * 0.18 * enter(6),
            height: unit * 0.006,
            marginTop: copyGap,
            background: accent,
          }}
        />
        {scene.body && (
          <div
            style={{
              marginTop: copyGap,
              maxWidth: "34ch",
              fontSize: unit * (portrait ? 0.04 : 0.07),
              lineHeight: portrait ? 1.4 : 1.55,
            }}
          >
            {scene.body}
          </div>
        )}
      </div>

      <div
        style={{
          position: "absolute",
          left: width * imageX,
          top: height * imageY,
          width: width * imageW,
          height: height * imageH,
          overflow: "hidden",
          borderRadius: imageMode === "photo" ? unit * 0.035 : 0,
          transform: `translateX(${(1 - entrance) * width * 0.12}px) scale(${camera})`,
          opacity: index === 0 ? 1 : enter(3),
          background: imageMode === "white-bg" ? "#ffffff" : undefined,
        }}
      >
        <Img
          src={staticFile(source)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: imageMode === "photo" ? "cover" : "contain",
          }}
        />
      </div>

      {detail && (
        <div
          style={{
            position: "absolute",
            left: portrait ? "61.5%" : "8%",
            top: portrait ? "51%" : "68%",
            width: portrait ? "30.5%" : "84%",
            display: portrait ? "grid" : "flex",
            gap: unit * 0.04,
          }}
        >
          {callouts.map((label, i) => {
            const labelFrames =
              durationInFrames / scenes.length / callouts.length;
            const reveal = enter(
              portrait ? 10 + i * 7 : Math.ceil(i * labelFrames),
            );
            return (
              <div
                key={label}
                style={{
                  flex: 1,
                  display:
                    portrait ||
                    i ===
                      Math.min(
                        callouts.length - 1,
                        Math.floor(local / labelFrames),
                      )
                      ? "flex"
                      : "none",
                  alignItems: "baseline",
                  opacity: reveal,
                  transform: `translateX(${(1 - reveal) * unit * 0.06}px)`,
                  padding: `${unit * (portrait ? 0.018 : 0.012)}px ${unit * 0.022}px`,
                  background: bg,
                  border: `2px solid ${accent}`,
                  fontSize: unit * (portrait ? 0.04 : 0.07),
                  lineHeight: 1.3,
                  fontWeight: 650,
                }}
              >
                <span
                  style={{
                    flexShrink: 0,
                    width: unit * (portrait ? 0.045 : 0.08),
                    marginRight: unit * 0.025,
                    color: accent,
                  }}
                >
                  →
                </span>
                <span style={{ minWidth: 0 }}>{label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Keep this rectangle in sync with the card wrapper's transparent anchor. */}
      <div
        style={{
          position: "absolute",
          left: "8%",
          width: "84%",
          bottom: "7%",
          height: "7.5%",
          borderRadius: unit * 0.018,
          background: accent,
          color: ctaText,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: unit * 0.025,
          fontSize: unit * (portrait ? 0.043 : 0.06),
          fontWeight: 750,
        }}
      >
        {ctaLabel}
        <span
          style={{
            transform: `translateX(${Math.sin((frame / fps) * 2) * unit * 0.006}px)`,
          }}
        >
          ↗
        </span>
      </div>
    </AbsoluteFill>
  );
};
