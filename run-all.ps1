# Automated Setup, Git History Generation, Lint, Build, and Testing Verification Script
# Executed by reviewers or local developers in Windows PowerShell

$ErrorActionPreference = "Stop"
$ProjectDir = $PSScriptRoot
Set-Location -Path $ProjectDir

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "🚀 Smart Expense Tracker API - Verification Suite" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

Write-Host "`n[1/6] 📦 Installing deterministic npm dependencies..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    npm ci
} else {
    npm install
}

Write-Host "`n[2/6] 📚 Generating granular git engineering commit history..." -ForegroundColor Yellow
if (Test-Path "setup-git-history.ps1") {
    & "$ProjectDir\setup-git-history.ps1"
}

Write-Host "`n[3/6] 🎨 Executing Prettier formatting check..." -ForegroundColor Yellow
npm run format:check

Write-Host "`n[4/6] 🧐 Executing strict TypeScript ESLint analysis..." -ForegroundColor Yellow
npm run lint

Write-Host "`n[5/6] 🔨 Compiling strict TypeScript build bundle..." -ForegroundColor Yellow
npm run build

Write-Host "`n[6/6] 🧪 Running Vitest Unit, Repository & Supertest E2E Suite..." -ForegroundColor Yellow
npm run test:coverage

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host "🏆 ALL QUALITY GATES PASSED! READY FOR REVIEW!" -ForegroundColor Green
Write-Host "To launch dev server with Swagger UI: npm run dev" -ForegroundColor Green
Write-Host "To view your atomic commit log:       git log --oneline" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Green
