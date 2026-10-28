// Editable React/Remotion composition. No compilation is required.
(() => {
const {React} = MotionAds;
const h = React.createElement;
const {
  AbsoluteFill,
  Easing,
  spring,
  useCurrentFrame,
  useVideoConfig
} = MotionAds.Remotion;
const LIGHT = "#a5d8cf";
const clamp = (n) => Math.max(0, Math.min(1, n));
const ease = Easing.inOut(Easing.cubic);
const TRANSITION = 18;
const World = ({
  frame,
  colors,
  variant = 0
}) => {
  const { bg: INK, text: BONE, accent: GOLD } = colors;
  const drift = Math.sin(frame / 450 * Math.PI * 2) * 9;
  return h(
    "svg",
    {
      width: "100%",
      height: "100%",
      viewBox: "0 0 720 800",
      preserveAspectRatio: "xMidYMid slice"
    },
    h("defs", null, h("radialGradient", { id: `sky-${variant}` }, h("stop", { stopColor: variant === 1 ? "#426260" : "#325f70" }), h("stop", { offset: "1", stopColor: INK })), h("linearGradient", { id: `portal-${variant}`, x2: "0", y2: "1" }, h("stop", { stopColor: "#d9ead4" }), h("stop", { offset: "1", stopColor: "#4c9b9c" }))),
    h("rect", { width: "720", height: "800", fill: `url(#sky-${variant})` }),
    h("circle", { cx: 360 + drift, cy: "244", r: "116", fill: "#d8e0c0", opacity: ".12" }),
    [0, 1, 2].map((i) => h(
      "g",
      {
        key: i,
        transform: `translate(${drift * (i + 1) * 0.5}, ${i * 24})`,
        opacity: 0.28 + i * 0.22,
        fill: ["#497171", "#244b54", "#102f3d"][i]
      },
      h(
        "path",
        {
          d: `M-40 0H${170 - i * 30}Q${115 + i * 15} 177 ${190 - i * 23} 325T${124 - i * 12} 620L230 800H-40Z`
        }
      ),
      h(
        "path",
        {
          d: `M760 0H${568 + i * 28}Q${620 - i * 20} 190 ${530 + i * 18} 345T${602 + i * 12} 625L491 800H760Z`
        }
      )
    )),
    variant === 0 ? h("g", { transform: `translate(${drift * 0.4}, 0)` }, h(
      "path",
      {
        d: "M270 582V333a90 90 0 0 1 180 0v249Z",
        fill: "#102f3c",
        stroke: "#7ba9a4",
        strokeWidth: "2"
      }
    ), h(
      "path",
      {
        d: "M292 582V335a68 68 0 0 1 136 0v247Z",
        fill: `url(#portal-${variant})`,
        opacity: ".8"
      }
    ), h(
      "path",
      {
        d: "M360 580Q279 672 396 800H491Q353 665 379 580Z",
        fill: "#668e8c"
      }
    ), [0, 1, 2, 3].map((i) => h(
      "path",
      {
        key: i,
        d: `M${320 - i * 7} ${627 + i * 37}h${83 + i * 10}`,
        stroke: "#d2ddc0",
        strokeWidth: "2",
        opacity: ".35"
      }
    )), h("path", { d: "M360 582v-34", stroke: GOLD, strokeWidth: "4" }), h("path", { d: "M350 548l10-13 10 13-10 13Z", fill: GOLD })) : h("g", { transform: `translate(${drift * 0.5}, 0)` }, h(
      "path",
      {
        d: "M120 650Q325 570 285 480T465 365Q550 340 535 250",
        fill: "none",
        stroke: "#acc8b7",
        strokeWidth: "27",
        opacity: ".22"
      }
    ), h(
      "path",
      {
        d: "M120 650Q325 570 285 480T465 365Q550 340 535 250",
        fill: "none",
        stroke: GOLD,
        strokeWidth: "2",
        strokeDasharray: "5 11"
      }
    ), [
      [165, 634],
      [286, 475],
      [472, 360],
      [535, 250]
    ].map(([x, y], j) => h("g", { key: j }, h(
      "ellipse",
      {
        cx: x,
        cy: y + 16,
        rx: 45 - j * 7,
        ry: "9",
        fill: "#497879"
      }
    ), h("path", { d: `M${x} ${y}v-42`, stroke: GOLD, strokeWidth: "3" }), h("circle", { cx: x, cy: y - 45, r: "5", fill: BONE })))),
    h("path", { d: "M0 735Q160 678 304 756T720 713V800H0Z", fill: INK }),
    Array.from({ length: 22 }, (_, i) => h(
      "circle",
      {
        key: i,
        cx: 48 + i * 131 % 620 + Math.sin(frame / 65 + i) * 7,
        cy: 75 + i * 83 % 600 - Math.sin(frame / 90 + i) * 10,
        r: i % 3 === 0 ? 2.6 : 1.4,
        fill: BONE,
        opacity: 0.18 + i % 5 * 0.08
      }
    ))
  );
};
const Ad = (props) => {
  const {
    brand = "ILLUSTRATED JOURNEY",
    ctaLabel = "Explore the study",
    ctaHref,
    scenes = [],
    bg: INK,
    text: BONE,
    accent: GOLD,
    surface
  } = props;
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();
  const STARTS = [0, 1 / 6, 7 / 15, 0.8].map(
    (n) => Math.round(n * durationInFrames)
  );
  const index = STARTS.reduce((n, start, i) => frame >= start ? i : n, 0);
  const next = (index + 1) % STARTS.length;
  const boundary = next === 0 ? durationInFrames : STARTS[next];
  const p = ease(clamp((frame - boundary + TRANSITION) / TRANSITION));
  const entrance = (age, delay = 0) => spring({
    frame: Math.max(0, age - delay),
    fps,
    config: { damping: 23, stiffness: 115 }
  });
  const render = (i) => {
    const scene = scenes[i];
    if (!scene) throw new Error("Story example needs four scenes");
    const age = i === 0 ? 99 : frame - STARTS[i] + TRANSITION;
    const e = entrance(age);
    const copyOpacity = p === 0 ? 1 : i === index ? 1 - clamp(p * 2) : clamp((p - 0.5) * 2);
    const line = (text, j) => {
      const r = entrance(age, 4 + j * 7);
      return h("div", { key: j, style: { overflow: "hidden", paddingBottom: 7 } }, h(
        "div",
        {
          style: {
            transform: `translateY(${(1 - r) * 110}%)`,
            opacity: clamp(r)
          }
        },
        text
      ));
    };
    return h(AbsoluteFill, { "aria-hidden": "true", style: { background: INK } }, i === 0 ? h(React.Fragment, null, h(
      "div",
      {
        style: {
          position: "absolute",
          top: 18,
          left: 0,
          width: 720,
          height: 935
        }
      },
      h(World, { frame, colors: props })
    ), h(
      AbsoluteFill,
      {
        style: {
          background: `linear-gradient(180deg, transparent 46%, ${INK} 74%)`
        }
      }
    )) : h(React.Fragment, null, h(
      "div",
      {
        style: {
          position: "absolute",
          left: 56,
          right: 56,
          top: 414,
          height: i === 3 ? 335 : 346,
          clipPath: "polygon(22px 0,100% 0,100% calc(100% - 22px),calc(100% - 22px) 100%,0 100%,0 22px)",
          borderTop: `1px solid ${LIGHT}88`,
          opacity: e,
          transform: `translateY(${(1 - e) * 22}px)`
        }
      },
      h(
        "div",
        {
          style: {
            position: "absolute",
            inset: -25,
            transform: `scale(${1.02 + clamp(age / 140) * 0.07})`
          }
        },
        h(
          World,
          {
            frame: frame + i * 13,
            colors: props,
            variant: i === 1 ? 1 : 0
          }
        )
      ),
      h(
        AbsoluteFill,
        {
          style: {
            background: "linear-gradient(180deg, transparent 70%, #091b2560)"
          }
        }
      ),
      i === 2 && h(
        "svg",
        {
          width: "160",
          height: "220",
          viewBox: "0 0 160 220",
          style: {
            position: "absolute",
            left: 224,
            top: 55,
            transform: `translateY(${Math.sin(frame / 40) * 5}px)`
          }
        },
        h(
          "path",
          {
            d: "M80 18v29M51 58l29-21 29 21v110l-29 27-29-27Z",
            fill: "#d5b88112",
            stroke: GOLD,
            strokeWidth: "3"
          }
        ),
        h("path", { d: "M67 74h26v77H67Z", fill: GOLD }),
        h("path", { d: "M45 168h70M51 57h58", stroke: GOLD, strokeWidth: "4" })
      )
    )), h(
      "div",
      {
        style: {
          position: "absolute",
          left: 56,
          top: i === 0 ? 776 : 192,
          width: 608,
          opacity: copyOpacity
        }
      },
      h(
        "div",
        {
          style: {
            color: GOLD,
            fontSize: 28,
            letterSpacing: ".14em",
            marginBottom: 24,
            opacity: e
          }
        },
        scene.eyebrow
      ),
      h(
        "div",
        {
          style: {
            fontFamily: "var(--font-display, Georgia, serif)",
            fontWeight: "var(--display-weight, 400)",
            fontSize: i === 0 ? 75 : 69,
            lineHeight: 1.03,
            letterSpacing: "var(--display-tracking, -.035em)",
            color: BONE
          }
        },
        scene.headline.split("\n").map(line)
      )
    ), i === 1 && h(
      "div",
      {
        style: {
          position: "absolute",
          left: 56,
          top: 805,
          width: 608,
          opacity: copyOpacity
        }
      },
      (scene.labels ?? []).map((label, j) => {
        const r = entrance(age, 18 + j * 12);
        return h(
          "div",
          {
            key: label,
            style: {
              borderLeft: `3px solid ${GOLD}`,
              marginBottom: 18,
              padding: "18px 22px",
              background: surface,
              color: BONE,
              fontSize: 28,
              lineHeight: 1.25,
              opacity: r,
              transform: `translateX(${(1 - r) * 28}px)`
            }
          },
          h("span", { style: { color: GOLD, marginRight: 20 } }, "\u25C7"),
          label
        );
      })
    ), i === 2 && h(
      "div",
      {
        style: {
          position: "absolute",
          left: 56,
          top: 805,
          width: 608,
          display: "flex",
          gap: 20,
          color: BONE,
          opacity: copyOpacity
        }
      },
      (scene.details ?? []).map(({ heading, body }, j) => {
        const r = entrance(age, 20 + j * 12);
        return h(
          "div",
          {
            key: heading,
            style: {
              flex: 1,
              minWidth: 0,
              padding: "24px 22px",
              borderTop: `2px solid ${GOLD}`,
              background: surface,
              opacity: clamp(r),
              transform: `translateY(${(1 - r) * 24}px)`
            }
          },
          h(
            "div",
            {
              style: {
                color: GOLD,
                fontFamily: "var(--font-display, Georgia, serif)",
                fontSize: 42,
                marginBottom: 18
              }
            },
            heading
          ),
          h("div", { style: { fontSize: 29, lineHeight: 1.3 } }, body)
        );
      })
    ), i === 3 && h(
      "div",
      {
        style: {
          position: "absolute",
          left: 56,
          top: 805,
          width: 608,
          opacity: copyOpacity
        }
      },
      h(
        "div",
        {
          style: {
            color: BONE,
            fontSize: 34,
            lineHeight: 1.3,
            marginBottom: 28,
            opacity: clamp(entrance(age, 15))
          }
        },
        scene.body
      ),
      h("div", { style: { display: "flex", gap: 16 } }, (scene.labels ?? []).map((label, j) => h(
        "div",
        {
          key: label,
          style: {
            padding: "12px 18px",
            border: `1px solid ${LIGHT}66`,
            color: LIGHT,
            fontSize: 28,
            opacity: clamp(entrance(age, 24 + j * 8))
          }
        },
        label
      )))
    ), h(
      "div",
      {
        style: {
          position: "absolute",
          left: 56,
          top: 55,
          right: 56,
          display: "flex",
          alignItems: "center",
          gap: 22,
          color: BONE
        }
      },
      h(
        "span",
        {
          style: {
            fontFamily: "var(--font-display, Georgia, serif)",
            fontSize: 34,
            letterSpacing: ".16em"
          }
        },
        brand
      ),
      h("span", { style: { flex: 1, height: 1, background: "#eee8d740" } }),
      h("span", { style: { color: GOLD } }, "\u25C7")
    ));
  };
  const iris = next === 0 || next === 2;
  const clip = iris ? `circle(${p * 1550}px at 360px 565px)` : `inset(${(1 - p) * 1280}px 0 0 0)`;
  return h(
    AbsoluteFill,
    {
      style: {
        background: INK,
        overflow: "hidden",
        fontFamily: "var(--font-text, Arial, sans-serif)"
      }
    },
    h(
      "div",
      {
        style: {
          position: "absolute",
          width: 720,
          height: 1280,
          transform: `scale(${width / 720}, ${height / 1280})`,
          transformOrigin: "top left"
        }
      },
      h(
        AbsoluteFill,
        {
          style: { filter: p ? `brightness(${1 - p * 0.18})` : void 0 }
        },
        render(index)
      ),
      p > 0 && h(AbsoluteFill, { style: { clipPath: clip } }, render(next)),
      !iris && p > 0 && h(
        "div",
        {
          style: {
            position: "absolute",
            left: 0,
            top: (1 - p) * 1280,
            width: 720,
            height: 2,
            background: GOLD,
            opacity: Math.sin(p * Math.PI)
          }
        }
      ),
      h(
        "a",
        {
          href: ctaHref,
          style: {
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
            clipPath: "polygon(12px 0,100% 0,100% calc(100% - 12px),calc(100% - 12px) 100%,0 100%,0 12px)"
          }
        },
        ctaLabel,
        h("span", { "aria-hidden": "true" }, "\u2197")
      ),
      h(
        "div",
        {
          style: {
            position: "absolute",
            width: "100%",
            bottom: 30,
            textAlign: "center",
            color: "#aec3c0",
            fontSize: 22,
            letterSpacing: ".09em"
          }
        },
        "ORIGINAL VECTOR WORLD \xB7 MOTION STUDY"
      )
    )
  );
};

MotionAds.mount(Ad, window.motionAd);
})();
