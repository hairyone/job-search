# NPM Scripts Reference

Quick reference for all available npm commands.

## Local Development

### Start Application (Traditional Setup)

```bash
# Start both frontend and backend (recommended for development)
npm run local

# Start backend only (with auto-restart on changes)
npm run dev

# Start frontend only
npm run client

# Start backend (production mode, no auto-restart)
npm start
```

## Docker Commands

### Full Docker Setup (App + Database)

```bash
# Start everything in Docker
npm run docker:full

# Start with rebuilding the image (after code changes)
npm run docker:full:build

# View logs
npm run docker:full:logs

# Stop and remove containers
npm run docker:full:down
```

### Database Only (for Traditional Setup)

```bash
# Start PostgreSQL database only
npm run docker:db

# Stop database
npm run docker:db:down
```

## Installation

```bash
# Install all dependencies (backend + frontend)
npm run install:all

# Install backend dependencies only
npm install

# Install frontend dependencies only
cd client && npm install
```

## Build & Deploy

```bash
# Build frontend for production
npm run build

# Build frontend only
npm run build:client

# Build for Railway (used by Railway.app)
npm run railway:build

# Build for Vercel (used by Vercel)
npm run vercel-build
```

## Database

```bash
# Run database migrations manually
npm run migrate
```

## Command Cheat Sheet

| Command | What it does |
|---------|-------------|
| `npm run local` | Start both backend & frontend locally |
| `npm run dev` | Start backend only (dev mode) |
| `npm run client` | Start frontend only |
| `npm run docker:full` | Run entire app in Docker |
| `npm run docker:db` | Run database in Docker only |
| `npm run install:all` | Install all dependencies |
| `npm run build` | Build for production |
| `npm run migrate` | Run database migrations |

## Common Workflows

### First Time Setup (Traditional)
```bash
npm run install:all
npm run docker:db
cp .env.example .env
npm run local
```

### First Time Setup (Docker Full)
```bash
npm run docker:full
```

### Daily Development (Traditional)
```bash
npm run docker:db     # Start database (if not running)
npm run local         # Start app with hot reload
```

### Daily Development (Docker Full)
```bash
npm run docker:full   # Start everything
```

### After Pulling Updates (Traditional)
```bash
npm run install:all   # Update dependencies
npm run local         # Start app
```

### After Pulling Updates (Docker Full)
```bash
npm run docker:full:build   # Rebuild and start
```

### View Application Logs (Docker Full)
```bash
npm run docker:full:logs
```

### Clean Stop
```bash
# Traditional
Ctrl+C (in terminal)
npm run docker:db:down

# Docker Full
npm run docker:full:down
```

## Environment Variables

Most commands respect the `.env` file in the root directory.

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3001 for local, 3000 for Docker)
- `NODE_ENV` - Environment (development/production)

See `.env.example` for full list of available variables.

## Troubleshooting

### "concurrently: command not found"
```bash
npm install
```

### "nodemon: command not found"
```bash
npm install
```

### Port already in use
Change `PORT` in `.env` file to a different number (e.g., 3002)

### Docker commands not working
Make sure Docker Desktop is running

### Database connection errors
Check `DATABASE_URL` in `.env` file is correct
