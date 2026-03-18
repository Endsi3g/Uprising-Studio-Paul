# Script de démarrage local pour Project Paul (Uprising Studio)
# Lance Docker, l'API, la Web Console et NanoClaw en parallèle.

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 Démarrage de Paul (Uprising Studio) en local..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Démarrage de Docker (Postgres & Ollama)
Write-Host "[1/4] 🐳 Démarrage des conteneurs (Postgres & Ollama)..." -ForegroundColor Yellow
docker-compose -f infra/docker/docker-compose.yml up -d postgres ollama

Write-Host "Attente de l'initialisation de la base de données (3s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds 3

# 2. Migrations Prisma
Write-Host "[2/4] 🗄️ Vérification et application des migrations Prisma..." -ForegroundColor Yellow
Push-Location services\actions-service
# npm install (au cas où ce n'est pas fait)
npm install --silent
if (Test-Path "..\..\.env") { Copy-Item "..\..\.env" ".env" -Force }
npx prisma migrate dev --schema=../../db/schema.prisma
npx prisma generate --schema=../../db/schema.prisma
Pop-Location

# 3. Démarrage des services Node.js dans des nouvelles fenêtres
Write-Host "[3/4] ⚙️ Démarrage des services Node.js (API, Web, Bot)..." -ForegroundColor Yellow

# Démarrer Actions Service (API) sur le port 4000
Start-Process pwsh -ArgumentList "-NoExit -Title `"Paul API (Actions Service)`" -Command `"cd services/actions-service ; title 'Paul API (Actions Service)' ; npm run dev`""

# Démarrer Web Console sur le port 3000
Start-Process pwsh -ArgumentList "-NoExit -Title `"Paul Web Console`" -Command `"cd web-console ; title 'Paul Web Console' ; npm run dev`""

# Démarrer NanoClaw
Start-Process pwsh -ArgumentList "-NoExit -Title `"Paul NanoClaw (Discord)`" -Command `"cd nanoclaw ; title 'Paul NanoClaw (Discord)' ; npm run dev`""

Write-Host ""
Write-Host "[4/4] ✅ Démarrage terminé !" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "👉 Web Console : http://localhost:3002" -ForegroundColor White
Write-Host "👉 API Health  : http://localhost:4000/api/health" -ForegroundColor White
Write-Host "👉 Discord Bot : Connecté (vérifie la fenêtre NanoClaw)" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Note: 3 nouvelles fenêtres PowerShell se sont ouvertes pour les logs des différents services." -ForegroundColor DarkGray
Write-Host ""
