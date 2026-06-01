#!/bin/bash
# Pull the latest changes from the repository and update the local copy of the code.

set -e

git pull

# Use docker compose v2 if available, otherwise fall back to v1 (docker-compose).
if docker compose version >/dev/null 2>&1; then
    docker compose up -d --build
else
    docker-compose up -d --build
fi