# Job Application Tracker

A full-stack web application to track job applications from Indeed, LinkedIn, and other sources. Features include progress tracking, Google Drive attachment integration, and comprehensive statistics.

![Job Tracker](https://img.shields.io/badge/Status-Ready%20to%20Deploy-brightgreen)

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
- **Hosting**: Railway (Free tier - $5 credit/month)

## Local Development

### Prerequisites

- Node.js 18 or higher
- PostgreSQL (or use Render's free PostgreSQL)

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-search
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@localhost:5432/job_tracker
   PORT=3000
   NODE_ENV=development
   ```

4. **Run development servers**
   
   Backend:
   ```bash
   npm run dev
   ```
   
   Frontend (in a new terminal):
   ```bash
   cd client
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3000/api

## Deploy to Railway (Free Hosting)

### Quick Deployment (No Credit Card Required)

1. **Go to Railway**
   - Visit [Railway.app](https://railway.app)
   - Click **"Login"** and sign in with GitHub

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

### Free Tier Details

- **$5 credit per month** (no credit card required)
- Enough for ~500 hours of usage
- PostgreSQL database included
- No sleep mode (unlike Render)
- Better performance than Render free tier

## Environment Variables

Required for production:

- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Railway)
- `NODE_ENV`: Set to `production` (auto-configured by Railway)
- `PORT`: Server port (auto-configured by Railway)

Optional (for Google Drive features):

- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_REDIRECT_URI`: OAuth redirect URI

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

## Free Tier Limitations

- **Railway Free Tier**: $5 credit per month
- Approximately 500 hours of usage (for this app size)
- PostgreSQL database included
- **No sleep mode** - app stays awake
- After $5 credit is used, app pauses until next month

## Tips

- Monitor your Railway usage in the dashboard
- The $5/month credit is usually sufficient for personal apps
- No cold starts - better performance than Render free tier
- Database backups available in paid plans

## Upgrading

If you need more resources:
- **Railway Hobby Plan**: $5/month + usage-based pricing
- **Railway Pro Plan**: $20/month + usage-based pricing
- Alternative: Migrate to Vercel + Supabase (both have generous free tiers)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
