# Deployment Guide

This guide covers deploying the Payton Place Development application to production.

## Architecture Overview

- **Frontend**: Deployed to Vercel
- **Backend**: Deployed to Render (or Railway/Heroku)
- **Database**: MongoDB Atlas (cloud database)
- **CI/CD**: GitHub Actions

## Prerequisites

1. GitHub account with repository access
2. Vercel account (free tier available)
3. Render account (free tier available) or Railway/Heroku
4. MongoDB Atlas account (free tier available)

## Part 1: Database Setup (MongoDB Atlas)

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Create a new cluster (free M0 tier is sufficient)
4. Choose a cloud provider and region close to your users
5. Wait for cluster creation (2-5 minutes)

### 2. Configure Database Access

1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create a username and password (save these!)
4. Set user privileges to "Atlas admin" or "Read and write to any database"

### 3. Configure Network Access

1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Choose **Allow Access from Anywhere** (0.0.0.0/0) for development
4. For production, add specific IP addresses of your deployment servers

### 4. Get Connection String

1. Click **Connect** on your cluster
2. Choose **Connect your application**
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `myFirstDatabase` with your database name (e.g., `payton-place`)

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/payton-place?retryWrites=true&w=majority`

## Part 2: Backend Deployment (Render)

### 1. Create Render Account

1. Go to [Render](https://render.com)
2. Sign up with GitHub

### 2. Create New Web Service

1. Click **New +** → **Web Service**
2. Connect your GitHub repository
3. Select the repository

### 3. Configure Web Service

**Settings:**
- **Name**: `payton-place-backend`
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main`
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or paid for production)

### 4. Add Environment Variables

Click **Environment** and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_atlas_connection_string
CORS_ORIGIN=your_frontend_vercel_url

# Optional
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@paytonplace.com
```

### 5. Deploy

1. Click **Create Web Service**
2. Wait for deployment (5-10 minutes)
3. Note your backend URL: `https://payton-place-backend.onrender.com`

### 6. Seed Database

After first deployment:

```bash
# SSH into Render console or use local connection with production MongoDB
MONGODB_URI=your_atlas_connection npm run seed
```

## Part 3: Frontend Deployment (Vercel)

### 1. Create Vercel Account

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub

### 2. Import Project

1. Click **Add New** → **Project**
2. Import your GitHub repository
3. Select the repository

### 3. Configure Project

**Settings:**
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `dist` (auto-detected)

### 4. Add Environment Variables

Click **Environment Variables** and add:

```
VITE_API_URL=https://payton-place-backend.onrender.com/api
```

### 5. Deploy

1. Click **Deploy**
2. Wait for deployment (2-5 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

### 6. Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Configure DNS as instructed by Vercel

## Part 4: GitHub Actions CI/CD

### 1. Get Vercel Tokens

```bash
# Install Vercel CLI
npm i -g vercel

# Login and link project
cd frontend
vercel login
vercel link

# Get tokens from .vercel/project.json
cat .vercel/project.json
```

Copy `orgId` and `projectId`.

Get Vercel token:
1. Go to Vercel → Settings → Tokens
2. Create new token
3. Copy the token

### 2. Get Render Deploy Hook

1. Go to Render dashboard
2. Select your web service
3. Go to **Settings** → **Deploy Hook**
4. Create deploy hook
5. Copy the URL

### 3. Add GitHub Secrets

Go to your GitHub repository → Settings → Secrets → Actions

Add these secrets:

**For Frontend:**
- `VERCEL_TOKEN`: Your Vercel token
- `VERCEL_ORG_ID`: From .vercel/project.json
- `VERCEL_PROJECT_ID`: From .vercel/project.json
- `VITE_API_URL`: Your backend URL

**For Backend:**
- `RENDER_DEPLOY_HOOK_URL`: Your Render deploy hook URL

### 4. Test CI/CD

1. Make a change to your code
2. Commit and push to main branch
3. Check **Actions** tab in GitHub
4. Workflows should trigger automatically

## Part 5: Post-Deployment

### 1. Verify Deployment

- Frontend: Visit your Vercel URL
- Backend: Visit `https://your-backend.onrender.com/api/health`

### 2. Test All Features

- [ ] Navigation works
- [ ] Projects load from database
- [ ] Services display correctly
- [ ] Team members show
- [ ] Contact form submits
- [ ] Quote form submits
- [ ] Animations work smoothly

### 3. Monitor

**Vercel:**
- Check **Analytics** for traffic
- Monitor **Functions** for performance

**Render:**
- Check **Logs** for errors
- Monitor **Metrics** for performance

**MongoDB Atlas:**
- Check **Metrics** for database performance
- Monitor storage usage

## Troubleshooting

### Frontend Issues

**Build fails:**
- Check environment variables are set correctly
- Verify `VITE_API_URL` is correct
- Check build logs in Vercel

**API calls fail:**
- Verify CORS is configured in backend
- Check backend URL in environment variable
- Check browser console for errors

### Backend Issues

**Build fails:**
- Check TypeScript compilation errors
- Verify all dependencies are in package.json
- Check Render build logs

**Database connection fails:**
- Verify MongoDB Atlas connection string
- Check IP whitelist includes 0.0.0.0/0
- Verify database user credentials

**API returns 500 errors:**
- Check Render logs for error messages
- Verify environment variables
- Check database connection

### GitHub Actions Fails

- Verify all secrets are set correctly
- Check workflow syntax
- Review action logs for specific errors

## Alternative Deployment Options

### Backend Alternatives
- **Railway**: Similar to Render, great free tier
- **Heroku**: Popular choice, limited free tier
- **DigitalOcean App Platform**: Good for production
- **AWS Elastic Beanstalk**: Enterprise option

### Frontend Alternatives
- **Netlify**: Similar to Vercel
- **Cloudflare Pages**: Fast global CDN
- **GitHub Pages**: Free for static sites
- **AWS S3 + CloudFront**: Enterprise option

### Database Alternatives
- **Local MongoDB**: For development only
- **MongoDB Cloud Manager**: Self-hosted option
- **CosmosDB**: Azure alternative with MongoDB API

## Security Checklist

- [ ] Environment variables are not committed to Git
- [ ] Database has strong password
- [ ] IP whitelist configured (production)
- [ ] CORS configured properly
- [ ] HTTPS enabled (automatic with Vercel/Render)
- [ ] API rate limiting implemented (optional)
- [ ] Input validation on all forms
- [ ] MongoDB Atlas backup enabled

## Performance Optimization

1. **Enable Vercel Analytics**
2. **Configure CDN for images** (Cloudinary)
3. **Enable MongoDB Atlas indexes** for frequent queries
4. **Monitor Render metrics** for backend performance
5. **Optimize images** before uploading
6. **Enable compression** in Express (gzip)

## Scaling Considerations

**Free Tier Limits:**
- Vercel: 100GB bandwidth/month
- Render: 750 hours/month, sleeps after inactivity
- MongoDB Atlas: 512MB storage

**When to Upgrade:**
- High traffic (>100K visits/month)
- Large database (>500MB)
- Need 24/7 uptime (Render free tier sleeps)
- Need faster builds/deployments

---

For support, check the main README.md or create an issue in the repository.
