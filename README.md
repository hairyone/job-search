# Job Application Tracker

A full-stack web application to track job applications from Indeed, LinkedIn, and other sources. Features include progress tracking, Google Drive attachment integration, and comprehensive statistics.

![Job Tracker](https://img.shields.io/badge/Status-Ready%20to%20Use-brightgreen)

## ⚡ Quick Start - Run Locally on Your Laptop

**Not sure which setup to use?** See **[WHICH-SETUP.md](WHICH-SETUP.md)** to help you decide!

**Choose your preferred setup:**

### 🐳 Option 1: Everything in Docker (Easiest - No Node.js needed!)

**Just have Docker?** Run everything in containers:

```bash
docker-compose -f docker-compose.full.yml up -d
```

Open http://localhost:3000 - Done! 🎉

**Details:** [DOCKER-FULL.md](DOCKER-FULL.md)

### 💻 Option 2: Traditional Development (With Node.js installed)

**Automated Setup:**

**Linux/Mac:**
```bash
./start-local.sh
```

**Windows:**
```bash
start-local.bat
```

**Manual Setup:**

```bash
# 1. Install dependencies
npm run install:all

# 2. Start database (using Docker Compose)
docker-compose up -d

# 3. Create .env file
cp .env.example .env

# 4. Start the app
npm run local
```

Open http://localhost:3000 and you're done! 🎉

**Details:** [LOCAL-SETUP.md](LOCAL-SETUP.md) | [QUICKSTART.md](QUICKSTART.md)

---

## Features

- 📝 Track job applications from Indeed, LinkedIn, and other sources
- 📊 Real-time statistics and analytics
- 🔍 Search and filter capabilities
- 📎 Google Drive attachment integration
- 🎯 Multiple status tracking (Applied, Interview Scheduled, Offer, etc.)
- 💰 Salary range tracking
- 📍 Location and company information
- 📅 Application date tracking
- 📱 Responsive mobile-friendly design

## Tech Stack

- **Frontend**: React 18
- **Backend**: Node.js + Express
- **Database**: PostgreSQL
- **Local Hosting**: Docker (recommended) or native PostgreSQL
- **Hosting**: Local (your laptop) or any Docker-compatible cloud service

## Local Development

**📖 See [LOCAL-SETUP.md](LOCAL-SETUP.md) for complete instructions with troubleshooting.**

### Prerequisites

- Node.js 18 or higher
- Docker Desktop (easiest) OR native PostgreSQL

### Quick Setup

1. **Install dependencies**
   ```bash
   npm run install:all
   ```

2. **Start local database** (using Docker)
   ```bash
   docker run --name job-tracker-db \
     -e POSTGRES_PASSWORD=password123 \
     -e POSTGRES_DB=job_tracker \
     -p 5432:5432 \
     -d postgres:15
   ```

3. **Create `.env` file** in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:password123@localhost:5432/job_tracker
   PORT=3001
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   npm run local
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001/api

The database schema is created automatically on first startup!

### Useful Commands

```bash
npm run install:all    # Install all dependencies
npm run local          # Start both frontend and backend
npm run dev            # Start backend only
npm run client         # Start frontend only
npm run build          # Build for production
```

---

## Production Deployment (Optional)

This application is designed primarily for **local use on your laptop**. However, if you want to deploy it to the cloud, the Docker setup makes it easy.

### Deploy to Any Cloud Provider

The included `Dockerfile` works with any platform that supports Docker:

- **AWS** (EC2, ECS, App Runner)
- **Azure** (Container Instances, App Service)
- **Google Cloud** (Cloud Run, Compute Engine)
- **DigitalOcean** (App Platform, Droplets)
- **Fly.io**
- **Render**
- Or any VPS with Docker installed

### Quick Deploy Steps

1. **Build the Docker image:**
   ```bash
   docker build -t job-tracker .
   ```

2. **Push to your cloud provider's registry** (varies by provider)

3. **Set environment variables:**
   - `DATABASE_URL` - Your cloud PostgreSQL connection string
   - `PORT` - Usually 3000
   - `NODE_ENV` - Set to `production`
   - `AUTH_USERNAME` - Basic auth username (optional but recommended)
   - `AUTH_PASSWORD` - Basic auth password (optional but recommended)

4. **Deploy the container** (process varies by provider)

### Why Run Locally Instead?

- ✅ **Free** - No monthly costs
- ✅ **Private** - Your data stays on your computer
- ✅ **Fast** - No network latency
- ✅ **Simple** - No cloud account setup
- ✅ **Offline** - Works without internet
- ✅ **Full control** - No vendor lock-in

Most users find local hosting perfect for personal job tracking!

---

## API Endpoints

### Jobs
- `GET /api/jobs` - Get all jobs (supports filtering)
- `GET /api/jobs/:id` - Get single job with details
- `POST /api/jobs` - Create new job
- `PUT /api/jobs/:id` - Update job
- `DELETE /api/jobs/:id` - Delete job
- `GET /api/jobs/stats/summary` - Get statistics

### Attachments
- `GET /api/attachments/job/:jobId` - Get attachments for a job
- `POST /api/attachments` - Add attachment
- `DELETE /api/attachments/:id` - Delete attachment

## Database Schema

### Jobs Table
- `id`, `company`, `position`, `source`, `status`, `job_url`, `location`
- `salary_range`, `description`, `notes`, `applied_date`
- `created_at`, `updated_at`

### Attachments Table
- `id`, `job_id`, `file_name`, `file_type`
- `google_drive_id`, `google_drive_url`, `created_at`

### Contacts Table
- `id`, `job_id`, `name`, `email`, `phone`, `position`, `notes`, `created_at`

## Security

When running locally, the application is only accessible from your computer (localhost). 

If you deploy to a cloud provider, it's **strongly recommended** to set up authentication:
- Set `AUTH_USERNAME` and `AUTH_PASSWORD` environment variables
- The app uses HTTP Basic Authentication to protect your data
- You'll be prompted for username/password when accessing the app

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
