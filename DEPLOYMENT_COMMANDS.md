# Quick Deployment Commands

## 🎯 You're logged into PuTTY at your basement server

**Current location:** `/opt/apps/payton-place/backend`

---

## ⚡ Quick Deploy (Copy & Paste These Commands)

### 1. Navigate to Project Root
```bash
cd /opt/apps/payton-place
```

### 2. Install Backend Dependencies
```bash
cd backend && npm install --production
```

### 3. Copy Environment File
```bash
cp .env.production .env
```

### 4. Create Required Directories
```bash
mkdir -p ../logs
mkdir -p uploads
chmod 755 uploads
```

### 5. Update nginx Configuration
```bash
sudo cp ../nginx/payton-place.conf /etc/nginx/sites-available/payton-place
sudo ln -sf /etc/nginx/sites-available/payton-place /etc/nginx/sites-enabled/payton-place
sudo nginx -t
sudo systemctl reload nginx
```

### 6. Start Backend with PM2
```bash
cd /opt/apps/payton-place
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 7. Seed Database (Optional - for demo)
```bash
cd backend
npm run create-admin
npm run seed-dummy
```

---

## ✅ Verify It's Working

```bash
# Check PM2 status
pm2 status

# View logs
pm2 logs payton-place-backend

# Test API endpoint
curl https://payton-place.mbartonportfolio.space/api/health
```

**Then test in browser:**
- Frontend: https://payton-place.mbartonportfolio.space
- Admin Login: https://payton-place.mbartonportfolio.space/admin
  - Email: `admin@paytonplace.com`
  - Password: `admin123`

---

## 🔧 Common Commands

```bash
# View backend logs
pm2 logs payton-place-backend

# Restart backend
pm2 restart payton-place-backend

# Stop backend
pm2 stop payton-place-backend

# Delete backend from PM2
pm2 delete payton-place-backend

# PM2 status
pm2 status

# nginx reload
sudo systemctl reload nginx

# nginx status
sudo systemctl status nginx

# Check what's running on port 5000
lsof -i :5000
```

---

## 📋 What Got Built

✅ **Frontend** (`frontend/dist/`)
- Optimized production build
- 1.2 MB minified JavaScript
- 24 KB CSS

✅ **Backend** (`backend/dist/`)
- Compiled TypeScript → JavaScript
- Ready for Node.js execution

✅ **Configuration Files**
- `backend/.env.production` - MongoDB Atlas + CORS settings
- `ecosystem.config.js` - PM2 configuration
- `nginx/payton-place.conf` - Reverse proxy config

---

## 📁 File Structure on Server

```
/opt/apps/payton-place/
├── frontend/
│   └── dist/              # Built frontend (nginx serves this)
├── backend/
│   ├── dist/              # Compiled backend (PM2 runs this)
│   ├── .env               # Production environment (MongoDB URI, JWT)
│   └── uploads/           # User-uploaded images
├── logs/                  # PM2 log files
├── ecosystem.config.js    # PM2 process config
└── nginx/
    └── payton-place.conf  # nginx reverse proxy config
```

---

## 🆘 Troubleshooting

### "Route not found" on admin login
**Fix:** Backend not running
```bash
pm2 restart payton-place-backend
pm2 logs payton-place-backend
```

### 502 Bad Gateway
**Fix:** Backend crashed
```bash
pm2 logs payton-place-backend --err
pm2 restart payton-place-backend
```

### Images not loading
**Fix:** Create uploads directory
```bash
cd /opt/apps/payton-place/backend
mkdir -p uploads && chmod 755 uploads
```

### CORS errors
**Fix:** Check backend .env
```bash
cat /opt/apps/payton-place/backend/.env | grep CORS_ORIGIN
# Should be: CORS_ORIGIN=https://payton-place.mbartonportfolio.space
```

---

**For detailed instructions, see:** [DEPLOYMENT_SELF_HOSTED.md](DEPLOYMENT_SELF_HOSTED.md)
