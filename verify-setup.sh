#!/bin/bash

###############################################################################
# Secure EHR System - Setup Verification Script
# This script verifies that all components are properly configured
###############################################################################

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo "=========================================="
echo "🔍 Secure EHR System - Setup Verification"
echo "=========================================="
echo ""

ERRORS=0
WARNINGS=0

# Function to check command
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 is installed${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 is NOT installed${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check file
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 NOT found${NC}"
        ERRORS=$((ERRORS + 1))
        return 1
    fi
}

# Function to check directory
check_directory() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✅ $1 exists${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠️  $1 NOT found${NC}"
        WARNINGS=$((WARNINGS + 1))
        return 1
    fi
}

echo "=== System Requirements ==="
check_command node
check_command npm
check_command python3
check_command pip3
check_command git
echo ""

echo "=== Backend Files ==="
check_file "backend/package.json"
check_file "backend/src/index.ts"
check_file "backend/src/routes/ehrRoutes.ts"
check_file "backend/src/models/Schemas.ts"
check_file "backend/src/services/xgboostService.ts"
check_file "backend/src/services/blockchainService.ts"
check_file "backend/src/middleware/upload.ts"
check_file "backend/ml_model/train_model.py"
check_file "backend/ml_model/predict.py"
check_file "backend/ml_model/requirements.txt"
echo ""

echo "=== Backend Dependencies ==="
check_directory "backend/node_modules"
check_directory "backend/ml_model/venv"
echo ""

echo "=== XGBoost Model ==="
check_file "backend/ml_model/xgboost_model.pkl"
check_file "backend/ml_model/scaler.pkl"
check_file "backend/ml_model/feature_names.pkl"
echo ""

echo "=== Frontend Files ==="
check_file "frontend/vite-project/package.json"
check_file "frontend/vite-project/src/App.tsx"
check_file "frontend/vite-project/src/components/Navbar.tsx"
check_file "frontend/vite-project/src/components/Dashboard/Timeline.tsx"
check_file "frontend/vite-project/src/components/Dashboard/DiscoveryList.tsx"
check_file "frontend/vite-project/src/components/Modals/OnboardingModal.tsx"
check_file "frontend/vite-project/src/components/Modals/AddRecordModal.tsx"
echo ""

echo "=== Frontend Dependencies ==="
check_directory "frontend/vite-project/node_modules"
echo ""

echo "=== Configuration Files ==="
check_file "backend/.env"
if [ ! -f "backend/.env" ]; then
    echo -e "${YELLOW}⚠️  Create backend/.env from .env.example${NC}"
fi
echo ""

echo "=== Documentation ==="
check_file "README.md"
check_file "CLAUDE.md"
check_file "DEPLOYMENT.md"
check_file ".env.example"
echo ""

echo "=== Docker Files ==="
check_file "docker-compose.yml"
check_file "backend/Dockerfile"
check_file "frontend/vite-project/Dockerfile"
check_file "frontend/vite-project/nginx.conf"
echo ""

echo "=== Directories ==="
check_directory "backend/uploads"
if [ ! -d "backend/uploads" ]; then
    echo "Creating uploads directory..."
    mkdir -p backend/uploads
fi
echo ""

echo "=========================================="
echo "📊 Verification Summary"
echo "=========================================="
echo -e "${RED}Errors: $ERRORS${NC}"
echo -e "${YELLOW}Warnings: $WARNINGS${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All critical components are in place!${NC}"
    echo ""
    echo "Next steps:"
    echo "1. Configure backend/.env with your MongoDB URI and API keys"
    echo "2. Run ./start.sh to set up dependencies"
    echo "3. Start the backend: cd backend && npm run dev"
    echo "4. Start the frontend: cd frontend/vite-project && npm run dev"
    echo "5. Access http://localhost:5173"
else
    echo -e "${RED}❌ Please fix the errors above before proceeding${NC}"
    exit 1
fi
