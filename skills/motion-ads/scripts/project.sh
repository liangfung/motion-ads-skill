#!/usr/bin/env bash
# File operations only. The browser executes the delivered React/Remotion code.
set -eu
skill_root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
mode=${1:-}
out=${2:-}
if [ -z "$out" ]; then printf '%s\n' 'Usage: bash <skill>/scripts/project.sh init|check <out> [--example bright|atmospheric]' >&2; exit 1; fi
if [ "$mode" = init ]; then
    example=
    if [ "$#" -gt 2 ]; then
      if [ "$#" -ne 4 ]; then printf '%s\n' '--example requires bright or atmospheric.' >&2; exit 1; fi
      if [ "$3" != '--example' ]; then printf '%s\n' 'Use --example bright or atmospheric.' >&2; exit 1; fi
      example=$4
      if [ "$example" != bright ]; then
        if [ "$example" != atmospheric ]; then printf '%s\n' '--example must be bright or atmospheric.' >&2; exit 1; fi
      fi
    fi
    if [ -e "$out" ]; then printf '%s\n' 'Project already exists; edit its files in place.' >&2; exit 1; fi
    mkdir -p -- "$(dirname -- "$out")"
    mkdir -- "$out"
    cleanup() { rm -rf -- "$out"; exit 1; }
    mkdir -p -- "$out/dist/assets" || cleanup
    cp -- "$skill_root/assets/player-template/index.html" "$skill_root/assets/player-template/styles.css" "$skill_root/assets/player-template/ad.js" "$skill_root/assets/player-template/config.js" "$out/dist/" || cleanup
    cp -- "$skill_root/assets/runtime/motion-runtime.js" "$out/dist/runtime.js" || cleanup
    cp -- "$skill_root/assets/runtime/THIRD-PARTY-NOTICES.txt" "$out/dist/THIRD-PARTY-NOTICES.txt" || cleanup
    cp -- "$skill_root/assets/runtime/version.json" "$out/dist/runtime-version.json" || cleanup
    if [ -n "$example" ]; then cp -- "$skill_root/assets/examples/$example/ad.js" "$skill_root/assets/examples/$example/config.js" "$out/dist/" || cleanup; fi
    printf '%s\n' '{"sourceUrl":null,"facts":[],"assets":[],"assumptions":[],"decisions":{}}' > "$out/brief.json"
    printf '%s\n' "Ready to edit and preview: $out/dist/index.html"
elif [ "$mode" = check ]; then
    if [ "$#" -ne 2 ]; then printf '%s\n' 'check takes only an output path.' >&2; exit 1; fi
    if [ -d "$out/dist" ]; then out=$out/dist; fi
    for name in index.html styles.css runtime.js config.js ad.js runtime-version.json THIRD-PARTY-NOTICES.txt; do
      if [ ! -s "$out/$name" ]; then printf '%s\n' "Missing or empty delivery file: $name" >&2; exit 1; fi
    done
    for name in research qa node_modules brief.json; do
      if [ -e "$out/$name" ]; then printf '%s\n' "Keep working evidence outside dist/: $name" >&2; exit 1; fi
    done
    if grep -Eq 'Product name|Replace with|One clear reason to care|Verified feature|https://example\.(com|org|net)' "$out/config.js"; then printf '%s\n' 'Replace the scaffold inputs before review.' >&2; exit 1; fi
    printf '%s\n' 'Required files present; known scaffold inputs replaced. JavaScript, resources, playback and design still require browser review.'
else
    printf '%s\n' 'Use init or check.' >&2; exit 1
fi
