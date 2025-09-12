@echo off
setlocal enabledelayedexpansion

REM Prompt Optimization Platform Startup Script for Windows
REM This script starts all necessary services for the platform

echo 🚀 Starting Prompt Optimization Platform...
echo =================================================================

REM Check prerequisites
echo [INFO] Checking prerequisites...

REM Check Node.js
node --version >nul 2>&1
if !errorlevel! == 0 (
    for /f %%i in ('node --version') do set NODE_VERSION=%%i
    echo [SUCCESS] Node.js found: !NODE_VERSION!
) else (
    echo [ERROR] Node.js not found. Please install Node.js 18+ and try again.
    pause
    exit /b 1
)

REM Check Python
python --version >nul 2>&1
if !errorlevel! == 0 (
    for /f %%i in ('python --version') do set PYTHON_VERSION=%%i
    echo [SUCCESS] Python found: !PYTHON_VERSION!
) else (
    echo [ERROR] Python not found. Please install Python 3.8+ and try again.
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist ".env.local" (
    echo [WARNING] .env.local not found. Creating from template...
    (
        echo # Frontend Environment Variables
        echo NEXT_PUBLIC_API_URL=http://localhost:8000
        echo NEXT_PUBLIC_WS_URL=ws://localhost:8001
        echo.
        echo # Optional: Authentication
        echo NEXTAUTH_SECRET=your-nextauth-secret
        echo NEXTAUTH_URL=http://localhost:3000
        echo.
        echo # Optional: External APIs
        echo OPENAI_API_KEY=your-openai-api-key
    ) > .env.local
    echo [SUCCESS] Created .env.local template
)

REM Install frontend dependencies
echo [INFO] Installing frontend dependencies...
call npm ci
if !errorlevel! == 0 (
    echo [SUCCESS] Frontend dependencies installed
) else (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

REM Start services
echo [INFO] Starting services...

REM Start Redis if Docker is available
docker --version >nul 2>&1
if !errorlevel! == 0 (
    echo [INFO] Starting Redis with Docker...
    start /b docker run --rm -d -p 6379:6379 --name redis-prompt-opt redis:alpine
    timeout /t 3 >nul
    echo [SUCCESS] Redis started with Docker
) else (
    echo [WARNING] Docker not found. Please ensure Redis is running on port 6379
)

REM Start PostgreSQL if Docker is available
if !errorlevel! == 0 (
    echo [INFO] Starting PostgreSQL with Docker...
    start /b docker run --rm -d -p 5432:5432 --name postgres-prompt-opt -e POSTGRES_PASSWORD=password postgres:15
    timeout /t 5 >nul
    echo [SUCCESS] PostgreSQL started with Docker
) else (
    echo [WARNING] Please ensure PostgreSQL is running on port 5432
)

REM Start frontend
echo [INFO] Starting Next.js frontend...
start "Frontend Server" cmd /k "npm run dev"
timeout /t 3 >nul
echo [SUCCESS] Frontend started

REM Check if backend directory exists
if exist "django_backend" (
    echo [INFO] Django backend directory found
    
    cd django_backend
    
    REM Activate virtual environment
    if exist "Scripts\activate.bat" (
        echo [INFO] Activating virtual environment...
        call Scripts\activate.bat
    )
    
    REM Start Django server
    echo [INFO] Starting Django backend...
    start "Django Backend" cmd /k "python manage.py runserver 0.0.0.0:8000"
    timeout /t 3 >nul
    echo [SUCCESS] Backend started
    
    REM Start WebSocket server (if script exists)
    if exist "manage.py" (
        echo [INFO] Starting WebSocket server...
        start "WebSocket Server" cmd /k "python manage.py run_websocket_server"
        timeout /t 2 >nul
        echo [SUCCESS] WebSocket server started
    )
    
    REM Start Celery worker (if available)
    celery --version >nul 2>&1
    if !errorlevel! == 0 (
        echo [INFO] Starting Celery worker...
        start "Celery Worker" cmd /k "celery -A promptcraft_backend worker -l info"
        timeout /t 2 >nul
        echo [SUCCESS] Celery worker started
    )
    
    cd ..
) else (
    echo [WARNING] Django backend not found. Run 'python django_setup.py' to set it up.
)

REM Wait for services to start
echo [INFO] Waiting for services to start...
timeout /t 10 >nul

echo.
echo 🌐 Service Status:
echo ===================
echo    ✅ Frontend: http://localhost:3000
echo    ✅ Backend API: http://localhost:8000  
echo    ✅ WebSocket: ws://localhost:8001
echo    ✅ Redis: localhost:6379
echo    ✅ PostgreSQL: localhost:5432
echo.
echo [SUCCESS] 🎉 Prompt Optimization Platform is running!
echo.
echo 📋 Available URLs:
echo    🌐 Main App: http://localhost:3000
echo    🧠 Optimization: http://localhost:3000/optimization
echo    📚 Library: http://localhost:3000/library
echo    🔧 API Docs: http://localhost:8000/admin
echo.
echo [INFO] All services are running in separate windows.
echo [INFO] Close this window or press Ctrl+C to continue.
echo.

pause

