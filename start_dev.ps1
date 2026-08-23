# ====================================================================
# TailleurPro — Script d'orchestration et démarrage complet (Dev & Ngrok)
# ====================================================================

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host "        ✂️  TAILLEURPRO — ORCHESTRATEUR DE DÉVELOPPEMENT ✂️       " -ForegroundColor Gold
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""

$rootDir = $PSScriptRoot
$serverDir = Join-Path $rootDir "server"
$mobileDir = Join-Path $rootDir "mobile"

# 1. Vérification de l'environnement PHP & Base de données
Write-Host "[1/5] 🔍 Vérification de l'API Laravel & Base de données..." -ForegroundColor Yellow
Set-Location $serverDir

# Migration & Seed de sécurité
php artisan migrate --force | Out-Null
php artisan db:seed --class=DemoTailorSeeder --force | Out-Null
Write-Host "   ✅ Base de données migrée et initialisée avec les comptes de test." -ForegroundColor Green

# 2. Démarrage du serveur Laravel sur le port 8008
Write-Host "[2/5] 🚀 Lancement du serveur API Laravel (Port 8008)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$serverDir'; Write-Host '=== 🧵 API LARAVEL TAILLEURPRO (PORT 8008) ===' -ForegroundColor Cyan; php artisan serve --host=0.0.0.0 --port=8008"

Start-Sleep -Seconds 2

# 3. Démarrage du Tunnel Ngrok sur le port 8008
Write-Host "[3/5] 🌐 Lancement du Tunnel Ngrok sur le port 8008..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '=== 🌐 TUNNEL NGROK (PORT 8008) ===' -ForegroundColor Green; ngrok http 8008"

Write-Host "   ⏳ Récupération de l'URL publique Ngrok..." -ForegroundColor Gray
$ngrokUrl = ""
$attempts = 0
while ([string]::IsNullOrEmpty($ngrokUrl) -and $attempts -lt 15) {
    Start-Sleep -Seconds 1
    $attempts++
    try {
        $ngrokApi = Invoke-RestMethod -Uri "http://127.0.0.1:4040/api/tunnels" -TimeoutSec 2 -ErrorAction SilentlyContinue
        if ($ngrokApi.tunnels -and $ngrokApi.tunnels.Count -gt 0) {
            $httpsTunnel = $ngrokApi.tunnels | Where-Object { $_.proto -eq "https" } | Select-Object -First 1
            if ($httpsTunnel) {
                $ngrokUrl = $httpsTunnel.public_url
            } else {
                $ngrokUrl = $ngrokApi.tunnels[0].public_url
            }
        }
    } catch {
        # En attente de l'API ngrok
    }
}

if ([string]::IsNullOrEmpty($ngrokUrl)) {
    Write-Host "   ⚠️ Impossible de détecter l'URL Ngrok automatiquement." -ForegroundColor Yellow
    $ngrokUrl = Read-Host "   [INPUT] Veuillez coller votre URL Ngrok (ex: https://abc-123.ngrok-free.app)"
}

Write-Host "   🎯 URL Publique Ngrok : $ngrokUrl" -ForegroundColor Green

# 4. Configuration automatique des fichiers d'environnement
Write-Host "[4/5] ⚙️ Injection de l'URL dans l'app mobile et le backend..." -ForegroundColor Yellow

# mobile/.env
$mobileEnvPath = Join-Path $mobileDir ".env"
$mobileApiUrl = "$ngrokUrl/api/v2"
Set-Content -Path $mobileEnvPath -Value "EXPO_PUBLIC_API_URL=$mobileApiUrl"
Write-Host "   ✅ mobile/.env mis à jour avec : EXPO_PUBLIC_API_URL=$mobileApiUrl" -ForegroundColor Green

# server/.env (PAYDUNYA_WEBHOOK_URL)
$serverEnvPath = Join-Path $serverDir ".env"
if (Test-Path $serverEnvPath) {
    $serverEnv = Get-Content $serverEnvPath
    $serverEnv = $serverEnv -replace 'PAYDUNYA_WEBHOOK_URL=.*', "PAYDUNYA_WEBHOOK_URL=$ngrokUrl/api/v2/payments/webhook"
    Set-Content -Path $serverEnvPath -Value $serverEnv
    Write-Host "   ✅ server/.env mis à jour avec le webhook PayDunya." -ForegroundColor Green
}

# 5. Démarrage du Bundler Expo Mobile
Write-Host "[5/5] 📱 Lancement du Bundler Expo 54..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$mobileDir'; Write-Host '=== 📱 EXPO METRO BUNDLER ===' -ForegroundColor Magenta; npx expo start -c"

Set-Location $rootDir

Write-Host ""
Write-Host "==================================================================" -ForegroundColor Green
Write-Host " 🎉 ENVIRONNEMENT DE DÉVELOPPEMENT PRÊT À 100% ! " -ForegroundColor Green
Write-Host "==================================================================" -ForegroundColor Green
Write-Host ""
Write-Host " 🌐 URL API Publique Ngrok : $mobileApiUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host " 🔑 IDENTIFIANTS DE TEST :" -ForegroundColor Yellow
Write-Host "   👉 Atelier Démo 1 : Téléphone 773757077 | Code PIN : 1234" -ForegroundColor White
Write-Host "   👉 Atelier Démo 2 : Téléphone 774731493 | Code PIN : 5678" -ForegroundColor White
Write-Host "   👉 Super Admin    : abdallahdiouf.dev@gmail.com | Mdp : Khoudia1970" -ForegroundColor White
Write-Host ""
Write-Host " 📲 Ouvrez l'application Expo Go sur votre iPhone et scannez le QR code !" -ForegroundColor Gold
Write-Host "==================================================================" -ForegroundColor Cyan
Write-Host ""
