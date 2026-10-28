// Maintainer-only: generation uses the committed browser runtime, never this builder.
import { build, transform } from "esbuild";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const skill = join(root, "skills/motion-ads");
const checking = process.argv.includes("--check");
const outputs = new Map();
const source = join(root, "tools/runtime");
const bundle = await build({
  entryPoints: [join(source, "entry.tsx")],
  bundle: true,
  write: false,
  format: "iife",
  globalName: "MotionAds",
  platform: "browser",
  target: "es2020",
  minify: true,
  jsx: "automatic",
  legalComments: "inline",
  define: { "process.env.NODE_ENV": '"production"' },
});
const runtime = bundle.outputFiles[0].contents;
outputs.set("assets/runtime/motion-runtime.js", runtime);
const packages = [
  "react",
  "react-dom",
  "scheduler",
  "remotion",
  "@remotion/player",
];
const versions = {};
const notices = [];
for (const name of packages) {
  const packagePath = require.resolve(name + "/package.json");
  const pkg = JSON.parse(readFileSync(packagePath));
  versions[name] = pkg.version;
  const file = ["react", "react-dom", "scheduler"].includes(name)
    ? "LICENSE"
    : "LICENSE.md";
  notices.push(
    `${name}@${pkg.version}\n${readFileSync(join(dirname(packagePath), file), "utf8")}`,
  );
  if (name === "remotion")
    notices.push(
      readFileSync(
        join(dirname(packagePath), "THIRD_PARTY_LICENSES.md"),
        "utf8",
      ),
    );
}
outputs.set(
  "assets/runtime/THIRD-PARTY-NOTICES.txt",
  notices.join("\n\n---\n\n") + "\n",
);
outputs.set(
  "assets/runtime/version.json",
  JSON.stringify(
    {
      format: "remotion-player-runtime",
      versions,
      sha256: createHash("sha256").update(runtime).digest("hex"),
    },
    null,
    2,
  ) + "\n",
);
for (const name of ["default", "bright", "atmospheric"]) {
  const file =
    name === "default"
      ? join(source, "default")
      : join(source, "examples", name);
  let code = readFileSync(file + ".tsx", "utf8")
    .replace(/import\s+\*\s+as\s+React\s+from\s*["']react["'];?/, "")
    .replace(
      /import\s*\{([\s\S]*?)\}\s*from\s*["']remotion["'];?/,
      "const {$1} = MotionAds.Remotion;",
    )
    .replace("export const Ad", "const Ad");
  const result = await transform(code, {
    loader: "tsx",
    jsxFactory: "h",
    jsxFragment: "React.Fragment",
    target: "es2020",
  });
  if (/\b(?:import|export)\s/.test(result.code))
    throw Error(`Unexpected module dependency in ${name}`);
  const compiled = result.code.replace(/\/\*\s*@__PURE__\s*\*\/\s*/g, "");
  const ad =
    "// Editable React/Remotion composition. No compilation is required.\n(() => {\nconst {React} = MotionAds;\nconst h = React.createElement;\n" +
    compiled +
    "\nMotionAds.mount(Ad, window.motionAd);\n})();\n";
  const props = JSON.parse(readFileSync(file + ".json"));
  props.assets = [];
  const dir =
    name === "default" ? "assets/player-template" : "assets/examples/" + name;
  outputs.set(dir + "/ad.js", ad);
  outputs.set(
    dir + "/config.js",
    "// Edit these inputs from the source brief. Paths are relative to index.html.\nwindow.motionAd = " +
      JSON.stringify(props, null, 2) +
      ";\n",
  );
}
let stale = false;
for (const [relative, data] of outputs) {
  const file = join(skill, relative),
    bytes = Buffer.from(data);
  if (checking) {
    let existing;
    try {
      existing = readFileSync(file);
    } catch {}
    if (!existing?.equals(bytes)) {
      console.error("Out of date: " + relative);
      stale = true;
    }
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, bytes);
  }
}
if (stale) process.exitCode = 1;
else
  console.log(
    checking
      ? "Browser runtime and reference files are up to date."
      : "Prepared browser runtime and two complete references.",
  );
