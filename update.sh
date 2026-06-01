#!/bin/bash
# Pull the latest changes from the repository and update the local copy of the code.

set -e

git pull

# Pick docker compose v2 if installed, otherwise fall back to v1.
if docker compose version >/dev/null 2>&1; then
    COMPOSE="docker compose"
else
    COMPOSE="docker-compose"
fi

# `down` then `up` avoids the v1 KeyError: 'ContainerConfig' bug on recreate.
# Named volumes and bind mounts are preserved by `down`.
$COMPOSE down
$COMPOSE up -d --build