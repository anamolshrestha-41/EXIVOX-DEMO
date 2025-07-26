import express from 'express';
import { 
  getModerationSettings, 
  updateModerationSettings, 
  testModeration 
} from '../controllers/moderationController.js';

const router = express.Router();

// Get moderation settings
router.get('/settings', getModerationSettings);

// Update moderation settings
router.put('/settings', updateModerationSettings);

// Test moderation
router.post('/test', testModeration);

export default router;