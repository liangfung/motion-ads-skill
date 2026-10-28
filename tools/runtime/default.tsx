import {
  AbsoluteFill,
  Img,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import type { AdProps } from "./types";
export const Ad = (props: AdProps) => {
  const frame = useCurrentFrame(),
    { durationInFrames, fps } = useVideoConfig();
  const slot = durationInFrames / props.scenes.length,
    index = Math.min(props.scenes.length - 1, Math.floor(frame / slot));
  const scene = props.scenes[index],
    age = frame - index * slot;
  const reveal = spring({ frame: age, fps, config: { damping: 24 } });
  return (
    <AbsoluteFill
      style={{
        background: props.bg,
        color: props.text,
        fontFamily: "var(--font-text, Arial, sans-serif)",
        padding: "8%",
      }}
    >
      <div
        aria-hidden="true"
        style={{ fontSize: 30, fontWeight: 700, letterSpacing: 3 }}
      >
        {props.brand}
      </div>
      <div
        aria-hidden="true"
        style={{
          marginTop: "16%",
          opacity: index === 0 ? 1 : reveal,
          transform: `translateY(${(1 - reveal) * 20}px)`,
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 2, marginBottom: 24 }}>
          {scene.eyebrow}
        </div>
        <div
          style={{
            fontFamily: "var(--font-display, var(--font-text, Arial, sans-serif))",
            fontWeight: "var(--display-weight, 400)",
            letterSpacing: "var(--display-tracking, normal)",
            fontSize: 76,
            lineHeight: 1.05,
            margin: 0,
            whiteSpace: "pre-line",
          }}
        >
          {scene.headline}
        </div>
        {scene.body && (
          <p style={{ fontSize: 32, lineHeight: 1.4 }}>{scene.body}</p>
        )}
        {(scene.image || props.image) && (
          <Img
            pauseWhenLoading
            src={scene.image || props.image!}
            style={{
              width: "100%",
              height: 460,
              objectFit: "contain",
              marginTop: 32,
            }}
          />
        )}
        {scene.labels?.map((label) => (
          <p key={label} style={{ fontSize: 32 }}>
            {label}
          </p>
        ))}
      </div>
      <a
        href={props.ctaHref}
        style={{
          position: "absolute",
          left: "8%",
          right: "8%",
          bottom: "7%",
          padding: "26px 30px",
          color: props.bg,
          background: props.accent,
          fontSize: 34,
          textDecoration: "none",
          textAlign: "center",
        }}
      >
        {props.ctaLabel} ↗
      </a>
    </AbsoluteFill>
  );
};
