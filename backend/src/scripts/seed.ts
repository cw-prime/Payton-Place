import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { connectDB } from '../config/database';
import Project from '../models/Project';
import Service from '../models/Service';
import TeamMember from '../models/TeamMember';

dotenv.config();

// High-quality Unsplash image URLs for real estate/architecture
const projectsData = [
  {
    title: 'Residential Renovation: Modern Family Home',
    description: 'Complete renovation of a family home, featuring a modern kitchen, updated bathrooms, and a spacious living area. This project transformed a dated 1980s house into a contemporary living space perfect for modern family life.',
    category: 'residential',
    type: 'Full Home Renovation',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
    ],
    featured: true,
    details: {
      location: 'Suburban District',
      completionDate: new Date('2024-03-15'),
      duration: '4 months',
      budget: '$150,000 - $200,000',
      client: 'Private Homeowner',
    },
    testimonial: {
      text: 'The team exceeded our expectations. They transformed our home while keeping disruption to a minimum.',
      author: 'Sarah Johnson',
      role: 'Homeowner',
    },
    tags: ['renovation', 'modern', 'family home', 'kitchen', 'bathrooms'],
  },
  {
    title: 'Commercial Renovation: Boutique Retail Space',
    description: 'Transformation of a retail space into a stylish boutique, enhancing customer experience and brand identity. Custom fixtures, modern lighting, and an open floor plan create an inviting shopping environment.',
    category: 'commercial',
    type: 'Retail Space Transformation',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800',
      'https://images.unsplash.com/photo-1612686735502-e8293c4c8f70?w=800',
    ],
    featured: true,
    details: {
      location: 'Downtown Shopping District',
      completionDate: new Date('2024-01-20'),
      duration: '6 weeks',
      budget: '$75,000 - $100,000',
    },
    tags: ['commercial', 'retail', 'boutique', 'modern design'],
  },
  {
    title: 'Residential Renovation: Urban Loft Conversion',
    description: 'Conversion of an industrial loft into a chic urban living space, maximizing space and natural light. Exposed brick, high ceilings, and industrial elements blend with modern amenities.',
    category: 'residential',
    type: 'Loft Conversion',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
      'https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800',
    ],
    featured: true,
    details: {
      location: 'Urban Downtown',
      completionDate: new Date('2023-11-10'),
      duration: '3 months',
      budget: '$120,000 - $150,000',
    },
    testimonial: {
      text: 'They perfectly captured the industrial-chic aesthetic we wanted while making the space highly functional.',
      author: 'Michael Chen',
      role: 'Property Owner',
    },
    tags: ['loft', 'urban', 'industrial', 'modern'],
  },
  {
    title: 'Commercial Renovation: Restaurant Transformation',
    description: 'Redesign of a restaurant to create a welcoming atmosphere with improving layout and aesthetic appeal. Modern finishes, custom woodwork, and strategic lighting create an unforgettable dining experience.',
    category: 'commercial',
    type: 'Restaurant Redesign',
    images: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    ],
    featured: false,
    details: {
      location: 'Entertainment District',
      completionDate: new Date('2023-09-25'),
      duration: '8 weeks',
      budget: '$100,000 - $150,000',
    },
    tags: ['restaurant', 'commercial', 'hospitality', 'interior design'],
  },
  {
    title: 'Residential Renovation: Suburban Home Extension',
    description: 'Extension and renovation of a suburban home, adding a new wing and updating existing interiors. The project included a master suite addition, open-concept living area, and outdoor entertainment space.',
    category: 'residential',
    type: 'Home Extension',
    images: [
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
    ],
    featured: false,
    details: {
      location: 'Residential Suburb',
      completionDate: new Date('2024-02-28'),
      duration: '5 months',
      budget: '$175,000 - $225,000',
    },
    tags: ['extension', 'suburban', 'renovation', 'modern'],
  },
  {
    title: 'Commercial Renovation: Office Space Redesign',
    description: 'Redesign of an office space to foster collaboration and productivity, with modern amenities and a fresh look. Open workstations, quiet zones, and collaborative areas create a dynamic work environment.',
    category: 'commercial',
    type: 'Office Transformation',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800',
    ],
    featured: false,
    details: {
      location: 'Business Park',
      completionDate: new Date('2023-12-15'),
      duration: '10 weeks',
      budget: '$125,000 - $175,000',
    },
    tags: ['office', 'commercial', 'workplace', 'modern'],
  },
  {
    title: 'Residential Renovation: Kitchen Remodeling',
    description: 'Transform your kitchen into the heart of your home with our custom remodeling services. Custom cabinetry, high-end appliances, and beautiful finishes create a chef\'s dream kitchen.',
    category: 'residential',
    type: 'Kitchen Renovation',
    images: [
      'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800',
      'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    ],
    featured: false,
    details: {
      location: 'Residential Area',
      completionDate: new Date('2024-01-10'),
      duration: '6 weeks',
      budget: '$45,000 - $65,000',
    },
    tags: ['kitchen', 'remodeling', 'residential', 'custom'],
  },
  {
    title: 'Residential Renovation: Bathroom Spa Retreat',
    description: 'Upgrade your bathroom with our expert renovation services, creating a spa-like retreat. Luxurious fixtures, custom tile work, and thoughtful design transform daily routines into relaxation.',
    category: 'residential',
    type: 'Bathroom Renovation',
    images: [
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?w=800',
    ],
    featured: false,
    details: {
      location: 'Various Locations',
      completionDate: new Date('2023-10-20'),
      duration: '4 weeks',
      budget: '$25,000 - $40,000',
    },
    tags: ['bathroom', 'spa', 'luxury', 'renovation'],
  },
  {
    title: 'Commercial Renovation: Retail Store Modernization',
    description: 'Enhance your retail environment with our expert renovations, designed to attract customers and boost sales. Modern fixtures, strategic lighting, and optimized layout improve both aesthetics and functionality.',
    category: 'commercial',
    type: 'Retail Modernization',
    images: [
      'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800',
    ],
    featured: false,
    details: {
      location: 'Shopping Center',
      completionDate: new Date('2023-08-15'),
      duration: '5 weeks',
      budget: '$60,000 - $90,000',
    },
    tags: ['retail', 'commercial', 'modernization'],
  },
  {
    title: 'Residential Renovation: Historic Home Restoration',
    description: 'Revitalize your entire home with our comprehensive renovation services, tailored to your lifestyle. This historic property was carefully restored while incorporating modern systems and amenities.',
    category: 'residential',
    type: 'Historic Restoration',
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800',
    ],
    featured: false,
    details: {
      location: 'Historic District',
      completionDate: new Date('2023-07-30'),
      duration: '8 months',
      budget: '$250,000 - $350,000',
    },
    testimonial: {
      text: 'They preserved the character of our historic home while making it perfect for modern living.',
      author: 'Elizabeth Thompson',
      role: 'Homeowner',
    },
    tags: ['historic', 'restoration', 'preservation', 'renovation'],
  },
  {
    title: 'Commercial Addition: Warehouse Expansion',
    description: 'Expand your commercial property with our professional addition services, maximizing space and functionality. This warehouse expansion doubled storage capacity while improving operational efficiency.',
    category: 'commercial',
    type: 'Commercial Expansion',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800',
    ],
    featured: false,
    details: {
      location: 'Industrial Zone',
      completionDate: new Date('2023-06-10'),
      duration: '4 months',
      budget: '$200,000 - $300,000',
    },
    tags: ['commercial', 'expansion', 'warehouse', 'industrial'],
  },
  {
    title: 'Residential Renovation: Basement Finishing',
    description: 'Transform your basement into a functional living space with our expert finishing services. This project created a family entertainment area with home theater, game room, and wet bar.',
    category: 'residential',
    type: 'Basement Finishing',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800',
      'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800',
    ],
    featured: false,
    details: {
      location: 'Suburban Home',
      completionDate: new Date('2024-04-05'),
      duration: '10 weeks',
      budget: '$55,000 - $75,000',
    },
    tags: ['basement', 'finishing', 'entertainment', 'residential'],
  },
];

