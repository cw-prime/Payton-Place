# API Documentation

Base URL: `http://localhost:5000/api` (development) or `https://your-domain.com/api` (production)

## Table of Contents

- [Authentication](#authentication)
- [Projects](#projects)
- [Services](#services)
- [Team](#team)
- [Contact](#contact)
- [Quote Requests](#quote-requests)
- [Health Check](#health-check)

## Authentication

Currently, the API does not require authentication for public endpoints. Admin endpoints (creating/updating resources) would require authentication in a production environment.

## Projects

### Get All Projects

Retrieve a list of all projects with optional filtering.

**Endpoint:** `GET /api/projects`

**Query Parameters:**
- `category` (optional): Filter by category (`residential` or `commercial`)
- `featured` (optional): Filter featured projects (`true` or `false`)

**Example Request:**
```http
GET /api/projects?category=residential&featured=true
```

**Response:** `200 OK`
```json
[
  {
    "_id": "654abc123def456789012345",
    "title": "Residential Renovation: Modern Family Home",
    "description": "Complete renovation of a family home...",
    "category": "residential",
    "type": "Full Home Renovation",
    "images": [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800"
    ],
    "featured": true,
    "details": {
      "location": "Suburban District",
      "completionDate": "2024-03-15T00:00:00.000Z",
      "duration": "4 months",
      "budget": "$150,000 - $200,000",
      "client": "Private Homeowner"
    },
    "testimonial": {
      "text": "The team exceeded our expectations...",
      "author": "Sarah Johnson",
      "role": "Homeowner"
    },
    "tags": ["renovation", "modern", "family home"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Project by ID

Retrieve a single project by its ID.

**Endpoint:** `GET /api/projects/:id`

**Example Request:**
```http
GET /api/projects/654abc123def456789012345
```

**Response:** `200 OK`
```json
{
  "_id": "654abc123def456789012345",
  "title": "Residential Renovation: Modern Family Home",
  ...
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Project not found"
}
```

### Create Project

Create a new project.

**Endpoint:** `POST /api/projects`

**Request Body:**
```json
{
  "title": "New Project",
  "description": "Project description",
  "category": "residential",
  "type": "Kitchen Renovation",
  "images": ["https://example.com/image1.jpg"],
  "featured": false,
  "details": {
    "location": "City Name",
    "completionDate": "2024-06-01",
    "duration": "8 weeks",
    "budget": "$50,000 - $75,000"
  },
  "tags": ["kitchen", "modern"]
}
```

**Response:** `201 Created`
```json
{
  "_id": "654abc123def456789012346",
  "title": "New Project",
  ...
}
```

## Services

### Get All Services

Retrieve a list of all services with optional filtering.

**Endpoint:** `GET /api/services`

**Query Parameters:**
- `category` (optional): Filter by category (`residential` or `commercial`)

**Example Request:**
```http
GET /api/services?category=residential
```

**Response:** `200 OK`
```json
[
  {
    "_id": "654abc123def456789012347",
    "name": "Kitchen Remodeling",
    "description": "Transform your kitchen into the heart of your home...",
    "category": "residential",
    "icon": "Chef",
    "features": [
      "Custom cabinetry design",
      "High-end appliance installation",
      "Counter and backsplash selection"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Service by ID

Retrieve a single service by its ID.

**Endpoint:** `GET /api/services/:id`

**Example Request:**
```http
GET /api/services/654abc123def456789012347
```

**Response:** `200 OK`

## Team

### Get All Team Members

Retrieve a list of all team members.

**Endpoint:** `GET /api/team`

**Example Request:**
```http
GET /api/team
```

**Response:** `200 OK`
```json
[
  {
    "_id": "654abc123def456789012348",
    "name": "Ethan Carter",
    "role": "CEO",
    "bio": "With over 20 years of experience...",
    "image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "email": "ethan.carter@paytonplace.com",
    "order": 1,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Team Member by ID

Retrieve a single team member by their ID.

**Endpoint:** `GET /api/team/:id`

**Example Request:**
```http
GET /api/team/654abc123def456789012348
```

**Response:** `200 OK`

## Contact

### Submit Contact Inquiry

Submit a contact form inquiry.

**Endpoint:** `POST /api/contact`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "I'm interested in a kitchen renovation...",
  "projectType": "residential"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `message`: Required, minimum 10 characters
- `projectType`: Optional

**Response:** `201 Created`
```json
{
  "message": "Contact inquiry submitted successfully",
  "inquiry": {
    "_id": "654abc123def456789012349",
    "name": "John Doe",
    "email": "john@example.com",
    "message": "I'm interested in a kitchen renovation...",
    "projectType": "residential",
    "status": "new",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "message": "Name, email, and message are required"
}
```

### Get All Contact Inquiries

Retrieve all contact inquiries (admin endpoint).

**Endpoint:** `GET /api/contact`

**Response:** `200 OK`

## Quote Requests

### Submit Quote Request

Submit a quote request form.

**Endpoint:** `POST /api/quote`

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "projectType": "residential",
  "description": "I need a complete home renovation including kitchen and bathrooms...",
  "budgetRange": "100k-200k",
  "timeline": "3-6-months"
}
```

**Validation Rules:**
- `name`: Required, minimum 2 characters
- `email`: Required, valid email format
- `phone`: Required, minimum 10 characters
- `projectType`: Required, enum (`residential`, `commercial`, `both`)
- `description`: Required, minimum 20 characters
- `budgetRange`: Required
- `timeline`: Required

**Response:** `201 Created`
```json
{
  "message": "Quote request submitted successfully",
  "quoteRequest": {
    "_id": "654abc123def456789012350",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "+1234567890",
    "projectType": "residential",
    "description": "I need a complete home renovation...",
    "budgetRange": "100k-200k",
    "timeline": "3-6-months",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Response:** `400 Bad Request`
```json
{
  "message": "All fields are required"
}
```

### Get All Quote Requests

Retrieve all quote requests (admin endpoint).

**Endpoint:** `GET /api/quote`

**Response:** `200 OK`

## Health Check

### Check API Health

Check if the API is running and healthy.

**Endpoint:** `GET /api/health`

**Example Request:**
```http
GET /api/health
```

**Response:** `200 OK`
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600.5
}
```

## Error Responses

All endpoints may return the following error responses:

### 500 Internal Server Error
```json
{
  "message": "Something went wrong!",
  "error": "Detailed error message (only in development)"
}
```

### 404 Not Found
```json
{
  "message": "Route not found"
}
```

## Rate Limiting

Currently, there is no rate limiting implemented. For production, consider adding rate limiting middleware.

## CORS

The API accepts requests from the frontend origin specified in the `CORS_ORIGIN` environment variable. Default: `http://localhost:5173` (development).

## Data Models

### Project Schema
```typescript
{
  title: string;
  description: string;
  category: 'residential' | 'commercial';
  type: string;
  images: string[];
  featured: boolean;
  details?: {
    location?: string;
    completionDate?: Date;
    duration?: string;
    budget?: string;
    client?: string;
  };
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Service Schema
```typescript
{
  name: string;
  description: string;
  category: 'residential' | 'commercial';
  icon: string;
  image?: string;
  features?: string[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Team Member Schema
```typescript
{
  name: string;
  role: string;
  bio: string;
  image: string;
  email?: string;
  phone?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
  };
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

---

For more information, see the main README.md file.
