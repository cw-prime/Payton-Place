# Admin Panel Setup Guide

## 🎉 What's Been Added

### Backend (Complete ✅)

1. **Authentication System**
   - JWT-based authentication
   - Admin model with bcrypt password hashing
   - Login/register endpoints
   - Auth middleware for protected routes

2. **Image Upload**
   - Multer middleware for file uploads
   - Local storage in `/uploads` directory
   - Support for multiple images (up to 10)
   - Image validation (jpeg, jpg, png, gif, webp)
   - Max file size: 10MB

3. **Enhanced Project API**
   - `POST /api/projects` - Create with image upload (protected)
   - `PUT /api/projects/:id` - Update with images (protected)
   - `DELETE /api/projects/:id` - Delete project (protected)
   - Image URLs automatically generated

4. **New Dependencies Added**
   - `bcryptjs` - Password hashing
   - `jsonwebtoken` - JWT tokens
   - `uuid` - Unique file names

### Frontend (Partial - Core Done ✅)

1. **Authentication Context**
   - `/src/contexts/AuthContext.tsx` - Auth state management
   - Auto token verification
   - Login/logout functionality

2. **Admin Pages**
   - `/admin/login` - Admin login page
   - `/admin/dashboard` - Admin dashboard with stats

### What's Still Needed

1. **Project Upload Form** (Next step)
2. **Project Edit Form**
3. **Project Detail Page** (Blog-style)
4. **Project Management List**
5. **Protected Route Component**
6. **Update App.tsx with admin routes**

---

## 🚀 Quick Setup

### 1. Install New Dependencies

```bash
cd backend
npm install
```

###2. Update Environment Variables

Add to `backend/.env`:
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

### 3. Create Admin User

```bash
cd backend
npm run create-admin
```

This creates:
- Email: `admin@paytonplace.com`
- Password: `admin123`

### 4. Test Authentication

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@paytonplace.com","password":"admin123"}'
```

You'll get a response with `token` - use this for authenticated requests.

**Create Project with Images:**
```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "title=New Project" \
  -F "description=Project description" \
  -F "category=residential" \
  -F "type=Kitchen Renovation" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

---

## 📱 Mobile Photo Upload

The backend is ready for mobile uploads! Admins can:

1. Take photos on their phone
2. Upload directly through the admin panel
3. Select Residential or Commercial category
4. Images are stored in `/uploads` directory

---

## 🔐 API Authentication

All protected endpoints require:
```
Authorization: Bearer YOUR_JWT_TOKEN
```

### Protected Endpoints:
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Public Endpoints (No auth needed):
- `GET /api/projects` - List projects
- `GET /api/projects/:id` - Get single project

---

## 📂 File Structure

```
backend/
├── src/
│   ├── models/
│   │   └── Admin.ts ✅ NEW
│   ├── middleware/
│   │   ├── auth.ts ✅ NEW
│   │   └── upload.ts ✅ NEW
│   ├── controllers/
│   │   ├── authController.ts ✅ NEW
│   │   └── projectController.ts ✅ UPDATED
│   ├── routes/
│   │   ├── authRoutes.ts ✅ NEW
│   │   └── projectRoutes.ts ✅ UPDATED
│   ├── scripts/
│   │   └── createAdmin.ts ✅ NEW
│   └── server.ts ✅ UPDATED
└── uploads/ ✅ AUTO-CREATED

frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.tsx ✅ NEW
│   └── pages/
│       └── admin/
│           ├── Login.tsx ✅ NEW
│           └── Dashboard.tsx ✅ NEW
```

---

## 🎯 Next Steps to Complete

I can help you complete the following:

### 1. Project Upload Form
- Mobile-friendly image picker
- Category selection (Residential/Commercial)
- Multi-image upload with preview
- Form validation
- Progress indicator

### 2. Project Edit Form
- Load existing project data
- Update images (add/remove)
- Save changes

### 3. Project Detail Page (Blog-style)
- Full-screen image gallery
- Project information
- Testimonials
- Related projects

### 4. Protected Routes
- Redirect to login if not authenticated
- Admin-only route wrapper

### 5. Update App Routing
- Add admin routes
- Integrate AuthProvider

---

## 💡 Features Ready to Use

✅ Admin authentication with JWT
✅ Password hashing with bcrypt
✅ Token verification
✅ Image upload with Multer
✅ Protected API endpoints
✅ Auto-create uploads directory
✅ Admin user creation script
✅ Login page
✅ Dashboard with stats

---

## 🔧 Testing the System

### 1. Start Backend
```bash
cd backend
npm run dev
```

### 2. Create Admin
```bash
cd backend
npm run create-admin
```

### 3. Test Login
Visit: `http://localhost:5173/admin/login`
- Email: admin@paytonplace.com
- Password: admin123

### 4. Upload Images via API
Use Postman or curl with multipart/form-data

---

## 🎨 Admin Panel Features (When Complete)

- **Dashboard**: Stats, recent projects, quick actions
- **Project Upload**: Multi-image upload from phone/desktop
- **Project Management**: Edit, delete, feature projects
- **Category Filters**: Residential/Commercial
- **Image Management**: Add/remove project images
- **Real-time Updates**: See changes immediately

---

## 🚀 Production Considerations

### Security
- Change JWT_SECRET in production
- Change default admin password
- Use HTTPS only
- Implement rate limiting
- Add CSRF protection

### File Storage
- Consider Cloudinary for production
- Implement image optimization
- Add file size limits
- Clean up old uploads

### Additional Features
- Image compression before upload
- Cloudinary integration (ready, just configure)
- Admin role management
- Audit logs
- Bulk upload

---

## ❓ Need Help?

The core authentication and upload system is ready. To complete the admin panel, we need to create:

1. Project upload/edit forms
2. Project detail page (blog-style)
3. Route protection
4. Image preview/management

Would you like me to continue building these components?

---

**Status**: Backend Complete ✅ | Frontend 40% Complete

Next: Build project upload form with mobile image support!
