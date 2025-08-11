import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation';
import { authController } from '../controllers/authController';

const router = Router();

// User registration
router.post('/register', [
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name must be between 2 and 50 characters'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name must be between 2 and 50 characters'),
  body('phone').matches(/^0[3-9][0-9]{8}$/).withMessage('Invalid phone number format'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('referralCode').isLength({ min: 6, max: 10 }).withMessage('Referral code must be between 6 and 10 characters'),
  validateRequest
], authController.register);

// User login
router.post('/login', [
  body('phone').matches(/^0[3-9][0-9]{8}$/).withMessage('Invalid phone number format'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
], authController.login);

// Admin login
router.post('/admin/login', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required'),
  validateRequest
], authController.adminLogin);

// Refresh token
router.post('/refresh', [
  body('refreshToken').notEmpty().withMessage('Refresh token is required'),
  validateRequest
], authController.refreshToken);

// Logout
router.post('/logout', authController.logout);

// Forgot password
router.post('/forgot-password', [
  body('phone').matches(/^0[3-9][0-9]{8}$/).withMessage('Invalid phone number format'),
  validateRequest
], authController.forgotPassword);

// Reset password
router.post('/reset-password', [
  body('token').notEmpty().withMessage('Reset token is required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  validateRequest
], authController.resetPassword);

export default router;