#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = execFileSync("git", ["rev-parse", "--git-path", "hooks/pre-commit"], { cwd: root, encoding: "utf8" }).trim();
const path = resolve(root, target);
const source = readFileSync(join(root, ".githooks/pre-commit"));
if (existsSync(path) && !readFileSync(path).equals(source)) {
  console.error(`Refusing to overwrite existing hook: ${path}. Integrate .githooks/pre-commit manually.`);
  process.exit(1);
}
mkdirSync(dirname(path), { recursive: true });
writeFileSync(path, source);
chmodSync(path, 0o755);
console.log("Installed pre-commit hook for well-known artifacts.");
