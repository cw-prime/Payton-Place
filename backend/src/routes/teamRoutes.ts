import { Router } from 'express';
import { getAllTeamMembers, getTeamMemberById, createTeamMember, updateTeamMember, deleteTeamMember } from '../controllers/teamController';
import { authenticateAdmin } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllTeamMembers);
router.get('/:id', getTeamMemberById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, upload.single('image'), createTeamMember);
router.put('/:id', authenticateAdmin, upload.single('image'), updateTeamMember);
router.delete('/:id', authenticateAdmin, deleteTeamMember);

export default router;
