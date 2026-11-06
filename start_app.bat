@echo off
echo ==============================================
echo   Starting MANMITRA Fullstack Platform
echo ==============================================
echo.
echo Launching Backend in a new window...
start "MANMITRA - Backend" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0run_backend.ps1"

timeout /t 2 /nobreak >nul

echo Launching Frontend in a new window...
start "MANMITRA - Frontend" powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0run_frontend.ps1"

echo.
echo Application started!
echo - Official Website & Portal: http://localhost:5173
echo - API Docs (Swagger):        http://localhost:8000/docs
echo.
pause
