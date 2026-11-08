@echo off
title RUMUSKY AIRLINES - Web Platform
echo ===================================================
echo   RUMUSKY AIRLINES - Baslatiliyor...
echo ===================================================
echo.

if not exist node_modules (
    echo Paket bagimliliklari yukleniyor...
    call npm install
)

echo Tarayici aciliyor ve sunucu baslatiliyor...
start http://localhost:3000
npm run dev
pause
