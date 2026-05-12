#!/bin/bash
# Pull the latest changes from the repository and update the local copy of the code.

git pull

docker rm -f job-tracker-app

docker-compose -f docker-compose.full.yml up -d --build