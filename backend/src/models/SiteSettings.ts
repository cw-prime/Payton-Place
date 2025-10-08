import mongoose, { Document, Schema } from 'mongoose';

export interface ISiteSettings extends Document {
  heroMediaType: 'image' | 'video';
  heroImageUrl: string;
  heroVideoUrl: string;
  heroHeadline: string;
  heroSubheadline: string;
  createdAt: Date;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettings>(
  {
    heroMediaType: {
      type: String,
      enum: ['image', 'video'],
      default: 'image',
      required: true,
    },
    heroImageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600',
      required: true,
    },
    heroVideoUrl: {
      type: String,
      default: '',
    },
    heroHeadline: {
      type: String,
      default: 'Transforming Spaces, Building Dreams',
      required: true,
    },
    heroSubheadline: {
      type: String,
      default: 'Premier real estate development company specializing in exceptional residential and commercial renovations',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSettings = mongoose.model<ISiteSettings>('SiteSettings', SiteSettingsSchema);

export default SiteSettings;
