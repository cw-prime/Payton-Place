import { Router } from 'express';
import {
  createReview,
  deleteReview,
  getAdminReviews,
  getPublicReviews,
  getReviewAnalytics,
  updateReview,
  updateReviewStatus,
} from '../controllers/reviewController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

router.post('/', createReview);
router.get('/', getPublicReviews);
router.get('/analytics', authenticateAdmin, getReviewAnalytics);

router.use(authenticateAdmin);
router.get('/admin', getAdminReviews);
router.patch('/:id/status', updateReviewStatus);
router.patch('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
