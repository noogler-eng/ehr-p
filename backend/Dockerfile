# Multi-stage Dockerfile for Backend API
# Includes Node.js and Python for XGBoost model

FROM node:18-slim AS base

# Install Python and build dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Set up Python virtual environment and install ML dependencies
WORKDIR /app/ml_model
RUN python3 -m venv venv && \
    . venv/bin/activate && \
    pip install --no-cache-dir -r requirements.txt && \
    python train_model.py

# Build TypeScript code
WORKDIR /app
RUN npm run build

# Create uploads directory
RUN mkdir -p /app/uploads

# Expose port
EXPOSE 8080

# Start the application
CMD ["node", "dist/index.js"]
