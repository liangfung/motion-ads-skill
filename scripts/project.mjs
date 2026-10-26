#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import {
  cpSync,
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  realpathSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import {
  dirname,
  delimiter,
  extname,
  isAbsolute,
  join,
  relative,
  resolve,
  sep,
} from "node:path";
import { fileURLToPath } from "node:url";

const skill = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [command, directory, ...extra] = process.argv.slice(2);
const usage =
  "Usage: node <skill>/scripts/project.mjs init|stills|render|check|verify|package <project> [--layout card|landing OR --example single-stage|story (init)] [--frames=0,90 (stills)] [Remotion flags (stills/render)]";

function init(project) {
  if (extra[0] === "--example" && extra.length !== 2)
    throw new Error("--example requires one value: single-stage or story");
  const example = extra[0] === "--example" && extra.length === 2 ? extra[1] : null;
  if (example && !["single-stage", "story"].includes(example))
    throw new Error("--example must be single-stage or story");
  let layout =
    extra.length === 0 || example
      ? "card"
      : extra[0] === "--layout" && extra.length === 2
        ? extra[1]
        : "invalid";
  if (layout === "endcard") layout = "card";
  if (!["landing", "card"].includes(layout))
    throw new Error("--layout must be card or landing");
  if (existsSync(project))
    throw new Error(`Project already exists; edit it in place: ${project}`);
  mkdirSync(project, { recursive: true });
  cpSync(
    join(
      skill,
      "assets",
      layout === "landing" ? "landing.html" : "template.html",
    ),
    join(project, "index.html"),
  );
  cpSync(join(skill, "assets/remotion-template"), join(project, "hero-video"), {
    recursive: true,
  });
  if (example) {
    const source = join(skill, "assets/examples", example);
    cpSync(join(source, "Ad.tsx"), join(project, "hero-video/src/Ad.tsx"));
    cpSync(join(source, "props.json"), join(project, "hero-video/props.json"));
  }
  const propsPath = join(project, "hero-video/props.json");
  const props = JSON.parse(readFileSync(propsPath, "utf8"));
  if (layout === "landing") Object.assign(props, { width: 1200, height: 720 });
  writeFileSync(propsPath, `${JSON.stringify(props, null, 2)}\n`);
  if (example) {
    const path = join(project, "index.html");
    writeFileSync(path, readFileSync(path, "utf8")
      .replaceAll("https://example.com", "https://www.remotion.dev/docs/")
      .replaceAll("Product video ad", `${props.brand} — illustrative motion example`)
      .replaceAll("Learn more about the product", props.ctaLabel)
      .replaceAll("Product advertising video", "Original vector artwork motion example")
      .replaceAll("Replace with a concise description of the complete video ad", "Illustrative motion study; not a real product advertisement")
      .replaceAll("Replace with the source-backed advertising message.", "Original vector artwork demonstrating advertising composition and motion.")
      .replaceAll("#f4f5f7", props.bg));
  }
  mkdirSync(join(project, "assets"));
  writeFileSync(
    join(project, "brief.json"),
    `${JSON.stringify({ layout, ...(example ? { example, illustrationOnly: true } : {}), sourceUrl: null, facts: [], assets: [], assumptions: [], decisions: {} }, null, 2)}\n`,
  );
  writeFileSync(
    join(project, ".gitignore"),
    "hero-video/node_modules/\nhero-video/.remotion/\nhero-video/out/\n",
  );
  console.log(
    `Created ${layout} project: ${project}\nEdit brief.json, index.html and hero-video/props.json. Install dependencies with npm install in ${join(project, "hero-video")}.`,
  );
}

