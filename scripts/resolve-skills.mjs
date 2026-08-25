#!/usr/bin/env node
import { readFileSync } from "node:fs";

const [manifestPath, mode, ...args] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function getWorkflow(name) {
  const workflow = manifest.workflows?.[name];
  if (!workflow) throw new Error(`Unknown workflow: ${name}`);
  if (Array.isArray(workflow)) {
    return { entrySkills: workflow, bundledSkills: [], optionalSkills: [] };
  }
  return {
    entrySkills: workflow.entrySkills ?? [],
    bundledSkills: workflow.bundledSkills ?? [],
    optionalSkills: workflow.optionalSkills ?? [],
  };
}

function resolveNames(rootNames) {
  const visiting = new Set();
  const visited = new Set();
  const ordered = [];

  function visit(name) {
    const skill = manifest.skills[name];
    if (!skill) throw new Error(`Unknown skill: ${name}`);
    if (visiting.has(name)) throw new Error(`Dependency cycle at: ${name}`);
    if (visited.has(name)) return;
    visiting.add(name);
    for (const dependency of skill.dependsOn) visit(dependency);
    visiting.delete(name);
    visited.add(name);
    ordered.push(name);
  }

  for (const name of rootNames) visit(name);
  return ordered;
}

if (mode === "list") {
  for (const [name, skill] of Object.entries(manifest.skills)) {
    const dependencies = skill.dependsOn.length ? skill.dependsOn.join(", ") : "none";
    console.log(`${name}\t${skill.invocation}\t${dependencies}`);
  }
  process.exit(0);
}

if (mode === "list-workflows") {
  for (const name of Object.keys(manifest.workflows ?? {})) {
    const { entrySkills, bundledSkills, optionalSkills } = getWorkflow(name);
    const required = resolveNames([...entrySkills, ...bundledSkills]);
    const optional = resolveNames([...entrySkills, ...bundledSkills, ...optionalSkills])
      .filter(skill => !required.includes(skill));
    console.log([
      name,
      required.length,
      optional.length,
      required.join(", "),
      optional.join(", ") || "none",
      required.length + optional.length,
    ].join("\t"));
  }
  process.exit(0);
}

if (mode === "workflow-optional-skills") {
  const optionalSkills = new Set();
  for (const workflowName of args) {
    for (const name of getWorkflow(workflowName).optionalSkills) optionalSkills.add(name);
  }
  console.log([...optionalSkills].join("\n"));
  process.exit(0);
}

if (mode === "workflow-bundled-skills") {
  const bundledSkills = new Set();
  for (const workflowName of args) {
    for (const name of getWorkflow(workflowName).bundledSkills) bundledSkills.add(name);
  }
  console.log([...bundledSkills].join("\n"));
  process.exit(0);
}

let names = args;
if (mode.startsWith("workflow")) {
  const withOptional = mode.includes("optional");
  const withBundled = !mode.includes("no-bundled");
  names = [];
  for (const workflowName of args) {
    const { entrySkills, bundledSkills, optionalSkills } = getWorkflow(workflowName);
    names.push(...entrySkills);
    if (withBundled) names.push(...bundledSkills);
    if (withOptional) names.push(...optionalSkills);
  }
}

console.log(resolveNames(names).join("\n"));
