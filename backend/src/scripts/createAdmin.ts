import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import Admin from '../models/Admin';

dotenv.config();

const createAdmin = async () => {
  try {
    console.log('🔧 Creating admin user...');

    await connectDB();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@paytonplace.com' });
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists!');
      console.log('Email: admin@paytonplace.com');
      process.exit(0);
    }

    // Create new admin
    const admin = new Admin({
      email: 'admin@paytonplace.com',
      password: 'admin123',  // Change this in production!
      name: 'Admin User',
      role: 'super-admin',
    });

    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('');
    console.log('Login credentials:');
    console.log('Email: admin@paytonplace.com');
    console.log('Password: admin123');
    console.log('');
    console.log('⚠️  IMPORTANT: Change the password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
