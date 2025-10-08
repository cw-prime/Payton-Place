import { Router } from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject } from '../controllers/projectController';
import { authenticateAdmin } from '../middleware/auth';
import { uploadMultiple } from '../middleware/upload';

const router = Router();

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, uploadMultiple, createProject);
router.put('/:id', authenticateAdmin, uploadMultiple, updateProject);
router.delete('/:id', authenticateAdmin, deleteProject);

export default router;
