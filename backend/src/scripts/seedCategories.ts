import mongoose from 'mongoose';
import Category from '../models/Category';
import { MONGODB_URI } from '../config/env';

const categories = [
  {
    name: 'Residential',
    slug: 'residential',
    description: 'Residential construction and renovation projects',
    type: 'project',
    active: true,
  },
  {
    name: 'Commercial',
    slug: 'commercial',
    description: 'Commercial construction and renovation projects',
    type: 'project',
    active: true,
  },
];

const seedCategories = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('🗑️  Cleared existing categories');

    // Insert new categories
    await Category.insertMany(categories);
    console.log('✅ Seeded categories successfully');

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
