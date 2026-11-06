# Run backend with SQLite
$env:DATABASE_URL = "sqlite:///./living_relationships.db"
$env:JWT_SECRET = "development-secret-key-32-chars-long"
$env:ACCESS_TOKEN_MINUTES = "720"
$env:CORS_ORIGINS = "http://localhost:5173,http://127.0.0.1:5173"

Write-Host "Starting MANMITRA Backend on http://localhost:8000..." -ForegroundColor Green
Write-Host "Swagger API docs: http://localhost:8000/docs" -ForegroundColor Cyan
.\.venv\Scripts\uvicorn app.main:app --app-dir backend --reload --port 8000
