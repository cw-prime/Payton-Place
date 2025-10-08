import axios from 'axios';
import type { Project, Service, TeamMember, ContactForm, QuoteForm } from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects
export const getProjects = async (category?: string, featured?: boolean): Promise<Project[]> => {
  const params: any = {};
  if (category) params.category = category;
  if (featured) params.featured = 'true';

  const response = await api.get('/projects', { params });
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await api.get(`/projects/${id}`);
  return response.data;
};

// Services
export const getServices = async (category?: string): Promise<Service[]> => {
  const params: any = {};
  if (category) params.category = category;

  const response = await api.get('/services', { params });
  return response.data;
};

// Team
export const getTeamMembers = async (): Promise<TeamMember[]> => {
  const response = await api.get('/team');
  return response.data;
};

// Contact
export const submitContactForm = async (data: ContactForm): Promise<any> => {
  const response = await api.post('/contact', data);
  return response.data;
};

// Quote
export const submitQuoteRequest = async (data: QuoteForm): Promise<any> => {
  const response = await api.post('/quote', data);
  return response.data;
};

export default api;
