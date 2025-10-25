import mongoose, { Document, Schema } from 'mongoose';

export interface IServiceRequest extends Document {
  name: string;
  email: string;
  phone: string;
  serviceId: mongoose.Types.ObjectId;
  message: string;
  preferredContactMethod: 'email' | 'phone' | 'either';
  status: 'new' | 'contacted' | 'in-progress' | 'completed' | 'declined';
  createdAt: Date;
  updatedAt: Date;
}

const ServiceRequestSchema = new Schema<IServiceRequest>(
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
      trim: true,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ['email', 'phone', 'either'],
      default: 'either',
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'in-progress', 'completed', 'declined'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IServiceRequest>('ServiceRequest', ServiceRequestSchema);
