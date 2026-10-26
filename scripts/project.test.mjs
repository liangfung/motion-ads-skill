import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
  existsSync,
  cpSync,
  symlinkSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import vm from "node:vm";

const skill = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const cli = join(skill, "scripts/project.mjs");
const run = (...args) =>
  spawnSync(process.execPath, [cli, ...args], {
    encoding: "utf8",
    cwd: tmpdir(),
  });
const temporary = (t) => {
  const path = mkdtempSync(join(tmpdir(), "motion-ads-test-"));
  t.after(() => rmSync(path, { recursive: true, force: true }));
  return path;
};

// Set REMOTION_TEST_PROJECT to a rendered working project to run media/package integration too.
// Protocol stub for command tests; real browser/media integration is checked separately.
function browserStub(out, source = 'exports.ensureBrowser = async options => ({path: options.browserExecutable || process.execPath});') {
  const module = join(out, "hero-video/node_modules/@remotion/renderer");
  mkdirSync(module, { recursive: true });
  writeFileSync(join(module, "package.json"), JSON.stringify({ name: "@remotion/renderer", main: "index.cjs" }));
  writeFileSync(join(module, "index.cjs"), source);
}

test("init works outside the skill directory and never overwrites an existing project", (t) => {
  const out = join(temporary(t), "a product");
  assert.equal(run("init", out).status, 0);
  const props = JSON.parse(readFileSync(join(out, "hero-video/props.json")));
  assert.equal(props.presentation, "ad");
  assert.equal(props.width / props.height, 9 / 16);
  assert.ok(props.scenes.length >= 3);
  assert.ok(
    readFileSync(join(out, "index.html"), "utf8").includes('id="hero-video"'),
  );
  writeFileSync(join(out, "index.html"), "user edits");
  assert.notEqual(run("init", out).status, 0);
  assert.equal(readFileSync(join(out, "index.html"), "utf8"), "user edits");
});

test("explicit landing uses a wide narrative video, while endcard remains a card alias", (t) => {
  const base = temporary(t);
  for (const layout of ["landing", "card", "endcard"]) {
    const out = join(base, layout);
    assert.equal(run("init", out, "--layout", layout).status, 0);
    const props = JSON.parse(readFileSync(join(out, "hero-video/props.json")));
    assert.equal(props.presentation, "ad");
    assert.equal(props.width > props.height, layout === "landing");
    assert.equal(
      JSON.parse(readFileSync(join(out, "brief.json"))).layout,
      layout === "endcard" ? "card" : layout,
    );
  }
});

test("init offers two runnable portrait examples without changing the default scaffold", (t) => {
  const base = temporary(t);
  for (const example of ["single-stage", "story"]) {
    const out = join(base, example);
    const result = run("init", out, "--example", example);
    assert.equal(result.status, 0, result.stderr);
    const props = JSON.parse(readFileSync(join(out, "hero-video/props.json")));
    assert.equal(props.presentation, "ad");
    assert.equal(props.width / props.height, 9 / 16);
    assert.ok(props.qaFrames.length > 6);
    assert.ok(existsSync(join(out, "hero-video/src/Ad.tsx")));
    assert.equal(JSON.parse(readFileSync(join(out, "brief.json"))).example, example);
  }
  const invalid = join(base, "invalid");
  assert.notEqual(run("init", invalid, "--example", "unknown").status, 0);
  assert.equal(existsSync(invalid), false);
});

