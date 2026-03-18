# --- Configuration ---
$OPENCLAW_MODEL = if ($env:OPENCLAW_MODEL) { $env:OPENCLAW_MODEL } else { "kimi-k2.5:cloud" }
$WEB_PORT = 3000
$API_PORT = 4000
$DB_WAIT_TIME = 3
# ---------------------

Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "🚀 Démarrage de Paul (Uprising Studio) en local..." -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Démarrage de Docker (Postgres & Ollama)
Write-Host "[1/4] Démarrage des conteneurs (Postgres & Ollama)..." -ForegroundColor Yellow
docker-compose -f infra/docker/docker-compose.yml up -d postgres ollama

Write-Host "Attente de l'initialisation de la base de données ($($DB_WAIT_TIME)s)..." -ForegroundColor DarkGray
Start-Sleep -Seconds $DB_WAIT_TIME

# 2. Migrations Prisma
Write-Host "[2/4] Vérification et application des migrations Prisma..." -ForegroundColor Yellow
Push-Location services\actions-service
# npm install (au cas où ce n'est pas fait)
npm install --silent
if (Test-Path "..\..\.env") { Copy-Item "..\..\.env" ".env" -Force }
npx prisma migrate dev --schema=../../db/schema.prisma
npx prisma generate --schema=../../db/schema.prisma
Pop-Location

# 3. Démarrage des services Node.js (API, Web)
Write-Host "[3/4] Démarrage des services (API, Web)..." -ForegroundColor Yellow

# Démarrer Actions Service (API) sur le port $API_PORT
Start-Process pwsh -ArgumentList "-NoExit -Title `"Paul API (Actions Service)`" -Command `"cd services/actions-service ; title 'Paul API (Actions Service)' ; npm run dev`""

# Note: Onyx (Web Console) se gère via Docker ou le script d'installation dans /web-console
Write-Host "💡 Note: Onyx (Web Console) doit être lancé via son système Docker dédié dans /web-console." -ForegroundColor DarkGray

# 4. Choix de l'agent (NanoClaw ou OpenClaw)
Write-Host ""
Write-Host "[4/4] Quel agent souhaitez-vous lancer ?" -ForegroundColor Yellow
Write-Host "1) NanoClaw (Local - Discord Bot)"
Write-Host "2) OpenClaw (Cloud - $OPENCLAW_MODEL)"
$choice = Read-Host "Votre choix [1/2] (Défaut: 1)"

if ($choice -eq "2") {
    Write-Host "🚀 Lancement de OpenClaw avec le modèle $OPENCLAW_MODEL..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit -Title `"Paul OpenClaw`" -Command `"ollama launch openclaw --model $OPENCLAW_MODEL`""
} else {
    Write-Host "🚀 Lancement de NanoClaw..." -ForegroundColor Green
    Start-Process pwsh -ArgumentList "-NoExit -Title `"Paul NanoClaw (Discord)`" -Command `"cd nanoclaw ; title 'Paul NanoClaw (Discord)' ; npm run dev`""
}

Write-Host ""
Write-Host "✅ Configuration terminée !" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "👉 Onyx (Web UI) : http://localhost:$WEB_PORT" -ForegroundColor White
Write-Host "👉 API Health    : http://localhost:$API_PORT/api/health" -ForegroundColor White
if ($choice -eq "2") {
    Write-Host "👉 OpenClaw      : Interface TUI ouverte dans une nouvelle fenêtre" -ForegroundColor White
} else {
    Write-Host "👉 Discord Bot   : Connecté via NanoClaw" -ForegroundColor White
}
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "Note: 2 à 3 nouvelles fenêtres PowerShell se sont ouvertes pour les logs." -ForegroundColor DarkGray
Write-Host ""
