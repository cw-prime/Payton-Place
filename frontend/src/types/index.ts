export interface Project {
  _id: string;
  title: string;
  description: string;
  category: 'residential' | 'commercial';
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
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  _id: string;
  name: string;
  description: string;
  category: 'residential' | 'commercial';
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
