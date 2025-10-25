import mongoose, { Document, Schema } from 'mongoose';

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface IReview extends Document {
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  body: string;
  serviceId?: mongoose.Types.ObjectId;
  status: ReviewStatus;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    customerEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 160,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 120,
    },
    body: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 1000,
    },
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: 'Service',
      required: false,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ status: 1, createdAt: -1 });
ReviewSchema.index({ featured: 1, createdAt: -1 });
ReviewSchema.index({ serviceId: 1, status: 1 });

export default mongoose.model<IReview>('Review', ReviewSchema);
