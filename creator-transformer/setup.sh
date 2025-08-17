#!/bin/bash

# Creator Transformer Setup Script
# This script sets up both frontend and backend for development

set -e

echo "🚀 Setting up Creator Transformer..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "frontend" ] || [ ! -d "backend" ]; then
    echo -e "${RED}❌ Error: Please run this script from the creator-transformer root directory${NC}"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed. Please install Python 3.9+ first.${NC}"
    exit 1
fi

echo -e "${YELLOW}📦 Installing frontend dependencies...${NC}"
cd frontend
npm install
cd ..

echo -e "${YELLOW}📦 Installing backend dependencies...${NC}"
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}🐍 Creating Python virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
echo -e "${YELLOW}📥 Installing Python packages...${NC}"
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

cd ..

# Create environment files from examples
echo -e "${YELLOW}⚙️ Setting up environment files...${NC}"

# Frontend environment
if [ ! -f "frontend/.env.local" ]; then
    cp frontend/.env.local frontend/.env.local.backup 2>/dev/null || true
    echo "NEXT_PUBLIC_API_BASE=http://localhost:8000" > frontend/.env.local
    echo "✅ Created frontend/.env.local"
fi

# Backend environment
if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your Hugging Face API token${NC}"
    echo "   Get your token from: https://huggingface.co/settings/tokens"
fi

echo ""
echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Edit backend/.env and add your Hugging Face API token"
echo "2. Start the backend: cd backend && source venv/bin/activate && uvicorn app.main:app --reload --port 8000"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