test("stills honors authored hold and transition frames for unequal scene timing", (t) => {
  const out = join(temporary(t), "timed-ad");
  assert.equal(run("init", out).status, 0);
  const module = join(out, "hero-video/node_modules/@remotion/cli");
  mkdirSync(module, { recursive: true });
  writeFileSync(join(module, "package.json"), JSON.stringify({ name: "@remotion/cli", bin: "bin.cjs" }));
  writeFileSync(join(module, "bin.cjs"), 'require("node:fs").appendFileSync("frames.jsonl", JSON.stringify(process.argv.slice(2))+"\\n");');
  browserStub(out);
  const path = join(out, "hero-video/props.json");
  const props = JSON.parse(readFileSync(path));
  props.qaFrames = [39, 47, 56, 143, 151, 169];
  writeFileSync(path, JSON.stringify(props));
  mkdirSync(join(out, "qa"));
  writeFileSync(join(out, "qa/hero-999.jpg"), "previous render sample");
  writeFileSync(join(out, "qa/browser.jpg"), "browser evidence");
  writeFileSync(join(out, "qa/review.md"), "review notes");
  assert.equal(run("stills", out).status, 0);
  assert.equal(existsSync(join(out, "qa/hero-999.jpg")), false);
  assert.equal(readFileSync(join(out, "qa/browser.jpg"), "utf8"), "browser evidence");
  assert.equal(readFileSync(join(out, "qa/review.md"), "utf8"), "review notes");
  const frames = readFileSync(join(out, "hero-video/frames.jsonl"), "utf8").trim().split("\n").map(line =>
    Number(JSON.parse(line).find(arg => arg.startsWith("--frame=")).split("=")[1]));
  assert.deepEqual(frames, [0, 39, 47, 56, 143, 151, 169, 180, 359]);
  writeFileSync(join(out, "qa/hero-39.jpg"), "current sample");
  writeFileSync(path, JSON.stringify({ ...props, qaFrames: [360] }));
  const invalid = run("stills", out);
  assert.notEqual(invalid.status, 0);
  assert.match(invalid.stderr, /qaFrames/);
  assert.equal(readFileSync(join(out, "qa/hero-39.jpg"), "utf8"), "current sample");
});

test("stills samples every narrative scene and both sides of cuts", (t) => {
  const out = join(temporary(t), "ad");
  assert.equal(run("init", out).status, 0);
  const module = join(out, "hero-video/node_modules/@remotion/cli");
  mkdirSync(module, { recursive: true });
  writeFileSync(
    join(module, "package.json"),
    JSON.stringify({ name: "@remotion/cli", bin: "bin.cjs" }),
  );
  writeFileSync(
    join(module, "bin.cjs"),
    'require("node:fs").appendFileSync("frames.jsonl", JSON.stringify(process.argv.slice(2))+"\\n");',
  );
  browserStub(out);
  const propsPath = join(out, "hero-video/props.json");
  const props = JSON.parse(readFileSync(propsPath));
  props.durationSeconds = 12;
  props.width = 1200;
  props.height = 720;
  props.scenes = Array.from({ length: 4 }, () => ({
    headline: "A sourced benefit",
    labels: ["First detail", "Second detail", "Third detail"],
  }));
  writeFileSync(propsPath, JSON.stringify(props));
  assert.equal(run("stills", out).status, 0);
  const frames = readFileSync(join(out, "hero-video/frames.jsonl"), "utf8")
    .trim()
    .split("\n")
    .map((line) =>
      Number(
        JSON.parse(line)
          .find((arg) => arg.startsWith("--frame="))
          .split("=")[1],
      ),
    );
  for (const [start, end] of [
    [0, 89],
    [90, 179],
    [180, 269],
    [270, 359],
  ])
    assert.ok(frames.some((frame) => frame > start + 8 && frame < end));
  for (const cut of [90, 180, 270])
    assert.ok(frames.includes(cut - 1) && frames.includes(cut));
  for (let start = 0; start < 360; start += 30)
    assert.ok(
      frames.some((frame) => frame > start + 8 && frame < start + 30),
      `Missing readable label hold after frame ${start}`,
    );
  assert.ok(frames.includes(348) && frames.includes(354), "sample the default ad's closing dissolve as well as its endpoint");
});

test("render resolves an environment browser and preserves explicit paths with spaces", (t) => {
  const out = join(temporary(t), "browser selection");
  assert.equal(run("init", out).status, 0);
  const module = join(out, "hero-video/node_modules/@remotion/cli");
  mkdirSync(module, { recursive: true });
  writeFileSync(join(module, "package.json"), JSON.stringify({ name: "@remotion/cli", bin: "bin.cjs" }));
  writeFileSync(join(module, "bin.cjs"), 'require("node:fs").appendFileSync("calls.jsonl", JSON.stringify(process.argv.slice(2))+"\\n");');
  browserStub(out, 'exports.ensureBrowser = async options => { require("node:fs").writeFileSync("selected-browser.txt", options.browserExecutable); return {path: options.browserExecutable}; };');
  const envBrowser = join(temporary(t), "provided Chrome");
  const explicitBrowser = join(temporary(t), "chosen Chrome");
  for (const path of [envBrowser, explicitBrowser]) writeFileSync(path, "fixture");
  for (const flags of [[], [`--browser-executable=${explicitBrowser}`], ["--browser-executable", explicitBrowser]]) {
    const result = spawnSync(process.execPath, [cli, "render", out, ...flags], {
      cwd: tmpdir(), encoding: "utf8", env: { ...process.env, REMOTION_BROWSER_EXECUTABLE: envBrowser },
    });
    assert.equal(result.status, 0, result.stderr);
    const selected = flags.length ? explicitBrowser : envBrowser;
    assert.equal(readFileSync(join(out, "hero-video/selected-browser.txt"), "utf8"), selected);
    const calls = readFileSync(join(out, "hero-video/calls.jsonl"), "utf8").trim().split("\n").slice(-2).map(JSON.parse);
    for (const args of calls) {
      assert.ok(args.includes(`--browser-executable=${selected}`));
      assert.equal(args.filter(arg => arg === "--browser-executable" || arg.startsWith("--browser-executable=")).length, 1);
    }
  }
});

