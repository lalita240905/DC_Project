#!/bin/bash

echo "🚀 Lost & Found Application Setup Script"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongosh &> /dev/null; then
    echo "❌ MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Generate JWT Secret
echo "🔑 Generating JWT Secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
echo "Generated JWT Secret: $JWT_SECRET"

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

# Create .env file
cat > .env << EOL
PORT=5000
MONGODB_URI=mongodb://localhost:27017/lostfound
JWT_SECRET=$JWT_SECRET
NODE_ENV=development
EOL

echo "✅ Backend .env file created"

# Install backend dependencies
npm install
echo "✅ Backend dependencies installed"

# Initialize database
node database/setup.js
echo "✅ Database initialized"

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd ../frontend

# Install frontend dependencies
npm install
echo "✅ Frontend dependencies installed"

echo ""
echo "🎉 Setup Complete!"
echo "==================="
echo ""
echo "To start the application:"
echo "1. Backend: cd backend && npm run dev"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Access the app at: http://localhost:5173"
echo "Backend API at: http://localhost:5000"
echo ""
echo "Your JWT Secret: $JWT_SECRET"
echo "(This has been saved to backend/.env)"
