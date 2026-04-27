#!/bin/sh
# One-time setup: point this repo's git hooks at the checked-in hooks/ directory.
# Run once after cloning: ./scripts/install-hooks.sh
#
# Why core.hooksPath instead of symlinks: it's repo-local config (lives in
# .git/config, not global), reversible (git config --unset core.hooksPath),
# and works on Windows where symlinks need extra setup.

set -e

cd "$(dirname "$0")/.."

if [ ! -d hooks ]; then
  echo "❌ hooks/ directory not found. Run from repo root."
  exit 1
fi

git config core.hooksPath hooks
chmod +x hooks/* 2>/dev/null || true

echo "✅ Git hooks installed (core.hooksPath = hooks/)"
echo "   Pre-commit will now run JS integrity + vocabulary validation on index.html changes."
