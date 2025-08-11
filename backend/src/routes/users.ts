import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// Get user profile
router.get('/profile', userController.getProfile);

// Update user profile
router.put('/profile', userController.updateProfile);

// Change password
router.post('/change-password', userController.changePassword);

// Get user statistics
router.get('/stats', userController.getStats);

// Get user transactions
router.get('/transactions', userController.getTransactions);

// Get user investments
router.get('/investments', userController.getInvestments);

// Get user team
router.get('/team', userController.getTeam);

export default router;