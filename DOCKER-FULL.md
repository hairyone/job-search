# Running Everything in Docker

This guide shows you how to run the **entire application** in Docker containers - no Node.js installation needed on your laptop!

## Why Run Everything in Docker?

✅ **No Node.js needed** - Don't need to install Node.js locally  
✅ **Consistent environment** - Same setup on any computer  
✅ **Easy cleanup** - Remove everything with one command  
✅ **Isolated** - Doesn't affect your system  
✅ **Production-like** - Closer to how it runs in production  

## Prerequisites

Just one thing:
- **Docker Desktop** ([download](https://www.docker.com/products/docker-desktop/))

That's it! No Node.js, no PostgreSQL, nothing else needed.

## Option 1: Quick Start (Recommended)

### Start Everything

```bash
docker-compose -f docker-compose.full.yml up -d
```

This will:
- Build the application Docker image (takes 2-3 minutes first time)
- Start PostgreSQL database
- Start the application
- Set up networking between containers

### Access the Application

Open your browser: **http://localhost:3000**

### View Logs

```bash
# View all logs
docker-compose -f docker-compose.full.yml logs -f

# View app logs only
docker-compose -f docker-compose.full.yml logs -f app

# View database logs only
docker-compose -f docker-compose.full.yml logs -f postgres
```

### Stop Everything

```bash
docker-compose -f docker-compose.full.yml down
```

### Start Again Later

```bash
docker-compose -f docker-compose.full.yml up -d
```

The database data persists between restarts!

## Option 2: Build and Run Manually

### Build the Docker Image

```bash
docker build -t job-tracker .
```

### Run the Containers

```bash
# Start database
docker run -d \
  --name job-tracker-db \
  -e POSTGRES_PASSWORD=password123 \
  -e POSTGRES_DB=job_tracker \
  -p 5432:5432 \
  postgres:15

# Wait a few seconds for database to be ready
sleep 5

# Start application
docker run -d \
  --name job-tracker-app \
  --link job-tracker-db:postgres \
  -e DATABASE_URL=postgresql://postgres:password123@postgres:5432/job_tracker \
  -e PORT=3000 \
  -e NODE_ENV=production \
  -p 3000:3000 \
  job-tracker
```

### Stop and Remove

```bash
docker stop job-tracker-app job-tracker-db
docker rm job-tracker-app job-tracker-db
```

## Option 3: Development Mode with Docker

If you want to run the app in Docker but still edit code with live reload:

### Using docker-compose with volumes

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: job-tracker-db
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password123
      POSTGRES_DB: job_tracker
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

volumes:
  postgres-data:
```

Then run:
```bash
# Start just the database in Docker
docker-compose -f docker-compose.dev.yml up -d

# Run the app locally (with hot reload)
npm run local
```

This gives you the best of both worlds:
- Database in Docker (easy setup)
- App running locally (fast development)

## Useful Commands

```bash
# Rebuild after code changes
docker-compose -f docker-compose.full.yml up -d --build

# View container status
docker-compose -f docker-compose.full.yml ps

# Access database directly
docker exec -it job-tracker-db psql -U postgres -d job_tracker

# Access app container shell
docker exec -it job-tracker-app sh

# Remove everything including volumes (DELETES DATA!)
docker-compose -f docker-compose.full.yml down -v

# View resource usage
docker stats
```

## Updating the Application

After making code changes:

```bash
# Rebuild and restart
docker-compose -f docker-compose.full.yml up -d --build
```

## Troubleshooting

### Port Already in Use

**Error:** "Bind for 0.0.0.0:3000 failed: port is already allocated"

**Solution:** Stop any other services using port 3000, or change the port:

```bash
# Edit docker-compose.full.yml and change:
ports:
  - "3001:3000"  # Maps host port 3001 to container port 3000
```

Then access at http://localhost:3001

### Database Connection Failed

**Error:** "ECONNREFUSED" or "database does not exist"

**Solution:** 
1. Make sure database is running:
   ```bash
   docker-compose -f docker-compose.full.yml ps
   ```

2. Check database logs:
   ```bash
   docker-compose -f docker-compose.full.yml logs postgres
   ```

3. Restart everything:
   ```bash
   docker-compose -f docker-compose.full.yml down
   docker-compose -f docker-compose.full.yml up -d
   ```

### Build Fails

**Error:** During `docker build` or `docker-compose up --build`

**Solution:**
1. Clean Docker cache:
   ```bash
   docker-compose -f docker-compose.full.yml down
   docker system prune -a
   docker-compose -f docker-compose.full.yml up -d --build
   ```

2. Check you have enough disk space (needs ~500MB)

### App Container Keeps Restarting

**Check logs:**
```bash
docker-compose -f docker-compose.full.yml logs app
```

Common causes:
- Database not ready yet (wait 10-20 seconds)
- Wrong DATABASE_URL
- Missing environment variables

## Advantages vs Local Installation

| Feature | Docker Full | Local (npm) |
|---------|-------------|-------------|
| Node.js install needed | ❌ No | ✅ Yes |
| PostgreSQL install needed | ❌ No | ✅ Yes (or Docker) |
| Setup complexity | 🟢 Simple | 🟡 Medium |
| Startup time | 🟡 ~10 sec | 🟢 ~3 sec |
| Hot reload | ❌ No* | ✅ Yes |
| Code editing | ✅ Yes | ✅ Yes |
| Production-like | ✅ Yes | 🟡 Similar |
| Cleanup | 🟢 Easy | 🟡 Manual |

*Can use volumes for hot reload in dev mode

## Which Setup Should I Use?

**Use Docker Full (`docker-compose.full.yml`) if:**
- You don't want to install Node.js
- You want the simplest setup
- You're testing deployment
- You want easy cleanup

**Use Local Development (`npm run local`) if:**
- You're actively developing/coding
- You want fast hot reload
- You prefer traditional development workflow
- You're already familiar with npm/Node.js

**Use Hybrid (Database in Docker, App Local) if:**
- You want the best of both worlds
- You're developing but want easy database setup
- This is what `docker-compose.yml` provides by default

## Complete Removal

To completely remove everything:

```bash
# Stop and remove containers
docker-compose -f docker-compose.full.yml down -v

# Remove images
docker rmi job-tracker postgres:15

# Clean up system
docker system prune -a
```

This removes all traces of the application from Docker.

## Next Steps

- **Production deployment?** The same Dockerfile works with Railway, Render, AWS, etc.
- **Need development mode?** Use `docker-compose.yml` (database only) + `npm run local`
- **Want to customize?** Edit `Dockerfile` and `docker-compose.full.yml`

Enjoy containerized development! 🐳
