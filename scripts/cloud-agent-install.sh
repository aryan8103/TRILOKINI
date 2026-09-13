#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

npm ci --prefix server
(cd client && npm ci) || npm install --prefix client --no-audit --no-fund
(cd admin && npm ci) || npm install --prefix admin --no-audit --no-fund

"$ROOT/scripts/cloud-agent-write-env.sh"

# Seed the local database when MongoDB is reachable.
if mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
  (cd server && npm run seed:categories)
  (cd server && npm run seed:products)
  (cd server && npm run seed:collections)
fi
