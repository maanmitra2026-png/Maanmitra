# Run backend with SQLite
$env:DATABASE_URL = "sqlite:///./living_relationships.db"
$env:JWT_SECRET = "development-secret-key-32-chars-long"
$env:ACCESS_TOKEN_MINUTES = "720"
$env:CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"
$env:PAYMENT_GATEWAY = "cashfree"
if (-not $env:CASHFREE_APP_ID) { $env:CASHFREE_APP_ID = "15302684abff6e77cfbe09ff71f8620351" }
if (Test-Path backend\.env) {
    Get-Content backend\.env | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#") -and $line.Contains("=")) {
            $parts = $line.Split("=", 2)
            [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
        }
    }
}

Write-Host "Starting MANMITRA Backend on http://localhost:8000..." -ForegroundColor Green
Write-Host "Swagger API docs: http://localhost:8000/docs" -ForegroundColor Cyan
.\.venv\Scripts\uvicorn app.main:app --app-dir backend --reload --port 8000
