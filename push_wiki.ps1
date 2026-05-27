# push_wiki.ps1
# Script to push local wiki pages to GitHub Wiki repository.

param (
    [string]$Token
)

# If no token is provided as a parameter, try to prompt for it
if ([string]::IsNullOrEmpty($Token)) {
    $Token = Read-Host -Prompt "Enter your GitHub Personal Access Token (PAT)"
    if ([string]::IsNullOrEmpty($Token)) {
        Write-Host "[ERROR] GitHub Personal Access Token is required." -ForegroundColor Red
        exit 1
    }
}

$wikiUrl = "https://$($Token)@github.com/dpraanav558-glitch/pgents.wiki.git"
$wikiDir = Join-Path $PSScriptRoot ".wiki-temp"
$localWikiDir = Join-Path $PSScriptRoot "wiki"
$git = "C:\Program Files\Git\cmd\git.exe"

# 1. Clean up old temp directory if it exists
if (Test-Path $wikiDir) {
    Remove-Item $wikiDir -Recurse -Force
}

# 2. Try to clone the wiki repository
Write-Host "Cloning GitHub Wiki repository..." -ForegroundColor Cyan
& $git clone $wikiUrl $wikiDir

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n[ERROR] Could not clone the Wiki repository." -ForegroundColor Red
    Write-Host "GitHub does not initialize the wiki backend until you manually create your first page on the Web UI." -ForegroundColor Yellow
    Write-Host "Please do the following:" -ForegroundColor Yellow
    Write-Host " 1. Go to: https://github.com/dpraanav558-glitch/pgents/wiki" -ForegroundColor White
    Write-Host " 2. Click the 'Create the first page' button." -ForegroundColor White
    Write-Host " 3. Title the page 'Home' and click 'Save page'." -ForegroundColor White
    Write-Host " 4. Run this script again." -ForegroundColor White
    exit 1
}

# 3. Copy our local wiki pages to the wiki repository folder
Write-Host "Copying local wiki markdown pages..." -ForegroundColor Cyan
Copy-Item "$localWikiDir\*" $wikiDir -Force

# 4. Commit and Push changes
Write-Host "Committing and pushing wiki pages..." -ForegroundColor Cyan
Set-Location $wikiDir

& $git config user.name "dpraanav558-glitch"
& $git config user.email "dpraanav558@github.com"
& $git add .
& $git commit -m "Update wiki pages from local directory"
& $git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Wiki pages updated successfully!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Failed to push changes to the wiki." -ForegroundColor Red
}

# Clean up
Set-Location $PSScriptRoot
Remove-Item $wikiDir -Recurse -Force -ErrorAction SilentlyContinue
