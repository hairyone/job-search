#!/bin/bash
# Pull the latest changes from the repository and update the local copy of the code.

git pull

docker compose up -d --build