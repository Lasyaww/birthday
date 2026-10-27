@echo off
title Deploying Birthday Surprise to GitHub Pages...
cd /d "%~dp0"
echo.
echo ========================================================
echo   DEPLOYING "ONLY FOR MY BORI" TO GITHUB PAGES
echo ========================================================
echo.
echo Pushing latest mobile fixes and pastel dark mode to GitHub...
echo.
git push origin main
echo.
if %ERRORLEVEL% EQU 0 (
    echo ========================================================
    echo  SUCCESS! Pushed to GitHub!
    echo  Live link: https://lasyaww.github.io/birthday/
    echo  (GitHub Pages updates in ~60 seconds)
    echo ========================================================
) else (
    echo ========================================================
    echo  If a browser popped up, please click Authorize.
    echo ========================================================
)
echo.
pause
