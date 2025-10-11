# CI/CD Setup Guide
## Automated Deployment for Payton Place

This guide will help you set up automated deployment so that every push to `main` automatically deploys to your production server at **payton-place.mbartonportfolio.space**.

---

## 🎯 What You'll Achieve

After completing this setup:

**Push to `develop`** →  Builds and tests (no deployment)
**Push to `main`** → **Automatic deployment to production** (no PuTTY needed!)

---

## 📋 Prerequisites

- ✅ GitHub repository: https://github.com/cw-prime/Payton-Place
- ✅ Production server: payton-place.mbartonportfolio.space
- ✅ SSH access to your basement server
- ✅ Server user: `alan@alan-zende-web`

---

## 🔐 Step 1: Generate SSH Key for GitHub Actions

These commands should be run on **your basement server** (via PuTTY):

### 1.1 Generate a new SSH key pair

```bash
# Login to your server via PuTTY, then run:
cd ~/.ssh

# Generate new key specifically for GitHub Actions
ssh-keygen -t ed25519 -C "github-actions-deploy" -f github_actions_deploy_key

# When prompted:
# - Enter file path: Just press Enter (uses default name above)
# - Enter passphrase: Leave EMPTY (just press Enter twice)
```

This creates two files:
- `github_actions_deploy_key` (private key - for GitHub)
- `github_actions_deploy_key.pub` (public key - for your server)

### 1.2 Add public key to authorized_keys

```bash
# Still on your server:
cat github_actions_deploy_key.pub >> ~/.ssh/authorized_keys

# Verify it was added
tail -1 ~/.ssh/authorized_keys
```

### 1.3 Copy the private key

```bash
# Display the PRIVATE key - you'll copy this to GitHub
cat github_actions_deploy_key

# Copy everything from -----BEGIN to -----END including those lines
```

**Keep this private key safe!** You'll add it to GitHub in the next step.

---

## 🔑 Step 2: Add Secrets to GitHub

Go to your GitHub repository: https://github.com/cw-prime/Payton-Place

### 2.1 Navigate to Secrets

1. Click **Settings** tab
2. Click **Secrets and variables** → **Actions** (in left sidebar)
3. Click **New repository secret** button

### 2.2 Add Four Secrets

Click "New repository secret" for each:

#### Secret 1: `SERVER_SSH_KEY`
- **Name**: `SERVER_SSH_KEY`
- **Value**: Paste the ENTIRE private key you copied earlier
  ```
  -----BEGIN OPENSSH PRIVATE KEY-----
  [your key content]
  -----END OPENSSH PRIVATE KEY-----
  ```
- Click **Add secret**

#### Secret 2: `SERVER_HOST`
- **Name**: `SERVER_HOST`
- **Value**: Your server IP address or hostname
  - Example: `68.188.8.233` (or your domain if using that)
- Click **Add secret**

#### Secret 3: `SERVER_USER`
- **Name**: `SERVER_USER`
- **Value**: `alan`
- Click **Add secret**

#### Secret 4: `SERVER_PORT`
- **Name**: `SERVER_PORT`
- **Value**: `22` (or your custom SSH port if different)
- Click **Add secret**

### 2.3 Verify Secrets

You should now see 4 secrets listed:
- ✅ SERVER_SSH_KEY
- ✅ SERVER_HOST
- ✅ SERVER_USER
- ✅ SERVER_PORT

---

## 🧪 Step 3: Test the CI/CD Pipeline

Now let's test that everything works!

### 3.1 Make a Small Change

On your **local development machine**:

```bash
cd /var/www/html/Payton-Place

# Make sure you're on develop branch
git checkout develop

# Make a small test change
echo "# CI/CD Test" >> TEST.md

# Commit and push to develop
git add TEST.md
git commit -m "Test CI/CD pipeline"
git push origin develop
```

### 3.2 Watch GitHub Actions

1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see "Build and Test Staging" workflow running
4. Click on it to watch the build in real-time

