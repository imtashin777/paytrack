@echo off
echo ========================================
echo   PayTrack - Quick Launch Script
echo ========================================
echo.

echo [1/4] Checking if node_modules exists...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo Dependencies already installed.
)

echo.
echo [2/4] Checking for .env file...
if not exist ".env" (
    echo WARNING: .env file not found!
    echo Please create .env file with DATABASE_URL and NEXTAUTH_SECRET
    echo See START_HERE.md for instructions
    pause
)

echo.
echo [3/4] Generating Prisma client...
call npx prisma generate
if errorlevel 1 (
    echo ERROR: Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [4/4] Starting development server...
echo.
echo ========================================
echo   Server starting at http://localhost:3000
echo   Press Ctrl+C to stop the server
echo ========================================
echo.

call npm run dev



