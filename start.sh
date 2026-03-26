#!/bin/bash

# ============================================================
#  Secure EHR System v3.0 — Complete Startup Script
#  Starts: ML Model + Backend Server + Frontend Dev Server
#  Usage: chmod +x start.sh && ./start.sh
# ============================================================

ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend/vite-project"
ML_DIR="$BACKEND_DIR/ml_model"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
NC='\033[0m'

BACKEND_PID=""
FRONTEND_PID=""

# Cleanup on exit
cleanup() {
    echo ""
    echo -e "${YELLOW}Shutting down all services...${NC}"
    [ -n "$BACKEND_PID" ] && kill $BACKEND_PID 2>/dev/null
    [ -n "$FRONTEND_PID" ] && kill $FRONTEND_PID 2>/dev/null
    # Also kill anything on our ports
    lsof -ti:8080 2>/dev/null | xargs kill -9 2>/dev/null || true
    lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true
    echo -e "${GREEN}All services stopped.${NC}"
    exit 0
}
trap cleanup SIGINT SIGTERM

echo ""
echo -e "${WHITE}======================================================${NC}"
echo -e "${WHITE}    SECURE EHR SYSTEM v3.0 — STARTUP SCRIPT${NC}"
echo -e "${WHITE}    Blockchain + AI-Powered Health Records${NC}"
echo -e "${WHITE}======================================================${NC}"
echo ""

# ----------------------------------------------------------
# Step 1: Prerequisites
# ----------------------------------------------------------
echo -e "${CYAN}[1/5] Checking prerequisites...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}  Node.js not found. Install Node.js 18+ first.${NC}"
    exit 1
fi
echo -e "  ${GREEN}Node.js $(node --version)${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}  Python3 not found. Install Python 3.8+ first.${NC}"
    exit 1
fi
echo -e "  ${GREEN}$(python3 --version)${NC}"

echo -e "  ${GREEN}npm $(npm --version)${NC}"
echo ""

# ----------------------------------------------------------
# Step 2: Python ML Model
# ----------------------------------------------------------
echo -e "${CYAN}[2/5] Setting up XGBoost ML Model...${NC}"

cd "$ML_DIR"

# Create venv if needed
if [ ! -d "venv" ]; then
    echo -e "  Creating virtual environment..."
    python3 -m venv venv
fi

# Install deps
echo -e "  Installing Python dependencies..."
./venv/bin/pip install --quiet --upgrade pip setuptools wheel 2>&1 | tail -1 || true
./venv/bin/pip install --quiet -r requirements.txt 2>&1 | tail -1 || true

# Train model if needed
if [ ! -f "xgboost_model.pkl" ]; then
    echo -e "  Training XGBoost model (first time)..."
    ./venv/bin/python train_model.py
    echo -e "  ${GREEN}Model trained successfully${NC}"
else
    echo -e "  ${GREEN}Model already trained (xgboost_model.pkl)${NC}"
fi

# Quick test
echo -n "  Testing prediction engine... "
TEST=$(echo '{"vitals":{"bp":"130/85","heartRate":78,"cholesterol":220,"sugarLevel":105,"ecgResult":"normal"},"clinicalMarkers":{"chestPainType":"asymptomatic"},"age":45}' | ./venv/bin/python predict.py 2>/dev/null)
if echo "$TEST" | grep -q "risk_level"; then
    RISK=$(echo "$TEST" | python3 -c "import sys,json; print(json.load(sys.stdin)['risk_level'])" 2>/dev/null || echo "OK")
    echo -e "${GREEN}OK (Risk: $RISK)${NC}"
else
    echo -e "${YELLOW}Warning: unexpected output${NC}"
fi
echo ""

# ----------------------------------------------------------
# Step 3: Backend
# ----------------------------------------------------------
echo -e "${CYAN}[3/5] Setting up Backend...${NC}"

cd "$BACKEND_DIR"

# Check .env
if [ ! -f ".env" ]; then
    echo -e "  ${RED}.env file missing! Create backend/.env with:${NC}"
    echo "    PORT=8080"
    echo "    MONGO_URI=mongodb+srv://..."
    echo "    GEMINI_API_KEY=your_key"
    echo "    JWT_SECRET=your_secret"
    exit 1
fi
echo -e "  ${GREEN}.env found${NC}"

# Install deps
if [ ! -d "node_modules" ]; then
    echo -e "  Installing dependencies..."
    npm install --silent 2>/dev/null
else
    echo -e "  ${GREEN}Dependencies installed${NC}"
fi

# Compile TypeScript
echo -e "  Compiling TypeScript..."
npx tsc 2>/dev/null
echo -e "  ${GREEN}Backend compiled${NC}"

# Create uploads dir
mkdir -p uploads

echo ""

# ----------------------------------------------------------
# Step 4: Frontend
# ----------------------------------------------------------
echo -e "${CYAN}[4/5] Setting up Frontend...${NC}"

cd "$FRONTEND_DIR"

if [ ! -d "node_modules" ]; then
    echo -e "  Installing dependencies..."
    npm install --silent 2>/dev/null
else
    echo -e "  ${GREEN}Dependencies installed${NC}"
fi
echo ""

# ----------------------------------------------------------
# Step 5: Launch
# ----------------------------------------------------------
echo -e "${CYAN}[5/5] Starting all services...${NC}"

# Kill anything on our ports
lsof -ti:8080 2>/dev/null | xargs kill -9 2>/dev/null || true
lsof -ti:5173 2>/dev/null | xargs kill -9 2>/dev/null || true
sleep 1

# Start Backend
cd "$BACKEND_DIR"
echo -e "  Starting Backend..."
cd "$BACKEND_DIR/ml_model"
sh setup.sh > /tmp/ehr-backend-setup.log 2>&1
cd ..
node dist/index.js > /tmp/ehr-backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

# Verify
if curl -s http://localhost:8080/ 2>/dev/null | grep -q "Running"; then
    echo -e "  ${GREEN}Backend running on http://localhost:8080${NC}"
else
    echo -e "  ${YELLOW}Backend starting... (check /tmp/ehr-backend.log if issues)${NC}"
fi

# Start Frontend
cd "$FRONTEND_DIR"
echo -e "  Starting Frontend..."
npm run dev > /tmp/ehr-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

echo ""
echo -e "${WHITE}======================================================${NC}"
echo -e "${WHITE}           ALL SYSTEMS RUNNING${NC}"
echo -e "${WHITE}======================================================${NC}"
echo ""
echo -e "  ${GREEN}Frontend:${NC}   http://localhost:5173"
echo -e "  ${GREEN}Backend:${NC}    http://localhost:8080"
echo -e "  ${GREEN}API Docs:${NC}   http://localhost:8080/api-docs"
echo ""
echo -e "  Backend PID:  $BACKEND_PID"
echo -e "  Frontend PID: $FRONTEND_PID"
echo ""
echo -e "  ${WHITE}Steps to use:${NC}"
echo -e "  1. Open ${GREEN}http://localhost:5173${NC} in your browser"
echo -e "  2. Install MetaMask extension if not installed"
echo -e "  3. Click 'Connect Wallet' and approve in MetaMask"
echo -e "  4. Select your role (Doctor/Patient/Pharmacist/Admin)"
echo -e "  5. Explore all features from the sidebar"
echo ""
echo -e "  ${YELLOW}Press Ctrl+C to stop all services${NC}"
echo ""

# Keep script running
wait
