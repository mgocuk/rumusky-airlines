@echo off
title RUMUSKY AIRLINES - GitHub Push Script
echo ===================================================
echo   RUMUSKY AIRLINES - GitHub Guncelleme
echo ===================================================
echo.
echo Dosyalar esitleniyor...
robocopy "C:\Mustafa GOCUK\Rumeysa\airlines" "C:\workspace\rumusky-airlines" /E /XD node_modules .git /NP /NFL /NDL /NJH /NJS
cd /d C:\workspace\rumusky-airlines
git add .
git commit -m "update: latest changes"
git push origin main
echo.
echo ===================================================
echo [BASARILI] Guncellemeler GitHub'a gonderildi!
echo ===================================================
pause
