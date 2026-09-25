import assert from "node:assert/strict";
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repo = dirname(dirname(fileURLToPath(import.meta.url)));
const checker = join(repo, "scripts/check-manifest.mjs");

function fixture(t) {
  const dir = mkdtempSync("/tmp/asen-manifest-test-");
  cpSync(join(repo, "skills"), join(dir, "skills"), { recursive: true });
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

function editSkill(dir, name, transform) {
  const path = join(dir, "skills/engineering", name, "SKILL.md");
  writeFileSync(path, transform(readFileSync(path, "utf8")));
}

function editManifest(dir, transform) {
  const path = join(dir, "skills/manifest.json");
  const manifest = JSON.parse(readFileSync(path, "utf8"));
  transform(manifest);
  writeFileSync(path, JSON.stringify(manifest));
}

function check(dir) {
  const result = spawnSync(process.execPath, [checker], { cwd: dir, encoding: "utf8" });
  assert.ifError(result.error);
  return { status: result.status, output: result.stdout + result.stderr };
}

test("repository call declarations and invocation modes match", () => {
  const result = check(repo);
  assert.equal(result.status, 0, result.output);
});

test("removing a downstream call does not leave a silent dependency", t => {
  const dir = fixture(t);
  editSkill(dir, "to-spec", text => text.replace(/call the Skill tool with ["'`]to-tickets["'`]/gi, "finish this phase"));
  const result = check(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /to-spec.*to-tickets.*no explicit call/);
});

test("an extra declared dependency is rejected", t => {
  const dir = fixture(t);
  editManifest(dir, m => m.skills.tdd.dependsOn.push("research"));
  const result = check(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /tdd.*research.*no explicit call/);
});

for (const delimiter of ['"', "'", "`"]) {
  test(`an undeclared call using ${delimiter} is rejected`, t => {
    const dir = fixture(t);
    editSkill(dir, "tdd", text => `${text}\nCall the Skill tool with ${delimiter}research${delimiter}\n`);
    const result = check(dir);
    assert.equal(result.status, 1, result.output);
    assert.match(result.output, /tdd calls "research" but dependsOn is missing it/);
  });
}

test("declared targets must exist even without a matching call", t => {
  const dir = fixture(t);
  editManifest(dir, m => m.skills.tdd.dependsOn.push("missing-skill"));
  const result = check(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /tdd.*missing-skill.*not in the manifest/);
});

test("both calls in the paired grilling invocation are checked", t => {
  const dir = fixture(t);
  editManifest(dir, m => {
    m.skills["grill-with-docs"].dependsOn = m.skills["grill-with-docs"].dependsOn.filter(name => name !== "domain-modeling");
  });
  const result = check(dir);
  assert.equal(result.status, 1, result.output);
  assert.match(result.output, /grill-with-docs calls "domain-modeling" but dependsOn is missing it/);
});
