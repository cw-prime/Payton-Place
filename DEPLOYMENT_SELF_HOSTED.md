# Self-Hosted Deployment Guide
## Deploy to payton-place.mbartonportfolio.space

This guide provides step-by-step instructions for deploying the Payton Place application to your self-hosted basement server.

---

## 📋 Prerequisites

✅ **Server Setup:**
- nginx installed and configured
- Node.js v20+ installed
- PM2 installed (`pm2 -v` shows v5.2.2)
- MongoDB Atlas connection established
- Domain: payton-place.mbartonportfolio.space
- HTTPS/SSL already configured

✅ **Files Built:**
- Frontend production build: `frontend/dist/`
- Backend compiled: `backend/dist/`
- Environment files created: `.env.production`
- nginx config: `nginx/payton-place.conf`
- PM2 config: `ecosystem.config.js`

---

## 🚀 Deployment Steps

### Step 1: Transfer Files to Server

You're currently logged into your server via PuTTY at `/opt/apps/payton-place/backend`

**Option A: If files aren't on server yet (use rsync from local machine):**
```bash
# From your LOCAL machine (not PuTTY):
rsync -avz --exclude='node_modules' \
  /var/www/html/Payton-Place/ \
  alan@your-server-ip:/opt/apps/payton-place/
```

**Option B: If this is the same machine, create symlink or copy:**
```bash
# Already on server, in PuTTY:
cd /opt/apps
# If not exists, create directory
mkdir -p payton-place
cd payton-place
```

---

### Step 2: Install Backend Dependencies

```bash
# In PuTTY, navigate to project root
cd /opt/apps/payton-place/backend

# Install production dependencies only
npm install --production

# Verify installation
ls -la node_modules | head -10
```

---

### Step 3: Copy Environment Files

```bash
# In PuTTY, copy production env file
cd /opt/apps/payton-place/backend
cp .env.production .env

# Verify the file
cat .env | grep -E "PORT|MONGODB_URI|NODE_ENV|CORS"
```

**Expected output:**
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://cwprime_db_user:...
CORS_ORIGIN=https://payton-place.mbartonportfolio.space
```

---

### Step 4: Create Logs Directory

```bash
# In PuTTY, create logs directory for PM2
cd /opt/apps/payton-place
mkdir -p logs

# Verify
ls -la logs
```

---

### Step 5: Update nginx Configuration

```bash
# In PuTTY, copy nginx config
sudo cp /opt/apps/payton-place/nginx/payton-place.conf \
  /etc/nginx/sites-available/payton-place

# Create symlink to sites-enabled (if not exists)
sudo ln -sf /etc/nginx/sites-available/payton-place \
  /etc/nginx/sites-enabled/payton-place

# Test nginx configuration
sudo nginx -t
```

**Expected output:**
```
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

**If test fails:**
- Check if SSL certificate paths in nginx config match your existing setup
- Edit the nginx config to use your existing SSL cert paths:
```bash
sudo nano /etc/nginx/sites-available/payton-place
```

---

### Step 6: Reload nginx

```bash
# In PuTTY, reload nginx to apply new config
sudo systemctl reload nginx

# Verify nginx is running
sudo systemctl status nginx
```

---

### Step 7: Start Backend with PM2

```bash
# In PuTTY, navigate to project root
cd /opt/apps/payton-place

# Start backend using PM2
pm2 start ecosystem.config.js --env production

# Check PM2 status
pm2 status

# View logs
pm2 logs payton-place-backend --lines 50
```

**Expected output:**
```
┌─────┬──────────────────────────┬─────────────┬─────────┬─────────┐
│ id  │ name                     │ mode        │ status  │ cpu     │
├─────┼──────────────────────────┼─────────────┼─────────┼─────────┤
│ 0   │ payton-place-backend     │ fork        │ online  │ 0%      │
└─────┴──────────────────────────┴─────────────┴─────────┴─────────┘
```

**Check logs for:**
- ✅ MongoDB connected successfully
- ✅ Server running on port 5000

---

### Step 8: Save PM2 Configuration (Auto-restart on Reboot)

```bash
# In PuTTY, save PM2 process list
pm2 save

# Configure PM2 to start on system boot
pm2 startup

# Follow the command output to complete startup configuration
# It will show a command like:
# sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u alan --hp /home/alan

# Copy and run that command
```

---

### Step 9: Create Uploads Directory

```bash
# In PuTTY, create uploads directory for images
cd /opt/apps/payton-place/backend
mkdir -p uploads

# Set proper permissions
chmod 755 uploads
```

---

### Step 10: Seed Database (Optional - Dummy Data)

```bash
# In PuTTY, seed dummy data for demo
cd /opt/apps/payton-place/backend

# Create admin user
npm run create-admin

# Seed dummy services and team members
npm run seed-dummy
```

**This will create:**
- ✅ Admin user (email: admin@paytonplace.com, password: admin123)
- ✅ 6 services (3 residential, 3 commercial)
- ✅ 4 team members

---

## ✅ Verify Deployment

### Test 1: Backend API Health Check

```bash
# In PuTTY or browser
curl https://payton-place.mbartonportfolio.space/api/health
```

**Expected:** `{"status":"ok"}` or similar

### Test 2: Frontend Loads

Visit in browser: **https://payton-place.mbartonportfolio.space/**

**Expected:**
- ✅ Homepage loads
- ✅ Navigation works
- ✅ No 404 errors in browser console

