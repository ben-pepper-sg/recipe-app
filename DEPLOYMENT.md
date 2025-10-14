# Deployment Guide - Vercel

## Step-by-Step Deployment

### 1. Push to GitHub

```bash
cd recipe-app
git init
git add .
git commit -m "Initial commit - Recipe app"
```

Create a new repository on GitHub, then:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### 2. Import Project to Vercel

1. Go to [vercel.com](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Keep the default settings (Framework Preset: Next.js)
5. **DON'T deploy yet** - click "Environment Variables" first

### 3. Add Environment Variables

Before deploying, add these environment variables:

#### Required Variables:

**NEXTAUTH_SECRET**
```
Itzo7trfBWxdc+rq1XMAd0GtdH8XwxA/jkVnCIpM8o4=
```

**NEXTAUTH_URL**
```
https://your-app-name.vercel.app
```
(You can leave this blank for now - Vercel will auto-detect it)

**ALLOWED_EMAILS**
```
your.email@example.com,friend@example.com
```
(Add up to 5 comma-separated emails)

### 4. Create Vercel Postgres Database

**BEFORE deploying:**

1. In your Vercel project dashboard, go to the "Storage" tab
2. Click "Create Database"
3. Select "Postgres"
4. Choose a database name (e.g., "recipe-db")
5. Select your region
6. Click "Create"

### 5. Connect Database to Project

After creating the database:

1. Vercel will automatically add these environment variables to your project:
   - `POSTGRES_URL`
   - `POSTGRES_PRISMA_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_USER`
   - `POSTGRES_HOST`
   - `POSTGRES_PASSWORD`
   - `POSTGRES_DATABASE`

2. These are automatically injected - you don't need to copy them manually!

### 6. Deploy

1. Click "Deploy" button
2. Wait for the build to complete (2-3 minutes)

### 7. Run Database Migrations

After your first deployment:

**Option A: Use Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link your project
vercel link

# Pull environment variables
vercel env pull

# Run migrations
npm run db:push
```

**Option B: Add to package.json and redeploy**

Add this to your `package.json` scripts:

```json
"scripts": {
  "build": "npx drizzle-kit push && next build"
}
```

Then push and redeploy - migrations will run automatically on build.

### 8. Access Your App

1. Go to your deployment URL: `https://your-app-name.vercel.app`
2. Navigate to `/auth/signup`
3. Register with one of your allowed emails
4. Start creating recipes!

---

## Quick Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Project imported to Vercel
- [ ] `NEXTAUTH_SECRET` environment variable added
- [ ] `ALLOWED_EMAILS` environment variable added with your emails
- [ ] Vercel Postgres database created
- [ ] Database connected to project (auto-connected)
- [ ] First deployment completed
- [ ] Database migrations run
- [ ] Tested sign-up with allowed email
- [ ] Created first recipe

---

## Troubleshooting

### "Database connection error"
- Make sure Vercel Postgres is created and connected
- Check that `POSTGRES_URL` is in your environment variables (should be automatic)
- Redeploy if you added the database after first deploy

### "Email not authorized"
- Verify `ALLOWED_EMAILS` is set correctly
- Check for typos in email addresses
- No spaces around commas: `email1@test.com,email2@test.com`

### "NEXTAUTH_SECRET error"
- Make sure `NEXTAUTH_SECRET` is set in Vercel environment variables
- Redeploy after adding environment variables

### Migrations not running
- Use Vercel CLI method (Option A above)
- Or modify build script (Option B) and redeploy

---

## Adding the Build Script (Recommended)

To make migrations run automatically on every deployment, update your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "drizzle-kit push && next build",
    "start": "next start",
    "lint": "next lint",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

Then redeploy. Migrations will run automatically before each build.

---

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click "Domains"
3. Add your custom domain
4. Update `NEXTAUTH_URL` to your custom domain
5. Redeploy

---

## Managing Users

To add/remove users after deployment:

1. Go to Vercel project → Settings → Environment Variables
2. Edit `ALLOWED_EMAILS`
3. Redeploy the app

---

## Database Management

**View Database:**
- In Vercel dashboard → Storage → Your database → "Data" tab

**Backup Database:**
- In Vercel dashboard → Storage → Your database → "Backups" tab
- Create manual backup or enable automatic backups

**Local Access:**
```bash
# Pull environment variables
vercel env pull

# Open Drizzle Studio
npm run db:studio
```

Browse your production database at http://localhost:4983
