#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
MONGO_DATA="${MONGO_DATA:-/tmp/mongodb-data}"
REDIS_DATA="${REDIS_DATA:-/tmp/redis-data}"

mkdir -p "$MONGO_DATA" "$REDIS_DATA"

if ! redis-cli ping >/dev/null 2>&1; then
  redis-server --daemonize yes --dir "$REDIS_DATA" --port 6379
fi

if ! mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
  mongod \
    --dbpath "$MONGO_DATA" \
    --bind_ip 127.0.0.1 \
    --port 27017 \
    --fork \
    --logpath /tmp/mongod.log
fi

for _ in $(seq 1 30); do
  if redis-cli ping >/dev/null 2>&1 && mongosh --quiet --eval 'db.runCommand({ ping: 1 })' >/dev/null 2>&1; then
    echo "MongoDB and Redis are ready"
    exit 0
  fi
  sleep 1
done

echo "Timed out waiting for MongoDB or Redis" >&2
exit 1
