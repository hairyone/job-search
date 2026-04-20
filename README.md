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
- **Hosting**: Railway (Hobby plan - $5/month)

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

## Deploy to Railway ($5/month Hosting)

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
