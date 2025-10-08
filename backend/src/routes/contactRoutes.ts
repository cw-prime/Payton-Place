import { Router } from 'express';
import { createContactInquiry, getAllInquiries } from '../controllers/contactController';

const router = Router();

router.post('/', createContactInquiry);
router.get('/', getAllInquiries);

export default router;
