@echo off
echo 🚀 Lost & Found Application Setup Script
echo ========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Generate JWT Secret
echo 🔑 Generating JWT Secret...
for /f %%i in ('node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"') do set JWT_SECRET=%%i
echo Generated JWT Secret: %JWT_SECRET%

REM Setup Backend
echo 🔧 Setting up Backend...
cd backend

REM Create .env file
(
echo PORT=5000
echo MONGODB_URI=mongodb://localhost:27017/lostfound
echo JWT_SECRET=%JWT_SECRET%
echo NODE_ENV=development
) > .env

echo ✅ Backend .env file created

REM Install backend dependencies
call npm install
echo ✅ Backend dependencies installed

REM Initialize database
node database/setup.js
echo ✅ Database initialized

REM Setup Frontend
echo 🎨 Setting up Frontend...
cd ../frontend

REM Install frontend dependencies
call npm install
echo ✅ Frontend dependencies installed

echo.
echo 🎉 Setup Complete!
echo ===================
echo.
echo To start the application:
echo 1. Backend: cd backend ^&^& npm run dev
echo 2. Frontend: cd frontend ^&^& npm run dev
echo.
echo Access the app at: http://localhost:5173
echo Backend API at: http://localhost:5000
echo.
echo Your JWT Secret: %JWT_SECRET%
echo (This has been saved to backend/.env)
pause
