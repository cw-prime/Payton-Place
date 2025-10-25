import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest';
import { sendQuoteRequestNotification, verifyTurnstileToken } from '../services/emailService';

export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, projectType, description, budgetRange, timeline, turnstileToken } = req.body;

    // Validation
    if (!name || !email || !phone || !projectType || !description || !budgetRange || !timeline) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify Turnstile token
    const isValidToken = await verifyTurnstileToken(turnstileToken);
    if (!isValidToken) {
      return res.status(400).json({ message: 'Bot verification failed. Please try again.' });
    }

    const quoteRequest = new QuoteRequest({
      name,
      email,
      phone,
      projectType,
      description,
      budgetRange,
      timeline,
    });

    await quoteRequest.save();

    // Send email notification
    try {
      await sendQuoteRequestNotification(quoteRequest);
    } catch (emailError) {
      // Log email error but don't fail the request
      console.error('⚠️ Email notification failed, but request was saved:', emailError);
    }

    res.status(201).json({
      message: 'Quote request submitted successfully',
      quoteRequest,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quote request', error });
  }
};

export const getAllQuoteRequests = async (req: Request, res: Response) => {
  try {
    const quoteRequests = await QuoteRequest.find().sort({ createdAt: -1 });
    res.json(quoteRequests);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching quote requests', error });
  }
};
