@echo off
REM Job Tracker - Local Development Startup Script for Windows
REM This script helps you start the application locally

echo.
echo 🚀 Job Tracker - Starting Local Development Environment
echo.

REM Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file...
    (
        echo DATABASE_URL=postgresql://postgres:password123@localhost:5432/job_tracker
        echo PORT=3001
        echo NODE_ENV=development
    ) > .env
    echo ✅ .env file created
) else (
    echo ✅ .env file already exists
)

REM Check if Docker is available
where docker >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo.
    echo 🐳 Checking Docker database...
    
    REM Check if container exists
    docker ps -a --format "{{.Names}}" | findstr /X "job-tracker-db" >nul 2>nul
    if %ERRORLEVEL% EQU 0 (
        REM Container exists, check if it's running
        docker ps --format "{{.Names}}" | findstr /X "job-tracker-db" >nul 2>nul
        if %ERRORLEVEL% EQU 0 (
            echo ✅ Database container is already running
        ) else (
            echo 🔄 Starting existing database container...
            docker start job-tracker-db
            echo ✅ Database container started
        )
    ) else (
        echo 🔄 Creating new database container...
        docker run --name job-tracker-db -e POSTGRES_PASSWORD=password123 -e POSTGRES_DB=job_tracker -p 5432:5432 -d postgres:15
        echo ✅ Database container created and started
        echo ⏳ Waiting 3 seconds for database to be ready...
        timeout /t 3 /nobreak >nul
    )
) else (
    echo ⚠️  Docker not found. Make sure PostgreSQL is running locally.
    echo    Or install Docker Desktop: https://www.docker.com/products/docker-desktop/
)

REM Check if node_modules exist
if not exist node_modules (
    echo.
    echo 📦 Installing dependencies...
    call npm run install:all
    echo ✅ Dependencies installed
) else if not exist client\node_modules (
    echo.
    echo 📦 Installing dependencies...
    call npm run install:all
    echo ✅ Dependencies installed
) else (
    echo.
    echo ✅ Dependencies already installed
)

echo.
echo 🎯 Starting application...
echo.
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:3001
echo.
echo    Press Ctrl+C to stop
echo.

REM Start the application
call npm run local
