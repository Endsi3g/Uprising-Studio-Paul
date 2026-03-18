#!/bin/bash

# Paul - Database Migration Script
# Pour lancer Prisma sur le container actions-service

docker compose -f infra/docker/docker-compose.yml exec actions-service npx prisma migrate dev
