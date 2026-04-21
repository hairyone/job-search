# Simple Migration Guide: Railway → Supabase (No Command Line Tools)

This guide is for migrating your data using only web browsers - no terminal commands needed!

## Part 1: Set Up Supabase Database (5 minutes)

### Step 1: Create Supabase Account & Project

1. Go to [supabase.com](https://supabase.com)
2. Click **"Start your project"** 
3. Sign up with GitHub (it's free!)
4. Click **"New project"**
5. Fill in:
   - **Name**: `job-tracker` (or anything you like)
   - **Database Password**: Choose a strong password and **SAVE IT!**
   - **Region**: Choose closest to you (e.g., US East, EU West)
6. Click **"Create new project"** (wait ~2 minutes for setup)

### Step 2: Create Database Schema

1. In your Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"+ New query"**
3. Open the file `supabase-schema.sql` in VS Code (it's in your job-search folder)
4. **Copy the entire contents** of that file
5. **Paste** into the Supabase SQL Editor
6. Click **"Run"** (bottom right)
7. You should see: "Success. No rows returned"

✅ **Your database structure is now ready!**

### Step 3: Get Your Connection String

1. In Supabase, go to **"Settings"** → **"Database"** (left sidebar)
2. Scroll down to **"Connection string"**
3. Select **"Connection pooling"** tab
4. Click the **copy icon** next to the connection string
5. **Paste it into a text editor and replace `[YOUR-PASSWORD]`** with the actual password you created in Step 1
6. **Save this somewhere safe** - you'll need it for Vercel later!

Example format (BEFORE replacing password):
```
postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

Example format (AFTER replacing password):
```
postgresql://postgres.xxx:MyActualPassword123@aws-0-us-east-1.pooler.supabase.com:5432/postgres
```

✅ **Save this complete connection string!**

---

## Part 2: How Much Data Do You Have?

**Quick check:** How many job applications have you saved in Railway?

- **0-10 jobs**: Skip export! Just manually re-enter them in Supabase (fastest)
- **10-50 jobs**: Export and import (follow Part 2A below)
- **50+ jobs**: Consider contacting support or using advanced tools

---

## Part 2A: Export Data from Railway (Only if 10+ jobs)

### Step 1: Access Railway Database

1. Go to [railway.app](https://railway.app)
2. Open your job-search project
3. Click on the **PostgreSQL** service
4. Click the **"Data"** tab (or "Query" tab if available)

### Step 2: Count Your Data First

Before exporting, let's see how much data you have:

1. In the Query tab, run:
   ```sql
   SELECT COUNT(*) as total_jobs FROM jobs;
   ```
2. If you have **10 or fewer jobs**, it's easiest to just manually re-enter them in Supabase
3. If you have **more than 10 jobs**, continue with the export below

### Step 3: Export Your Jobs Data

1. In the Query tab, paste this:
   ```sql
   SELECT * FROM jobs ORDER BY id;
   ```
2. Click **"Run"**
3. **Copy the results manually:**
   - Select all the rows in the results table
   - Copy them to a text file or spreadsheet
   - OR take a screenshot of each page of results
   - OR write down the data for each job

**Note:** Railway may not have a download button - manual copying is fine for small amounts of data!

### Step 4: Export Your Attachments Data (if any)

1. In the Query tab, paste this:
   ```sql
   SELECT * FROM attachments ORDER BY id;
   ```
2. Click **"Run"**
3. Copy the results to a text file

### Step 5: Export Your Contacts Data (if any)

1. In the Query tab, paste this:
   ```sql
   SELECT * FROM contacts ORDER BY id;
   ```
2. Click **"Run"**
3. Copy the results to a text file

### Alternative: Get Data from Your Live App

If Railway's database interface is difficult:

1. Go to your live Railway app URL
2. Open each job application
3. Take notes or screenshots
4. Re-enter them in Supabase later (often faster for < 20 jobs!)

---

## Part 3: Import Data to Supabase (5 minutes)

### Method A: Using Table Editor (Easiest for Small Data)

1. Go to your Supabase dashboard
2. Click **"Table Editor"** (left sidebar)
3. Select the **"jobs"** table
4. Click **"Insert"** → **"Insert row"**
5. Manually enter each job (good if you have < 10 jobs)

### Method B: Using SQL Editor (Better for More Data)

1. Click **"SQL Editor"** in Supabase
2. Click **"+ New query"**
3. For each job from your Railway export, create an INSERT statement:

**Example:** If your Railway data shows:
```
id: 1
company: "Google"
position: "Software Engineer"
source: "LinkedIn"
status: "Applied"
```

Create this SQL:
```sql
INSERT INTO jobs (company, position, source, status, job_url, location, salary_range, description, notes, applied_date)
VALUES 
  ('Google', 'Software Engineer', 'LinkedIn', 'Applied', 'https://...', 'Mountain View, CA', '150k-200k', 'Description here', 'My notes', '2026-04-15'),
  ('Apple', 'iOS Developer', 'Indeed', 'Interview Scheduled', 'https://...', 'Cupertino, CA', '140k-180k', NULL, NULL, '2026-04-10');
  -- Add more rows as needed
```

4. Click **"Run"**
5. Repeat for `attachments` and `contacts` tables if you have data

### Method C: Using CSV Import (If Supabase Supports It)

1. In Supabase Table Editor, look for an **"Import"** or **"Upload CSV"** button
2. If available, upload your CSV files directly
3. Map the columns correctly

---

## Part 4: Verify Migration

### Check Your Data

1. In Supabase, go to **"Table Editor"**
2. Click each table and verify:
   - ✅ **jobs** - Check count matches Railway
   - ✅ **attachments** - Verify linked correctly
   - ✅ **contacts** - Verify linked correctly

### Test a Query

1. Go to **SQL Editor**
2. Run:
   ```sql
   SELECT COUNT(*) FROM jobs;
   SELECT COUNT(*) FROM attachments;
   SELECT COUNT(*) FROM contacts;
   ```
3. Verify counts match your Railway database

✅ **Data migration complete!**

---

## Part 5: Deploy to Vercel (5 minutes)

### Step 1: Go to Vercel

1. Visit [vercel.com](https://vercel.com)
2. Click **"Sign Up"** and choose **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub

### Step 2: Import Your Project

1. Click **"Add New..."** → **"Project"**
2. Find **"hairyone/job-search"** in the list
3. Click **"Import"**

### Step 3: Configure & Deploy

1. Leave all settings as default
2. Click **"Deploy"**
3. Wait 2-3 minutes for build to complete

### Step 4: Add Environment Variables

1. After deployment, click **"Continue to Dashboard"**
2. Go to **"Settings"** → **"Environment Variables"**
3. Add these variables (click "+ Add" for each):

| Name | Value |
|------|-------|
| `DATABASE_URL` | Your Supabase connection string (from Part 1, Step 3) |
| `NODE_ENV` | `production` |
| `AUTH_USERNAME` | Choose a username (e.g., `admin` or your email) |
| `AUTH_PASSWORD` | Choose a strong password |

4. Click **"Save"**
5. Go to **"Deployments"** tab
6. Click the **"..."** menu on the latest deployment → **"Redeploy"**

### Step 5: Access Your App

1. Go back to your project overview
2. Click on your deployment URL (e.g., `job-search-xyz.vercel.app`)
3. You'll be prompted for username/password
4. Enter the AUTH_USERNAME and AUTH_PASSWORD you set
5. **You're live!** 🎉

---

## Troubleshooting

### "No data appears in my app"
- Check Supabase Table Editor - is your data there?
- Make sure DATABASE_URL in Vercel matches your Supabase connection string
- Check you replaced `[YOUR-PASSWORD]` with actual password

### "Can't connect to database"
- Verify DATABASE_URL has no typos
- Check Supabase project is still active (Settings → General)
- Make sure you're using the **Connection Pooling** string (not Transaction or Session)

### "Authentication not working"
- Double-check AUTH_USERNAME and AUTH_PASSWORD in Vercel
- Try redeploying after adding environment variables

---

## After Migration Checklist

- [ ] All jobs imported to Supabase
- [ ] All attachments imported (if any)
- [ ] All contacts imported (if any)
- [ ] Vercel deployment successful
- [ ] Environment variables configured
- [ ] Can log in with username/password
- [ ] Can see all your job applications
- [ ] Can create a new test job
- [ ] Can edit and delete test job

Once everything works:
- [ ] (Optional) Delete Railway project to stop charges

---

## Need Help?

If you get stuck:
1. Check the Supabase logs: Dashboard → Logs
2. Check Vercel deployment logs: Project → Deployments → Click deployment → View Logs
3. Ask for help and share the error message

**Your data is safe throughout this process - Railway stays active until you delete it!**
