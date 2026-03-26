#!/usr/bin/env bash
# Run from repo root: pnpm ship -- "Your commit message"
# Message is optional; defaults to "Update".
set -e
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

msg="${*:-Update}"
git add -A
git commit -m "$msg"
git push
