# Payton Place Development

A full-stack real estate consulting web application with a smooth-scrolling, image-rich UI and functional backend. Built with modern technologies and designed for easy customization and deployment.

![Payton Place Development](./screen.png)

## 🌟 Features

- **Modern, Responsive UI** - Clean design matching the provided mockups
- **Smooth Animations** - Framer Motion for beautiful scroll animations and transitions
- **Full-Stack Architecture** - React frontend with Node.js/Express backend
- **MongoDB Database** - Flexible NoSQL database with Mongoose ODM
- **TypeScript** - Type-safe development across the entire stack
- **RESTful API** - Well-structured API endpoints
- **Form Validation** - Client-side validation with Zod and React Hook Form
- **CI/CD Ready** - GitHub Actions workflows for automated deployment
- **Image Integration** - High-quality Unsplash images with lazy loading
- **SEO Optimized** - Meta tags and semantic HTML

## 📁 Project Structure

```
Payton-Place/
├── frontend/              # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── types/        # TypeScript types
│   │   └── hooks/        # Custom React hooks
│   ├── public/           # Static assets
│   └── package.json
│
├── backend/              # Express + TypeScript backend
│   ├── src/
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # API routes
│   │   ├── controllers/  # Route controllers
│   │   ├── config/       # Configuration files
│   │   ├── middleware/   # Express middleware
│   │   └── scripts/      # Utility scripts (seed data)
│   └── package.json
│
├── shared/               # Shared types/utilities
├── .github/workflows/    # CI/CD workflows
└── package.json          # Root workspace config
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

1. **Clone the repository**

```bash
git clone <your-repo-url>
cd Payton-Place
```

2. **Install dependencies**

```bash
npm install
```

This will install dependencies for all workspaces (root, frontend, backend).

3. **Configure environment variables**

**Backend** - Create `/backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/payton-place
CORS_ORIGIN=http://localhost:5173

# Optional - for image uploads
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional - for email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@paytonplace.com
```

**Frontend** - Create `/frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

4. **Seed the database**

```bash
npm run backend
# In another terminal:
cd backend
npm run seed
```

5. **Start the development servers**

```bash
npm run dev
```

This will start both frontend (http://localhost:5173) and backend (http://localhost:5000) concurrently.

## 🗄️ Database

The application uses MongoDB with Mongoose ODM. The database includes:

- **Projects** - Renovation project portfolio
- **Services** - Residential and commercial services
- **Team Members** - Company team information
- **Contact Inquiries** - Contact form submissions
- **Quote Requests** - Quote request submissions

### Seeding Data

The project includes a seed script with realistic placeholder data:

```bash
cd backend
npm run seed
```

This will populate the database with:
- 12+ renovation projects (residential and commercial)
- 6 services (kitchen remodeling, bathroom renovations, etc.)
- 5 team members

## 🎨 Pages

1. **Home** - Hero section, featured projects, services overview, stats, CTA
2. **Projects** - Portfolio grid with category filters
3. **Services** - Residential and commercial services showcase
4. **About Us** - Company history, team, mission, core values
5. **Contact** - Contact form with validation and contact information
6. **Get a Quote** - Detailed quote request form

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **React Router v6** - Routing
- **React Hook Form** - Form handling
- **Zod** - Schema validation
- **Axios** - HTTP client
- **Lucide React** - Icons

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variables

## 📡 API Endpoints

### Projects
- `GET /api/projects` - Get all projects (supports ?category= and ?featured= filters)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project

### Services
- `GET /api/services` - Get all services (supports ?category= filter)
- `GET /api/services/:id` - Get single service

### Team
- `GET /api/team` - Get all team members
- `GET /api/team/:id` - Get single team member

### Contact & Quotes
- `POST /api/contact` - Submit contact inquiry
- `GET /api/contact` - Get all contact inquiries
- `POST /api/quote` - Submit quote request
- `GET /api/quote` - Get all quote requests

### Health Check
- `GET /api/health` - API health status

## 🚢 Deployment

### Frontend (Vercel)

1. **Create a Vercel account** and install Vercel CLI
2. **Configure environment variables** in Vercel dashboard:
   - `VITE_API_URL` - Your backend API URL

3. **Deploy**:

```bash
cd frontend
vercel --prod
```

Or use the GitHub Actions workflow (automatically deploys on push to main).

### Backend (Render/Railway)

1. **Create a Render/Railway account**
2. **Create a new Web Service**
3. **Configure environment variables** in the dashboard (see `.env.example`)
4. **Set build command**: `cd backend && npm install && npm run build`
5. **Set start command**: `cd backend && npm start`

Or use the GitHub Actions workflow with deploy hook URL.

### GitHub Actions Setup

Add these secrets to your GitHub repository:

**For Frontend (Vercel)**:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VITE_API_URL`

**For Backend (Render)**:
- `RENDER_DEPLOY_HOOK_URL`

## 🎯 Customization

This application is designed to be easily customized for other clients:

### Branding
1. Update company name in `Header.tsx` and `Footer.tsx`
2. Replace logo/favicon in `/frontend/public`
3. Update color scheme in `tailwind.config.js`
4. Modify content in seed script (`/backend/src/scripts/seed.ts`)

### Content
1. Update team members data in seed script
2. Modify services offered
3. Change project portfolio
4. Update contact information

### Styling
1. Edit TailwindCSS theme in `tailwind.config.js`
2. Modify component styles as needed
3. Update animation configurations

## 📝 Scripts

### Root
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build all workspaces

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Backend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Compile TypeScript
- `npm start` - Start production server
- `npm run seed` - Seed database with sample data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Images from [Unsplash](https://unsplash.com)
- Icons from [Lucide](https://lucide.dev)
- Design mockups provided by client

## 📧 Support

For support, email support@paytonplace.com or create an issue in the repository.

---

**Built with ❤️ by the Payton Place Development Team**
