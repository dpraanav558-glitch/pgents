# push_deploy_workflow.ps1
# Script to push the GitHub Pages deployment workflow to your repository.

param (
    [string]$Token
)

$git = "C:\Program Files\Git\cmd\git.exe"

# Retrieve original URL dynamically so we don't hardcode any secrets
$defaultUrl = & $git remote get-url origin

if ([string]::IsNullOrEmpty($Token)) {
    Write-Host "Please ensure your GitHub Personal Access Token (PAT) has the 'workflow' scope enabled." -ForegroundColor Yellow
    Write-Host "You can enable it at: https://github.com/settings/tokens" -ForegroundColor White
    $Token = Read-Host -Prompt "Enter your GitHub Personal Access Token (PAT) with 'workflow' scope"
    if ([string]::IsNullOrEmpty($Token)) {
        Write-Host "[ERROR] GitHub Personal Access Token is required." -ForegroundColor Red
        exit 1
    }
}

$repoUrl = "https://$($Token)@github.com/dpraanav558-glitch/pgents.git"

Write-Host "Staging deploy.yml..." -ForegroundColor Cyan
& $git add .github/workflows/deploy.yml

Write-Host "Committing changes..." -ForegroundColor Cyan
& $git commit -m "ci: add Pages deployment workflow"

# Temporary update remote URL to include the new token
Write-Host "Updating remote origin with token..." -ForegroundColor Cyan
& $git remote set-url origin $repoUrl

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
& $git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[SUCCESS] Workflow file pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "`n[ERROR] Failed to push workflow. Please verify your token has 'workflow' scope." -ForegroundColor Red
    Write-Host "Undoing commit to keep local tree clean..." -ForegroundColor Yellow
    & $git reset HEAD~1
}

# Restore default remote URL
& $git remote set-url origin $defaultUrl
