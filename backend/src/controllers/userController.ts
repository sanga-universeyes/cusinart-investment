import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const userController = {
  // Get user profile
  async getProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;

      const user = await prisma.user.findUnique({
        where: { id: userId },
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

      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      logger.error('Get profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get profile'
      });
    }
  },

  // Update user profile
  async updateProfile(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { firstName, lastName, email, language, currency } = req.body;

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          email,
          language,
          currency
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

      res.json({
        success: true,
        message: 'Profile updated successfully',
        data: { user: updatedUser }
      });
    } catch (error) {
      logger.error('Update profile error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update profile'
      });
    }
  },

  // Change password
  async changePassword(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          error: 'User not found'
        });
      }

      // Verify current password
      const bcrypt = require('bcryptjs');
      const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(400).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }

      // Hash new password
      const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
      const passwordHash = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash }
      });

      res.json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to change password'
      });
    }
  },

  // Get user statistics
  async getStats(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;

      const stats = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          balanceAr: true,
          balanceUsdt: true,
          pointsBalance: true,
          totalInvested: true,
          totalEarned: true,
          totalWithdrawn: true,
          isInvestor: true
        }
      });

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      logger.error('Get stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get statistics'
      });
    }
  },

  // Get user transactions
  async getTransactions(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, type, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { userId };
      if (type) where.type = type;
      if (status) where.status = status;

      const transactions = await prisma.transaction.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.transaction.count({ where });

      res.json({
        success: true,
        data: {
          transactions,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            totalPages: Math.ceil(total / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      logger.error('Get transactions error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get transactions'
      });
    }
  },

  // Get user investments
  async getInvestments(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { userId };
      if (status) where.status = status;

      const investments = await prisma.investment.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          plan: true
        }
      });

      const total = await prisma.investment.count({ where });

      res.json({
        success: true,
        data: {
          investments,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            totalPages: Math.ceil(total / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      logger.error('Get investments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get investments'
      });
    }
  },

  // Get user team
  async getTeam(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;

      const team = await prisma.user.findMany({
        where: { referredBy: userId },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          phone: true,
          status: true,
          isInvestor: true,
          totalInvested: true,
          totalEarned: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

      res.json({
        success: true,
        data: { team }
      });
    } catch (error) {
      logger.error('Get team error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get team'
      });
    }
  }
};