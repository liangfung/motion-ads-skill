#!/usr/bin/env node
// Builds the Agent Skills Discovery (v0.2.0) artifacts under .well-known/agent-skills/.
// Usage: node tools/build-well-known.mjs [--check]
//   --check  fail if the committed artifacts are out of date instead of writing them.
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const skillsDir = join(root, "skills");
const outDir = join(root, ".well-known/agent-skills");
const SCHEMA = "https://schemas.agentskills.io/discovery/0.2.0/schema.json";
// Maintainer-only files stay in the repository but are not shipped.
const excluded = (name) => name === "node_modules" || name === ".DS_Store" || name.endsWith(".test.mjs");

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !excluded(entry.name))
    .flatMap((entry) => {
      const path = join(dir, entry.name);
      if (entry.isSymbolicLink()) throw new Error(`Symlinks are not packaged: ${path}`);
      return entry.isDirectory() ? walk(path) : [path];
    });
}

function frontmatter(text, file) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1];
  if (!block) throw new Error(`${file} needs YAML frontmatter`);
  const field = (key) => block.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1].trim().replace(/^(["'])(.*)\1$/, "$2");
  return { name: field("name"), description: field("description") };
}

// Minimal deterministic ustar writer: sorted regular files, fixed owner/mtime, files at archive root.
function tar(base, files) {
  const blocks = [];
  for (const file of files) {
    const name = relative(base, file).split(sep).join("/");
    if (Buffer.byteLength(name) > 100) throw new Error(`Path too long for ustar: ${name}`);
    const data = readFileSync(file);
    const header = Buffer.alloc(512);
    const put = (value, offset, length) => header.write(value, offset, length, "utf8");
    const octal = (value, offset, length) => put(value.toString(8).padStart(length - 1, "0") + "\0", offset, length);
    put(name, 0, 100);
    octal(statSync(file).mode & 0o111 ? 0o755 : 0o644, 100, 8);
    octal(0, 108, 8); // uid
    octal(0, 116, 8); // gid
    octal(data.length, 124, 12);
    octal(0, 136, 12); // mtime
    put("        ", 148, 8); // checksum placeholder
    put("0", 156, 1); // regular file
    put("ustar\0" + "00", 257, 8);
    let sum = 0;
    for (const byte of header) sum += byte;
    put(sum.toString(8).padStart(6, "0") + "\0 ", 148, 8);
    blocks.push(header, data, Buffer.alloc((512 - (data.length % 512)) % 512));
  }
  blocks.push(Buffer.alloc(1024));
  const gz = gzipSync(Buffer.concat(blocks), { level: 9 });
  gz[9] = 255; // gzip OS byte varies by platform; mark unknown for reproducible digests.
  return gz;
}

const sha256 = (data) => `sha256:${createHash("sha256").update(data).digest("hex")}`;
const outputs = new Map();
const skills = [];
for (const entry of readdirSync(skillsDir, { withFileTypes: true }).filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const dir = join(skillsDir, entry.name);
  const skillFile = join(dir, "SKILL.md");
  if (!existsSync(skillFile)) continue;
  const { name, description } = frontmatter(readFileSync(skillFile, "utf8"), skillFile);
  if (name !== entry.name) throw new Error(`Frontmatter name "${name}" must match directory skills/${entry.name}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || name.length > 64) throw new Error(`Invalid skill name: ${name}`);
  if (!description || description.length > 1024) throw new Error(`${name} needs a description of 1-1024 characters`);
  const files = walk(dir).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  const archive = tar(dir, files);
  const file = `${name}.tar.gz`;
  outputs.set(file, archive);
  // Relative URL resolves against the index location (raw.githubusercontent.com, Pages or any static host).
  skills.push({ name, type: "archive", description, url: file, digest: sha256(archive) });
}
if (!skills.length) throw new Error("No skills found under skills/");
outputs.set("index.json", Buffer.from(`${JSON.stringify({ $schema: SCHEMA, skills }, null, 2)}\n`));

const expected = new Set(outputs.keys());
const stale = [...outputs].filter(([file, data]) => !existsSync(join(outDir, file)) || !readFileSync(join(outDir, file)).equals(data));
const extra = existsSync(outDir) ? readdirSync(outDir).filter((file) => !expected.has(file)) : [];
if (process.argv.includes("--check")) {
  if (stale.length || extra.length) {
    console.error(`Out of date: ${[...stale.map(([file]) => file), ...extra.map((file) => `${file} (unexpected)`)].join(", ")}`);
    console.error("Run: node tools/build-well-known.mjs");
    process.exit(1);
  }
  console.log("Agent skills artifacts are up to date.");
} else {
  if (extra.length) throw new Error(`Remove unexpected files from .well-known/agent-skills: ${extra.join(", ")}`);
  mkdirSync(outDir, { recursive: true });
  for (const [file, data] of stale) writeFileSync(join(outDir, file), data);
  for (const skill of skills) console.log(`${skill.name}: ${skill.url} ${skill.digest}`);
  console.log(stale.length ? `Wrote ${stale.map(([file]) => file).join(", ")}` : "No changes.");
}
