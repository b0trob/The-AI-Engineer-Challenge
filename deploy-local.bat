@echo off
setlocal enabledelayedexpansion

REM Simple OpenAI - Local Deployment Script (Windows)
REM This script sets up and tests the application locally before Vercel deployment

echo 🚀 Simple OpenAI - Local Deployment Script
echo ==========================================
echo.

REM Check if Python is installed
echo [INFO] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found. Please install Python 3.8+
    pause
    exit /b 1
)

REM Check Python version
for /f "tokens=2" %%i in ('python --version 2^>^&1') do set PYTHON_VERSION=%%i
echo [SUCCESS] Python %PYTHON_VERSION% found

REM Check if Node.js is installed
echo [INFO] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('node --version') do set NODE_VERSION=%%i
echo [SUCCESS] Node.js %NODE_VERSION% found

REM Check if npm is installed
echo [INFO] Checking npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] npm not found. Please install npm
    pause
    exit /b 1
)

for /f "tokens=1" %%i in ('npm --version') do set NPM_VERSION=%%i
echo [SUCCESS] npm %NPM_VERSION% found

REM Setup backend
echo [INFO] Setting up backend...
cd api

REM Create virtual environment if it doesn't exist
if not exist "venv" (
    echo [INFO] Creating Python virtual environment...
    python -m venv venv
)

REM Activate virtual environment
echo [INFO] Activating virtual environment...
call venv\Scripts\activate.bat

REM Install dependencies
echo [INFO] Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

REM Test backend startup
echo [INFO] Testing backend startup...
start /B python app.py
timeout /t 3 /nobreak >nul

REM Check if backend is running
curl -s http://127.0.0.1:8000/api/health >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend failed to start
    taskkill /f /im python.exe >nul 2>&1
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend is running successfully
    taskkill /f /im python.exe >nul 2>&1
)

cd ..

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend

REM Install dependencies
echo [INFO] Installing Node.js dependencies...
npm install

REM Build frontend
echo [INFO] Building frontend...
npm run build

REM Test frontend startup
echo [INFO] Testing frontend startup...
start /B npm start
timeout /t 5 /nobreak >nul

REM Check if frontend is running
curl -s http://127.0.0.1:3000 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Frontend failed to start
    taskkill /f /im node.exe >nul 2>&1
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend is running successfully
    taskkill /f /im node.exe >nul 2>&1
)

cd ..

REM Run integration tests
echo [INFO] Running integration tests...

REM Start backend for testing
cd api
call venv\Scripts\activate.bat
start /B python app.py
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Test API endpoints
echo [INFO] Testing API endpoints...

REM Health check
curl -s http://127.0.0.1:8000/api/health | findstr "ok" >nul
if errorlevel 1 (
    echo [ERROR] Health check failed
    taskkill /f /im python.exe >nul 2>&1
    pause
    exit /b 1
) else (
    echo [SUCCESS] Health check passed
)

REM Test API key validation endpoint
curl -s -X POST http://127.0.0.1:8000/api/test-key -H "Content-Type: application/json" -d "{\"api_key\": \"sk-proj-invalid-key-for-testing\"}" | findstr "Invalid API Key format" >nul
if errorlevel 1 (
    echo [ERROR] API key validation endpoint failed
    taskkill /f /im python.exe >nul 2>&1
    pause
    exit /b 1
) else (
    echo [SUCCESS] API key validation endpoint working
)

REM Stop backend
taskkill /f /im python.exe >nul 2>&1

echo [SUCCESS] All tests passed! Application is ready for local deployment.
echo.

REM Ask user if they want to start services
set /p START_SERVICES="Do you want to start both services now? (y/n): "
if /i "%START_SERVICES%"=="y" (
    echo [INFO] Starting both services...
    
    REM Start backend
    cd api
    call venv\Scripts\activate.bat
    echo [INFO] Starting backend on http://127.0.0.1:8000
    start /B python app.py
    cd ..
    
    REM Start frontend
    cd frontend
    echo [INFO] Starting frontend on http://127.0.0.1:3000
    start /B npm run dev
    cd ..
    
    REM Wait for services to start
    timeout /t 5 /nobreak >nul
    
    REM Check if both services are running
    curl -s http://127.0.0.1:8000/api/health >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to start services
        taskkill /f /im python.exe >nul 2>&1
        taskkill /f /im node.exe >nul 2>&1
        pause
        exit /b 1
    )
    
    curl -s http://127.0.0.1:3000 >nul 2>&1
    if errorlevel 1 (
        echo [ERROR] Failed to start services
        taskkill /f /im python.exe >nul 2>&1
        taskkill /f /im node.exe >nul 2>&1
        pause
        exit /b 1
    )
    
    echo [SUCCESS] Both services are running successfully!
    echo.
    echo 🌐 Application URLs:
    echo    Frontend: http://127.0.0.1:3000
    echo    Backend API: http://127.0.0.1:8000
    echo    API Docs: http://127.0.0.1:8000/docs
    echo.
    echo Press any key to stop both services
    pause >nul
    
    REM Stop services
    taskkill /f /im python.exe >nul 2>&1
    taskkill /f /im node.exe >nul 2>&1
) else (
    echo [INFO] Setup complete. You can start services manually:
    echo.
    echo Backend:
    echo   cd api ^&^& venv\Scripts\activate.bat ^&^& python app.py
    echo.
    echo Frontend:
    echo   cd frontend ^&^& npm run dev
    echo.
)

pause 