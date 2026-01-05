#!/bin/bash

echo "========================================"
echo "  PayTrack - Quick Launch Script"
echo "========================================"
echo ""

echo "[1/4] Checking if node_modules exists..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: Failed to install dependencies"
        exit 1
    fi
else
    echo "Dependencies already installed."
fi

echo ""
echo "[2/4] Checking for .env file..."
if [ ! -f ".env" ]; then
    echo "WARNING: .env file not found!"
    echo "Please create .env file with DATABASE_URL and NEXTAUTH_SECRET"
    echo "See START_HERE.md for instructions"
    read -p "Press enter to continue anyway..."
fi

echo ""
echo "[3/4] Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to generate Prisma client"
    exit 1
fi

echo ""
echo "[4/4] Starting development server..."
echo ""
echo "========================================"
echo "  Server starting at http://localhost:3000"
echo "  Press Ctrl+C to stop the server"
echo "========================================"
echo ""

npm run dev










