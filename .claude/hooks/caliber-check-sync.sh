#!/bin/sh
# Honor core.hooksPath if set (we use hooks/ via scripts/install-hooks.sh).
HOOKS_DIR=$(git config core.hooksPath 2>/dev/null)
HOOKS_DIR="${HOOKS_DIR:-.git/hooks}"
if grep -q "caliber" "$HOOKS_DIR/pre-commit" 2>/dev/null; then
  exit 0
fi
FLAG="/tmp/caliber-nudge-$(echo "$PWD" | (shasum 2>/dev/null || sha1sum 2>/dev/null || md5sum 2>/dev/null || cksum) | cut -c1-8)"
find /tmp -maxdepth 1 -name "caliber-nudge-*" -mmin +120 -delete 2>/dev/null
if [ -f "$FLAG" ]; then
  exit 0
fi
touch "$FLAG"
printf '{"decision":"block","reason":"Caliber agent config sync is not set up on this machine. Tell the user: This project uses Caliber to keep agent configs in sync — it is not set up yet. Want me to run /setup-caliber? (~30 seconds)"}'
