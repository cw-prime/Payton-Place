import { Request, Response } from 'express';
import SiteSettings from '../models/SiteSettings';

export const getSettings = async (req: Request, res: Response) => {
  try {
    // Get the first (and should be only) settings document
    let settings = await SiteSettings.findOne();

    // If no settings exist, create default settings
    if (!settings) {
      settings = new SiteSettings();
      await settings.save();
    }

    res.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ message: 'Error fetching site settings', error });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const { heroMediaType, heroImageUrl, heroVideoUrl, heroHeadline, heroSubheadline } = req.body;

    // Get the first settings document or create if it doesn't exist
    let settings = await SiteSettings.findOne();

    if (!settings) {
      settings = new SiteSettings();
    }

    // Update fields if provided
    if (heroMediaType) settings.heroMediaType = heroMediaType;
    if (heroHeadline !== undefined) settings.heroHeadline = heroHeadline;
    if (heroSubheadline !== undefined) settings.heroSubheadline = heroSubheadline;

    // Handle file uploads (req.files is an object when using .fields())
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // Handle image upload if a file was provided
    if (files && files.heroImage && files.heroImage[0]) {
      const imageFile = files.heroImage[0];
      settings.heroImageUrl = `/uploads/${imageFile.filename}`;
      settings.heroMediaType = 'image';
      console.log('📸 New hero image uploaded:', settings.heroImageUrl);
    } else if (heroImageUrl !== undefined) {
      // Allow setting external URL
      settings.heroImageUrl = heroImageUrl;
    }

    // Handle video upload if a file was provided
    if (files && files.heroVideo && files.heroVideo[0]) {
      const videoFile = files.heroVideo[0];
      settings.heroVideoUrl = `/uploads/${videoFile.filename}`;
      settings.heroMediaType = 'video';
      console.log('🎥 New hero video uploaded:', settings.heroVideoUrl);
    } else if (heroVideoUrl !== undefined) {
      // Allow setting external URL or clearing it
      settings.heroVideoUrl = heroVideoUrl;
    }

    await settings.save();

    console.log('✅ Site settings updated:', settings);
    res.json(settings);
  } catch (error) {
    console.error('❌ Error updating settings:', error);
    res.status(400).json({ message: 'Error updating site settings', error });
  }
};
