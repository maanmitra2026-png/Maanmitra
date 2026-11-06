# Run frontend
Set-Location "$PSScriptRoot\frontend"

Write-Host "Starting MANMITRA Frontend on http://localhost:5173..." -ForegroundColor Green
npm run dev
