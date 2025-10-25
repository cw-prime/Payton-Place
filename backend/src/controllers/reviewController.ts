import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Review, { ReviewStatus } from '../models/Review';
import Service from '../models/Service';
import { verifyTurnstileToken } from '../services/emailService';

const isValidObjectId = (id: string) => mongoose.Types.ObjectId.isValid(id);

const sanitizeText = (value: unknown, options?: { min?: number; max?: number }) => {
  if (typeof value !== 'string') return '';
  const trimmed = value.trim();
  const min = options?.min ?? 0;
  const max = options?.max ?? Number.MAX_SAFE_INTEGER;
  if (trimmed.length < min || trimmed.length > max) return '';
  return trimmed;
};

export const createReview = async (req: Request, res: Response) => {
  try {
    const { customerName, customerEmail, rating, title, body, serviceId, turnstileToken } = req.body;

    const name = sanitizeText(customerName, { min: 2, max: 100 });
    const email = sanitizeText(customerEmail, { min: 5, max: 160 });
    const reviewTitle = sanitizeText(title, { min: 3, max: 120 });
    const reviewBody = sanitizeText(body, { min: 10, max: 1000 });
    const numericRating = Number(rating);

    if (!name || !email || !reviewTitle || !reviewBody || Number.isNaN(numericRating)) {
      return res.status(400).json({ message: 'Invalid review submission. Please check your entries.' });
    }

    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5 stars.' });
    }

    const requiresTurnstile = Boolean(process.env.TURNSTILE_SECRET_KEY);

    if (requiresTurnstile) {
      const sanitizedToken = typeof turnstileToken === 'string' ? turnstileToken : '';
      const isValidToken = await verifyTurnstileToken(sanitizedToken);
      if (!isValidToken) {
        return res.status(400).json({ message: 'Bot verification failed. Please try again.' });
      }
    }

    let resolvedServiceId: mongoose.Types.ObjectId | undefined;
    if (serviceId) {
      if (typeof serviceId !== 'string' || !isValidObjectId(serviceId)) {
        return res.status(400).json({ message: 'Selected service is invalid.' });
      }
      const serviceExists = await Service.exists({ _id: serviceId });
      if (!serviceExists) {
        return res.status(400).json({ message: 'Selected service could not be found.' });
      }
      resolvedServiceId = new mongoose.Types.ObjectId(serviceId);
    }

    const review = await Review.create({
      customerName: name,
      customerEmail: email,
      rating: numericRating,
      title: reviewTitle,
      body: reviewBody,
      serviceId: resolvedServiceId,
      status: 'pending',
      featured: false,
    });

    res.status(201).json({
      message: 'Thank you! Your review has been submitted and is awaiting approval.',
      reviewId: review._id,
    });
  } catch (error) {
    console.error('❌ Error creating review:', error);
    res.status(500).json({ message: 'Failed to submit review', error });
  }
};

