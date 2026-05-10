#!/bin/bash

# Job Tracker - Local Development Startup Script
# This script helps you start the application locally

echo "🚀 Job Tracker - Starting Local Development Environment"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOL
DATABASE_URL=postgresql://postgres:password123@localhost:5432/job_tracker
PORT=3001
NODE_ENV=development
EOL
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

# Check if Docker is available
if command -v docker &> /dev/null; then
    echo ""
    echo "🐳 Checking Docker database..."
    
    # Check if container exists
    if docker ps -a --format '{{.Names}}' | grep -q '^job-tracker-db$'; then
        # Container exists, check if it's running
        if docker ps --format '{{.Names}}' | grep -q '^job-tracker-db$'; then
            echo "✅ Database container is already running"
        else
            echo "🔄 Starting existing database container..."
            docker start job-tracker-db
            echo "✅ Database container started"
        fi
    else
        echo "🔄 Creating new database container..."
        docker run --name job-tracker-db \
            -e POSTGRES_PASSWORD=password123 \
            -e POSTGRES_DB=job_tracker \
            -p 5432:5432 \
            -d postgres:15
        echo "✅ Database container created and started"
        echo "⏳ Waiting 3 seconds for database to be ready..."
        sleep 3
    fi
else
    echo "⚠️  Docker not found. Make sure PostgreSQL is running locally."
    echo "   Or install Docker Desktop: https://www.docker.com/products/docker-desktop/"
fi

# Check if node_modules exist
if [ ! -d "node_modules" ] || [ ! -d "client/node_modules" ]; then
    echo ""
    echo "📦 Installing dependencies..."
    npm run install:all
    echo "✅ Dependencies installed"
else
    echo ""
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🎯 Starting application..."
echo ""
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:3001"
echo ""
echo "   Press Ctrl+C to stop"
echo ""

# Start the application
npm run local