test("a required browser download stops before invoking the Remotion CLI", (t) => {
  const out = join(temporary(t), "no browser");
  assert.equal(run("init", out).status, 0);
  const module = join(out, "hero-video/node_modules/@remotion/cli");
  mkdirSync(module, { recursive: true });
  writeFileSync(join(module, "package.json"), JSON.stringify({ name: "@remotion/cli", bin: "bin.cjs" }));
  writeFileSync(join(module, "bin.cjs"), 'require("node:fs").writeFileSync("cli-invoked", "unexpected");');
  browserStub(out, 'exports.ensureBrowser = async options => { options.onBrowserDownload({chromeMode: "headless-shell"}); throw new Error("Download callback did not stop the operation"); };');
  for (const command of ["stills", "render"]) {
    const result = run(command, out);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /Automatic browser download is disabled/);
    assert.equal(existsSync(join(out, "hero-video/cli-invoked")), false);
  }
});

test("init validates layout before creating anything", (t) => {
  const out = join(temporary(t), "missing");
  const result = run("init", out, "--layout", "unknown");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /layout/);
  assert.equal(existsSync(out), false);
});

test("init reports a missing example value without creating the project", (t) => {
  const out = join(temporary(t), "missing-example");
  const result = run("init", out, "--example");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /--example.*(?:value|requires)/);
  assert.equal(existsSync(out), false);
});

test("verify probes and decodes real media, rejects ftyp-only files and mismatched dimensions", {
  skip: !process.env.REMOTION_TEST_PROJECT,
}, (t) => {
  const out = delivery(t);
  const fixture = process.env.REMOTION_TEST_PROJECT;
  symlinkSync(join(fixture, "hero-video/node_modules"), join(out, "hero-video/node_modules"), "dir");
  cpSync(join(fixture, "hero-video/props.json"), join(out, "hero-video/props.json"));
  const fake = run("verify", out);
  assert.notEqual(fake.status, 0);
  assert.match(fake.stderr, /ffprobe verification failed/);
  for (const file of ["hero.mp4", "poster.jpg", "hero-video/props.json"])
    cpSync(join(fixture, file), join(out, file));
  const valid = run("verify", out);
  assert.equal(valid.status, 0, valid.stderr);
  const report = JSON.parse(readFileSync(join(out, "qa/media-check.json")));
  assert.equal(report.fullDecode, "passed");
  assert.equal(report.pixelFormat, "yuv420p");
  assert.equal(report.sha256["hero.mp4"].length, 64);
  const htmlPath = join(out, "index.html");
  const html = readFileSync(htmlPath, "utf8");
  writeFileSync(join(out, "assets/current.mp4"), Buffer.from([0, 0, 0, 24, ...Buffer.from("ftypisom")]));
  writeFileSync(htmlPath, html.replace('src="hero.mp4"', 'src="assets/current.mp4"'));
  assert.notEqual(run("verify", out).status, 0, "verify must inspect the video referenced by the HTML, not a stale hero.mp4");
  cpSync(join(fixture, "hero.mp4"), join(out, "assets/current.mp4"));
  assert.equal(run("verify", out).status, 0);
  const referenced = JSON.parse(readFileSync(join(out, "qa/media-check.json")));
  assert.equal(referenced.sha256["assets/current.mp4"].length, 64);
  const encodedVideo = "assets/my hero #1 %.mp4";
  const encodedPoster = "assets/my poster #1 %.jpg";
  cpSync(join(fixture, "hero.mp4"), join(out, encodedVideo));
  cpSync(join(fixture, "poster.jpg"), join(out, encodedPoster));
  const url = path => path.split("/").map(encodeURIComponent).join("/");
  writeFileSync(htmlPath, html.replace('src="hero.mp4"', `src="${url(encodedVideo)}?v=1"`).replace('poster="poster.jpg"', `poster="${url(encodedPoster)}"`));
  const packaged = run("package", out);
  assert.equal(packaged.status, 0, packaged.stderr);
  assert.ok(existsSync(join(out, "dist", encodedVideo)));
  assert.equal(run("check", join(out, "dist")).status, 0);
  writeFileSync(htmlPath, html);
  const path = join(out, "hero-video/props.json");
  const props = JSON.parse(readFileSync(path));
  writeFileSync(path, JSON.stringify({ ...props, width: props.width + 2 }));
  const mismatch = run("verify", out);
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /dimensions differ/);
  assert.equal(existsSync(join(out, "qa/media-check.json")), false);
});

