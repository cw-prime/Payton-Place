import { Router } from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService } from '../controllers/serviceController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllServices);
router.get('/:id', getServiceById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, upload.single('image'), createService);
router.put('/:id', authenticateAdmin, upload.single('image'), updateService);
router.delete('/:id', authenticateAdmin, deleteService);

export default router;
