import mongoose, { Document, Schema } from 'mongoose';

export interface IQuoteRequest extends Document {
  name: string;
  email: string;
  phone: string;
  projectType: 'residential' | 'commercial' | 'both';
  description: string;
  budgetRange: string;
  timeline: string;
  status: 'pending' | 'reviewed' | 'quoted' | 'accepted' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const QuoteRequestSchema = new Schema<IQuoteRequest>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    projectType: {
      type: String,
      enum: ['residential', 'commercial', 'both'],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    budgetRange: {
      type: String,
      required: true,
    },
    timeline: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'quoted', 'accepted', 'declined'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IQuoteRequest>('QuoteRequest', QuoteRequestSchema);
