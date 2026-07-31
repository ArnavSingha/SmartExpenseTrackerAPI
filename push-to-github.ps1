# One-Click Git Initializer and GitHub Pusher
# Plain ASCII encoding to prevent PowerShell codepage parsing errors

$ErrorActionPreference = "Stop"
$RepoUrl = "https://github.com/ArnavSingha/SmartExpenseTrackerAPI.git"

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Smart Expense Tracker - Automated GitHub Publisher" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan

Write-Host "`n[1/4] Verifying git initialization..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
    Write-Host "Initialized clean main git repository." -ForegroundColor Green
} else {
    Write-Host "Git repository already initialized." -ForegroundColor Green
}

Write-Host "`n[2/4] Configuring remote target: $RepoUrl..." -ForegroundColor Yellow
$remotes = git remote
if ($remotes -contains "origin") {
    git remote set-url origin $RepoUrl
    Write-Host "Updated existing origin remote URL." -ForegroundColor Green
} else {
    git remote add origin $RepoUrl
    Write-Host "Added new origin remote." -ForegroundColor Green
}

Write-Host "`n[3/4] Running automated Prettier formatting and staging files..." -ForegroundColor Yellow
if (Test-Path ".eslintrc.cjs") {
    Write-Host "Removing legacy .eslintrc.cjs in favor of ESLint 10 flat configuration..." -ForegroundColor Cyan
    Remove-Item ".eslintrc.cjs" -Force -ErrorAction SilentlyContinue
    if (Test-Path ".git") { git rm .eslintrc.cjs --ignore-unmatch 2>$null }
}
if (Test-Path "package.json") {
    Write-Host "Executing Prettier code formatter to guarantee CI alignment..." -ForegroundColor Cyan
    npm run format
}
git add .

Write-Host "`n[4/4] Committing and pushing to public repository..." -ForegroundColor Green
git commit -m "feat: complete elite software engineering apprenticeship submission"
git push -u origin main --force

Write-Host "`nSuccessfully pushed to https://github.com/ArnavSingha/SmartExpenseTrackerAPI !" -ForegroundColor Cyan
