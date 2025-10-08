import { Request, Response } from 'express';
import ContactInquiry from '../models/ContactInquiry';

export const createContactInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, message, projectType } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const inquiry = new ContactInquiry({
      name,
      email,
      message,
      projectType,
    });

    await inquiry.save();

    // TODO: Send email notification

    res.status(201).json({
      message: 'Contact inquiry submitted successfully',
      inquiry,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting contact inquiry', error });
  }
};

export const getAllInquiries = async (req: Request, res: Response) => {
  try {
    const inquiries = await ContactInquiry.find().sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inquiries', error });
  }
};
