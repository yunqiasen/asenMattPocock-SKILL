#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [command, ...args] = process.argv.slice(2);

const shellCommands = {
  install: "scripts/install-skills.sh",
  list: "scripts/list-skills.sh",
};

const nodeCommands = {
  check: "scripts/check-manifest.mjs",
};

function usage() {
  console.log(`Usage: asen-skills <command> [options]

Commands:
  install   Install skills or a workflow into a project or globally
  list      List every SKILL.md in this repository
  check     Verify manifest.json against the real skill calls in every SKILL.md

Examples:
  npx github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork install --project /path/to/project --agent codex --workflow standard
  npx github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork install --list-workflows

No project setup is required. Skills write their specs and tickets to .scratch/
by default, or to GitHub Issues when the repository has a GitHub remote.

Run "asen-skills <command> --help" for command options.`);
}

if (!command || command === "--help" || command === "-h") {
  usage();
  process.exit(command ? 0 : 2);
}

const shellScript = shellCommands[command];
const nodeScript = nodeCommands[command];
if (!shellScript && !nodeScript) {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exit(2);
}

// Shell commands keep the caller's cwd so relative --project paths resolve.
// The manifest checker reads repo-relative paths, so it runs from the repo root.
const result = shellScript
  ? spawnSync("bash", [resolve(repoRoot, shellScript), ...args], { stdio: "inherit" })
  : spawnSync(process.execPath, [resolve(repoRoot, nodeScript), ...args], { stdio: "inherit", cwd: repoRoot });
process.exit(result.status ?? 1);
