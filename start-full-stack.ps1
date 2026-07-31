# Automated Full-Stack Launcher (Backend API and Framer Motion Frontend)
# Plain ASCII encoding to prevent PowerShell codepage parsing errors

$ErrorActionPreference = "Stop"
$Root = $PSScriptRoot
Set-Location -Path $Root

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Smart Expense Tracker - Full-Stack Execution Portal" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

Write-Host "`n[1/3] Verifying Express REST API dependencies in root..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) { npm install }

Write-Host "`n[2/3] Installing and preparing React Framer Motion client..." -ForegroundColor Yellow
Set-Location -Path "$Root\client"
if (-not (Test-Path "node_modules")) { npm install }

Write-Host "`n[3/3] Launching both Express REST API (Port 3000) and Vite UI (Port 5173)..." -ForegroundColor Green
Write-Host "Open your browser at: http://localhost:5173/" -ForegroundColor Cyan

# Launch Express Server in separate background terminal session
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$Root'; Write-Host 'REST API Port 3000' -ForegroundColor Green; npm run dev"

# Launch Vite React Client directly in current session
npm run dev
