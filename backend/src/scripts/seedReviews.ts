import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import Review from '../models/Review';
import Service from '../models/Service';

dotenv.config();

const reviewSeeds = [
  {
    customerName: 'Olivia Martin',
    customerEmail: 'olivia.martin@example.com',
    rating: 5,
    title: 'Kitchen remodel perfection',
    body: 'Payton Place guided us through every decision and the finished kitchen is stunning. The crew was respectful of our home and finished right on schedule.',
    serviceName: 'Kitchen Remodeling',
    status: 'approved' as const,
    featured: true,
  },
  {
    customerName: 'Marcus Lee',
    customerEmail: 'marcus.lee@example.com',
    rating: 4,
    title: 'Office overhaul done right',
    body: 'We hired the team for an office redesign and productivity has noticeably improved. Communication was great throughout and any issues were solved quickly.',
    serviceName: 'Office Redesigns',
    status: 'approved' as const,
    featured: false,
  },
  {
    customerName: 'Danielle Ruiz',
    customerEmail: 'danielle.ruiz@example.com',
    rating: 5,
    title: 'Bathroom feels like a spa',
    body: 'From the tile work to the fixtures, every detail in our new bathroom feels luxurious. We appreciated the design suggestions—they made a huge impact.',
    serviceName: 'Bathroom Renovations',
    status: 'approved' as const,
    featured: true,
  },
  {
    customerName: 'Jared Collins',
    customerEmail: 'jared.collins@example.com',
    rating: 5,
    title: 'Seamless commercial addition',
    body: 'Our warehouse expansion went off without a hitch. The crew worked around our operations and delivered more than we expected.',
    serviceName: 'Commercial Additions',
    status: 'approved' as const,
    featured: false,
  },
  {
    customerName: 'Rachel Thompson',
    customerEmail: 'rachel.thompson@example.com',
    rating: 5,
    title: 'Exceeded all expectations',
    body: 'Our whole-home renovation transformed our dated property into a modern masterpiece. The attention to detail and professionalism was outstanding.',
    serviceName: 'Whole-Home Renovations',
    status: 'approved' as const,
    featured: true,
  },
  {
    customerName: 'David Chen',
    customerEmail: 'david.chen@example.com',
    rating: 4,
    title: 'Great retail space transformation',
    body: 'The renovation of our retail space brought in more foot traffic immediately. Minor delays but the final result was worth it.',
    serviceName: 'Retail Space Renovations',
    status: 'approved' as const,
    featured: false,
  },
];

const seedReviews = async () => {
  try {
    console.log('🌱 Starting review seed...');

    // Connect to database
    await connectDB();

    // Fetch all services to map service names to IDs
    console.log('📋 Fetching services...');
    const services = await Service.find({});
    const serviceMap = new Map(services.map(service => [service.name, service._id]));

    console.log(`✅ Found ${services.length} services`);

    // Check for existing reviews to avoid duplicates
    const existingReviews = await Review.find({
      customerEmail: { $in: reviewSeeds.map(r => r.customerEmail) }
    });

    if (existingReviews.length > 0) {
      console.log(`⚠️  Found ${existingReviews.length} existing reviews with matching emails`);
      console.log('   Customer emails:', existingReviews.map(r => r.customerEmail).join(', '));
      console.log('   ');
      console.log('   Options:');
      console.log('   1. Delete existing reviews first: Review.deleteMany({ customerEmail: { $in: [...] } })');
      console.log('   2. Modify the seed data to use different emails');
      console.log('   ');
      console.log('   Aborting to prevent duplicates.');
      process.exit(0);
    }

    // Prepare reviews for insertion
    const reviewsToInsert = reviewSeeds.map((review) => {
      const serviceId = serviceMap.get(review.serviceName);

      if (!serviceId) {
        console.warn(`⚠️  Service "${review.serviceName}" not found, review will not be linked to a service`);
      }

      return {
        customerName: review.customerName,
        customerEmail: review.customerEmail,
        rating: review.rating,
        title: review.title,
        body: review.body,
        serviceId: serviceId || undefined,
        status: review.status,
        featured: review.featured,
      };
    });

    // Insert reviews
    console.log('📝 Inserting reviews...');
    const insertedReviews = await Review.insertMany(reviewsToInsert);
    console.log(`✅ ${insertedReviews.length} reviews created`);

    // Display summary
    console.log('');
    console.log('🎉 Review seeding complete!');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   Total reviews: ${insertedReviews.length}`);
    console.log(`   Featured: ${insertedReviews.filter(r => r.featured).length}`);
    console.log(`   Approved: ${insertedReviews.filter(r => r.status === 'approved').length}`);
    console.log(`   Average rating: ${(insertedReviews.reduce((sum, r) => sum + r.rating, 0) / insertedReviews.length).toFixed(1)}`);
    console.log('');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding reviews:', error);
    process.exit(1);
  }
};

seedReviews();
