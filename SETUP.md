# Quick Setup Guide

Get the Payton Place Development application running locally in minutes.

## Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js v18+** installed ([download](https://nodejs.org/))
- [ ] **npm** or **yarn** package manager
- [ ] **MongoDB** installed locally OR MongoDB Atlas account ([signup](https://www.mongodb.com/cloud/atlas))
- [ ] **Git** installed
- [ ] A code editor (VS Code recommended)

## 🚀 Quick Start (5 Steps)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Payton-Place

# Install all dependencies (root, frontend, backend)
npm install
```

### Step 2: Setup MongoDB

**Option A: Local MongoDB**

```bash
# Make sure MongoDB is running
mongod
```

**Option B: MongoDB Atlas (Cloud)**

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get connection string
4. Whitelist IP: 0.0.0.0/0 (for development)

### Step 3: Configure Environment Variables

**Backend:** Create `backend/.env`

```bash
# Copy example file
cp backend/.env.example backend/.env

# Edit backend/.env with your values:
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/payton-place
# OR for Atlas: mongodb+srv://username:password@cluster.xxxxx.mongodb.net/payton-place
CORS_ORIGIN=http://localhost:5173
```

**Frontend:** Create `frontend/.env`

```bash
# Copy example file
cp frontend/.env.example frontend/.env

# Edit frontend/.env:
VITE_API_URL=http://localhost:5000/api
```

### Step 4: Seed the Database

```bash
# Start backend (in one terminal)
npm run backend

# In another terminal, seed data
cd backend
npm run seed
```

You should see:
```
✅ 12 projects created
✅ 6 services created
✅ 5 team members created
🎉 Database seeded successfully!
```

### Step 5: Start Development Servers

```bash
# From root directory, start both frontend and backend
npm run dev
```

This starts:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## ✅ Verify Installation

1. **Frontend:** Open http://localhost:5173
   - You should see the home page with hero section
   - Navigate to Projects, Services, About, Contact pages

2. **Backend:** Open http://localhost:5000/api/health
   - You should see: `{"status":"healthy","timestamp":"...","uptime":...}`

3. **Database:** Check MongoDB
   ```bash
   # If using local MongoDB
   mongosh
   use payton-place
   db.projects.count()  # Should return 12
   ```

## 🛠️ Development Workflow

### Run Services Individually

```bash
# Backend only
npm run backend

# Frontend only
npm run frontend
```

### Build for Production

```bash
# Build all workspaces
npm run build

# Or build individually
cd frontend && npm run build
cd backend && npm run build
```

### Re-seed Database

```bash
cd backend
npm run seed
```

This will clear existing data and insert fresh seed data.

## 📂 Project Structure

```
Payton-Place/
├── frontend/                 # React + Vite app
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── backend/                  # Express + TypeScript API
│   ├── src/
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── controllers/     # Route handlers
│   │   ├── config/          # Configuration
│   │   ├── scripts/         # Seed & utilities
│   │   └── server.ts        # Entry point
│   ├── .env                 # Environment variables
│   └── package.json
│
├── shared/                   # Shared types
├── .github/workflows/        # CI/CD workflows
├── README.md                # Main documentation
├── DEPLOYMENT.md            # Deployment guide
├── API.md                   # API documentation
└── package.json             # Root workspace config
```

## 🐛 Troubleshooting

### MongoDB Connection Error

**Problem:** `MongooseServerSelectionError: connect ECONNREFUSED`

**Solution:**
- Check if MongoDB is running: `mongod` or check Atlas connection
- Verify `MONGODB_URI` in `backend/.env`
- For Atlas: Ensure IP is whitelisted

### Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Find and kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or change port in backend/.env
PORT=5001
```

### Frontend Can't Connect to Backend

**Problem:** API calls return 404 or network errors

**Solution:**
- Ensure backend is running on port 5000
- Check `VITE_API_URL` in `frontend/.env`
- Verify CORS settings in backend

### Dependencies Installation Fails

**Problem:** `npm install` errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf backend/node_modules backend/package-lock.json

# Reinstall
npm install
```

### Seed Script Fails

**Problem:** Seed script errors

**Solution:**
- Ensure MongoDB is running and connected
- Check `MONGODB_URI` is correct
- Ensure database is accessible
- Try dropping the database first:
  ```bash
  mongosh
  use payton-place
  db.dropDatabase()
  ```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Rebuild TypeScript
cd backend && npm run build
cd ../frontend && npm run build
```

## 🔧 Configuration Options

### Backend Environment Variables

```env
# Required
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/payton-place
CORS_ORIGIN=http://localhost:5173

# Optional - Image Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your_value
CLOUDINARY_API_KEY=your_value
CLOUDINARY_API_SECRET=your_value

# Optional - Email Notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@paytonplace.com
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## 📱 Testing the Application

### Test Contact Form

1. Go to http://localhost:5173/contact
2. Fill out the form
3. Submit
4. Check MongoDB for new entry:
   ```bash
   mongosh
   use payton-place
   db.contactinquiries.find().pretty()
   ```

### Test Quote Request

1. Go to http://localhost:5173/quote
2. Fill out the form
3. Submit
4. Check MongoDB:
   ```bash
   db.quoterequests.find().pretty()
   ```

### Test API Endpoints

```bash
# Get all projects
curl http://localhost:5000/api/projects

# Get featured projects
curl http://localhost:5000/api/projects?featured=true

# Get residential services
curl http://localhost:5000/api/services?category=residential

# Get team members
curl http://localhost:5000/api/team

# Health check
curl http://localhost:5000/api/health
```

## 🚀 Next Steps

1. **Customize Content**
   - Edit seed data in `backend/src/scripts/seed.ts`
   - Replace placeholder images with real images
   - Update company information

2. **Customize Styling**
   - Edit TailwindCSS theme in `frontend/tailwind.config.js`
   - Modify component styles

3. **Add Features**
   - Add authentication for admin panel
   - Implement image upload functionality
   - Add email notifications

4. **Deploy**
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions
   - Set up CI/CD with GitHub Actions

## 📚 Additional Resources

- [Main README](README.md) - Full documentation
- [API Documentation](API.md) - API endpoints
- [Deployment Guide](DEPLOYMENT.md) - Deploy to production
- [Contributing Guide](CONTRIBUTING.md) - Contribute to the project

## 💡 Tips

- Use **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

- Keep backend and frontend terminals separate for easier debugging

- Use MongoDB Compass for visual database management

- Check browser console and network tab for frontend issues

- Check backend terminal for API errors

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review the main [README.md](README.md)
3. Check [API.md](API.md) for API details
4. Search existing issues in the repository
5. Create a new issue with detailed information

---

Happy coding! 🎉
