#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
MANIFEST="$REPO/skills/manifest.json"
RESOLVER="$REPO/scripts/resolve-skills.mjs"
DEFAULT_SOURCE="https://github.com/yunqiasen/asenMattPocock-SKILL/tree/develop"

usage() {
  printf '%s\n' \
    'Usage:' \
    '  scripts/install-skills.sh --project <path> --agent <claude-code|codex> --skill <name> [...]' \
    '  scripts/install-skills.sh --global --agent <claude-code|codex> --skill <name> [...]' \
    '  scripts/install-skills.sh --list' \
    '' \
    'Options:' \
    '  --project <path>  Install into one project directory.' \
    '  --global          Install for the current user across projects.' \
    '  --agent <name>    Repeat for claude-code and/or codex.' \
    '  --skill <name>    Repeat to select one or more skills.' \
    '  --all             Install all 17 skills.' \
    '  --source <value>  Override the GitHub source or use a local checkout.' \
    '  --symlink         Use symlinks when supported instead of copies.' \
    '  --list            List the 17 skills and their dependencies.' \
    '  --help            Show this help.'
}

project=""
global_install=false
source="$DEFAULT_SOURCE"
copy=true
list=false
all=false
agents=()
requested=()

while (($# > 0)); do
  case "$1" in
    --project)
      [[ $# -ge 2 ]] || { echo "--project requires a path" >&2; exit 2; }
      project="$2"
      shift 2
      ;;
    --global)
      global_install=true
      shift
      ;;
    --agent)
      [[ $# -ge 2 ]] || { echo "--agent requires a name" >&2; exit 2; }
      case "$2" in
        claude-code|codex) agents+=("$2") ;;
        *) echo "Unsupported agent: $2. Use claude-code or codex." >&2; exit 2 ;;
      esac
      shift 2
      ;;
    --skill)
      [[ $# -ge 2 ]] || { echo "--skill requires a name" >&2; exit 2; }
      requested+=("$2")
      shift 2
      ;;
    --all)
      all=true
      shift
      ;;
    --source)
      [[ $# -ge 2 ]] || { echo "--source requires a value" >&2; exit 2; }
      source="$2"
      shift 2
      ;;
    --symlink)
      copy=false
      shift
      ;;
    --list)
      list=true
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

if "$list"; then
  printf 'NAME\tINVOCATION\tDEPENDENCIES\n'
  node "$RESOLVER" "$MANIFEST" list
  exit 0
fi

if "$global_install" && [[ -n "$project" ]]; then
  echo "Use either --project or --global, not both." >&2
  exit 2
fi
if ! "$global_install" && [[ -z "$project" ]]; then
  echo "Choose an install scope with --project <path> or --global." >&2
  exit 2
fi
if ((${#agents[@]} == 0)); then
  echo "At least one --agent is required." >&2
  exit 2
fi
if "$all" && ((${#requested[@]} > 0)); then
  echo "Use either --all or --skill, not both." >&2
  exit 2
fi

if "$all"; then
  while IFS= read -r name; do
    requested+=("$name")
  done < <(node - "$MANIFEST" <<'NODE'
const { readFileSync } = require("node:fs");
const manifest = JSON.parse(readFileSync(process.argv[2], "utf8"));
console.log(Object.keys(manifest.skills).join("\n"));
NODE
  )
fi
if ((${#requested[@]} == 0)); then
  echo "At least one --skill or --all is required." >&2
  exit 2
fi

resolved=()
while IFS= read -r name; do
  resolved+=("$name")
done < <(node "$RESOLVER" "$MANIFEST" resolve "${requested[@]}")

command=(npx --yes skills@latest add "$source")
for agent in "${agents[@]}"; do command+=(--agent "$agent"); done
for name in "${resolved[@]}"; do command+=(--skill "$name"); done
if "$global_install"; then command+=(--global); fi
if "$copy"; then command+=(--copy); fi
command+=(--yes)

printf 'Installing: %s\n' "${resolved[*]}"
printf 'Agents: %s\n' "${agents[*]}"
if "$global_install"; then
  printf 'Scope: global\n'
  "${command[@]}"
else
  target="$(cd "$project" && pwd)"
  printf 'Scope: project\nPath: %s\n' "$target"
  (cd "$target" && "${command[@]}")
fi
