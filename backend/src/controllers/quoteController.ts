import { Request, Response } from 'express';
import QuoteRequest from '../models/QuoteRequest';

export const createQuoteRequest = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, projectType, description, budgetRange, timeline } = req.body;

    // Validation
    if (!name || !email || !phone || !projectType || !description || !budgetRange || !timeline) {
      return res.status(400).json({ message: 'All fields are required' });
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

    // TODO: Send email notification

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
