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
- **Hosting**: Render (Free tier)

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

## Deploy to Render (Free Hosting)

### One-Click Deployment

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Connect to Render**
   - Go to [Render.com](https://render.com) and sign up/login
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect the `render.yaml` file

3. **Auto-Setup**
   - Render will create:
     - A web service for your app
     - A PostgreSQL database (free tier)
     - Environment variables are configured automatically

4. **Wait for deployment** (5-10 minutes)
   - Render will install dependencies, build the app, and start the server
   - You'll get a URL like: `https://job-tracker-xxxx.onrender.com`

5. **Done!** Your app is live and accessible from anywhere

### Manual Deployment (Alternative)

If you prefer manual setup:

1. **Create PostgreSQL Database**
   - In Render dashboard: New → PostgreSQL
   - Name: `job-tracker-db`
   - Free tier is sufficient

2. **Create Web Service**
   - New → Web Service
   - Connect your GitHub repo
   - Configure:
     - Build Command: `npm run install:all && npm run build`
     - Start Command: `npm start`
     - Add environment variable: `DATABASE_URL` (copy from PostgreSQL dashboard)

## Environment Variables

Required for production:

- `DATABASE_URL`: PostgreSQL connection string (auto-configured by Render)
- `NODE_ENV`: Set to `production`
- `PORT`: Server port (auto-configured by Render)

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

- **Render Web Service**: 750 hours/month (enough for one app)
- **PostgreSQL**: 90 days, then expires (upgrade to paid or migrate data)
- **Sleep Mode**: App sleeps after 15 minutes of inactivity (wakes on request)
- **Build Time**: Limited build minutes (plenty for this app)

## Tips

- The app will sleep after 15 minutes of no traffic (free tier)
- First request after sleep takes 30-60 seconds to wake up
- Consider using a service like [UptimeRobot](https://uptimerobot.com/) to ping your app every 5-10 minutes to keep it awake

## Upgrading

To keep the app always awake and get better performance:
- Upgrade Render plan to paid ($7/month)
- Or migrate to Vercel + Supabase (both have better free tiers)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
