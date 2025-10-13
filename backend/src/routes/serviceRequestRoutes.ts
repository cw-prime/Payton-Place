import { Router } from 'express';
import {
  getAllServiceRequests,
  getServiceRequestById,
  createServiceRequest,
  updateServiceRequestStatus,
  deleteServiceRequest
} from '../controllers/serviceRequestController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public route - anyone can submit a service request
router.post('/', createServiceRequest);

// Protected routes (admin only)
router.get('/', authenticateAdmin, getAllServiceRequests);
router.get('/:id', authenticateAdmin, getServiceRequestById);
router.patch('/:id/status', authenticateAdmin, updateServiceRequestStatus);
router.delete('/:id', authenticateAdmin, deleteServiceRequest);

export default router;