**Expected result**: ✅ Build succeeds (but doesn't deploy)

### 3.3 Deploy to Production

Now merge to main to trigger auto-deployment:

```bash
# On your local machine:
git checkout main
git merge develop
git push origin main
```

### 3.4 Watch the Deployment

1. Go back to GitHub **Actions** tab
2. You should see "Deploy to Production" workflow running
3. Click on it to watch the deployment

**Expected steps:**
1. ✅ Checkout code
2. ✅ SSH into your server
3. ✅ Pull latest code
4. ✅ Build frontend
5. ✅ Build backend
6. ✅ Restart PM2
7. ✅ Verify deployment

**Total time**: ~2-3 minutes

### 3.5 Verify on Your Server

In PuTTY, check that the deployment worked:

```bash
pm2 status
pm2 logs payton-place-backend --lines 10
```

**Check your browser:**
- Visit: https://payton-place.mbartonportfolio.space
- Changes should be live!

---

## 🎊 You're Done!

### Your New Workflow:

#### **For Development Work:**
```bash
# Work on develop branch
git checkout develop

# Make changes
# ... edit files ...

# Commit and push
git add .
git commit -m "Add new feature"
git push origin develop

# ✅ GitHub Actions builds and tests automatically
# ⚠️  Does NOT deploy to production yet
```

#### **When Ready for Production:**
```bash
# Merge to main
git checkout main
git merge develop
git push origin main

# 🚀 Automatic deployment happens!
# ✅ Deployed to payton-place.mbartonportfolio.space in ~2 minutes
# ✅ No PuTTY login needed!
```

---

## 🔍 Monitoring Deployments

### View GitHub Actions Logs

1. Go to https://github.com/cw-prime/Payton-Place/actions
2. Click on any workflow run
3. Click "Deploy to Production Server" to see detailed logs

### Check Server Logs (via PuTTY if needed)

```bash
# PM2 logs
pm2 logs payton-place-backend

# Deployment history
ls -lh /opt/apps/payton-place/backups/
```

---

## 🔄 Rollback (If Needed)

If a deployment breaks something:

### Option 1: Rollback via Git

```bash
# On your local machine:
git revert HEAD
git push origin main

# This triggers a new deployment with the previous version
```

### Option 2: Rollback via Server Backup

```bash
# On your server (PuTTY):
cd /opt/apps/payton-place/backups

# List available backups
ls -lh

# Extract a previous backup (example)
tar -xzf backup_20251011_183000.tar.gz -C /opt/apps/payton-place

# Restart PM2
pm2 restart payton-place-backend
```

---

## ⚠️ Troubleshooting

### Deployment Fails with "Permission denied (publickey)"

**Fix:**
1. Check that you added the public key to `~/.ssh/authorized_keys` on your server
2. Verify `SERVER_SSH_KEY` secret in GitHub contains the PRIVATE key
3. Make sure the key was generated without a passphrase

```bash
# On server, check authorized_keys:
cat ~/.ssh/authorized_keys | grep "github-actions-deploy"
```

### Deployment Fails During Build

**Fix:**
1. Check the GitHub Actions logs for the specific error
2. Make sure `develop` branch builds successfully before merging to `main`
3. Test build locally:
   ```bash
   cd frontend && npm run build
   cd ../backend && npm run build
   ```

### PM2 Restart Fails

**Fix:**
Check PM2 logs on your server:
```bash
pm2 logs payton-place-backend --err --lines 50
```

Common issues:
- Port 5000 in use (kill other processes)
- MongoDB connection issue (check .env file)
- Missing dependencies (run `npm install`)

### Deployment Succeeds but Site Doesn't Update

**Fix:**
1. Clear browser cache (Ctrl+Shift+R)
2. Check nginx is serving the new build:
   ```bash
   sudo nginx -t
   sudo systemctl reload nginx
   ```
3. Verify files were updated:
   ```bash
   ls -lh /opt/apps/payton-place/frontend/dist/
   ```

---

## 📊 GitHub Actions Usage

**Free Tier Limits:**
- 2,000 CI/CD minutes per month
- Each deployment uses ~2-3 minutes
- You get ~600-1000 deployments per month for free

**Current workflows:**
- `deploy-production.yml` - Runs on push to `main`
- `deploy-staging.yml` - Runs on push to `develop`

**Cost**: $0 (within free tier limits)

---

## 🚀 Advanced Features (Optional)

### Add Slack/Discord Notifications

Edit `.github/workflows/deploy-production.yml` to add webhook notifications on success/failure.

### Add Automated Tests

Create test scripts and add them to the workflow:
```yaml
- name: Run Tests
  run: |
    cd backend
    npm test
```

### Deploy to Staging Subdomain

If you set up `staging.payton-place.mbartonportfolio.space`:
1. Uncomment the `deploy-staging` job in `deploy-staging.yml`
2. Add separate nginx config for staging
3. Use different PM2 process name

---

## 📞 Support

If you encounter issues:

1. **Check GitHub Actions logs**: Most issues are visible in the workflow logs
2. **Check server logs**: `pm2 logs payton-place-backend`
3. **Verify secrets**: Make sure all 4 secrets are correctly set in GitHub
4. **Test SSH manually**: Try SSH from another machine with the key to verify it works

---

## 🎯 Quick Reference

**Your Branches:**
- `develop` - Development branch (builds, doesn't deploy)
- `main` - Production branch (builds AND deploys automatically)

**Your Workflow:**
1. Work on `develop`
2. Push to `develop` (triggers build/test)
3. Merge to `main` when ready
4. Push to `main` (triggers auto-deploy)
5. ✅ Live in ~2 minutes!

**No more PuTTY!** 🎉

---

**Setup completed by Claude Code**
Generated: 2025-10-11
