#!/usr/bin/env bash
# Build the production app, start it, run the e2e suite against it, then stop.
# Usage: bash tests/run-e2e.sh
set -euo pipefail

cd "$(dirname "$0")/.."

PORT="${PORT:-4139}"
BASE="http://localhost:${PORT}"

echo "▸ Building production app..."
npm run build >/dev/null

echo "▸ Starting server on :${PORT}..."
# Start WITHOUT Instagram env so the gallery is in its fallback state.
env -u BEHOLD_FEED_ID -u INSTAGRAM_TOKEN npx next start -p "$PORT" >/tmp/cult-e2e.log 2>&1 &
SERVER_PID=$!
trap 'kill "$SERVER_PID" 2>/dev/null || true' EXIT

echo "▸ Waiting for server..."
for _ in $(seq 1 30); do
  if curl -s -o /dev/null "$BASE/"; then break; fi
  sleep 1
done

echo "▸ Running e2e tests..."
TEST_BASE_URL="$BASE" node --test tests/e2e/*.test.ts
