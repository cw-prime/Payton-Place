import mongoose, { Document, Schema } from 'mongoose';

export interface IContactInquiry extends Document {
  name: string;
  email: string;
  message: string;
  projectType?: string;
  status: 'new' | 'read' | 'responded' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
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
    message: {
      type: String,
      required: true,
    },
    projectType: String,
    status: {
      type: String,
      enum: ['new', 'read', 'responded', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IContactInquiry>('ContactInquiry', ContactInquirySchema);
