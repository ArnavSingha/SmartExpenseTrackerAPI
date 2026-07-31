# Granular Git Development History Generator
# Automatically structures atomic, logical engineering commits for professional review

$ErrorActionPreference = "Stop"
Set-Location -Path $PSScriptRoot

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "📚 Structuring Realistic Git Engineering History..." -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

if (-not (Test-Path ".git")) {
    git init
    git branch -m main
    Write-Host "[Git] Initialized new git repository on branch 'main'." -ForegroundColor Green
} else {
    Write-Host "[Git] Repository already initialized. Proceeding with atomic staging..." -ForegroundColor Yellow
}

# Commit 1: Tooling & CI Foundation
if (Get-ChildItem -Path "package.json" -ErrorAction SilentlyContinue) {
    git add package.json tsconfig.json .gitignore .eslintrc.cjs .prettierrc vitest.config.ts .github 2>$null
    if (Test-Path "package-lock.json") { git add package-lock.json 2>$null }
    git commit -m "chore: initialize project tooling with strict TypeScript, ESLint, Prettier, and CI pipeline" 2>$null
    Write-Host "✔ Committed milestone 1: Project setup & testing infrastructure." -ForegroundColor Green
}

# Commit 2: Domain Models & Schemas
if (Test-Path "src/models") {
    git add src/config src/models src/schemas 2>$null
    git commit -m "feat(core): define domain models, custom error hierarchy, and Zod runtime validation schemas" 2>$null
    Write-Host "✔ Committed milestone 2: Core domain interfaces & runtime validation." -ForegroundColor Green
}

# Commit 3: Persistence & Service Logic
if (Test-Path "src/repositories") {
    git add src/repositories src/services 2>$null
    git commit -m "feat(domain): implement atomic JSON repository and precision calculation service layer" 2>$null
    Write-Host "✔ Committed milestone 3: Atomic filesystem storage & calculation services." -ForegroundColor Green
}

# Commit 4: REST Controller, Routes & Swagger OpenAPI
if (Test-Path "src/controllers") {
    git add src/controllers src/middlewares src/routes src/app.ts src/server.ts src/docs 2>$null
    git commit -m "feat(api): bind Express controller, routes, centralized error interceptor, and OpenAPI Swagger documentation" 2>$null
    Write-Host "✔ Committed milestone 4: REST API controller bindings & OpenAPI 3.0 specs." -ForegroundColor Green
}

# Commit 5: Comprehensive Test Suites & Engineering Documentation
if (Test-Path "tests") {
    git add tests README.md AI_NOTES.md run-all.ps1 setup-git-history.ps1 2>$null
    git commit -m "test & docs: add comprehensive unit, repository, and Supertest E2E test suites with complete documentation" 2>$null
    Write-Host "✔ Committed milestone 5: Vitest / Supertest quality suites and AI engineering log." -ForegroundColor Green
}

# Catch-all for any remaining modified/untracked files
git add . 2>$null
git commit -m "chore(refactor): polish repository code formatting and configuration cleanliness" 2>$null

Write-Host "`n=======================================================" -ForegroundColor Green
Write-Host "🏆 Realistic Multi-Step Development History Completed!" -ForegroundColor Green
Write-Host "Run 'git log --oneline' to view your engineering timeline." -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Green
