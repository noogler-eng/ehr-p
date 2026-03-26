#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "------------------------------------------------"
echo "🚀 Setting up XGBoost Disease Prediction Model..."
echo "------------------------------------------------"

# 1. Ensure we are using a compatible Python version
# If on Python 3.12+, we need to ensure pip/setuptools are ready for older logic
PYTHON_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "Detected Python version: $PYTHON_VERSION"

# 2. Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
else
    echo "Virtual environment already exists. Skipping creation."
fi

# 3. Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# 4. Critical: Upgrade build tools FIRST
# This helps resolve the 'pkgutil' and 'wheel' errors on Python 3.12
echo "Updating core build tools..."
pip install --upgrade pip setuptools wheel

# 5. Install dependencies
echo "Installing Python dependencies..."
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
else
    echo "❌ Error: requirements.txt not found!"
    exit 1
fi

# 6. Train the model
if [ -f "train_model.py" ]; then
    echo "Training XGBoost model..."
    python train_model.py
else
    echo "⚠️  Warning: train_model.py not found. Skipping training step."
fi

echo "------------------------------------------------"
echo "✅ Setup complete! Environment is ready."
echo "------------------------------------------------"