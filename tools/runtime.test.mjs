import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { JSDOM, VirtualConsole } from "jsdom";

const skill = resolve("skills/motion-ads");
const helper = join(skill, "scripts/project.sh");
const runtime = join(skill, "assets/runtime/motion-runtime.js");

test("a ready runtime and shell-only project helper ship with the skill", () => {
  assert.ok(existsSync(runtime), "expected a prebuilt browser runtime");
  assert.ok(existsSync(helper), "expected a shell-only project helper");
});

test("new projects and complete examples need no project build or installer", (t) => {
  const temp = mkdtempSync(join(tmpdir(), "motion-prebuilt-test-"));
  t.after(() => rmSync(temp, { recursive: true, force: true }));
  for (const example of ["bright", "atmospheric", "single-stage"]) {
    const out = join(temp, example);
    const init = spawnSync(
      "/bin/bash",
      [helper, "init", out, "--example", example],
      { encoding: "utf8" },
    );
    assert.equal(init.status, 0, init.stderr);
    for (const file of [
      "index.html",
      "config.js",
      "ad.js",
      "runtime.js",
      "styles.css",
    ])
      assert.ok(existsSync(join(out, "dist", file)), file);
    assert.equal(existsSync(join(out, "package.json")), false);
    assert.equal(existsSync(join(out, "node_modules")), false);
    assert.equal(
      readFileSync(join(out, "dist/runtime.js"), "utf8"),
      readFileSync(runtime, "utf8"),
    );
    const check = spawnSync("/bin/bash", [helper, "check", out], {
      encoding: "utf8",
    });
    assert.equal(check.status, 0, check.stderr);
    assert.notEqual(
      spawnSync("/bin/bash", [helper, "init", out], { encoding: "utf8" })
        .status,
      0,
    );
  }
});

