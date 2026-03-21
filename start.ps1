# PowerShell script to start Tailor App with Docker Compose

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Tailor App - Docker Compose Startup   " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker is running
try {
    docker info > $null 2>&1
} catch {
    Write-Host "ERROR: Docker is not running or not installed." -ForegroundColor Red
    Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
    exit 1
}

# Check if docker-compose is available
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "WARNING: docker-compose not found, using 'docker compose' plugin." -ForegroundColor Yellow
    $composeCommand = "docker compose"
} else {
    $composeCommand = "docker-compose"
}

# Copy environment file if not exists
if (-not (Test-Path ".env")) {
    Write-Host "Copying .env.docker to .env..." -ForegroundColor Green
    Copy-Item ".env.docker" ".env" -Force
}

# Build and start containers
Write-Host "Building and starting containers..." -ForegroundColor Green
Invoke-Expression "$composeCommand up --build -d"

Write-Host ""
Write-Host "Services are starting..." -ForegroundColor Green
Write-Host "  - Backend API:   http://localhost:8000" -ForegroundColor Yellow
Write-Host "  - Frontend App:  http://localhost:5173" -ForegroundColor Yellow
Write-Host "  - Database:      SQLite (volume: tailor_sqlite-data)" -ForegroundColor Yellow
Write-Host ""

# Wait a moment for services to be ready
Write-Host "Waiting for services to be ready..." -ForegroundColor Gray
Start-Sleep -Seconds 10

# Check backend health
try {
    $backendHealth = Invoke-WebRequest -Uri "http://localhost:8000/api/health" -Method Get -TimeoutSec 5
    if ($backendHealth.StatusCode -eq 200) {
        Write-Host "✓ Backend API is healthy" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠ Backend API may still be starting..." -ForegroundColor Yellow
}

# Show logs
Write-Host ""
Write-Host "To view logs, run: $composeCommand logs -f" -ForegroundColor Gray
Write-Host "To stop services, run: $composeCommand down" -ForegroundColor Gray
Write-Host ""

Write-Host "Tailor App is ready! " -ForegroundColor Green