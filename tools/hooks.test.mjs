import assert from "node:assert/strict";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import test from "node:test";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
function fixture(t) {
  const dir = mkdtempSync(join(tmpdir(), "motion-hooks-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const run = (cmd, args) => spawnSync(cmd, args, { cwd: dir, encoding: "utf8" });
  assert.equal(run("git", ["init", "--quiet"]).status, 0);
  mkdirSync(join(dir, "tools"));
  mkdirSync(join(dir, "skills/demo"), { recursive: true });
  writeFileSync(join(dir, "skills/demo/SKILL.md"), "---\nname: demo\ndescription: Demo skill\n---\nDemo\n");
  cpSync(join(root, "tools/build-well-known.mjs"), join(dir, "tools/build-well-known.mjs"));
  if (existsSync(join(root, ".githooks"))) cpSync(join(root, ".githooks"), join(dir, ".githooks"), { recursive: true });
  if (existsSync(join(root, "tools/install-hooks.mjs"))) cpSync(join(root, "tools/install-hooks.mjs"), join(dir, "tools/install-hooks.mjs"));
  assert.equal(run("git", ["add", "--", "skills", "tools"]).status, 0);
  return { dir, run, hook: () => run("sh", [".githooks/pre-commit"]) };
}

test("pre-commit builds and stages reproducible discovery artifacts", (t) => {
  const { run, hook } = fixture(t);
  const result = hook();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(run("node", ["tools/build-well-known.mjs", "--check"]).status, 0);
  assert.equal(run("git", ["diff", "--name-only", "--", ".well-known"]).stdout, "");
  assert.match(run("git", ["diff", "--cached", "--name-only"]).stdout, /\.well-known\/agent-skills\/demo\.tar\.gz/);
});

for (const kind of ["unstaged source", "untracked source", "unstaged builder"]) {
  test(`pre-commit rejects ${kind} before building`, (t) => {
    const { dir, hook } = fixture(t);
    const path = kind === "unstaged builder" ? "tools/build-well-known.mjs" : kind === "untracked source" ? "skills/demo/new.txt" : "skills/demo/SKILL.md";
    writeFileSync(join(dir, path), "not staged\n", { flag: "a" });
    const result = hook();
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /stage|unstaged|untracked/i);
    assert.equal(existsSync(join(dir, ".well-known")), false);
  });
}

test("pre-commit rejects ignored private skill files before packaging", (t) => {
  const { dir, run, hook } = fixture(t);
  writeFileSync(join(dir, ".git/info/exclude"), "skills/demo/private.txt\n");
  writeFileSync(join(dir, "skills/demo/private.txt"), "private local content\n");
  assert.equal(run("git", ["check-ignore", "skills/demo/private.txt"]).status, 0);
  const result = hook();
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /untracked/i);
  assert.equal(existsSync(join(dir, ".well-known")), false);
});

test("hook installation is executable, idempotent and preserves an existing hook", (t) => {
  const { dir, run } = fixture(t);
  const install = () => run("node", ["tools/install-hooks.mjs"]);
  assert.equal(install().status, 0);
  const target = join(dir, ".git/hooks/pre-commit");
  assert.ok(statSync(target).mode & 0o111);
  assert.equal(install().status, 0);
  writeFileSync(target, "#!/bin/sh\necho custom\n");
  const result = install();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /existing/i);
  assert.equal(readFileSync(target, "utf8"), "#!/bin/sh\necho custom\n");
});