const servicesData = [
  {
    name: 'Kitchen Remodeling',
    description: 'Transform your kitchen into the heart of your home with our custom remodeling services.',
    category: 'residential',
    icon: 'Chef',
    features: [
      'Custom cabinetry design',
      'High-end appliance installation',
      'Counter and backsplash selection',
      'Layout optimization',
    ],
  },
  {
    name: 'Bathroom Renovations',
    description: 'Upgrade your bathroom with our expert renovation services, creating a spa-like retreat.',
    category: 'residential',
    icon: 'Bath',
    features: [
      'Luxury fixture installation',
      'Custom tile work',
      'Modern vanity design',
      'Lighting upgrades',
    ],
  },
  {
    name: 'Whole-Home Renovations',
    description: 'Revitalize your entire home with our comprehensive renovation services, tailored to your lifestyle.',
    category: 'residential',
    icon: 'Home',
    features: [
      'Complete home transformation',
      'Structural improvements',
      'Interior and exterior updates',
      'Energy efficiency upgrades',
    ],
  },
  {
    name: 'Office Redesigns',
    description: 'Create a productive and inspiring workspace with our innovative office redesign services.',
    category: 'commercial',
    icon: 'Briefcase',
    features: [
      'Space planning and layout',
      'Modern furniture selection',
      'Technology integration',
      'Collaborative work areas',
    ],
  },
  {
    name: 'Retail Space Renovations',
    description: 'Enhance your retail environment with our expert renovations, designed to attract customers.',
    category: 'commercial',
    icon: 'ShoppingBag',
    features: [
      'Customer flow optimization',
      'Display and fixture design',
      'Brand-aligned aesthetics',
      'Lighting design',
    ],
  },
  {
    name: 'Commercial Additions',
    description: 'Expand your commercial property with our professional addition services, maximizing space and functionality.',
    category: 'commercial',
    icon: 'Building2',
    features: [
      'Space expansion planning',
      'Structural engineering',
      'Code compliance',
      'Minimal business disruption',
    ],
  },
];

