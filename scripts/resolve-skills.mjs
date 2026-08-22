#!/usr/bin/env node
import { readFileSync } from "node:fs";

const [manifestPath, mode, ...names] = process.argv.slice(2);
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

if (mode === "list") {
  for (const [name, skill] of Object.entries(manifest.skills)) {
    const dependencies = skill.dependsOn.length ? skill.dependsOn.join(", ") : "none";
    console.log(`${name}\t${skill.invocation}\t${dependencies}`);
  }
  process.exit(0);
}

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

for (const name of names) visit(name);
console.log(ordered.join("\n"));
