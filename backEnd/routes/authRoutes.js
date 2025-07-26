import express from 'express';
import { signup, login, getProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.get('/verify', protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: req.user
  });
});

export default router;
