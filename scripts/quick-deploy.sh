#!/bin/bash
# Quick Deployment Script for payton-place.mbartonportfolio.space
# Run this on your basement server via PuTTY

set -e  # Exit on error

echo "🚀 Payton Place Deployment Script"
echo "=================================="
echo ""

# Configuration
PROJECT_DIR="/opt/apps/payton-place"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
LOGS_DIR="$PROJECT_DIR/logs"

# Step 1: Create necessary directories
echo "📁 Creating directories..."
mkdir -p "$LOGS_DIR"
mkdir -p "$BACKEND_DIR/uploads"
chmod 755 "$BACKEND_DIR/uploads"
echo "✅ Directories created"
echo ""

# Step 2: Copy environment files
echo "⚙️  Copying environment files..."
if [ -f "$BACKEND_DIR/.env.production" ]; then
    cp "$BACKEND_DIR/.env.production" "$BACKEND_DIR/.env"
    echo "✅ Backend environment file copied"
else
    echo "❌ Error: Backend .env.production not found!"
    exit 1
fi
if [ -f "$FRONTEND_DIR/.env.production" ]; then
    cp "$FRONTEND_DIR/.env.production" "$FRONTEND_DIR/.env"
    echo "✅ Frontend environment file copied"
else
    echo "⚠️  Frontend .env.production not found, skipping..."
fi
echo ""

# Step 3: Install and build
echo "📦 Installing dependencies and building..."
cd "$BACKEND_DIR"
npm install
npm run build
echo "✅ Backend built"

cd "$FRONTEND_DIR"
npm install
npm run build
echo "✅ Frontend built"
echo ""

# Step 4: Configure nginx
echo "🌐 Configuring nginx..."
if [ -f "$PROJECT_DIR/nginx/payton-place.conf" ]; then
    sudo cp "$PROJECT_DIR/nginx/payton-place.conf" /etc/nginx/sites-available/payton-place
    sudo ln -sf /etc/nginx/sites-available/payton-place /etc/nginx/sites-enabled/payton-place
    sudo nginx -t
    if [ $? -eq 0 ]; then
        sudo systemctl reload nginx
        echo "✅ nginx configured and reloaded"
    else
        echo "❌ nginx configuration test failed!"
        exit 1
    fi
else
    echo "⚠️  nginx config not found, skipping..."
fi
echo ""

# Step 5: Start backend with PM2
echo "🔄 Starting backend with PM2..."
cd "$PROJECT_DIR"
pm2 delete payton-place-backend 2>/dev/null || true  # Delete if exists
pm2 start ecosystem.config.js --env production
pm2 save
echo "✅ Backend started with PM2"
echo ""

# Step 6: Display status
echo "📊 Deployment Status:"
echo "===================="
pm2 status
echo ""
echo "📝 View logs with: pm2 logs payton-place-backend"
echo "🌐 Frontend: https://payton-place.mbartonportfolio.space"
echo "🔐 Admin: https://payton-place.mbartonportfolio.space/admin"
echo ""
echo "✅ Deployment complete!"
