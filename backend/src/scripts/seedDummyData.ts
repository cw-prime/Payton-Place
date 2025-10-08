import mongoose from 'mongoose';
import Service from '../models/Service';
import TeamMember from '../models/TeamMember';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

const dummyServices = [
  {
    name: 'Home Staging Consultation',
    description: 'Professional home staging services to help your property sell faster and for top dollar. Our experts will enhance your home\'s appeal to potential buyers.',
    category: 'residential',
    icon: 'Home',
    image: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=800',
    features: [
      'Complete room-by-room assessment',
      'Furniture arrangement recommendations',
      'Color and decor consultation',
      'Virtual staging options available'
    ]
  },
  {
    name: 'Investment Property Analysis',
    description: 'Comprehensive analysis of potential investment properties including ROI calculations, market trends, and risk assessment.',
    category: 'residential',
    icon: 'TrendingUp',
    image: 'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800',
    features: [
      'Cash flow projections',
      'Comparative market analysis',
      'Neighborhood growth potential',
      '10-year investment forecast'
    ]
  },
  {
    name: 'First-Time Buyer Program',
    description: 'Specialized guidance for first-time homebuyers navigating the complex world of real estate. We make buying your first home stress-free.',
    category: 'residential',
    icon: 'Award',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800',
    features: [
      'Credit score improvement tips',
      'Down payment assistance programs',
      'Mortgage pre-qualification help',
      'Step-by-step closing process guidance'
    ]
  },
  {
    name: 'Commercial Lease Negotiation',
    description: 'Expert negotiation services for commercial leases. We ensure you get the best terms and protect your business interests.',
    category: 'commercial',
    icon: 'FileText',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
    features: [
      'Lease term optimization',
      'Rent escalation clause review',
      'Tenant improvement negotiations',
      'Exit strategy planning'
    ]
  },
  {
    name: 'Retail Space Consulting',
    description: 'Find the perfect retail location for your business with our comprehensive site selection and analysis services.',
    category: 'commercial',
    icon: 'ShoppingBag',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
    features: [
      'Foot traffic analysis',
      'Demographic studies',
      'Competition mapping',
      'Visibility and accessibility assessment'
    ]
  },
  {
    name: 'Office Space Planning',
    description: 'Strategic planning for office space needs including layout design, expansion planning, and cost optimization.',
    category: 'commercial',
    icon: 'Building',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    features: [
      'Space utilization analysis',
      'Growth projection planning',
      'Cost per square foot optimization',
      'Hybrid work environment design'
    ]
  }
];

const dummyTeamMembers = [
  {
    name: 'Sarah Mitchell',
    role: 'Senior Real Estate Consultant',
    bio: 'With over 15 years of experience in residential real estate, Sarah has helped hundreds of families find their dream homes.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800',
    email: 'sarah.mitchell@example.com',
    phone: '(555) 123-4567',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/sarahmitchell',
      twitter: 'https://twitter.com/sarahmitchell'
    },
    order: 1
  },
  {
    name: 'Michael Chen',
    role: 'Commercial Property Specialist',
    bio: 'Michael specializes in commercial real estate transactions and has closed over $200M in deals across various industries.',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800',
    email: 'michael.chen@example.com',
    phone: '(555) 234-5678',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/michaelchen'
    },
    order: 2
  },
  {
    name: 'Emily Rodriguez',
    role: 'Investment Advisor',
    bio: 'Emily helps clients build wealth through strategic real estate investments. She has a proven track record of identifying high-ROI opportunities.',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800',
    email: 'emily.rodriguez@example.com',
    phone: '(555) 345-6789',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/emilyrodriguez',
      twitter: 'https://twitter.com/emilyrodriguez'
    },
    order: 3
  },
  {
    name: 'David Thompson',
    role: 'Market Analyst',
    bio: 'David provides in-depth market analysis and trend forecasting to help clients make informed real estate decisions.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
    email: 'david.thompson@example.com',
    phone: '(555) 456-7890',
    socialLinks: {
      linkedin: 'https://linkedin.com/in/davidthompson'
    },
    order: 4
  }
];

const seedData = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/payton-place';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Clear existing dummy data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing dummy data...');
    await Service.deleteMany({ name: { $in: dummyServices.map(s => s.name) } });
    await TeamMember.deleteMany({ name: { $in: dummyTeamMembers.map(t => t.name) } });

    // Insert dummy services
    console.log('📦 Inserting dummy services...');
    const services = await Service.insertMany(dummyServices);
    console.log(`✅ Created ${services.length} services`);

    // Insert dummy team members
    console.log('👥 Inserting dummy team members...');
    const teamMembers = await TeamMember.insertMany(dummyTeamMembers);
    console.log(`✅ Created ${teamMembers.length} team members`);

    console.log('\n🎉 Dummy data seeded successfully!');
    console.log('\n📋 Summary:');
    console.log(`   - Services: ${services.length} (${dummyServices.filter(s => s.category === 'residential').length} residential, ${dummyServices.filter(s => s.category === 'commercial').length} commercial)`);
    console.log(`   - Team Members: ${teamMembers.length}`);
    console.log('\n💡 You can delete this data later from the admin panel');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
