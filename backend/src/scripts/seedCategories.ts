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

    // Check if categories already exist
    const existingCount = await Category.countDocuments();

    if (existingCount > 0) {
      console.log(`✅ Categories already exist (${existingCount} found). Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    // Insert new categories only if none exist
    await Category.insertMany(categories);
    console.log(`✅ Seeded ${categories.length} categories successfully`);

    // Disconnect
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
