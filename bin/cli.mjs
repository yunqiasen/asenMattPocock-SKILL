#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const [command, ...args] = process.argv.slice(2);

const commands = {
  init: "scripts/init-project.sh",
  install: "scripts/install-skills.sh",
  list: "scripts/list-skills.sh",
};

function usage() {
  console.log(`Usage: asen-skills <command> [options]

Commands:
  init      Initialize a target project (docs/agents + agent instructions block)
  install   Install skills or a workflow into a project or globally
  list      List every SKILL.md in this repository

Examples:
  npx github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork init --project /path/to/project
  npx github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork install --project /path/to/project --agent codex --workflow standard
  npx github:yunqiasen/asenMattPocock-SKILL#MattPocock-Fork install --list-workflows

Run "asen-skills <command> --help" for command options.`);
}

if (!command || command === "--help" || command === "-h") {
  usage();
  process.exit(command ? 0 : 2);
}

const script = commands[command];
if (!script) {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exit(2);
}

const result = spawnSync("bash", [resolve(repoRoot, script), ...args], { stdio: "inherit" });
process.exit(result.status ?? 1);
