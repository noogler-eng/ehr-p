#!/bin/bash

###############################################################################
# Secure EHR System - Quick Start Script
# This script helps you get the application running quickly
###############################################################################

set -e  # Exit on error

echo "=========================================="
echo "🏥 Secure EHR System - Quick Start"
echo "=========================================="
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f backend/.env ]; then
    echo -e "${YELLOW}⚠️  .env file not found!${NC}"
    echo "Creating .env from template..."
    cp .env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env with your MongoDB URI and API keys${NC}"
    echo "Press Enter to continue after editing .env..."
    read
fi

# Check Node.js
echo "Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Node.js $(node -v)${NC}"

# Check Python
echo "Checking Python..."
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python is not installed. Please install Python 3.8+ first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Python $(python3 --version)${NC}"

# Backend setup
echo ""
echo "=========================================="
echo "📦 Setting up Backend..."
echo "=========================================="
cd backend

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node modules already installed"
fi

# XGBoost model setup
cd ml_model
if [ ! -f "xgboost_model.pkl" ]; then
    echo "Training XGBoost model..."
    chmod +x setup.sh
    ./setup.sh
else
    echo "XGBoost model already trained"
fi
cd ..

# Build TypeScript
echo "Building TypeScript..."
npm run build

cd ..

# Frontend setup
echo ""
echo "=========================================="
echo "🎨 Setting up Frontend..."
echo "=========================================="
cd frontend/vite-project

if [ ! -d "node_modules" ]; then
    echo "Installing Node.js dependencies..."
    npm install
else
    echo "Node modules already installed"
fi

cd ../..

# Create uploads directory
mkdir -p backend/uploads

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "1. Start Backend (in terminal 1):"
echo -e "   ${GREEN}cd backend && npm run dev${NC}"
echo ""
echo "2. Start Frontend (in terminal 2):"
echo -e "   ${GREEN}cd frontend/vite-project && npm run dev${NC}"
echo ""
echo "3. Access the application:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:8080"
echo "   - API Docs: http://localhost:8080/api-docs"
echo ""
echo "Don't forget to:"
echo "  - Install MetaMask browser extension"
echo "  - Configure your .env file with MongoDB URI and API keys"
echo ""
echo "For more information, see README.md and CLAUDE.md"
echo ""