async function media(project) {
  const video = join(project, "hero-video");
  const require = createRequire(join(video, "package.json"));
  let executable, renderer, manifest;
  try {
    manifest = require.resolve("@remotion/cli/package.json");
    const pkg = JSON.parse(readFileSync(manifest, "utf8"));
    executable = resolve(
      dirname(manifest),
      typeof pkg.bin === "string" ? pkg.bin : pkg.bin.remotion,
    );
    renderer = require("@remotion/renderer");
  } catch {
    throw new Error(
      `Remotion dependencies missing. Run npm install in ${video}.`,
    );
  }
  const props = JSON.parse(readFileSync(join(video, "props.json"), "utf8"));
  for (const key of ["width", "height"]) {
    if (!Number.isInteger(props[key]) || props[key] < 2 || props[key] % 2)
      throw new Error(
        `${key} must be a positive even integer in hero-video/props.json`,
      );
  }
  if (!Number.isFinite(props.durationSeconds) || props.durationSeconds <= 0)
    throw new Error(
      "durationSeconds must be positive in hero-video/props.json",
    );
  const option = (name) => {
    const matches = extra.map((arg, i) => arg === name || arg.startsWith(`${name}=`) ? i : -1).filter(i => i >= 0);
    if (matches.length > 1) throw new Error(`Pass ${name} only once`);
    if (!matches.length) return undefined;
    const i = matches[0];
    const value = extra[i] === name ? extra[i + 1] : extra[i].slice(name.length + 1);
    if (!value || value.startsWith("--")) throw new Error(`${name} needs a value`);
    return value;
  };
  const frames = Math.max(1, Math.round(props.durationSeconds * 30));
  const frameOption = command === "stills" ? option("--frames") : undefined;
  const requestedFrames = frameOption === undefined ? null : frameOption.split(",").map(Number);
  if (requestedFrames && (!/^\d+(,\d+)*$/.test(frameOption) || requestedFrames.some(frame => !Number.isInteger(frame) || frame < 0 || frame >= frames)))
    throw new Error(`--frames requires comma-separated integer frames from 0 to ${frames - 1}`);
  const localFile = path => existsSync(path) && statSync(path).isFile();
  const candidates = [
    ...(process.platform === "darwin" ? [
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      "/Applications/Chromium.app/Contents/MacOS/Chromium",
    ] : []),
    ...(process.env.PATH || "").split(delimiter).filter(Boolean).flatMap(dir =>
      (process.platform === "win32" ? ["chrome.exe", "chromium.exe"] : ["google-chrome", "google-chrome-stable", "chromium", "chromium-browser"]).map(name => resolve(dir, name))),
    ...(process.platform === "win32" ? [process.env.PROGRAMFILES, process.env["PROGRAMFILES(X86)"], process.env.LOCALAPPDATA].filter(Boolean).map(dir => join(dir, "Google/Chrome/Application/chrome.exe")) : []),
  ];
  const browserExecutable = option("--browser-executable") || process.env.REMOTION_BROWSER_EXECUTABLE || process.env.CHROME_PATH || candidates.find(localFile) || null;
  if (browserExecutable && (!isAbsolute(browserExecutable) || !localFile(browserExecutable)))
    throw new Error("Browser executable must be an absolute local file path; a browser-tool CDP URL is not an executable path.");
  // Remotion resolves its existing browser cache relative to the project cwd.
  process.chdir(video);
  const browser = await renderer.ensureBrowser({
    browserExecutable,
    chromeMode: option("--chrome-mode") || "headless-shell",
    onBrowserDownload: () => {
      throw new Error("Automatic browser download is disabled. Locate an existing local Chrome/Chromium (including the browser tool's executable, if available) and pass --browser-executable=/absolute/path or REMOTION_BROWSER_EXECUTABLE. If the tool exposes only remote CDP, report the render environment blocker.");
    },
  });
  const browserFlags = [`--browser-executable=${browser.path}`];
  const remotionFlags = [...extra];
  const browserIndex = remotionFlags.findIndex(arg => arg === "--browser-executable" || arg.startsWith("--browser-executable="));
  if (browserIndex >= 0)
    remotionFlags.splice(browserIndex, remotionFlags[browserIndex] === "--browser-executable" ? 2 : 1);
  if (command === "stills" && frameOption !== undefined) {
    const index = remotionFlags.findIndex(arg => arg === "--frames" || arg.startsWith("--frames="));
    remotionFlags.splice(index, remotionFlags[index] === "--frames" ? 2 : 1);
  }
  const invoke = (args) => {
    const result = spawnSync(
      process.execPath,
      [executable, ...args, "--props=props.json", "--overwrite", ...browserFlags, ...remotionFlags],
      { cwd: video, stdio: "inherit" },
    );
    if (result.error) throw result.error;
    if (result.status !== 0)
      throw new Error(
        `Remotion ${args[0]} failed (exit ${result.status ?? result.signal})`,
      );
  };
  const still = (frame, destination) =>
    invoke([
      "still",
      "src/index.ts",
      "Hero",
      destination,
      `--frame=${frame}`,
      "--image-format=jpeg",
    ]);
  if (command === "stills") {
    mkdirSync(join(project, "qa"), { recursive: true });
    const samples = new Set(requestedFrames ?? [0, Math.floor(frames / 2), frames - 1]);
    if (!requestedFrames && props.qaFrames !== undefined) {
      if (!Array.isArray(props.qaFrames) || props.qaFrames.some(frame =>
        !Number.isInteger(frame) || frame < 0 || frame >= frames))
        throw new Error(`qaFrames must contain integer frames from 0 to ${frames - 1}`);
      for (const frame of props.qaFrames) samples.add(frame);
    } else if (!requestedFrames && props.presentation === "ad" && props.scenes?.length) {
      for (let i = 0; i < props.scenes.length; i++) {
        const start = Math.ceil((i * frames) / props.scenes.length);
        const end = Math.ceil(((i + 1) * frames) / props.scenes.length) - 1;
        samples.add(Math.floor((start + end) / 2));
        const labels = props.scenes[i].labels?.length ?? 0;
        if (props.width > props.height) {
          for (let j = 0; j < labels; j++)
            samples.add(
              Math.floor(start + ((j + 0.65) * (end - start + 1)) / labels),
            );
        }
        if (i > 0)
          for (const offset of [-1, 0, 8])
            samples.add(Math.min(end, start + offset));
      }
      const wrap = Math.min(12, Math.floor(frames / props.scenes.length / 3));
      if (wrap > 1) {
        samples.add(frames - wrap);
        samples.add(frames - Math.ceil(wrap / 2));
      }
    }
    for (const file of readdirSync(join(project, "qa"), { withFileTypes: true }))
      if (!requestedFrames && file.isFile() && /^hero-\d+\.jpg$/.test(file.name))
        rmSync(join(project, "qa", file.name));
    const selected = [...samples].sort((a, b) => a - b);
    const customConfig = readdirSync(video).some(name => name.startsWith("remotion.config.") &&
      (name !== "remotion.config.ts" || !readFileSync(join(video, name)).equals(readFileSync(join(skill, "assets/remotion-template/remotion.config.ts")))));
    if (remotionFlags.length || customConfig) {
      // Preserve custom configuration and advanced flags through the existing CLI.
      for (const frame of selected) still(frame, join(project, `qa/hero-${frame}.jpg`));
    } else {
      const started = Date.now();
      const { bundle } = createRequire(manifest)("@remotion/bundler");
      const bundleDirectory = mkdtempSync(join(tmpdir(), "motion-ads-bundle-"));
      let instance;
      try {
        const serveUrl = await bundle({ entryPoint: join(video, "src/index.ts"), publicDir: join(video, "public"), outDir: bundleDirectory });
        instance = await renderer.openBrowser("chrome", { browserExecutable: browser.path, logLevel: "error" });
        const shared = { serveUrl, inputProps: props, puppeteerInstance: instance, browserExecutable: browser.path, logLevel: "error" };
        const composition = await renderer.selectComposition({ ...shared, id: "Hero" });
        for (const frame of selected) {
          await renderer.renderStill({ ...shared, composition, frame, output: join(project, `qa/hero-${frame}.jpg`), imageFormat: "jpeg", overwrite: true });
          console.log(`Rendered QA frame ${frame}`);
        }
      } finally {
        try {
          if (instance) await instance.close({ silent: true });
        } finally {
          rmSync(bundleDirectory, { recursive: true, force: true });
        }
      }
      console.log(`Rendered ${selected.length} QA stills in ${((Date.now() - started) / 1000).toFixed(1)}s with one bundle/browser.`);
    }
  } else {
    still(0, join(project, "poster.jpg"));
    invoke([
      "render",
      "src/index.ts",
      "Hero",
      join(project, "hero.mp4"),
      "--codec=h264",
      "--pixel-format=yuv420p",
      "--image-format=png",
      "--color-space=bt709",
      "--muted",
      "--crf=24",
    ]);
  }
}

