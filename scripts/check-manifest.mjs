#!/usr/bin/env node
// Verify skills/manifest.json against the real "Call the Skill tool with" calls in each SKILL.md.
import { readFileSync, existsSync, readdirSync } from "node:fs";

const manifestPath = process.argv[2] ?? "skills/manifest.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const problems = [];

const CALL_PATTERN = /Skill tool (?:twice, )?(?:with|for) "([a-z-]+)"(?: and "([a-z-]+)")?/g;

function callsIn(body) {
  return new Set(
    [...body.matchAll(CALL_PATTERN)].flatMap(match => [match[1], match[2]]).filter(Boolean),
  );
}

// 1. every declared skill has a SKILL.md, and every SKILL.md is declared
const onDisk = new Set();
for (const bucket of readdirSync("skills", { withFileTypes: true })) {
  if (!bucket.isDirectory()) continue;
  for (const entry of readdirSync(`skills/${bucket.name}`, { withFileTypes: true })) {
    if (entry.isDirectory() && existsSync(`skills/${bucket.name}/${entry.name}/SKILL.md`)) {
      onDisk.add(entry.name);
    }
  }
}
for (const name of Object.keys(manifest.skills)) {
  if (!onDisk.has(name)) problems.push(`manifest declares "${name}" but no SKILL.md exists`);
}
for (const name of onDisk) {
  if (!manifest.skills[name]) problems.push(`SKILL.md exists for "${name}" but manifest does not declare it`);
}

// 2. every explicit runtime call is declared in dependsOn
for (const [name, meta] of Object.entries(manifest.skills)) {
  const file = `skills/${meta.bucket}/${name}/SKILL.md`;
  if (!existsSync(file)) continue;
  const declared = new Set(meta.dependsOn);
  for (const call of callsIn(readFileSync(file, "utf8"))) {
    if (call === name) continue;
    if (!manifest.skills[call]) {
      problems.push(`${name} calls "${call}" which is not in the manifest`);
    } else if (!declared.has(call)) {
      problems.push(`${name} calls "${call}" but dependsOn is missing it`);
    }
  }

  // 3. invocation mode must match the frontmatter and the openai policy file
  const body = readFileSync(file, "utf8");
  const manualOnly = /^disable-model-invocation:\s*true$/m.test(body);
  if (manualOnly && meta.invocation !== "manual-only") {
    problems.push(`${name} sets disable-model-invocation but manifest says ${meta.invocation}`);
  }
  if (!manualOnly && meta.invocation === "manual-only") {
    problems.push(`${name} is manual-only in the manifest but has no disable-model-invocation`);
  }
  const policyFile = `skills/${meta.bucket}/${name}/agents/openai.yaml`;
  if (!existsSync(policyFile)) {
    problems.push(`${name} is missing agents/openai.yaml`);
  } else {
    const policy = readFileSync(policyFile, "utf8");
    const implicitFalse = /allow_implicit_invocation:\s*false/.test(policy);
    if (manualOnly !== implicitFalse) {
      problems.push(`${name} invocation mode disagrees between SKILL.md and agents/openai.yaml`);
    }
  }
}

// 4. workflow references must resolve
for (const [name, workflow] of Object.entries(manifest.workflows ?? {})) {
  const groups = {
    entrySkills: workflow.entrySkills ?? [],
    bundledSkills: workflow.bundledSkills ?? [],
    optionalSkills: workflow.optionalSkills ?? [],
  };
  for (const [group, names] of Object.entries(groups)) {
    for (const skill of names) {
      if (!manifest.skills[skill]) problems.push(`workflow ${name}.${group} references unknown skill "${skill}"`);
    }
  }
}

if (problems.length) {
  for (const problem of problems) console.error(`FAIL  ${problem}`);
  console.error(`\n${problems.length} problem(s) found.`);
  process.exit(1);
}
console.log(`OK  ${Object.keys(manifest.skills).length} skills, ${Object.keys(manifest.workflows ?? {}).length} workflows, manifest matches every SKILL.md`);
