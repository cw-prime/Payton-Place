// Shared TypeScript types used across frontend and backend

export interface Project {
  _id?: string;
  title: string;
  description: string;
  category: 'residential' | 'commercial';
  type: string;
  images: string[];
  featured: boolean;
  details?: {
    location?: string;
    completionDate?: Date | string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface Service {
  _id?: string;
  name: string;
  description: string;
  category: 'residential' | 'commercial';
  icon: string;
  image?: string;
  features?: string[];
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface TeamMember {
  _id?: string;
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
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ContactInquiry {
  _id?: string;
  name: string;
  email: string;
  message: string;
  projectType?: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface QuoteRequest {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  projectType: 'residential' | 'commercial' | 'both';
  description: string;
  budgetRange: string;
  timeline: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'declined';
  createdAt?: Date | string;
  updatedAt?: Date | string;
}
