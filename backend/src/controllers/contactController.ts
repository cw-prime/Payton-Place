import { Request, Response } from 'express';
import ContactInquiry from '../models/ContactInquiry';
import { sendContactInquiryNotification, verifyTurnstileToken } from '../services/emailService';

export const createContactInquiry = async (req: Request, res: Response) => {
  try {
    const { name, email, message, projectType, turnstileToken } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return res.status(400).json({ message: 'Bot verification failed. Please try again.' });
    }

    const inquiry = new ContactInquiry({
      name,
      email,
      message,
      projectType,
    });

    await inquiry.save();

    // Send email notification
    try {
      await sendContactInquiryNotification(inquiry);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('⚠️ Email notification failed, but inquiry was saved:', emailError);
    }

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
