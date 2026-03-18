# Script de démarrage FULL DOCKER pour Uprising AI Assistant
# Lance TOUTE l'infrastructure (DB, Ollama, API, Web, Bot) dans Docker.

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🐳 Démarrage FULL DOCKER de l'Assistant AI (Uprising Studio)..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Vérification des fichiers d'environnement
Write-Host "[1/4] 🔐 Vérification des variables d'environnement..." -ForegroundColor Yellow

if (-not (Test-Path ".env")) {
    Write-Host "Copie de .env.example vers .env à la racine..." -ForegroundColor DarkGray
    Copy-Item ".env.example" ".env"
}

if (-not (Test-Path "nanoclaw/.env")) {
    Write-Host "Copie de nanoclaw/.env.example vers nanoclaw/.env..." -ForegroundColor DarkGray
    Copy-Item "nanoclaw/.env.example" "nanoclaw/.env"
}

# Astuce importante : pour que Prisma puisse migrer depuis l'intérieur du container API,
# il faut transférer les variables du fichier local vers le docker-compose ou s'assurer
# que l'image Docker les possède. Le compose de prod s'en charge.

# 2. Build des images
Write-Host "[2/4] 🏗️ Build des images Docker (API, Web Console, NanoClaw)..." -ForegroundColor Yellow
docker-compose -f infra/docker/docker-compose.yml build

# 3. Lancement de toute la stack
Write-Host "[3/4] 🚀 Démarrage de TOUS les conteneurs en tâche de fond..." -ForegroundColor Yellow
docker-compose -f infra/docker/docker-compose.yml up -d

Write-Host "Attente du démarrage (5s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds 5

# 4. Migrations de base de données
Write-Host "[4/4] 🗄️ Application des migrations Prisma dans le conteneur API..." -ForegroundColor Yellow
docker compose -f infra/docker/docker-compose.yml exec -T actions-service npx prisma migrate deploy

Write-Host ""
Write-Host "✅ Démarrage de l'Assistant Assistant terminé !" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "👉 Dashboard Web : http://localhost:3002" -ForegroundColor White
Write-Host "👉 API (Backend) : http://localhost:4000/api/health" -ForegroundColor White
Write-Host "👉 Assistant Bot : Connecté en arrière-plan" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Pour voir tous les logs consolidés en direct :" -ForegroundColor DarkGray
Write-Host "docker-compose -f infra/docker/docker-compose.yml logs -f" -ForegroundColor Yellow
Write-Host "Pour arrêter publiquement :" -ForegroundColor DarkGray
Write-Host "docker-compose -f infra/docker/docker-compose.yml down" -ForegroundColor Yellow
Write-Host ""
