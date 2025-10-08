import mongoose, { Document, Schema } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: 'residential' | 'commercial';
  type: string;
  images: string[];
  featured: boolean;
  details: {
    location?: string;
    completionDate?: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ['residential', 'commercial'],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    images: [{
      type: String,
      required: true,
    }],
    featured: {
      type: Boolean,
      default: false,
    },
    details: {
      location: String,
      completionDate: Date,
      duration: String,
      budget: String,
      client: String,
    },
    testimonial: {
      text: String,
      author: String,
      role: String,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IProject>('Project', ProjectSchema);
