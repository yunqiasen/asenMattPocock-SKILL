import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8");
const skill = name => read(`skills/${name === "grilling" ? "productivity" : "engineering"}/${name}/SKILL.md`);
const cards = text => [...text.matchAll(/^Awaiting confirmation:/gm)].length;

test("nested grilling returns without a gate; standalone execution still waits", () => {
  const text = skill("grilling");
  assert.match(text, /Do not add a confirmation gate just to return/);
  assert.match(text, /gate below applies only when `grilling` is the top-level workflow/);
  assert.equal(cards(text), 1);
  assert.match(text, /Resume only after a later user reply explicitly approves/);
});

test("alignment has one combined decision and specification gate", () => {
  const text = skill("grill-with-docs");
  assert.equal(cards(text), 1);
  assert.match(text, /Confirm the complete alignment result and permission to write the spec together, once/);
  assert.match(text, /without a closing confirmation/);
  assert.match(text, /Continue domain-modeling and document updates without asking permission/);
  assert.match(text, /Stop after the card/);
  assert.match(text, /do not load or delegate the downstream phase/);
});

test("spec retains test design but removes separate seam approval", () => {
  const text = skill("to-spec");
  assert.equal(cards(text), 1);
  assert.doesNotMatch(text, /Awaiting confirmation: test seams|Entry approved, test seams not yet approved/);
  assert.match(text, /Do not open a separate test-seam approval gate/);
  assert.match(text, /## Testing Decisions/);
  assert.match(text, /public seams to exercise/);
  assert.match(text, /Do not load `to-tickets`, create tickets, or implement anything while this gate is pending/);
  assert.match(text, /Do not read downstream skills to work around a missing tool/);
  assert.match(text, /split and publish tickets, then implement them in dependency order/);
  assert.match(text, /Approval of the spec alone is not implementation permission/);
});

test("ticket decomposition automatically hands off without a new gate", () => {
  const text = skill("to-tickets");
  assert.equal(cards(text), 0);
  assert.match(text, /This skill has no routine confirmation gate/);
  assert.match(text, /call the Skill tool with "implement"/);
  assert.match(text, /After publication, automatically continue/);
  assert.doesNotMatch(text, /Combined plan and execution confirmation gate|Implementation confirmation gate|awaiting.*approval/i);
  assert.match(text, /For decomposition-only or publication-only requests, finish that work and stop/);
});

test("batch continuation keeps membership, blockers and per-ticket completion checks", () => {
  const text = skill("to-tickets");
  assert.match(text, /continue to the next selected unblocked ticket without a per-ticket confirmation/);
  assert.match(text, /all its blockers are actually complete/);
  assert.match(text, /Do not mark a failed or partial ticket complete/);
  assert.match(text, /Do not start unselected tickets or silently implement an unapproved prerequisite/);
  assert.match(text, /Do not ask to start the next unselected ticket at completion/);
  assert.match(skill("implement"), /spec-level implementation approval covers tickets faithfully derived from that spec/);
  assert.match(text, /Verify that every ticket traces to the approved scope and acceptance criteria/);
});

test("TDD keeps red-green-refactor and automatic single review without seam gates", () => {
  const text = skill("tdd");
  assert.equal(cards(text), 0);
  assert.doesNotMatch(text, /Ask which skill owns|test seams -> TDD|Test only at pre-agreed seams/);
  for (const step of ["Red before green", "Minimal green", "Refactor while green", "Commit the slice"]) {
    assert.ok(text.includes(step), step);
  }
  assert.match(text, /material change to the agreed behavior, scope, or public contract/);
  assert.match(text, /When TDD is invoked by `implement`, do not execute the `code-review` step here/);
  assert.match(text, /call the Skill tool with "code-review" exactly once/);
  assert.match(skill("implement"), /Missing test seams alone do not block implementation/);
  assert.match(skill("implement"), /ignore the nested `code-review` step/);
});

test("exploration and diagnosis retain their boundaries", () => {
  const wayfinder = skill("wayfinder");
  assert.match(wayfinder, /never resolve more than one ticket per session/);
  assert.match(wayfinder, /returns without a closing approval gate/);
  assert.equal(cards(wayfinder), 1);
  assert.equal(cards(skill("improve-codebase-architecture")), 1);
  assert.equal(cards(skill("diagnosing-bugs")), 1);
});

test("behavior cases cover progress, refusal, scope change and batch boundaries", () => {
  const { evals } = JSON.parse(read("skills/engineering/grill-with-docs/evals/evals.json"));
  assert.equal(evals.length, 21);
  assert.equal(new Set(evals.map(item => item.id)).size, evals.length);
  for (const item of evals) {
    assert.ok(item.prompt && item.expected_output && item.assertions.length >= 2, item.name);
  }
  assert.ok(evals.some(item => item.name === "approved-batch-continues"));
  assert.ok(evals.some(item => item.name === "declined-handoff-stops"));
  assert.ok(evals.some(item => item.name === "scope-change-invalidates-approval"));
});
