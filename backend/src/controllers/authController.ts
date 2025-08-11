import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const authController = {
  // User registration
  async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, phone, password, referralCode } = req.body;

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { phone }
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: 'User with this phone number already exists'
        });
      }

      // Validate referral code
      if (referralCode) {
        const referrer = await prisma.user.findUnique({
          where: { referralCode }
        });

        if (!referrer) {
          return res.status(400).json({
            success: false,
            error: 'Invalid referral code'
          });
        }
      }

      // Hash password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Generate unique referral code
      const userReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();

      // Create user
      const user = await prisma.user.create({
        data: {
          firstName,
          lastName,
          phone,
          passwordHash,
          referralCode: userReferralCode,
          referredBy: referralCode || null
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          email: true,
          status: true,
          isInvestor: true,
          balanceAr: true,
          balanceUsdt: true,
          pointsBalance: true,
          totalInvested: true,
          totalEarned: true,
          totalWithdrawn: true,
          referralCode: true,
          referredBy: true,
          language: true,
          currency: true,
          profileImage: true,
          lastLoginAt: true,
          createdAt: true
        }
      });

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      logger.info(`New user registered: ${user.id}`);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user,
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        error: 'Registration failed'
      });
    }
  },

  // User login
  async login(req: Request, res: Response) {
    try {
      const { phone, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check if account is active
      if (user.status !== 'ACTIVE') {
        return res.status(403).json({
          success: false,
          error: 'Account is not active'
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() }
      });

      // Remove password from response
      const { passwordHash, ...userWithoutPassword } = user;

      logger.info(`User logged in: ${user.id}`);

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        error: 'Login failed'
      });
    }
  },

  // Admin login
  async adminLogin(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      // Find admin
      const admin = await prisma.admin.findUnique({
        where: { username }
      });

      if (!admin) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Check password
      const isValidPassword = await bcrypt.compare(password, admin.passwordHash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: 'Invalid credentials'
        });
      }

      // Generate tokens
      const accessToken = jwt.sign(
        { adminId: admin.id },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      const refreshToken = jwt.sign(
        { adminId: admin.id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
      );

      // Update last login
      await prisma.admin.update({
        where: { id: admin.id },
        data: { lastLoginAt: new Date() }
      });

      // Remove password from response
      const { passwordHash, ...adminWithoutPassword } = admin;

      logger.info(`Admin logged in: ${admin.id}`);

      res.json({
        success: true,
        message: 'Admin login successful',
        data: {
          admin: adminWithoutPassword,
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      logger.error('Admin login error:', error);
      res.status(500).json({
        success: false,
        error: 'Admin login failed'
      });
    }
  },

  // Refresh token
  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: 'Refresh token is required'
        });
      }

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;

      // Generate new access token
      const accessToken = jwt.sign(
        { userId: decoded.userId || decoded.adminId },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRES_IN || '15m' }
      );

      res.json({
        success: true,
        data: { accessToken }
      });
    } catch (error) {
      logger.error('Token refresh error:', error);
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
    }
  },

  // Logout
  async logout(req: AuthRequest, res: Response) {
    try {
      // In a real application, you might want to blacklist the token
      // For now, we'll just return a success response
      res.json({
        success: true,
        message: 'Logout successful'
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        error: 'Logout failed'
      });
    }
  },

  // Forgot password
  async forgotPassword(req: Request, res: Response) {
    try {
      const { phone } = req.body;

      const user = await prisma.user.findUnique({
        where: { phone }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Generate reset token
      const resetToken = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      // In a real application, you would send this token via SMS or email
      // For now, we'll just return it in the response
      res.json({
        success: true,
        message: 'Password reset instructions sent',
        data: { resetToken } // Remove this in production
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        error: 'Password reset failed'
      });
    }
  },

  // Reset password
  async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      // Verify reset token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Update user password
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { passwordHash }
      });

      res.json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
  }
};