@echo off
REM Library Management System - Frontend Installation Script
REM This script will install dependencies and start the development server

echo.
echo ========================================
echo Library Management System - Frontend Setup
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

REM Display Node.js version
echo Node.js version:
node -v
echo.

REM Install dependencies
echo Installing dependencies...
echo.
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To start the development server, run:
echo   npm run dev
echo.
echo The app will be available at: http://localhost:3000
echo.
echo WARNING: Make sure the backend is running on http://localhost:8080
echo.
pause
