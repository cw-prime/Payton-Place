import { Router } from 'express';
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateAdmin } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllCategories);
router.get('/:id', getCategoryById);

// Protected routes (admin only)
router.post('/', authenticateAdmin, createCategory);
router.put('/:id', authenticateAdmin, updateCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

export default router;
