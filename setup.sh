#!/bin/bash

echo "🚀 Kunafa Chat - Quick Setup Guide"
echo "=================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install
echo "✅ Root dependencies installed"
echo ""

# Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..
echo "✅ Client dependencies installed"
echo ""

# Setup database
echo "🗄️  Setting up database..."
npm run db:push
echo "✅ Database initialized"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Start the backend: npm run dev"
echo "2. In another terminal, start the frontend: cd client && npm run dev"
echo ""
echo "🌐 Access the app at:"
echo "   - Frontend: http://localhost:5173"
echo "   - Backend API: http://localhost:5000"
echo ""
echo "📚 Default credentials:"
echo "   - Manil: manil123"
echo "   - Ines: ines123"