const teamData = [
  {
    name: 'Ethan Carter',
    role: 'CEO',
    bio: 'With over 20 years of experience in real estate development, Ethan leads our company with a vision for excellence and innovation. His expertise in project management and client relations ensures every project exceeds expectations.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    email: 'ethan.carter@paytonplace.com',
    order: 1,
  },
  {
    name: 'Sophia Bennett',
    role: 'Head of Design',
    bio: 'Sophia brings a creative eye and meticulous attention to detail to every project. Her background in architecture and interior design ensures that form and function work in perfect harmony.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    email: 'sophia.bennett@paytonplace.com',
    order: 2,
  },
  {
    name: 'Liam Harper',
    role: 'Project Manager',
    bio: 'Liam oversees all project operations, ensuring timelines are met and quality standards are maintained. His organizational skills and commitment to excellence keep every project on track.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    email: 'liam.harper@paytonplace.com',
    order: 3,
  },
  {
    name: 'Isabella Rodriguez',
    role: 'Lead Architect',
    bio: 'Isabella specializes in sustainable design and innovative architectural solutions. Her technical expertise and creative vision bring unique character to every project.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    email: 'isabella.rodriguez@paytonplace.com',
    order: 4,
  },
  {
    name: 'Marcus Johnson',
    role: 'Construction Supervisor',
    bio: 'With hands-on experience in all aspects of construction, Marcus ensures quality craftsmanship and safety on every job site. His attention to detail guarantees superior results.',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
    email: 'marcus.johnson@paytonplace.com',
    order: 5,
  },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seed...');

    // Connect to database
    await connectDB();

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Project.deleteMany({});
    await Service.deleteMany({});
    await TeamMember.deleteMany({});

    // Insert new data
    console.log('📝 Inserting projects...');
    await Project.insertMany(projectsData);
    console.log(`✅ ${projectsData.length} projects created`);

    console.log('📝 Inserting services...');
    await Service.insertMany(servicesData);
    console.log(`✅ ${servicesData.length} services created`);

    console.log('📝 Inserting team members...');
    await TeamMember.insertMany(teamData);
    console.log(`✅ ${teamData.length} team members created`);

    console.log('🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