### Test 3: Admin Login

Visit: **https://payton-place.mbartonportfolio.space/admin**

**Login credentials:**
- Email: `admin@paytonplace.com`
- Password: `admin123`

**Expected:**
- ✅ Login successful
- ✅ Redirects to dashboard
- ✅ No "Route not found" error

### Test 4: Services Page

Visit: **https://payton-place.mbartonportfolio.space/services**

**Expected:**
- ✅ Shows 6 services (if you ran seed-dummy)
- ✅ Images load correctly

### Test 5: Team Page

Visit: **https://payton-place.mbartonportfolio.space/about**

**Expected:**
- ✅ Shows 4 team members (if you ran seed-dummy)
- ✅ Photos display

---

## 🔧 Troubleshooting

### Issue: Admin Login Shows "Route not found"

**Cause:** Backend not running or nginx not proxying `/api` requests

**Fix:**
```bash
# Check PM2 status
pm2 status

# View backend logs
pm2 logs payton-place-backend

# Restart backend
pm2 restart payton-place-backend

# Check nginx config
sudo nginx -t
sudo systemctl reload nginx
```

### Issue: Images Not Loading

**Cause:** Uploads directory doesn't exist or wrong permissions

**Fix:**
```bash
cd /opt/apps/payton-place/backend
mkdir -p uploads
chmod 755 uploads
```

### Issue: 502 Bad Gateway

**Cause:** Backend crashed or not running on port 5000

**Fix:**
```bash
# Check PM2 logs
pm2 logs payton-place-backend --err

# Restart backend
pm2 restart payton-place-backend

# Check if port 5000 is in use
lsof -i :5000
```

### Issue: CORS Errors in Browser Console

**Cause:** Backend CORS not configured correctly

**Fix:**
```bash
cd /opt/apps/payton-place/backend

# Verify .env has correct CORS_ORIGIN
cat .env | grep CORS_ORIGIN

# Should show: CORS_ORIGIN=https://payton-place.mbartonportfolio.space

# If wrong, edit:
nano .env

# Restart backend
pm2 restart payton-place-backend
```

### Issue: Database Connection Failed

**Cause:** MongoDB Atlas connection string incorrect or IP not whitelisted

**Fix:**
1. Go to MongoDB Atlas → Network Access
2. Ensure your server IP is whitelisted (or use 0.0.0.0/0 for all IPs)
3. Verify connection string in `.env`:
```bash
cat /opt/apps/payton-place/backend/.env | grep MONGODB_URI
```

---

## 📊 Monitoring

### View Backend Logs

```bash
# Real-time logs
pm2 logs payton-place-backend

# Last 100 lines
pm2 logs payton-place-backend --lines 100

# Error logs only
pm2 logs payton-place-backend --err

# Log files location
ls -lh /opt/apps/payton-place/logs/
```

### Check PM2 Process

```bash
# Status
pm2 status

# Detailed info
pm2 info payton-place-backend

# Monitor resources
pm2 monit
```

### Check nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log

# Specific to your domain
sudo tail -f /var/log/nginx/access.log | grep payton-place
```

---

## 🔄 Updating Deployment

When you push new code to GitHub:

```bash
# On your basement server (PuTTY):
cd /opt/apps/payton-place

# Pull latest changes
git pull origin main

# Rebuild frontend
cd frontend
npm run build

# Rebuild backend
cd ../backend
npm run build

# Restart PM2
pm2 restart payton-place-backend

# No need to restart nginx unless config changed
```

---

## 🛡️ Security Checklist

- ✅ HTTPS enabled (already configured)
- ✅ MongoDB Atlas credentials in `.env` (not committed to git)
- ✅ JWT_SECRET is strong and unique
- ✅ CORS restricted to your domain only
- ✅ `.env` files have proper permissions (600)
```bash
chmod 600 /opt/apps/payton-place/backend/.env
```
- ✅ nginx security headers enabled (in config)
- ✅ MongoDB Atlas IP whitelist configured

---

## 📝 Important File Locations

| File/Directory | Location | Purpose |
|---------------|----------|---------|
| Frontend Build | `/opt/apps/payton-place/frontend/dist/` | Static files served by nginx |
| Backend Build | `/opt/apps/payton-place/backend/dist/` | Compiled JavaScript run by Node |
| Environment | `/opt/apps/payton-place/backend/.env` | Production config (MongoDB, JWT, CORS) |
| PM2 Config | `/opt/apps/payton-place/ecosystem.config.js` | Process manager settings |
| nginx Config | `/etc/nginx/sites-available/payton-place` | Reverse proxy configuration |
| Backend Logs | `/opt/apps/payton-place/logs/` | PM2 application logs |
| Uploads | `/opt/apps/payton-place/backend/uploads/` | User-uploaded images |

---

## 🎯 Next Steps

1. **Test all features** with dummy data
2. **Show client** how to use admin panel
3. **Delete dummy data** when ready (from admin panel)
4. **Have client add real content**:
   - Real services
   - Real team members
   - Real projects
5. **Monitor logs** for first few days
6. **Set up automated backups** for MongoDB Atlas

---

## 🆘 Support

If you encounter issues:

1. Check PM2 logs: `pm2 logs payton-place-backend`
2. Check nginx error logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify backend is running: `pm2 status`
4. Test API directly: `curl http://localhost:5000/api/health`
5. Check browser console for frontend errors

---

**Deployment prepared by Claude Code**
Generated: 2025-10-11