test("stills reports missing Remotion dependencies rather than pretending to render", (t) => {
  const out = join(temporary(t), "product");
  assert.equal(run("init", out).status, 0);
  const result = run("stills", out);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /npm install/);
});

function delivery(t) {
  const out = temporary(t);
  mkdirSync(join(out, "assets"));
  mkdirSync(join(out, "hero-video"));
  writeFileSync(
    join(out, "index.html"),
    '<html lang="en"><title>Product</title><video id="hero-video" src="hero.mp4" poster="poster.jpg" autoplay muted loop playsinline></video><img src="assets/product.svg"><a id="cta" href="https://store.steampowered.com/app/367520/?utm_source=campaign">View on Steam</a></html>',
  );
  // Structural fixtures only: actual encoding and playback are covered by the render/browser smoke run.
  writeFileSync(
    join(out, "hero.mp4"),
    Buffer.from([0, 0, 0, 24, ...Buffer.from("ftypisom")]),
  );
  writeFileSync(join(out, "poster.jpg"), "poster fixture");
  writeFileSync(
    join(out, "assets/product.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"/>',
  );
  writeFileSync(join(out, "hero-video/private.txt"), "must not ship");
  writeFileSync(join(out, "brief.json"), '{"privateSource":"must not ship"}');
  return out;
}

function encodedDelivery(t) {
  const out = delivery(t);
  const fixture = process.env.REMOTION_TEST_PROJECT;
  symlinkSync(join(fixture, "hero-video/node_modules"), join(out, "hero-video/node_modules"), "dir");
  for (const file of ["hero.mp4", "poster.jpg", "hero-video/props.json"])
    cpSync(join(fixture, file), join(out, file));
  return out;
}

test("package rejects corrupt or mismatched media before replacing an existing delivery", {
  skip: !process.env.REMOTION_TEST_PROJECT,
}, (t) => {
  const out = encodedDelivery(t);
  const valid = run("package", out);
  assert.equal(valid.status, 0, valid.stderr);
  const delivered = readFileSync(join(out, "dist/hero.mp4"));
  const original = readFileSync(join(out, "hero.mp4"));
  writeFileSync(join(out, "hero.mp4"), Buffer.from([0, 0, 0, 24, ...Buffer.from("ftypisom")]));
  assert.equal(run("check", out).status, 0, "the fixture must still pass the structural check");
  const corrupt = run("package", out);
  assert.notEqual(corrupt.status, 0, "package must decode the actual video, even with an older successful report");
  assert.match(corrupt.stderr, /ffprobe verification failed/);
  assert.deepEqual(readFileSync(join(out, "dist/hero.mp4")), delivered);
  assert.equal(existsSync(join(out, "qa/media-check.json")), false);
  writeFileSync(join(out, "hero.mp4"), original);
  const propsPath = join(out, "hero-video/props.json");
  const props = JSON.parse(readFileSync(propsPath));
  writeFileSync(propsPath, JSON.stringify({ ...props, width: props.width + 2 }));
  const mismatch = run("package", out);
  assert.notEqual(mismatch.status, 0);
  assert.match(mismatch.stderr, /dimensions differ/);
  assert.deepEqual(readFileSync(join(out, "dist/hero.mp4")), delivered);
});

test("check fails for missing local media and preserves a supplied tracking URL", (t) => {
  const out = delivery(t);
  assert.equal(run("check", out).status, 0);
  assert.match(
    readFileSync(join(out, "index.html"), "utf8"),
    /utm_source=campaign/,
  );
  rmSync(join(out, "assets/product.svg"));
  const result = run("check", out);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /product\.svg/);
});

