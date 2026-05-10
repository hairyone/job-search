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
- **Cloud Hosting**: Vercel (free) or Railway ($5/month)

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

## Cloud Deployment Options

## Deploy to Vercel + Supabase (FREE Forever!)

### Best for: Personal projects, permanent free hosting

**Total Cost: $0/month** ✅

### Step 1: Set Up Supabase Database

1. **Create Supabase Account**
   - Go to [supabase.com](https://supabase.com)
   - Sign up with GitHub (free, no credit card required)

2. **Create New Project**
   - Click "New Project"
   - Organization: Create a new one or use existing
   - Name: `job-tracker` (or your choice)
   - Database Password: Choose a strong password (save this!)
   - Region: Choose closest to you
   - Click "Create new project" (takes ~2 minutes)

3. **Get Database Connection String**
   - Go to "Settings" → "Database"
   - Find "Connection string" section
   - Select **"Connection pooling"** (better for serverless)
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your actual password
   - Example: `postgresql://postgres.xxx:[PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
   - Save this for later!

4. **Initialize Database Schema**
   - Go to "SQL Editor" in Supabase dashboard
   - Copy the schema from `server/db.js` (the CREATE TABLE statements)
   - Or run migrations locally:
     ```bash
     # Set DATABASE_URL to your Supabase connection string
     export DATABASE_URL="your-supabase-connection-string"
     npm run migrate
     ```

### Step 2: Deploy to Vercel

1. **Push Code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push
   ```

2. **Go to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "Sign Up" or "Login" with GitHub (free, no credit card)

3. **Import Your Repository**
   - Click "Add New..." → "Project"
   - Import your GitHub repository: `hairyone/job-search`
   - Click "Import"

4. **Configure Project**
   - Framework Preset: Vercel auto-detects (leave as is)
   - Root Directory: `./` (leave default)
   - Build & Development Settings: Use defaults
   - Click "Deploy"

5. **Add Environment Variables**
   
   While it's building, click "Environment Variables" and add:
   
   | Name | Value |
   |------|-------|
   | `DATABASE_URL` | Your Supabase connection string |
   | `NODE_ENV` | `production` |
   | `AUTH_USERNAME` | Your chosen username |
   | `AUTH_PASSWORD` | Your chosen password |
   
   Then redeploy if already deployed.

6. **Access Your App**
   - Vercel gives you a URL like: `https://job-search-xyz.vercel.app`
   - Your app is live and FREE forever! 🎉

### Step 3: Migrate Data from Railway (If Applicable)

If you already have data in Railway, see [MIGRATION.md](MIGRATION.md) for detailed instructions.

**Quick version:**
```bash
# Export from Railway
pg_dump "$RAILWAY_DATABASE_URL" --clean --no-owner --no-acl -f backup.sql

# Import to Supabase
psql "$SUPABASE_DATABASE_URL" -f backup.sql
```

### Vercel + Supabase Benefits

- ✅ **$0/month** - completely free for personal projects
- ✅ **No credit card required**
- ✅ **No sleep mode** - always fast
- ✅ **Automatic deployments** - push to GitHub, auto-deploy
- ✅ **Global CDN** - fast worldwide
- ✅ **500MB database** - plenty for job tracking
- ✅ **SSL/HTTPS included**
- ✅ **99.9% uptime**

### Free Tier Limits

**Vercel:**
- 100GB bandwidth/month
- Unlimited websites
- 100GB-hours serverless function execution

**Supabase:**
- 500MB database storage
- 2GB bandwidth/month
- Unlimited API requests
- 500MB file storage

**This is more than enough for personal job tracking!**

---

## Deploy to Railway ($5/month Hosting)

### Alternative: Paid hosting with simpler setup

**Total Cost: $5-8/month** 💳

### Quick Deployment

1. **Go to Railway**
   - Visit [Railway.app](https://railway.app)
   - Click **"Login"** and sign in with GitHub
   - **Note**: Railway requires the Hobby plan ($5/month) - no free tier available

2. **Deploy from GitHub**
   - Click **"New Project"**
   - Select **"Deploy from GitHub repo"**
   - Choose `hairyone/job-search`
   - Railway will automatically detect and deploy your app

3. **Add PostgreSQL Database**
   - In your project, click **"+ New"**
   - Select **"Database"** → **"Add PostgreSQL"**
   - Railway automatically creates and links the database
   - Environment variable `DATABASE_URL` is auto-configured

4. **Configure Build (if needed)**
   - Railway auto-detects settings, but you can customize:
   - Build Command: `npm run railway:build`
   - Start Command: `npm start` (auto-detected)

5. **Get Your URL**
   - Click on your service → **"Settings"** → **"Generate Domain"**
   - You'll get a URL like: `https://job-search-production.up.railway.app`

6. **Done!** Your app is live

### Pricing Details

- **Hobby Plan**: $5/month base + usage-based pricing
- PostgreSQL database included
- No sleep mode (always active)
- Much better performance than free hosting alternatives
- Credit card required

## Environment Variables

Required for production:

- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Railway)
- `NODE_ENV`: Set to `production` (auto-configured by Railway)
- `PORT`: Server port (auto-configured by Railway)
- `AUTH_USERNAME`: Username for basic authentication (REQUIRED for security)
- `AUTH_PASSWORD`: Password for basic authentication (REQUIRED for security)

Optional (for Google Drive features):

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth redirect URI

## Setting Up Authentication on Railway

**IMPORTANT:** The app uses HTTP Basic Authentication to protect your data.

1. In Railway dashboard, go to your web service
2. Click **"Variables"** tab
3. Add these environment variables:
   - `AUTH_USERNAME`: Choose a username (e.g., your email or "admin")
   - `AUTH_PASSWORD`: Choose a strong password
4. Redeploy

When you visit your app, you'll be prompted to enter username/password.

## Google Drive Integration

### How to Add Attachments

The app allows you to link Google Drive files to your job applications:

1. Upload your document (resume, cover letter, etc.) to Google Drive
2. Right-click the file → "Get link" → "Anyone with the link can view"
3. Copy the URL
4. In the app, add the attachment with the file name and Google Drive URL

### Future Enhancement (Optional)

For direct file uploads, you'll need to:
1. Create a Google Cloud project
2. Enable Google Drive API
3. Create OAuth credentials
4. Add credentials to your environment variables

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

## Cost Considerations

- **Railway Hobby Plan**: $5/month base fee + usage costs
- Small apps like this typically cost $5-8/month total
- PostgreSQL database included
- **No sleep mode** - app stays awake
- Monitor usage in Railway dashboard to avoid surprises

## Tips

- Monitor your Railway usage in the dashboard to track costs
- Set up usage alerts to avoid unexpected charges
- Railway is more reliable than free hosting (no cold starts)
- Database backups available in paid plans

## Alternative Free Hosting Options

If you want completely free hosting, consider:
- **Vercel** (frontend) + **Supabase** (database) - both have generous free tiers
- **Render** - has a free tier but apps sleep after inactivity
- **Fly.io** - has a small free allowance
- Note: Free hosting typically has limitations (sleep mode, slower performance)

## Upgrading Railway

For more resources on Railway:
- **Railway Pro Plan**: $20/month + usage-based pricing
- Better performance, more build minutes, priority support

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
