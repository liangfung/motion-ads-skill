import { useCallback, useEffect, useRef, useState } from "react";
import { Player, type PlayerRef } from "@remotion/player";
import type { AdProps } from "./types";

const PlaybackFailure = ({
  props,
  onError,
}: {
  props: AdProps;
  onError: () => void;
}) => {
  useEffect(onError, [onError]);
  return (
    <div className="motion-fallback" role="alert">
      <strong>{props.title}</strong>
      <span>This animation could not be played.</span>
      <a href={props.ctaHref}>{props.ctaLabel}</a>
    </div>
  );
};

export const PlayerApp = ({
  component,
  props,
}: {
  component: React.ComponentType<AdProps>;
  props: AdProps;
}) => {
  const ref = useRef<PlayerRef>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [preference] = useState(() =>
    matchMedia("(prefers-reduced-motion: reduce)"),
  );
  const [reduced, setReduced] = useState(preference.matches);
  const [ready, setReady] = useState(false);
  const [fonts, setFonts] = useState("loading");
  const [error, setError] = useState("");
  const failed = useCallback(
    () => setError("This animation could not be played."),
    [],
  );
  const total = Math.max(1, Math.round(props.durationSeconds * props.fps));
  const requested = new URLSearchParams(location.search).get("frame");
  const inspecting =
    requested !== null && /^\d+$/.test(requested) && Number(requested) < total;
  const initialFrame = inspecting ? Number(requested) : 0;
  useEffect(() => {
    let active = true;
    const images = (props.assets || []).filter((file) =>
      /\.(?:png|jpe?g|webp|avif|svg|gif)$/i.test(file),
    );
    Promise.all([
      Promise.allSettled(
        Array.from(document.fonts).map((font) => font.load()),
      ).then((results) => {
        if (!active) return;
        const fallback = results.some((result) => result.status === "rejected");
        setFonts(fallback ? "fallback" : "ready");
        if (fallback)
          console.warn(
            "Some declared fonts could not load; fallback fonts require typography review.",
          );
      }),
      ...images.map((file) => {
        const image = new Image();
        image.src = file;
        return image.decode();
      }),
    ])
      .then(() => {
        if (active) setReady(true);
      })
      .catch(() => {
        if (active) setError("An image could not be loaded.");
      });
    const change = () => setReduced(preference.matches);
    preference.addEventListener("change", change);
    return () => {
      active = false;
      preference.removeEventListener("change", change);
    };
  }, []);
  useEffect(() => {
    const player = ref.current;
    if (!ready || error || !player) return;
    const frame = ({ detail }: { detail: { frame: number } }) => {
      if (stage.current) stage.current.dataset.frame = String(detail.frame);
    };
    const resume = () => {
      if (document.hidden || reduced || inspecting) player.pause();
      else player.play();
      if (reduced && !inspecting) player.seekTo(0);
    };
    player.addEventListener("frameupdate", frame);
    player.addEventListener("error", failed);
    document.addEventListener("visibilitychange", resume);
    resume();
    return () => {
      player.removeEventListener("frameupdate", frame);
      player.removeEventListener("error", failed);
      document.removeEventListener("visibilitychange", resume);
    };
  }, [ready, reduced, inspecting, error, failed]);
  return (
    <div
      ref={stage}
      id="motion-stage"
      data-state={
        error
          ? "error"
          : !ready
            ? "loading"
            : reduced || inspecting
              ? "paused"
              : "playing"
      }
      data-frame={initialFrame}
      data-fonts={fonts}
      style={{
        width: `min(100vw, calc(100svh * ${props.width} / ${props.height}))`,
        aspectRatio: `${props.width}/${props.height}`,
        background: props.bg,
      }}
    >
      {ready && !error ? (
        <Player
          ref={ref}
          component={component}
          inputProps={props}
          compositionWidth={props.width}
          compositionHeight={props.height}
          fps={props.fps}
          durationInFrames={total}
          initialFrame={initialFrame}
          loop
          initiallyMuted
          controls={false}
          clickToPlay={false}
          doubleClickToFullscreen={false}
          errorFallback={() => (
            <PlaybackFailure props={props} onError={failed} />
          )}
          style={{ width: "100%", height: "100%" }}
        />
      ) : (
        <div className="motion-fallback" role="status">
          <strong>{props.title}</strong>
          <span>{error || "Preparing the animation…"}</span>
          <a href={props.ctaHref}>{props.ctaLabel}</a>
        </div>
      )}
    </div>
  );
};
