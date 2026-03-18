#!/bin/bash

# Paul - VPS Setup Script (Ubuntu)
# Ce script installe Docker, Docker Compose et configure les permissions.

set -e

echo "--- Mise à jour du système ---"
sudo apt-get update && sudo apt-get upgrade -y

echo "--- Installation des dépendances ---"
sudo apt-get install -y ca-certificates curl gnupg lsb-release

echo "--- Configuration de Docker ---"
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "--- Configuration des permissions ---"
sudo usermod -aG docker $USER

echo "--- Installation terminée ! ---"
echo "Déconnectez-vous et reconnectez-vous pour que les changements de groupe Docker s'appliquent."
