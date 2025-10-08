import { Router } from 'express';
import { createQuoteRequest, getAllQuoteRequests } from '../controllers/quoteController';

const router = Router();

router.post('/', createQuoteRequest);
router.get('/', getAllQuoteRequests);

export default router;