function page(t, props, extra = "") {
  const virtualConsole = new VirtualConsole();
  const errors = [];
  const warnings = [];
  virtualConsole.on("error", (error) => errors.push(error));
  virtualConsole.on("warn", (warning) => warnings.push(warning));
  const dom = new JSDOM(
    readFileSync(join(skill, "assets/player-template/index.html"), "utf8"),
    {
      url: "https://unit.invalid/story/index.html" + extra,
      runScripts: "outside-only",
      pretendToBeVisual: true,
      virtualConsole,
    },
  );
  t.after(() => dom.window.close());
  const listeners = new Set();
  const media = {
    matches: false,
    addEventListener: (type, fn) => listeners.add(fn),
    removeEventListener: (type, fn) => listeners.delete(fn),
  };
  dom.window.matchMedia = () => media;
  dom.window.ResizeObserver = class {
    observe() {}
    disconnect() {}
    unobserve() {}
  };
  Object.defineProperty(dom.window.document, "fonts", { value: new Set() });
  dom.window.Image = class {
    decode() {
      return Promise.resolve();
    }
  };
  dom.window.eval(readFileSync(runtime, "utf8"));
  dom.window.motionAd = props;
  return {
    dom,
    errors,
    warnings,
    setReduced(value) {
      media.matches = value;
      for (const fn of listeners) fn();
    },
  };
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const exampleConfig = (name) => {
  const dom = new JSDOM("", { runScripts: "outside-only" });
  dom.window.eval(
    readFileSync(join(skill, "assets/examples", name, "config.js"), "utf8"),
  );
  const props = JSON.parse(JSON.stringify(dom.window.motionAd));
  dom.window.close();
  return props;
};
test("the standalone runtime exposes real Remotion and renders the editable references", async (t) => {
  for (const name of ["bright", "atmospheric", "single-stage"]) {
    const { dom, errors } = page(t, exampleConfig(name), "?frame=100");
    assert.equal(
      typeof dom.window.MotionAds.Remotion.useCurrentFrame,
      "function",
    );
    assert.equal(dom.window.process, undefined);
    assert.equal(dom.window.require, undefined);
    dom.window.eval(
      readFileSync(join(skill, "assets/examples", name, "ad.js"), "utf8"),
    );
    await delay(120);
    assert.ok(
      dom.window.document.querySelector("#motion-stage svg"),
      "real React SVG composition",
    );
    assert.ok(
      dom.window.document.querySelector('#motion-stage a[href="#details"]'),
      "semantic action",
    );
    assert.equal(
      dom.window.document.querySelector("#motion-stage").dataset.frame,
      "100",
    );
    assert.equal(errors.length, 0, errors.map(String).join("\n"));
  }
});
test("Player advances, pauses for live reduced motion and resumes", async (t) => {
  const { dom, setReduced, errors } = page(t, exampleConfig("bright"));
  dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(300);
  const stage = dom.window.document.querySelector("#motion-stage");
  assert.ok(Number(stage.dataset.frame) > 0, "Player timeline advances");
  setReduced(true);
  await delay(80);
  assert.equal(stage.dataset.state, "paused");
  assert.equal(stage.dataset.frame, "0");
  await delay(100);
  assert.equal(stage.dataset.frame, "0");
  setReduced(false);
  await delay(180);
  assert.ok(Number(stage.dataset.frame) > 0);
  assert.equal(errors.length, 0, errors.map(String).join("\n"));
});
test("invalid configuration and mount-time composition errors retain readable failures", async (t) => {
  for (const broken of ["config", "component"]) {
    const props = exampleConfig("bright");
    if (broken === "config") props.ctaHref = "javascript:alert(1)";
    const { dom } = page(t, props);
    if (broken === "config")
      dom.window.eval(
        readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
      );
    else
      dom.window.eval(
        'MotionAds.mount(function Broken(){throw Error("fixture component failure")},window.motionAd)',
      );
    await delay(100);
    assert.ok(
      dom.window.document.querySelector('[data-state="error"]'),
      "error state is visible",
    );
    assert.ok(
      dom.window.document.querySelector("#app").textContent.length > 20,
    );
  }
});

test("initialization, checks and edits work inside a virtual shell with no Node", async () => {
  const { Bash } = await import("just-bash");
  const fs = await import("node:fs");
  const files = {};
  for (const name of fs
    .readdirSync(skill, { recursive: true })
    .filter((f) => fs.statSync(join(skill, f)).isFile())) {
    files["/skills/motion-ads/" + name] = readFileSync(
      join(skill, name),
      "utf8",
    );
  }
  const shell = new Bash({ files, cwd: "/workspace" });
  assert.notEqual((await shell.exec("node --version")).exitCode, 0);
  const initialized = await shell.exec(
    "bash /skills/motion-ads/scripts/project.sh init /workspace/study --example single-stage",
  );
  assert.equal(initialized.exitCode, 0, initialized.stderr);
  const checked = await shell.exec(
    "bash /skills/motion-ads/scripts/project.sh check /workspace/study",
  );
  assert.equal(checked.exitCode, 0, checked.stderr);
  assert.equal(
    await shell.fs.readFile("/workspace/study/dist/runtime.js"),
    readFileSync(runtime, "utf8"),
  );
  const edited = await shell.exec(
    "printf '\\n// edited in shared files\\n' >> /workspace/study/dist/ad.js",
  );
  assert.equal(edited.exitCode, 0, edited.stderr);
  assert.match(
    await shell.fs.readFile("/workspace/study/dist/ad.js"),
    /edited in shared files/,
  );
  assert.notEqual(
    (
      await shell.exec(
        "bash /skills/motion-ads/scripts/project.sh init /workspace/study",
      )
    ).exitCode,
    0,
  );
});

test("inspection rejects out-of-range frame requests and preserves valid frames under reduced motion", async (t) => {
  const invalid = page(t, exampleConfig("bright"), "?frame=99999");
  invalid.dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(80);
  assert.equal(
    invalid.dom.window.document.querySelector("#app").dataset.state,
    "error",
  );
  const valid = page(t, exampleConfig("bright"), "?frame=100");
  valid.setReduced(true);
  valid.dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(100);
  assert.equal(
    valid.dom.window.document.querySelector("#motion-stage").dataset.frame,
    "100",
  );
});

test("asset URL guards reject escapes and missing images retain a usable fallback", async (t) => {
  const env = page(t, exampleConfig("bright"));
  for (const asset of [
    "https://example.org/image.jpg",
    "../outside.png",
    "%2e%2e/outside.png",
    "/outside.png",
  ]) {
    assert.throws(() =>
      env.dom.window.MotionAds.validate({
        ...env.dom.window.motionAd,
        assets: [asset],
      }),
    );
  }
  env.dom.window.motionAd.assets = ["./assets/missing.png"];
  env.dom.window.Image = class {
    decode() {
      return Promise.reject(Error("fixture missing image"));
    }
  };
  env.dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(100);
  assert.equal(
    env.dom.window.document.querySelector("#motion-stage").dataset.state,
    "error",
  );
  assert.equal(
    env.dom.window.document
      .querySelector("#motion-stage a")
      .getAttribute("href"),
    "#details",
  );
});

test("a failed ad script load becomes a readable startup error", (t) => {
  const { dom } = page(t, exampleConfig("bright"));
  const script = dom.window.document.createElement("script");
  script.src = "./ad.js";
  dom.window.document.body.append(script);
  script.dispatchEvent(new dom.window.Event("error", { bubbles: false }));
  assert.equal(
    dom.window.document.querySelector("#app").dataset.state,
    "error",
  );
  assert.match(
    dom.window.document.querySelector("#app").textContent,
    /script|resource/i,
  );
});

test("a later mount preserves the first startup script error", (t) => {
  const { dom } = page(t, undefined);
  dom.window.dispatchEvent(
    new dom.window.ErrorEvent("error", {
      message: "SyntaxError: fixture config.js could not parse",
      filename: "config.js",
    }),
  );
  dom.window.MotionAds.mount(() => null, dom.window.motionAd);
  assert.match(
    dom.window.document.querySelector("#app").textContent,
    /SyntaxError: fixture config\.js could not parse/,
  );
});

test("unrelated startup errors do not prevent a valid Player from mounting", async (t) => {
  for (const source of ["./analytics.js", "https://third-party.invalid/ad.js", ""]) {
    const { dom, errors } = page(t, exampleConfig("bright"));
    dom.window.dispatchEvent(new dom.window.ErrorEvent("error", {
      message: "fixture optional script failure",
      filename: source,
    }));
    const script = dom.window.document.createElement("script");
    script.src = source || "./optional.js";
    dom.window.document.body.append(script);
    script.dispatchEvent(new dom.window.Event("error"));
    dom.window.eval(
      readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
    );
    await delay(100);
    assert.equal(
      dom.window.document.querySelector("#motion-stage")?.dataset.state,
      "playing",
      `unrelated source must not block playback: ${source || "unattributed"}`,
    );
    assert.equal(errors.length, 0);
  }
});

test("core script failures retain the ad's first cause after unrelated errors", (t) => {
  for (const file of ["runtime.js", "config.js", "ad.js"]) {
    for (const kind of ["exception", "load"]) {
      const { dom } = page(t, exampleConfig("bright"));
      dom.window.dispatchEvent(new dom.window.ErrorEvent("error", {
        message: "fixture analytics error",
        filename: "./analytics.js",
      }));
      const source = new URL(`./${file}?v=2#test`, dom.window.document.baseURI).href;
      if (kind === "exception")
        dom.window.dispatchEvent(new dom.window.ErrorEvent("error", {
          message: `fixture ${file} failure`,
          filename: source,
        }));
      else {
        const script = dom.window.document.createElement("script");
        script.src = source;
        dom.window.document.body.append(script);
        script.dispatchEvent(new dom.window.Event("error"));
      }
      const mounted = dom.window.MotionAds.mount(() => null, undefined);
      const root = dom.window.document.querySelector("#app");
      assert.equal(mounted, null);
      assert.equal(root.dataset.state, "error");
      assert.equal(root.textContent.includes("analytics"), false);
      assert.ok(root.textContent.includes(kind === "exception" ? `${file} failure` : "script could not load"));
      assert.equal(root.textContent.includes("Provide a motionAd configuration"), false);
    }
  }
});

test("a muted file:// script error still ends loading with a readable failure", (t) => {
  const { dom } = page(t, exampleConfig("bright"));
  dom.window.dispatchEvent(
    new dom.window.ErrorEvent("error", { message: "Script error.", filename: "" }),
  );
  dom.window.dispatchEvent(new dom.window.Event("load"));
  const root = dom.window.document.querySelector("#app");
  assert.equal(root.dataset.state, "error");
  assert.match(root.textContent, /did not start/);
});

test("missing and malformed action destinations name the invalid field", (t) => {
  const { dom } = page(t, exampleConfig("bright"));
  for (const ctaHref of [undefined, null, "", " ", "bad-url", "#missing"])
    assert.throws(
      () => dom.window.MotionAds.validate({ ...dom.window.motionAd, ctaHref }),
      /ctaHref/,
    );
});

test("a failed font permits playback with an observable typography warning", async (t) => {
  const { dom, errors, warnings } = page(t, exampleConfig("bright"));
  dom.window.document.fonts.add({
    load: () => Promise.reject(Error("fixture font could not load")),
  });
  dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(150);
  const stage = dom.window.document.querySelector("#motion-stage");
  assert.equal(stage.dataset.state, "playing");
  assert.equal(stage.dataset.fonts, "fallback");
  assert.ok(Number(stage.dataset.frame) > 0);
  assert.match(warnings.join("\n"), /fallback.*typography/i);
  assert.equal(errors.length, 0);
});

test("playback waits for pending fonts and marks successful loading", async (t) => {
  const { dom } = page(t, exampleConfig("bright"));
  let finish;
  dom.window.document.fonts.add({
    load: () => new Promise((resolve) => { finish = resolve; }),
  });
  dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(50);
  const stage = dom.window.document.querySelector("#motion-stage");
  assert.equal(stage.dataset.state, "loading");
  finish();
  await delay(100);
  assert.equal(stage.dataset.state, "playing");
  assert.equal(stage.dataset.fonts, "ready");
});

test("all studies apply configured theme roles inside the composition", async (t) => {
  const theme = {
    bg: "#123456",
    surface: "#234567",
    text: "#eeeeee",
    accent: "#abcdef",
  };
  for (const name of ["bright", "atmospheric", "single-stage"]) {
    const { dom } = page(t, { ...exampleConfig(name), ...theme }, "?frame=160");
    dom.window.eval(
      readFileSync(join(skill, "assets/examples", name, "ad.js"), "utf8"),
    );
    await delay(120);
    const stage = dom.window.document.querySelector("#motion-stage");
    const colors = [...stage.querySelectorAll("*")].flatMap(({ style }) =>
      style ? [style.backgroundColor, style.color, style.borderTopColor] : [],
    );
    for (const [role, value] of Object.entries(theme)) {
      const probe = dom.window.document.createElement("div");
      probe.style.color = value;
      assert.ok(
        colors.includes(probe.style.color),
        `${name}: ${role} reaches a rendered composition layer`,
      );
    }
  }
});

test("the starter has one page heading and actions stay outside hidden visuals", async (t) => {
  for (const dir of ["player-template", "examples/bright", "examples/atmospheric", "examples/single-stage"]) {
    const name = dir === "player-template" ? "bright" : dir.slice("examples/".length);
    const { dom } = page(t, exampleConfig(name), "?frame=100");
    dom.window.eval(readFileSync(join(skill, "assets", dir, "ad.js"), "utf8"));
    await delay(100);
    assert.equal(dom.window.document.querySelectorAll("h1").length, 1);
    const action = dom.window.document.querySelector(
      '#motion-stage a[href="#details"]',
    );
    assert.ok(action);
    assert.equal(action.closest('[aria-hidden="true"]'), null);
    assert.ok(
      dom.window.document.querySelector('#motion-stage [aria-hidden="true"]'),
    );
    assert.ok(dom.window.document.querySelector("#page-description").textContent);
  }
});

test("editable published references contain no compiler purity annotations", () => {
  for (const dir of ["player-template", "examples/bright", "examples/atmospheric", "examples/single-stage"])
    assert.equal(
      readFileSync(join(skill, "assets", dir, "ad.js"), "utf8").includes("@__PURE__"),
      false,
      `${dir}: editable references should omit compiler annotations`,
    );
});

test("functional theme colors keep unique, valid SVG gradient references", async (t) => {
  const props = { ...exampleConfig("bright"), bg: "rgb(243, 200, 75)" };
  const { dom } = page(t, props, "?frame=265");
  dom.window.eval(
    readFileSync(join(skill, "assets/examples/bright/ad.js"), "utf8"),
  );
  await delay(120);
  const gradients = [...dom.window.document.querySelectorAll("linearGradient")];
  assert.equal(gradients.length, 3);
  assert.equal(new Set(gradients.map(({ id }) => id)).size, 3);
  for (const gradient of gradients) {
    assert.match(gradient.id, /^[a-zA-Z][a-zA-Z0-9_-]*$/);
    assert.ok(
      [...gradient.closest("svg").querySelectorAll("[fill]")].some(
        (node) => node.getAttribute("fill") === `url(#${gradient.id})`,
      ),
      "each illustration references its own gradient",
    );
  }
});

test("all compositions expose shared typography roles without losing study fallbacks", async (t) => {
  for (const [dir, textFallback, displayFallback] of [
    ["player-template", "Arial, sans-serif", "Arial, sans-serif"],
    ["examples/bright", "Arial, Helvetica, sans-serif", "Arial, Helvetica, sans-serif"],
    ["examples/atmospheric", "Arial, sans-serif", "Georgia, serif"],
    ["examples/single-stage", "Arial, sans-serif", "Georgia, serif"],
  ]) {
    const name = dir === "player-template" ? "bright" : dir.slice("examples/".length);
    const { dom, errors } = page(t, exampleConfig(name), name === "single-stage" ? "?frame=120" : "?frame=265");
    dom.window.eval(readFileSync(join(skill, "assets", dir, "ad.js"), "utf8"));
    await delay(100);
    const stage = dom.window.document.querySelector("#motion-stage");
    const families = [...stage.querySelectorAll("[style]")]
      .map(({ style }) => style.fontFamily)
      .filter(Boolean);
    assert.ok(families.includes(`var(--font-text, ${textFallback})`), `${dir}: reading role`);
    assert.ok(families.some((family) => family.startsWith("var(--font-display,")), `${dir}: display role`);
    assert.ok(families.some((family) => family.includes(displayFallback)), `${dir}: default family retained`);
    assert.ok(families.every((family) => family.startsWith("var(--font-")), `${dir}: no hardcoded family overrides the roles`);
    const headline = [...stage.querySelectorAll("[style]")].find(
      ({ style }) => style.fontWeight.startsWith("var(--display-weight,"),
    );
    assert.ok(headline, `${dir}: configurable headline weight`);
    assert.ok(headline.style.letterSpacing.startsWith("var(--display-tracking,"));
    assert.equal(errors.length, 0, errors.map(String).join("\n"));
  }
});

test("single-stage aligns two views of one subject while local information changes on a fixed stage", async (t) => {
  const props = exampleConfig("single-stage");
  const total = props.fps * props.durationSeconds;
  const frames = [0, 1, 60, 120, 180, total - 2, total - 1];
  const shots = [];
  for (const frame of frames) {
    const { dom, errors } = page(t, props, `?frame=${frame}`);
    dom.window.eval(readFileSync(join(skill, "assets/examples/single-stage/ad.js"), "utf8"));
    await delay(100);
    const stage = dom.window.document.querySelector("#motion-stage");
    assert.equal(stage.dataset.state, "paused");
    const headline = [...stage.querySelectorAll("[style]")].find(
      ({ style }) => style.fontWeight.startsWith("var(--display-weight,"),
    );
    const inside = stage.querySelector('svg[aria-label="Unwrapped botanical blend"]');
    const outside = stage.querySelector('svg[aria-label="Wrapped botanical pouch"]');
    assert.ok(inside && outside, "two representations of the same subject are present");
    assert.equal(inside.parentElement.style.cssText, outside.parentElement.style.cssText, "both views share the same position, size and motion");
    const masks = [inside, outside].map((view) => view.parentElement.parentElement.style.clipPath);
    const plane = stage.querySelector('a[href="#details"]').parentElement;
    const localValues = props.scenes[0].details.flatMap(({ heading, body }) => [heading, body]);
    const active = [...plane.querySelectorAll("div")].filter((node) => {
      if (node.children.length || !localValues.includes(node.textContent)) return false;
      let alpha = 1;
      for (let n = node; n && n !== plane.parentElement; n = n.parentElement)
        if (n.style.opacity !== "") alpha *= Number(n.style.opacity);
      return alpha > 0.01;
    }).map((node) => node.textContent);
    for (const key of ["heading", "body"])
      assert.ok(active.filter((value) => props.scenes[0].details.some((detail) => detail[key] === value)).length <= 1, "each information slot hands over without competing text");
    assert.deepEqual(errors, []);
    shots.push({
      copy: headline.outerHTML,
      action: stage.querySelector('a[href="#details"]').outerHTML,
      motion: inside.parentElement.style.transform,
      masks,
      active,
    });
  }
  for (const shot of shots) {
    assert.equal(shot.copy, shots[0].copy, "headline stays readable in the same place");
    assert.equal(shot.action, shots[0].action, "action stays in the same place");
    assert.deepEqual(shot.masks, shots[0].masks, "the split stays fixed while the subject moves");
  }
  assert.ok(shots[0].masks.every(Boolean) && shots[0].masks[0] !== shots[0].masks[1], "the views occupy complementary regions");
  assert.notEqual(shots[2].motion, shots[0].motion, "the subject actually moves across the split");
  assert.ok(new Set(shots.flatMap(({ active }) => active)).size >= 6, "local information develops through three pairs");
  const numbers = (value) => value.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g).map(Number);
  const first = numbers(shots[0].motion), second = numbers(shots[1].motion), last = numbers(shots.at(-1).motion);
  assert.equal(first.length, last.length);
  first.forEach((value, i) => assert.ok(Math.abs((value - last[i]) - (second[i] - value)) < 0.1, "loop displacement follows normal movement instead of resetting"));
});
