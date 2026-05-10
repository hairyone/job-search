# Local Setup Guide - Job Application Tracker

This guide will help you run the Job Application Tracker on your local laptop.

## 🚀 Super Quick Start

We offer multiple ways to run the application. Choose what works best for you:

### 🐳 Easiest: Everything in Docker (No Node.js needed!)

**Don't want to install Node.js?** Run everything in Docker:

```bash
docker-compose -f docker-compose.full.yml up -d
```

**That's it!** Open http://localhost:3000

**📖 Full Docker Guide:** [DOCKER-FULL.md](DOCKER-FULL.md)

---

### 💻 Traditional: Automated Setup Scripts

**Have Node.js installed?** Use our automated scripts:

**On Linux/Mac:**
```bash
./start-local.sh
```

**On Windows:**
```bash
start-local.bat
```

These scripts will:
- ✅ Create the .env file if it doesn't exist
- ✅ Start the PostgreSQL database using Docker
- ✅ Install all dependencies
- ✅ Start both frontend and backend servers

**That's it!** Open http://localhost:3000 when it's ready.

---

## 📋 Manual Setup (Step-by-Step)

If you prefer to do it manually or want to understand what's happening:

## Prerequisites

Before you begin, make sure you have:

1. **Node.js** (version 18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Check version: `node --version`

2. **PostgreSQL** (for the database)
   - **Option A - Docker (Easiest)**: Install [Docker Desktop](https://www.docker.com/products/docker-desktop/)
   - **Option B - Native**: Install [PostgreSQL](https://www.postgresql.org/download/)

## Quick Start (5 minutes)

### Step 1: Install Dependencies

Open a terminal in the project folder and run:

```bash
npm run install:all
```

This installs all dependencies for both the server and client.

### Step 2: Set Up Local Database

We provide three easy options. Choose the one you prefer:

#### Option A: Using Docker Compose (Easiest - Recommended!)

1. Make sure Docker Desktop is running

2. Start the database with one command:
   ```bash
   docker-compose up -d
   ```

3. Your database is now running! The connection string is already configured in the script.

4. To stop the database later:
   ```bash
   docker-compose down
   ```

5. To start it again:
   ```bash
   docker-compose up -d
   ```

#### Option B: Using Docker (Manual)

1. Make sure Docker Desktop is running

2. Run this command to start PostgreSQL:
   ```bash
   docker run --name job-tracker-db \
     -e POSTGRES_PASSWORD=password123 \
     -e POSTGRES_DB=job_tracker \
     -p 5432:5432 \
     -d postgres:15
   ```

3. Your database is now running! Connection string:
   ```
   postgresql://postgres:password123@localhost:5432/job_tracker
   ```

4. To stop the database later:
   ```bash
   docker stop job-tracker-db
   ```

5. To start it again:
   ```bash
   docker start job-tracker-db
   ```

#### Option C: Using Native PostgreSQL

If you installed PostgreSQL natively:

1. Create a database:
   ```bash
   createdb job_tracker
   ```

2. Your connection string (adjust username if needed):
   ```
   postgresql://postgres:yourpassword@localhost:5432/job_tracker
   ```

### Step 3: Configure Environment Variables

1. Create a file called `.env` in the root folder (same level as package.json)

2. Add this content (adjust if using different database credentials):
   ```env
   DATABASE_URL=postgresql://postgres:password123@localhost:5432/job_tracker
   PORT=3001
   NODE_ENV=development
   ```

   **Note:** We use port 3001 for the backend to avoid conflicts with React (which uses 3000)

### Step 4: Start the Application

You have two options:

#### Option A: Run Everything with One Command (Easiest)

```bash
npm run local
```

This starts both the backend server and frontend in one terminal.

#### Option B: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Step 5: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

The frontend runs on port 3000 and automatically connects to the backend on port 3001.

## Database is Created Automatically!

The first time you start the server, it will automatically:
- Create all the necessary tables (jobs, attachments, contacts)
- Set up indexes for better performance
- Run any pending migrations

You don't need to manually create the database schema!

## Troubleshooting

### Port Already in Use

If you see "Port 3000 is already in use":

1. Change the PORT in your `.env` file:
   ```env
   PORT=3002
   ```

2. Update the proxy in `client/package.json` to match:
   ```json
   "proxy": "http://localhost:3002"
   ```

### Database Connection Error

**Error:** "DATABASE_URL environment variable is not set"
- Make sure you created the `.env` file in the root folder
- Check that DATABASE_URL is spelled correctly

**Error:** "Connection refused" or "ECONNREFUSED"
- If using Docker: Make sure Docker Desktop is running and the container is started
- If using native PostgreSQL: Make sure PostgreSQL service is running
- Check your DATABASE_URL has the correct host, port, username, and password

**Error:** "database does not exist"
- Docker: Re-run the docker command from Step 2
- Native: Run `createdb job_tracker`

### Can't Access the Frontend

- Make sure both backend and frontend are running
- Check the terminal for error messages
- Try clearing browser cache or using incognito mode
- Make sure you're going to `http://localhost:3000` (not 3001)

## Useful Commands

```bash
# Install all dependencies
npm run install:all

# Start backend only (dev mode with auto-restart)
npm run dev

# Start frontend only
npm run client

# Start both backend and frontend together
npm run local

# Build frontend for production
npm run build

# Run migrations manually (usually not needed)
npm run migrate
```

## Stopping the Application

1. Press `Ctrl+C` in the terminal to stop the servers

2. If using Docker, stop the database:
   ```bash
   docker stop job-tracker-db
   ```

## Next Time You Want to Run It

1. If using Docker, start the database:
   ```bash
   docker start job-tracker-db
   ```

2. Start the application:
   ```bash
   npm run local
   ```

3. Open http://localhost:3000

That's it! 🎉

## What Data is Stored?

All your job application data is stored in the local PostgreSQL database on your laptop. Your data stays on your computer and is not sent anywhere.

## Need Help?

Common issues:
- **Docker not starting**: Make sure Docker Desktop is installed and running
- **Database errors**: Check your .env file has the correct DATABASE_URL
- **Port conflicts**: Change PORT in .env to a different number (e.g., 3002, 3003)
- **Dependencies errors**: Delete `node_modules` folders and run `npm run install:all` again
