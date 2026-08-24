#!/usr/bin/env node
import { readFileSync } from "node:fs";

const [manifestPath, mode, ...args] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

function getWorkflow(name) {
  const workflow = manifest.workflows?.[name];
  if (!workflow) throw new Error(`Unknown workflow: ${name}`);
  if (Array.isArray(workflow)) return { entrySkills: workflow, prerequisites: [] };
  return {
    entrySkills: workflow.entrySkills ?? [],
    prerequisites: workflow.prerequisites ?? [],
  };
}

if (mode === "list") {
  for (const [name, skill] of Object.entries(manifest.skills)) {
    const dependencies = skill.dependsOn.length ? skill.dependsOn.join(", ") : "none";
    console.log(`${name}\t${skill.invocation}\t${dependencies}`);
  }
  process.exit(0);
}

let names = args;
if (mode === "workflow" || mode === "workflow-all") {
  names = [];
  for (const workflowName of args) {
    const { entrySkills, prerequisites } = getWorkflow(workflowName);
    if (mode === "workflow-all") names.push(...prerequisites);
    names.push(...entrySkills);
  }
}

if (mode === "workflow-prerequisites") {
  const prerequisites = new Set();
  for (const workflowName of args) {
    for (const name of getWorkflow(workflowName).prerequisites) prerequisites.add(name);
  }
  console.log([...prerequisites].join("\n"));
  process.exit(0);
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

if (mode === "list-workflows") {
  for (const name of Object.keys(manifest.workflows ?? {})) {
    const { entrySkills, prerequisites } = getWorkflow(name);
    const resolved = resolveNames([...prerequisites, ...entrySkills]);
    console.log(`${name}\t${entrySkills.join(", ")}\t${prerequisites.join(", ") || "none"}\t${resolved.length}\t${resolved.join(", ")}`);
  }
  process.exit(0);
}

console.log(resolveNames(names).join("\n"));
