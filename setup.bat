@echo off
echo.
echo 🚀 Kunafa Chat - Quick Setup Guide
echo ==================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js version: %NODE_VERSION%
echo.

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install
echo ✅ Root dependencies installed
echo.

REM Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..
echo ✅ Client dependencies installed
echo.

REM Setup database
echo 🗄️  Setting up database...
call npm run db:push
echo ✅ Database initialized
echo.

echo 🎉 Setup complete!
echo.
echo 📝 Next steps:
echo 1. Start the backend: npm run dev
echo 2. In another terminal, start the frontend: cd client && npm run dev
echo.
echo 🌐 Access the app at:
echo    - Frontend: http://localhost:5173
echo    - Backend API: http://localhost:5000
echo.
echo 📚 Default credentials:
echo    - Manil: manil123
echo    - Ines: ines123
echo.
pause
