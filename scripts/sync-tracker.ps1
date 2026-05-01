# Sync the Florida Fast + Boxa sprint tracker from the vault into public/data so
# the deployed dashboard picks up your latest Friday EOD updates on next push.
#
# Usage (from anywhere):
#   pwsh G:\My Drive\Shaw\.mission-control-clone\scripts\sync-tracker.ps1
#
# Then review with `git status`, commit, and push when ready to deploy.

$ErrorActionPreference = 'Stop'

$src = 'G:\My Drive\Jasons_Brain\Projects\Florida Fast + Boxa - Tracker.csv'
$dst = 'G:\My Drive\Shaw\.mission-control-clone\public\data\ff-boxa-tracker.csv'

if (-not (Test-Path $src)) {
  Write-Host "Source tracker not found: $src" -ForegroundColor Red
  exit 1
}

Copy-Item -Path $src -Destination $dst -Force
Write-Host "Tracker synced -> $dst" -ForegroundColor Green
Write-Host "Next: review with 'git status', commit, push to deploy."