export const getPublicReviews = async (req: Request, res: Response) => {
  try {
    const { page = '1', limit = '10', serviceId, featured } = req.query;
    const numericPage = Math.max(parseInt(page as string, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit as string, 10) || 10, 1), 50);

    const filter: Record<string, any> = { status: 'approved' };

    if (typeof serviceId === 'string' && isValidObjectId(serviceId)) {
      filter.serviceId = serviceId;
    }

    if (featured === 'true') {
      filter.featured = true;
    }

    const [reviews, total, summary] = await Promise.all([
      Review.find(filter)
        .sort({ featured: -1, createdAt: -1 })
        .skip((numericPage - 1) * numericLimit)
        .limit(numericLimit)
        .populate('serviceId', 'name'),
      Review.countDocuments(filter),
      Review.aggregate([
        { $match: filter },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
          },
        },
      ]),
    ]);

    res.json({
      data: reviews,
      pagination: {
        total,
        page: numericPage,
        pages: Math.ceil(total / numericLimit),
        limit: numericLimit,
      },
      summary: {
        averageRating: summary.length > 0 ? summary[0].averageRating : null,
        totalReviews: total,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching public reviews:', error);
    res.status(500).json({ message: 'Failed to load reviews', error });
  }
};

export const getAdminReviews = async (req: Request, res: Response) => {
  try {
    const {
      page = '1',
      limit = '20',
      status,
      serviceId,
      minRating,
      search,
      sort = 'newest',
    } = req.query;

    const numericPage = Math.max(parseInt(page as string, 10) || 1, 1);
    const numericLimit = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
    const ratingFilter = Number(minRating);

    const filter: Record<string, any> = {};

    if (status && typeof status === 'string' && ['pending', 'approved', 'rejected'].includes(status)) {
      filter.status = status;
    }

    if (serviceId && typeof serviceId === 'string' && isValidObjectId(serviceId)) {
      filter.serviceId = serviceId;
    }

    if (!Number.isNaN(ratingFilter)) {
      filter.rating = { $gte: ratingFilter };
    }

    if (search && typeof search === 'string') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { customerName: regex },
        { customerEmail: regex },
        { title: regex },
        { body: regex },
      ];
    }

    const sortOptions: Record<string, any> = {
      newest: { createdAt: -1 },
      oldest: { createdAt: 1 },
      highest: { rating: -1 },
      lowest: { rating: 1 },
    };

    const reviews = await Review.find(filter)
      .sort(sortOptions[sort as string] || sortOptions.newest)
      .skip((numericPage - 1) * numericLimit)
      .limit(numericLimit)
      .populate('serviceId', 'name');

    const total = await Review.countDocuments(filter);

    res.json({
      data: reviews,
      pagination: {
        total,
        page: numericPage,
        pages: Math.ceil(total / numericLimit),
        limit: numericLimit,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching admin reviews:', error);
    res.status(500).json({ message: 'Failed to load reviews for moderation', error });
  }
};

export const updateReviewStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid review status' });
    }

    const review = await Review.findByIdAndUpdate(
      id,
      { status: status as ReviewStatus },
      { new: true }
    ).populate('serviceId', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review status updated',
      data: review,
    });
  } catch (error) {
    console.error('❌ Error updating review status:', error);
    res.status(500).json({ message: 'Failed to update review status', error });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      customerName,
      customerEmail,
      rating,
      title,
      body,
      serviceId,
      featured,
      status,
    } = req.body;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const updates: Record<string, any> = {};

    if (customerName !== undefined) {
      const value = sanitizeText(customerName, { min: 2, max: 100 });
      if (!value) return res.status(400).json({ message: 'Customer name is invalid.' });
      updates.customerName = value;
    }

    if (customerEmail !== undefined) {
      const value = sanitizeText(customerEmail, { min: 5, max: 160 });
      if (!value) return res.status(400).json({ message: 'Customer email is invalid.' });
      updates.customerEmail = value;
    }

    if (rating !== undefined) {
      const numericRating = Number(rating);
      if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
        return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
      }
      updates.rating = numericRating;
    }

    if (title !== undefined) {
      const value = sanitizeText(title, { min: 3, max: 120 });
      if (!value) return res.status(400).json({ message: 'Title is invalid.' });
      updates.title = value;
    }

    if (body !== undefined) {
      const value = sanitizeText(body, { min: 10, max: 1000 });
      if (!value) return res.status(400).json({ message: 'Review body is invalid.' });
      updates.body = value;
    }

    if (serviceId !== undefined) {
      if (serviceId === null || serviceId === '') {
        updates.serviceId = undefined;
      } else if (typeof serviceId === 'string' && isValidObjectId(serviceId)) {
        const serviceExists = await Service.exists({ _id: serviceId });
        if (!serviceExists) return res.status(400).json({ message: 'Selected service not found.' });
        updates.serviceId = serviceId;
      } else {
        return res.status(400).json({ message: 'Service id is invalid.' });
      }
    }

    if (featured !== undefined) {
      updates.featured = Boolean(featured);
    }

    if (status !== undefined) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
      }
      updates.status = status;
    }

    const review = await Review.findByIdAndUpdate(id, updates, { new: true })
      .populate('serviceId', 'name');

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({
      message: 'Review updated successfully',
      data: review,
    });
  } catch (error) {
    console.error('❌ Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review', error });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid review id' });
    }

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review', error });
  }
};

export const getReviewAnalytics = async (req: Request, res: Response) => {
  try {
    const [totals, approvedMetrics, perService] = await Promise.all([
      Review.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]),
      Review.aggregate([
        { $match: { status: 'approved' } },
        {
          $group: {
            _id: null,
            averageRating: { $avg: '$rating' },
            totalApproved: { $sum: 1 },
          },
        },
      ]),
      Review.aggregate([
        { $match: { status: 'approved', serviceId: { $ne: null } } },
        {
          $group: {
            _id: '$serviceId',
            averageRating: { $avg: '$rating' },
            totalReviews: { $sum: 1 },
          },
        },
      ]),
    ]);

    const statusCounts: Record<ReviewStatus, number> = {
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    totals.forEach((entry) => {
      if (entry._id && statusCounts.hasOwnProperty(entry._id)) {
        statusCounts[entry._id as ReviewStatus] = entry.count;
      }
    });

    const averageRating = approvedMetrics.length > 0 ? approvedMetrics[0].averageRating : null;
    const totalApproved = approvedMetrics.length > 0 ? approvedMetrics[0].totalApproved : 0;

    const serviceIds = perService.map((entry) => entry._id);
    const services = await Service.find({ _id: { $in: serviceIds } }, { name: 1 }).lean();
    const serviceNameMap = new Map(
      services.map((service: any) => [service._id.toString(), service.name as string])
    );

    const serviceBreakdown = perService.map((entry) => ({
      serviceId: entry._id,
      serviceName: serviceNameMap.get(entry._id.toString()) || 'Unknown Service',
      averageRating: entry.averageRating,
      totalReviews: entry.totalReviews,
    }));

    const latestReview = await Review.findOne().sort({ createdAt: -1 }).select('createdAt status');

    res.json({
      counts: statusCounts,
      totals: {
        all: statusCounts.pending + statusCounts.approved + statusCounts.rejected,
        approved: totalApproved,
      },
      averageRating,
      serviceBreakdown,
      latestActivity: latestReview?.createdAt || null,
    });
  } catch (error) {
    console.error('❌ Error fetching review analytics:', error);
    res.status(500).json({ message: 'Failed to load review analytics', error });
  }
};
