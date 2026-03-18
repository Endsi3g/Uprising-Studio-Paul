# Script de déploiement pour Project Paul (Uprising Studio) sur un VPS
# Récupère le dernier code, build les images Docker et lance la production.

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 Déploiement de Paul (Uprising Studio) en production..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Mise à jour du code
Write-Host "[1/5] 📥 Récupération du dernier code depuis GitHub..." -ForegroundColor Yellow
git pull origin main
git submodule update --init --recursive

# 2. Vérification de l'environnement
Write-Host "[2/5] 🔐 Vérification des variables d'environnement..." -ForegroundColor Yellow
if (-not (Test-Path ".env")) {
    Write-Host "⚠ Attention: Fichier .env manquant à la racine. Création à partir de .env.example..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "❌ Arrêt du déploiement. Remplissez les vraies valeurs dans le .env à la racine." -ForegroundColor Red
    exit 1
}

if (-not (Test-Path "nanoclaw/.env")) {
    Write-Host "⚠ Attention: Fichier nanoclaw/.env manquant. Création à partir de .env.example..." -ForegroundColor Yellow
    Copy-Item "nanoclaw/.env.example" "nanoclaw/.env"
     Write-Host "❌ Arrêt du déploiement. Remplissez DISCORD_BOT_TOKEN dans nanoclaw/.env." -ForegroundColor Red
    exit 1
}

# 3. Construction des images Docker
Write-Host "[3/5] 🏗️ Build des images Docker (API, Web Console, NanoClaw)..." -ForegroundColor Yellow
# Pas de profile "dev" ici, on lance le profile par défaut défini dans docker-compose.yml 
# qui inclut les 3 services + db + ollama.
docker-compose -f infra/docker/docker-compose.yml build --no-cache

# 4. Lancement des services
Write-Host "[4/5] 🐳 Démarrage des conteneurs en mode détaché..." -ForegroundColor Yellow
docker-compose -f infra/docker/docker-compose.yml up -d

Write-Host "Attente du démarrage de la base de données (5s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds 5

# 5. Migrations de base de données
Write-Host "[5/5] 🗄️ Application des migrations Prisma en production..." -ForegroundColor Yellow
docker compose -f infra/docker/docker-compose.yml exec -T actions-service npx prisma migrate deploy

Write-Host ""
Write-Host "[5/5] ✅ Déploiement terminé avec succès !" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "👉 Les services tournent en arrière-plan via Docker." -ForegroundColor White
Write-Host "👉 Console Web accessible sur le port 3000 de ce VPS." -ForegroundColor White
Write-Host "👉 API backend accessible sur le port 4000 de ce VPS." -ForegroundColor White
Write-Host "👉 Pour voir les logs : docker-compose logs -f" -ForegroundColor DarkGray
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
