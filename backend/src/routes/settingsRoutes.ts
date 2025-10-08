import { Router } from 'express';
import { getSettings, updateSettings } from '../controllers/settingsController';
import { authenticateAdmin } from '../middleware/auth';
import { uploadMedia } from '../middleware/upload';

const router = Router();

// Upload middleware that accepts BOTH image AND video files
const uploadFields = uploadMedia.fields([
  { name: 'heroImage', maxCount: 1 },
  { name: 'heroVideo', maxCount: 1 }
]);

// Public route - get settings
router.get('/', getSettings);

// Protected route - update settings (admin only)
// Accepts either heroImage OR heroVideo file upload
router.put('/', authenticateAdmin, uploadFields, updateSettings);

export default router;