function resourcePath(root, reference, source = "index.html") {
  return resolve(dirname(join(root, source)), decodeURIComponent(reference.split(/[?#]/)[0]));
}

function checkScaffold(root, html) {
  // Match exact starter copy, not arbitrary marketing phrases or source-code examples.
  const markers = new Set([
    "Product name", "Brand name", "Product video ad", "Product category",
    "One clear reason to care.", "First distinctive benefit", "Second distinctive benefit", "Third distinctive benefit",
    "Show what makes it different.", "Verified feature", "Useful detail",
    "End on the product, its promise, and the action.",
    "Replace with the source-backed advertising message.",
    "Replace with a source-backed product description.",
    "Replace with a concise description of the complete video ad",
    "Replace this with the product's distinctive benefit, grounded in the supplied source.",
    "Replace with a useful, source-backed caption, or remove.",
    "Replace with a distinctive, source-backed promise.",
    "Use one specific fact from the source. Remove this module when no supporting detail is available.",
    "Explain what this means for the intended audience using verified product details.",
    "Keep the wording useful and specific. The product's real qualities supply the proof.",
  ]);
  const reject = values => {
    for (const value of values)
      if (typeof value === "string" && markers.has(value.trim().replace(/\s+/g, " ")))
        throw new Error(`Unreplaced scaffold placeholder: ${value}`);
  };
  const markup = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
  reject([
    ...[...markup.matchAll(/>([^<>]+)</g)].map(match => match[1]),
    ...[...markup.matchAll(/\b(?:content|aria-label)\s*=\s*(["'])([\s\S]*?)\1/gi)].map(match => match[2]),
  ]);
  const propsPath = join(root, "hero-video/props.json");
  if (!existsSync(propsPath)) return; // Packaged dist has no editable source project.
  const props = JSON.parse(readFileSync(propsPath, "utf8"));
  reject([props.brand, ...(props.scenes || []).flatMap(scene => [scene.eyebrow, scene.headline, scene.body, ...(scene.labels || [])])]);
  const briefPath = join(root, "brief.json");
  const study = existsSync(briefPath) && JSON.parse(readFileSync(briefPath, "utf8")).illustrationOnly === true;
  if (study) return; // Bundled vector studies intentionally carry illustrative artwork.
  const images = props.presentation === "gallery" && props.images?.length
    ? props.images
    : props.presentation === "ad" && props.scenes?.length
      ? props.scenes.map(scene => scene.image || props.image)
      : [props.image];
  const placeholder = readFileSync(join(skill, "assets/remotion-template/public/product.svg"));
  for (const image of new Set(images.filter(value => typeof value === "string"))) {
    const path = join(root, "hero-video/public", image);
    if (existsSync(path) && statSync(path).isFile() && readFileSync(path).equals(placeholder))
      throw new Error(`Unreplaced placeholder artwork: ${image}. Replace it or remove unused image props; mark illustrative studies explicitly in the brief.`);
  }
}

function check(project) {
  const root = realpathSync(project);
  const files = new Set(["index.html"]);
  const html = readFileSync(join(root, "index.html"), "utf8");
  checkScaffold(root, html);
  const attribute = (tag, name) =>
    tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']*)["']`, "i"))?.[1];
  const video = html.match(/<video\b[^>]*\bid=["']hero-video["'][^>]*>/i)?.[0];
  if (!video || !attribute(video, "src") || !attribute(video, "poster"))
    throw new Error(
      "A hero-video element with local src and poster is required",
    );
  for (const flag of ["muted", "playsinline"]) {
    if (!new RegExp(`\\b${flag}\\b`, "i").test(video))
      throw new Error(`hero-video must include ${flag}`);
  }
  const ctas = [...html.matchAll(/<a\b[^>]*\bid=["']cta["'][^>]*>/gi)];
  if (ctas.length !== 1)
    throw new Error("Exactly one primary link with id=cta is required");
  const href = attribute(ctas[0][0], "href");
  let target;
  try {
    target = new URL(href);
  } catch {
    throw new Error("CTA needs a real absolute destination URL");
  }
  if (
    !["https:", "http:"].includes(target.protocol) ||
    /(^|\.)example\.(com|org|net)$/.test(target.hostname)
  )
    throw new Error("CTA still uses a placeholder or unsupported URL");
  const visit = (reference, source = "index.html") => {
    if (
      !reference ||
      reference.startsWith("#") ||
      reference.startsWith("data:")
    )
      return;
    if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(reference))
      throw new Error(`External runtime resource: ${reference}`);
    const path = resourcePath(root, reference, source);
    const rel = relative(root, path);
    if (rel === ".." || rel.startsWith(`..${sep}`) || isAbsolute(rel))
      throw new Error(`Resource escapes outside project: ${reference}`);
    if (!existsSync(path) || !statSync(path).isFile())
      throw new Error(`Missing local resource: ${reference}`);
    const actual = relative(root, realpathSync(path));
    if (actual === ".." || actual.startsWith(`..${sep}`) || isAbsolute(actual))
      throw new Error(`Resource symlink escapes outside project: ${reference}`);
    if (files.has(rel)) return;
    files.add(rel);
    if ([".css", ".svg"].includes(extname(path)))
      scan(readFileSync(path, "utf8"), rel);
  };
  const scan = (text, source) => {
    for (const match of text.matchAll(
      /\b(?:src|poster|data-video|data-poster)\s*=\s*["']([^"']+)["']/gi,
    ))
      visit(match[1], source);
    for (const match of text.matchAll(/\bsrcset\s*=\s*["']([^"']+)["']/gi)) {
      let rest = match[1].trim();
      while (rest) {
        const token = rest.match(/^\S+/)[0];
        const urls = token.startsWith("data:")
          ? [token.replace(/,+$/, "")]
          : token.split(",").filter(Boolean);
        for (const url of urls) visit(url, source);
        rest = rest.slice(token.length).trimStart();
        if (!token.endsWith(","))
          rest = rest.includes(",")
            ? rest.slice(rest.indexOf(",") + 1).trimStart()
            : "";
      }
    }
    for (const match of text.matchAll(
      /<link\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi,
    ))
      visit(match[1], source);
    for (const match of text.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/gi))
      visit(match[1].trim(), source);
    for (const match of text.matchAll(/@import\s+["']([^"']+)["']/gi))
      visit(match[1], source);
  };
  scan(html, "index.html");
  const assets = (directory) => {
    for (const entry of readdirSync(join(root, directory), {
      withFileTypes: true,
    })) {
      if (entry.name.startsWith(".")) continue;
      const path = join(directory, entry.name);
      if (entry.isDirectory()) assets(path);
      else visit(path.split(sep).map(encodeURIComponent).join("/"));
    }
  };
  if (existsSync(join(root, "assets"))) assets("assets");
  const videoPath = resourcePath(root, attribute(video, "src"));
  if (readFileSync(videoPath).subarray(4, 8).toString() !== "ftyp")
    throw new Error(
      "Hero media is not an MP4 file; render it with Remotion first",
    );
  return [...files];
}

function verify(project) {
  const report = join(project, "qa/media-check.json");
  rmSync(report, { force: true });
  check(project);
  const require = createRequire(join(project, "hero-video/package.json"));
  // Resolve platform/libc and macOS dylibs exactly as the pinned 4.0.538 renderer does.
  // Keep this adapter together if the pinned Remotion version changes.
  const renderer = dirname(require.resolve("@remotion/renderer/package.json"));
  const { getExecutableDir } = require(join(renderer, "dist/compositor/get-executable-path.js"));
  const { getExplicitEnv } = require(join(renderer, "dist/compositor/get-explicit-env.js"));
  const binaries = getExecutableDir(false, "error");
  const invoke = (name, args) => {
    const result = spawnSync(join(binaries, name + (process.platform === "win32" ? ".exe" : "")), args, {
      cwd: binaries,
      env: { ...process.env, ...getExplicitEnv(binaries) },
      encoding: "utf8",
      timeout: 120000,
      maxBuffer: 8 * 1024 * 1024,
    });
    if (result.error) throw result.error;
    if (result.status !== 0)
      throw new Error(`${name} verification failed: ${result.stderr.slice(-2000)}`);
    return result.stdout;
  };
  const probe = (path) => JSON.parse(invoke("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", path]));
  const props = JSON.parse(readFileSync(join(project, "hero-video/props.json"), "utf8"));
  const tag = readFileSync(join(project, "index.html"), "utf8").match(/<video\b[^>]*\bid=["']hero-video["'][^>]*>/i)[0];
  const mediaPath = name => resourcePath(project,
    tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"))[1]);
  const path = mediaPath("src");
  const metadata = probe(path);
  const video = metadata.streams.find(stream => stream.codec_type === "video");
  if (!video || video.width !== props.width || video.height !== props.height)
    throw new Error("Encoded video dimensions differ from props.json");
  if (video.codec_name !== "h264" || video.pix_fmt !== "yuv420p")
    throw new Error("Expected H.264/yuv420p; render with --codec=h264 --pixel-format=yuv420p --image-format=png --color-space=bt709");
  if (Math.abs(Number(metadata.format.duration) - props.durationSeconds) > 1 / 30 + 0.01)
    throw new Error("Encoded duration differs from props.json");
  if (metadata.streams.some(stream => stream.codec_type === "audio"))
    throw new Error("Expected a silent video");
  // The bundled build may lack the null muxer's default wrapped_avframe encoder.
  invoke("ffmpeg", ["-v", "error", "-xerror", "-i", path, "-map", "0:v:0", "-c:v", "rawvideo", "-f", "null", "-"]);
  const posterPath = mediaPath("poster");
  const poster = probe(posterPath).streams[0];
  if (poster.width !== props.width || poster.height !== props.height)
    throw new Error("Poster dimensions differ from props.json");
  const evidence = {
    mediaCheck: "passed",
    width: video.width, height: video.height,
    durationSeconds: Number(metadata.format.duration), fps: video.r_frame_rate,
    codec: video.codec_name, pixelFormat: video.pix_fmt,
    audioStreams: 0, fullDecode: "passed", posterDimensions: "passed",
    sha256: Object.fromEntries(["index.html", relative(project, path), relative(project, posterPath)].map(name =>
      [name, createHash("sha256").update(readFileSync(join(project, name))).digest("hex")])),
    browserQA: "required separately", visualQA: "required separately",
  };
  mkdirSync(dirname(report), { recursive: true });
  writeFileSync(report, `${JSON.stringify(evidence, null, 2)}\n`);
  console.log(JSON.stringify(evidence, null, 2));
}

function publish(project) {
  verify(project);
  const files = check(project);
  const destination = join(project, "dist");
  rmSync(destination, { recursive: true, force: true });
  mkdirSync(destination);
  for (const file of files) {
    const target = join(destination, file);
    mkdirSync(dirname(target), { recursive: true });
    cpSync(join(project, file), target);
  }
  check(destination);
  console.log(
    `Packaged ${files.length} files in ${destination}. Media verified; browser and creative review remain separate. Run a final browser smoke check on this folder before delivery.`,
  );
}

try {
  if (
    !directory ||
    !["init", "stills", "render", "check", "verify", "package"].includes(command)
  )
    throw new Error(usage);
  const project = resolve(directory);
  if (command === "init") init(project);
  else if (command === "stills" || command === "render") await media(project);
  else if (extra.length) throw new Error(usage);
  else if (command === "verify") verify(project);
  else if (command === "package") publish(project);
  else
    console.log(
      JSON.stringify(
        {
          structuralCheck: "passed",
          files: check(project),
          browserQA: "required separately",
        },
        null,
        2,
      ),
    );
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
