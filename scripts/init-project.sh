#!/usr/bin/env bash
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
TEMPLATES="$REPO/templates"

usage() {
  printf '%s\n' \
    'Initialize a target project for the engineering skills.' \
    '' \
    'Usage:' \
    '  scripts/init-project.sh --project <path> [options]' \
    '' \
    'Options:' \
    '  --project <path>     Target project directory. Required.' \
    '  --tracker <value>    github | local. Default: auto-detect from git remote.' \
    '  --instructions <v>   CLAUDE.md | AGENTS.md | both. Default: reuse existing, else AGENTS.md.' \
    '  --with-triage        Also write docs/agents/triage-labels.md (needs the triage skill).' \
    '  --force              Overwrite existing docs/agents/*.md.' \
    '  --dry-run            Print the plan without writing anything.' \
    '  --help               Show this help.'
}

project=""
tracker=""
instructions=""
with_triage=false
force=false
dry_run=false

while (($# > 0)); do
  case "$1" in
    --project)
      [[ $# -ge 2 ]] || { echo "--project requires a path" >&2; exit 2; }
      project="$2"; shift 2 ;;
    --tracker)
      [[ $# -ge 2 ]] || { echo "--tracker requires a value" >&2; exit 2; }
      case "$2" in github|local) tracker="$2" ;; *) echo "Unsupported tracker: $2. Use github or local." >&2; exit 2 ;; esac
      shift 2 ;;
    --instructions)
      [[ $# -ge 2 ]] || { echo "--instructions requires a value" >&2; exit 2; }
      case "$2" in CLAUDE.md|AGENTS.md|both) instructions="$2" ;; *) echo "Unsupported value: $2. Use CLAUDE.md, AGENTS.md or both." >&2; exit 2 ;; esac
      shift 2 ;;
    --with-triage) with_triage=true; shift ;;
    --force) force=true; shift ;;
    --dry-run) dry_run=true; shift ;;
    --help|-h) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

if [[ -z "$project" ]]; then
  echo "--project <path> is required." >&2
  exit 2
fi
if [[ ! -d "$project" ]]; then
  echo "Target project not found: $project" >&2
  exit 2
fi

target="$(cd "$project" && pwd)"
if [[ "$target" == "$REPO" ]]; then
  echo "Refusing to initialize the skills repository itself." >&2
  exit 2
fi

if [[ -z "$tracker" ]]; then
  remotes="$(cd "$target" && git remote -v 2>/dev/null || true)"
  if [[ "$remotes" == *github.com* ]]; then tracker="github"; else tracker="local"; fi
fi

if [[ -z "$instructions" ]]; then
  if [[ -f "$target/CLAUDE.md" && -f "$target/AGENTS.md" ]]; then
    instructions="both"
  elif [[ -f "$target/CLAUDE.md" ]]; then
    instructions="CLAUDE.md"
  elif [[ -f "$target/AGENTS.md" ]]; then
    instructions="AGENTS.md"
  else
    instructions="AGENTS.md"
  fi
fi

instruction_files=()
case "$instructions" in
  both) instruction_files=("CLAUDE.md" "AGENTS.md") ;;
  *) instruction_files=("$instructions") ;;
esac

if [[ "$tracker" == "github" ]]; then
  tracker_template="$TEMPLATES/issue-tracker-github.md"
  tracker_summary="Issues live in GitHub Issues, managed with the \`gh\` CLI."
else
  tracker_template="$TEMPLATES/issue-tracker-local.md"
  tracker_summary="Issues live as Markdown files under \`.scratch/<feature-slug>/\`."
fi

planned=("docs/agents/issue-tracker.md" "docs/agents/domain.md")
if "$with_triage"; then planned+=("docs/agents/triage-labels.md"); fi

printf 'Target project: %s\n' "$target"
printf 'Issue tracker:  %s\n' "$tracker"
printf 'Domain layout:  single-context\n'
printf 'Doc files:      %s\n' "${planned[*]}"
printf 'Instructions:   %s\n' "${instruction_files[*]}"

if "$dry_run"; then
  printf 'Dry run: nothing written.\n'
  exit 0
fi

mkdir -p "$target/docs/agents"

write_doc() {
  local source="$1" destination="$2"
  if [[ -f "$destination" ]] && ! "$force"; then
    printf 'skip     %s (exists, use --force to overwrite)\n' "${destination#"$target"/}"
    return 0
  fi
  cp "$source" "$destination"
  printf 'write    %s\n' "${destination#"$target"/}"
}

write_doc "$tracker_template" "$target/docs/agents/issue-tracker.md"
write_doc "$TEMPLATES/domain.md" "$target/docs/agents/domain.md"
if "$with_triage"; then
  write_doc "$TEMPLATES/triage-labels.md" "$target/docs/agents/triage-labels.md"
fi

build_block() {
  printf '## Agent skills\n\n'
  printf '### Issue tracker\n\n%s See `docs/agents/issue-tracker.md`.\n\n' "$tracker_summary"
  if "$with_triage"; then
    printf '### Triage labels\n\nDefault five-role triage vocabulary. See `docs/agents/triage-labels.md`.\n\n'
  fi
  printf '### Domain docs\n\nSingle-context layout: root `CONTEXT.md` plus `docs/adr/`. See `docs/agents/domain.md`.\n'
}

update_instructions() {
  local file="$1" path="$target/$1"
  local block
  block="$(build_block)"

  if [[ ! -f "$path" ]]; then
    printf '# Agent Instructions\n\n%s\n' "$block" > "$path"
    printf 'create   %s (## Agent skills)\n' "$file"
    return 0
  fi

  if grep -q '^## Agent skills$' "$path"; then
    BLOCK="$block" awk '
      /^## Agent skills$/ && !replaced { print ENVIRON["BLOCK"]; skipping = 1; replaced = 1; next }
      skipping && /^## / { skipping = 0; print "" }
      skipping { next }
      { print }
    ' "$path" > "$path.tmp"
    mv "$path.tmp" "$path"
    printf 'update   %s (## Agent skills replaced in place)\n' "$file"
  else
    printf '\n%s\n' "$block" >> "$path"
    printf 'append   %s (## Agent skills)\n' "$file"
  fi
}

for file in "${instruction_files[@]}"; do
  update_instructions "$file"
done

printf 'Done. to-spec, to-tickets, wayfinder, implement and code-review now read docs/agents/.\n'
