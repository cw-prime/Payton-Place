#!/bin/bash
# Remote Deployment Script
# This script is executed on the production server by GitHub Actions

set -e  # Exit on error

echo "=================================="
echo "🚀 Payton Place Production Deploy"
echo "=================================="
echo "📅 $(date)"
echo "🌐 Target: payton-place.mbartonportfolio.space"
echo "=================================="
echo ""

# Configuration
PROJECT_DIR="/opt/apps/payton-place"
FRONTEND_DIR="$PROJECT_DIR/frontend"
BACKEND_DIR="$PROJECT_DIR/backend"
BACKUP_DIR="$PROJECT_DIR/backups"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
log_info() {
    echo -e "${GREEN}✓${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✗${NC} $1"
}

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Step 1: Navigate to project directory
log_info "Navigating to project directory..."
cd "$PROJECT_DIR" || { log_error "Failed to navigate to $PROJECT_DIR"; exit 1; }

# Step 2: Create backup of current version
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/backup_$TIMESTAMP.tar.gz"
log_info "Creating backup: $BACKUP_FILE"
tar -czf "$BACKUP_FILE" --exclude='node_modules' --exclude='.git' frontend/dist backend/dist 2>/dev/null || log_warn "Backup creation skipped (no previous build)"

# Step 3: Pull latest changes
log_info "Pulling latest code from GitHub (main branch)..."
git pull origin main || { log_error "Git pull failed"; exit 1; }

# Step 4: Install and build frontend
log_info "Building frontend..."
cd "$FRONTEND_DIR"
npm install --production || { log_error "Frontend npm install failed"; exit 1; }
npm run build || { log_error "Frontend build failed"; exit 1; }
log_info "Frontend build complete"

# Step 5: Install and build backend
log_info "Building backend..."
cd "$BACKEND_DIR"
npm install --production || { log_error "Backend npm install failed"; exit 1; }
npm run build || { log_error "Backend build failed"; exit 1; }
log_info "Backend build complete"

# Step 6: Restart PM2
log_info "Restarting backend with PM2..."
cd "$PROJECT_DIR"
pm2 restart payton-place-backend || { log_error "PM2 restart failed"; exit 1; }

# Wait for PM2 to stabilize
sleep 3

# Step 7: Verify PM2 status
log_info "Verifying PM2 status..."
if pm2 status | grep -q "payton-place-backend.*online"; then
    log_info "PM2 status: ONLINE"
else
    log_error "PM2 status check failed"
    log_warn "Attempting to view logs..."
    pm2 logs payton-place-backend --lines 20 --nostream
    exit 1
fi

# Step 8: Clean up old backups (keep last 10)
log_info "Cleaning up old backups (keeping last 10)..."
cd "$BACKUP_DIR"
ls -t | tail -n +11 | xargs -r rm -- 2>/dev/null || true

# Step 9: Display deployment summary
echo ""
echo "=================================="
echo "✅ Deployment Complete!"
echo "=================================="
echo "📅 Deployed: $(date)"
echo "🌐 URL: https://payton-place.mbartonportfolio.space"
echo "📦 Backup: $BACKUP_FILE"
echo "🔄 PM2 Status:"
pm2 status payton-place-backend --nostream
echo "=================================="
echo ""
log_info "To view logs: pm2 logs payton-place-backend"
log_info "To rollback: tar -xzf $BACKUP_FILE"