test("check resolves encoded media paths exactly once", (t) => {
  const out = delivery(t);
  for (const name of ["my hero #1 %.mp4", "literal%20name.mp4"]) {
    cpSync(join(out, "hero.mp4"), join(out, name));
    const html = readFileSync(join(out, "index.html"), "utf8");
    writeFileSync(join(out, "index.html"), html.replace(/src="[^"]+\.mp4(?:[^\"]*)"/, `src="./${encodeURIComponent(name)}?v=1"`));
    const result = run("check", out);
    assert.equal(result.status, 0, result.stderr);
    assert.ok(JSON.parse(result.stdout).files.includes(name));
  }
});

test("asset discovery skips hidden entries while retaining explicit hidden resource references", (t) => {
  const out = delivery(t);
  mkdirSync(join(out, "assets/.cache"));
  mkdirSync(join(out, "assets/.fonts"));
  writeFileSync(join(out, "assets/.DS_Store"), "metadata");
  writeFileSync(join(out, "assets/.cache/private.txt"), "working data");
  writeFileSync(join(out, "assets/.fonts/mark.svg"), '<svg xmlns="http://www.w3.org/2000/svg"/>');
  writeFileSync(join(out, "index.html"), readFileSync(join(out, "index.html"), "utf8") + '<img src="assets/.fonts/mark.svg">');
  const result = run("check", out);
  assert.equal(result.status, 0, result.stderr);
  const files = JSON.parse(result.stdout).files;
  assert.equal(files.includes("assets/.DS_Store"), false);
  assert.equal(files.includes("assets/.cache/private.txt"), false);
  assert.ok(files.includes("assets/.fonts/mark.svg"));
});

test("check rejects known HTML scaffold copy without scanning scripts, styles or comments", (t) => {
  const out = delivery(t);
  const original = readFileSync(join(out, "index.html"), "utf8");
  for (const extra of [
    '<meta name="description" content="Replace with the source-backed advertising message.">',
    '<p>Replace with a useful, source-backed caption, or remove.</p>',
    '<footer>Brand name</footer>',
    '<h1>Product name</h1>',
  ]) {
    writeFileSync(join(out, "index.html"), original + extra);
    assert.match(run("check", out).stderr, /placeholder/i);
  }
  writeFileSync(join(out, "index.html"), original + '<!-- Product name --><script>const example = "Product name";</script><style>/* Brand name */</style><p>Replace with confidence.</p>');
  const valid = run("check", out);
  assert.equal(valid.status, 0, valid.stderr);
});

test("working props reject scaffold branding/artwork but allow user assets and bundled studies", (t) => {
  const out = delivery(t);
  mkdirSync(join(out, "hero-video/public"));
  const art = join(out, "hero-video/public/product.svg");
  cpSync(join(skill, "assets/remotion-template/public/product.svg"), art);
  const propsPath = join(out, "hero-video/props.json");
  const props = { brand: "Acme", image: "product.svg", presentation: "ad", scenes: [{ headline: "Made for everyday use." }] };
  writeFileSync(propsPath, JSON.stringify(props));
  assert.match(run("check", out).stderr, /placeholder.*artwork/i);
  writeFileSync(art, '<svg xmlns="http://www.w3.org/2000/svg"><circle r="5"/></svg>');
  rmSync(join(out, "brief.json"));
  assert.equal(run("check", out).status, 0, "user-supplied files do not require a source URL or fixed brief schema");
  writeFileSync(propsPath, JSON.stringify({ ...props, brand: "Product name" }));
  assert.match(run("check", out).stderr, /placeholder/i);
  for (const scene of [
    { headline: "Show what makes it different." },
    { labels: ["Verified feature"] },
    { labels: ["Useful detail"] },
    { body: "End on the product, its promise, and the action." },
  ]) {
    writeFileSync(propsPath, JSON.stringify({ ...props, scenes: [scene] }));
    assert.match(run("check", out).stderr, /placeholder/i);
  }
  writeFileSync(propsPath, JSON.stringify({ ...props, scenes: [{ eyebrow: "Look closer", headline: "Make your next move", body: "Learn more" }] }));
  assert.equal(run("check", out).status, 0, "usable generic copy is not a scaffold instruction");
  for (const example of ["single-stage", "story"]) {
    const study = join(temporary(t), example);
    assert.equal(run("init", study, "--example", example).status, 0);
    for (const name of ["hero.mp4", "poster.jpg"]) cpSync(join(out, name), join(study, name));
    const result = run("check", study);
    assert.equal(result.status, 0, result.stderr);
  }
});

test("check rejects remote runtime assets, placeholder CTA, and paths outside the package", (t) => {
  const out = delivery(t);
  const original = readFileSync(join(out, "index.html"), "utf8");
  for (const [html, message] of [
    [
      original.replace(
        "assets/product.svg",
        "https://cdn.example.org/product.svg",
      ),
      /external|remote/i,
    ],
    [original.replace(/https:\/\/store[^\"]+/, "https://example.com"), /CTA/],
    [
      original.replace("assets/product.svg", "../private.svg"),
      /outside|escape/i,
    ],
  ]) {
    writeFileSync(join(out, "index.html"), html);
    const result = run("check", out);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, message);
  }
});

test("package delivers media and assets without source, dependency, brief, or research files", {
  skip: !process.env.REMOTION_TEST_PROJECT,
}, (t) => {
  const out = encodedDelivery(t);
  mkdirSync(join(out, "research"));
  writeFileSync(join(out, "research/source.html"), "working research");
  assert.equal(run("package", out).status, 0);
  assert.equal(run("check", join(out, "dist")).status, 0);
  assert.ok(existsSync(join(out, "dist/assets/product.svg")));
  assert.equal(existsSync(join(out, "dist/hero-video")), false);
  assert.equal(existsSync(join(out, "dist/brief.json")), false);
  assert.equal(existsSync(join(out, "dist/research")), false);
  assert.equal(existsSync(join(out, "dist/qa")), false);
  assert.equal(JSON.parse(readFileSync(join(out, "qa/media-check.json"))).fullDecode, "passed");
});

test("package includes responsive image candidates", {
  skip: !process.env.REMOTION_TEST_PROJECT,
}, (t) => {
  const out = encodedDelivery(t);
  writeFileSync(
    join(out, "assets/large.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"/>',
  );
  const html = readFileSync(join(out, "index.html"), "utf8").replace(
    '<img src="assets/product.svg">',
    '<img src="assets/product.svg" srcset="assets/product.svg 1x, assets/large.svg 2x">',
  );
  writeFileSync(join(out, "index.html"), html);
  assert.equal(run("package", out).status, 0);
  assert.ok(existsSync(join(out, "dist/assets/large.svg")));
});

test("package includes quoted CSS imports and rejects remote imports", {
  skip: !process.env.REMOTION_TEST_PROJECT,
}, (t) => {
  const out = encodedDelivery(t);
  const html = readFileSync(join(out, "index.html"), "utf8");
  writeFileSync(
    join(out, "index.html"),
    `${html}<link rel="stylesheet" href="assets/main.css">`,
  );
  writeFileSync(join(out, "assets/main.css"), '@import "theme.css";');
  writeFileSync(join(out, "assets/theme.css"), "body { color: black; }");
  assert.equal(run("package", out).status, 0);
  assert.ok(existsSync(join(out, "dist/assets/theme.css")));
  writeFileSync(
    join(out, "assets/main.css"),
    '@import "https://cdn.example.org/theme.css";',
  );
  assert.match(run("check", out).stderr, /External runtime resource/);
});

test("package retains local assets selected dynamically by page scripts", {
  skip: !process.env.REMOTION_TEST_PROJECT,
}, (t) => {
  const out = encodedDelivery(t);
  writeFileSync(
    join(out, "assets/second #1 %.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg"/>',
  );
  assert.equal(run("package", out).status, 0);
  assert.ok(existsSync(join(out, "dist/assets/second #1 %.svg")));
});

test("both starters restore the poster on reduced motion and only pause when hidden", () => {
  for (const name of ["landing.html", "template.html"]) {
    const html = readFileSync(join(skill, "assets", name), "utf8");
    let reloads = 0;
    let pauses = 0;
    const video = {
      pause() {
        pauses++;
      },
      load() {
        reloads++;
      },
      play() {
        return Promise.resolve();
      },
      removeAttribute() {},
      getAttribute: name => name === "src" ? "hero.mp4" : "poster.jpg",
      addEventListener() {},
    };
    const preference = {
      matches: false,
      addEventListener(_, listener) {
        this.change = listener;
      },
    };
    const document = {
      hidden: false,
      getElementById: (id) => (id === "hero-video" ? video : null),
      addEventListener(_, listener) {
        this.change = listener;
      },
    };
    for (const [, script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
      vm.runInNewContext(script, {
        document,
        window: { matchMedia: () => preference },
      });
    document.hidden = true;
    document.change();
    assert.equal(pauses, 1);
    assert.equal(reloads, 0);
    preference.matches = true;
    preference.change();
    assert.equal(reloads, 1, name);
  }
});

test("reduced motion restores once per source/preference change, not per visibility event", () => {
  for (const name of ["template.html", "landing.html"]) {
    let reloads = 0;
    const listeners = {};
    const attrs = { src: "hero.mp4", poster: "poster.jpg" };
    const video = {
      pause() {}, play() { return Promise.resolve(); }, removeAttribute() {},
      load() { reloads++; }, getAttribute(key) { return attrs[key]; },
      addEventListener(type, cb) { listeners[type] = cb; },
    };
    const preference = { matches: true, addEventListener(_, cb) { listeners.preference = cb; } };
    const document = { hidden: false, getElementById: id => id === "hero-video" ? video : null, addEventListener(type, cb) { listeners[type] = cb; } };
    const html = readFileSync(join(skill, "assets", name), "utf8");
    for (const [, script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
      vm.runInNewContext(script, { document, window: { matchMedia: () => preference } });
    assert.equal(reloads, 1);
    document.hidden = true; listeners.visibilitychange();
    document.hidden = false; listeners.visibilitychange();
    assert.equal(reloads, 1, name);
    attrs.src = "next.mp4";
    assert.equal(typeof listeners.loadedmetadata, "function");
    listeners.loadedmetadata(); listeners.loadedmetadata();
    assert.equal(reloads, 2);
    preference.matches = false; listeners.preference();
    preference.matches = true; listeners.preference();
    assert.equal(reloads, 3);
  }
});

test("manual pause survives visibility changes in both starters", () => {
  for (const name of ["landing.html", "template.html"]) {
    const html = readFileSync(join(skill, "assets", name), "utf8");
    let plays = 0;
    const video = {
      pause() {},
      load() {}, getAttribute: name => name === "src" ? "hero.mp4" : "poster.jpg", addEventListener() {},
      removeAttribute() {},
      play() {
        plays++;
        return Promise.resolve();
      },
    };
    const button = {
      setAttribute() {},
      addEventListener(_, listener) {
        this.click = listener;
      },
    };
    const document = {
      hidden: false,
      getElementById: (id) => (id === "hero-video" ? video : button),
      addEventListener(_, listener) {
        this.change = listener;
      },
    };
    const window = {
      matchMedia: () => ({ matches: false, addEventListener() {} }),
    };
    for (const [, script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g))
      vm.runInNewContext(script, { document, window });
    assert.equal(plays, 1);
    assert.equal(typeof button.click, "function", name);
    button.click();
    document.hidden = true;
    document.change();
    document.hidden = false;
    document.change();
    assert.equal(plays, 1, name);
    button.click();
    assert.equal(plays, 2, name);
  }
});

test("starter media behavior works after optional interaction markup is removed", () => {
  const html = readFileSync(join(skill, "assets/template.html"), "utf8");
  const video = {
    pause() {},
    load() {}, getAttribute: name => name === "src" ? "hero.mp4" : "poster.jpg", addEventListener() {},
    play() {
      return Promise.resolve();
    },
    removeAttribute() {},
    addEventListener() {},
  };
  const document = {
    getElementById: (id) => (id === "hero-video" ? video : null),
    querySelectorAll: () => [],
    addEventListener() {},
    hidden: false,
  };
  const window = {
    matchMedia: () => ({ matches: true, addEventListener() {} }),
  };
  for (const [, script] of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) {
    assert.doesNotThrow(() => vm.runInNewContext(script, { document, window }));
  }
});
