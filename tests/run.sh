#!/bin/sh
# Run from anywhere: sh tests/run.sh   (needs node, python3, playwright with chromium)
cd "$(dirname "$0")" || exit 1
fail=0
for f in unit/*.js; do echo "== $f"; node "$f" | tail -2 || fail=1; done
for f in e2e/e2e*.py e2e/ss.py e2e/ovf.py; do echo "== $f"; python3 "$f" 2>&1 | grep -E "^FAIL|Traceback|pass,|ERRORS" | head -5; done
