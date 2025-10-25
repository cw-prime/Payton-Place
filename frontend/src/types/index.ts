export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  type: 'project' | 'service';
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  type: string;
  images: string[];
  featured: boolean;
  details?: {
    location?: string;
    completionDate?: string;
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
  beforeAfterGallery?: Array<{
    beforeImage: string;
    afterImage: string;
    description?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  image?: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  _id: string;
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
  createdAt: string;
  updatedAt: string;
}

export interface ContactForm {
  name: string;
  email: string;
  message: string;
  projectType?: string;
}

export interface QuoteForm {
  name: string;
  email: string;
  phone: string;
  projectType: 'residential' | 'commercial' | 'both';
  description: string;
  budgetRange: string;
  timeline: string;
}

export interface ServiceRequestForm {
  name: string;
  email: string;
  phone: string;
  serviceId: string;
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'either';
}

export interface ServiceRequest extends ServiceRequestForm {
  _id: string;
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'declined';
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  _id: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  body: string;
  serviceId?: {
    _id: string;
    name: string;
  } | null;
  status: 'pending' | 'approved' | 'rejected';
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewsResponse {
  data: Review[];
  pagination: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  summary: {
    averageRating: number | null;
    totalReviews: number;
  };
}

export interface ReviewAnalytics {
  counts: {
    pending: number;
    approved: number;
    rejected: number;
  };
  totals: {
    all: number;
    approved: number;
  };
  averageRating: number | null;
  serviceBreakdown: Array<{
    serviceId: string;
    serviceName: string;
    averageRating: number;
    totalReviews: number;
  }>;
  latestActivity: string | null;
}
