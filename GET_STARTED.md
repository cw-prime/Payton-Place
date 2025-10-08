# 🚀 Get Started in 3 Minutes

Quick reference card to get Payton Place Development running locally.

## Prerequisites

- Node.js v18+ ✅
- MongoDB (local or Atlas) ✅
- Git ✅

## Installation (Copy & Paste)

```bash
# 1. Install dependencies
npm install

# 2. Configure backend
cd backend
cp .env.example .env
# Edit .env: Set MONGODB_URI=mongodb://localhost:27017/payton-place

# 3. Configure frontend
cd ../frontend
cp .env.example .env
# Edit .env: Set VITE_API_URL=http://localhost:5000/api

# 4. Go back to root
cd ..

# 5. Start backend and seed database (in one terminal)
npm run backend
# Wait for "MongoDB connected successfully"
# Then in another terminal:
cd backend && npm run seed

# 6. Start both servers (from root)
npm run dev
```

## Access Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## Quick Test

1. Open http://localhost:5173
2. Navigate through: Home → Projects → Services → About → Contact
3. Test contact form at http://localhost:5173/contact
4. Test quote form at http://localhost:5173/quote

## Default MongoDB URI

**Local MongoDB:**
```
mongodb://localhost:27017/payton-place
```

**MongoDB Atlas:**
```
mongodb+srv://username:password@cluster.mongodb.net/payton-place
```

## Common Issues

**Port in use?**
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9
```

**MongoDB connection error?**
```bash
# Start MongoDB
mongod
# Or verify Atlas connection string
```

**Need to reseed?**
```bash
cd backend
npm run seed
```

## Project Structure at a Glance

```
Payton-Place/
├── frontend/          # React app (localhost:5173)
├── backend/           # Express API (localhost:5000)
├── shared/            # Shared types
├── .github/workflows/ # CI/CD
└── *.md               # Documentation
```

## Next Steps

1. ✅ Application running? → See [README.md](README.md) for features
2. 🎨 Want to customize? → See [SETUP.md](SETUP.md) for details
3. 🚀 Ready to deploy? → See [DEPLOYMENT.md](DEPLOYMENT.md)
4. 📚 API reference? → See [API.md](API.md)

## Quick Scripts Reference

```bash
# Development
npm run dev              # Start both frontend & backend
npm run frontend         # Frontend only (port 5173)
npm run backend          # Backend only (port 5000)

# Database
cd backend && npm run seed  # Seed/reseed database

# Build
npm run build           # Build all for production

# Individual
cd frontend && npm run dev   # Vite dev server
cd backend && npm run dev    # Express with hot reload
```

## File Checklist

Before running, ensure these files exist:

- [ ] `backend/.env` (copy from `.env.example`)
- [ ] `frontend/.env` (copy from `.env.example`)
- [ ] MongoDB is running (local) or Atlas connection works

## Verify Installation

```bash
# Check backend
curl http://localhost:5000/api/health

# Check projects
curl http://localhost:5000/api/projects

# Should return JSON with projects data
```

## Emergency Reset

If something goes wrong:

```bash
# 1. Stop all servers (Ctrl+C)

# 2. Clean install
rm -rf node_modules frontend/node_modules backend/node_modules
npm install

# 3. Drop and reseed database
mongosh
> use payton-place
> db.dropDatabase()
> exit

cd backend && npm run seed

# 4. Restart
cd .. && npm run dev
```

---

**Need more help?** See detailed guides:
- [SETUP.md](SETUP.md) - Complete setup guide
- [README.md](README.md) - Full documentation
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview

🎉 **Happy coding!**
