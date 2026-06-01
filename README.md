# Job Application Tracker

A self-hosted web app to track job applications from Indeed, LinkedIn, and other sources. Tracks progress, statuses, salary, contacts, dated notes, and Google Drive attachments. Runs entirely in Docker.

## Quick Start

**Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/)

```bash
cp .env.example .env       # Optional: edit credentials
docker compose up -d       # Build and start the stack
```

Open http://localhost:3000

The first startup builds the app image (~2 min) and creates the database schema automatically.

## Features

- Track applications from Indeed, LinkedIn, and other sources
- Multiple status tracking (Applied, Interview Scheduled, Offer, Rejected, etc.)
- Salary range, location, and company information
- Dated notes per application (call logs, follow-ups, etc.)
- Contacts per application (recruiters, hiring managers)
- Google Drive attachment links (resumes, cover letters)
- Real-time statistics and analytics
- Search and filter by status, source, or text
- Mobile-friendly responsive design

## Tech Stack

- **Frontend:** React 18
- **Backend:** Node.js + Express
- **Database:** PostgreSQL 15
- **Hosting:** Docker (single `docker compose up -d`)

## Architecture

The stack runs as two containers connected by a private Docker network:

| Service  | Image              | Port  | Purpose                        |
|----------|--------------------|-------|--------------------------------|
| `app`    | Built from `Dockerfile` | 3000 | Express API + React build served as static files |
| `postgres` | `postgres:15`   | 5432  | Database (bind-mounted to `./data/postgres/`) |

The `app` container waits for `postgres` to pass its healthcheck before starting. The Express server automatically runs schema migrations on first start.

## Configuration

All configuration is in `.env` (created from `.env.example`):

| Variable | Description |
|----------|-------------|
| `POSTGRES_PASSWORD` | Database password. Must match in both `postgres` and `app` services. |
| `AUTH_USERNAME` | HTTP Basic Auth username. Leave blank to disable. |
| `AUTH_PASSWORD` | HTTP Basic Auth password. Leave blank to disable. |

## Commands

```bash
# Start the stack
docker compose up -d

# View logs
docker compose logs -f

# Rebuild the app image (after pulling code changes)
docker compose up -d --build

# Stop the stack
docker compose down

# Stop and delete all data (irreversible)
docker compose down -v

# Access the database directly
docker exec -it job-tracker-db psql -U postgres job_tracker

# Access the app container shell
docker exec -it job-tracker-app sh
```

Or use the npm scripts (shortcuts for the above):

```bash
npm run up        # docker compose up -d
npm run logs      # docker compose logs -f
npm run rebuild   # docker compose up -d --build
npm run down      # docker compose down
```

## Data Storage

Your job application data is stored in a bind-mounted directory on the host:

```
./data/postgres/
```

This folder is in `.gitignore` so it won't be committed. It contains the raw PostgreSQL data files.

**Why bind-mount instead of a Docker volume?** Your data is visible in your file browser, can be backed up with normal file tools, and can be synced to cloud storage (Dropbox, iCloud Drive, Google Drive) automatically.

## Backup & Restore

### Automatic backup (recommended)

```bash
# Linux/Mac
./backup.sh

# Windows
backup.bat
```

This creates a compressed SQL dump in `~/Backups/job-tracker/` and keeps the last 30 days.

### Manual backup

```bash
# Create SQL dump
docker exec job-tracker-db pg_dump -U postgres job_tracker | gzip > backup-$(date +%Y%m%d).sql.gz

# Restore
gunzip -c backup-20260510.sql.gz | docker exec -i job-tracker-db psql -U postgres job_tracker
```

### File-system backup

```bash
# Stop the database
docker compose down

# Copy the data folder
cp -r ./data/postgres ./data/postgres-backup-$(date +%Y%m%d)

# Restart
docker compose up -d
```

### Cloud sync

Put the project (or just the `data/` folder) in a cloud-synced directory like Dropbox or iCloud Drive for automatic off-site backup.

## Updating

After pulling new code:

```bash
docker compose up -d --build
```

If you encounter `'ContainerConfig' KeyError` during rebuild (a known docker-compose bug):

```bash
docker compose down
docker compose up -d --build
```

## API Endpoints

### Jobs
- `GET /api/jobs` - List jobs (supports `?status=`, `?source=`, `?search=`)
- `GET /api/jobs/:id` - Single job with attachments, contacts, and notes
- `POST /api/jobs` - Create job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/stats/summary` - Aggregate statistics

### Attachments
- `GET /api/attachments/job/:jobId` - List attachments for a job
- `POST /api/attachments` - Add Google Drive attachment link
- `DELETE /api/attachments/:id` - Delete attachment

### Health
- `GET /api/health` - Liveness check (no auth required)

## Database Schema

### jobs
`id, company, position, source, status, job_url, location, salary_range, description, applied_date, created_at, updated_at`

### attachments
`id, job_id, file_name, file_type, google_drive_id, google_drive_url, created_at`

### contacts
`id, job_id, name, email, phone, position, notes, created_at`

### job_notes
`id, job_id, note_date, note_text, created_at`

Migrations live in `server/migrations/` and run automatically on container startup.

## Security

- The app uses HTTP Basic Auth when `AUTH_USERNAME` and `AUTH_PASSWORD` are set in `.env`. Set them in production deployments.
- The PostgreSQL port (`5432`) is not published to the host — only the app container can reach the database over the private Docker network.
- Database password is configurable via `POSTGRES_PASSWORD` in `.env`. The default in `.env.example` is `password123` — change it before exposing this stack to the internet.

## Troubleshooting

**Port 3000 already in use**
Edit `docker-compose.yml` and change `"3000:3000"` to `"3001:3000"` (or any free port).

**App container keeps restarting**
```bash
docker compose logs app
```
Usually means the database isn't ready yet. The `depends_on: condition: service_healthy` should prevent this; if it persists, check that Docker has enough resources allocated.

**Build fails with `'ContainerConfig' KeyError`**
Run `docker compose down` then `docker compose up -d --build`.

**Permission errors on `./data/postgres`**
```bash
sudo chown -R 999:999 ./data/postgres
```
(PostgreSQL in the container runs as UID 999.)

**Want to start completely fresh**
```bash
docker compose down -v          # WARNING: deletes all data
rm -rf ./data/postgres
docker compose up -d --build
```

## License

MIT
