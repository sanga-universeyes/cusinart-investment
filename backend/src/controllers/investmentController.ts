import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const investmentController = {
  // Get investment plans
  async getPlans(req: Request, res: Response) {
    try {
      const plans = await prisma.investmentPlan.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { minAmount: 'asc' }
      });

      res.json({
        success: true,
        data: { plans }
      });
    } catch (error) {
      logger.error('Get investment plans error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get investment plans'
      });
    }
  },

  // Create investment
  async createInvestment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { planId, amount } = req.body;

      // Get plan
      const plan = await prisma.investmentPlan.findUnique({
        where: { id: planId }
      });

      if (!plan || plan.status !== 'ACTIVE') {
        return res.status(400).json({
          success: false,
          error: 'Invalid investment plan'
        });
      }

      // Validate amount
      if (amount < plan.minAmount || amount > plan.maxAmount) {
        return res.status(400).json({
          success: false,
          error: `Amount must be between ${plan.minAmount} and ${plan.maxAmount}`
        });
      }

      // Check user balance
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.balanceAr < amount) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient balance'
        });
      }

      // Calculate dates
      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration);

      // Create investment
      const investment = await prisma.investment.create({
        data: {
          userId,
          planId,
          amount,
          dailyReturn: plan.dailyReturn,
          totalReturn: plan.totalReturn,
          duration: plan.duration,
          startDate,
          endDate,
          status: 'ACTIVE'
        },
        include: {
          plan: true
        }
      });

      // Update user balance and stats
      await prisma.user.update({
        where: { id: userId },
        data: {
          balanceAr: user.balanceAr - amount,
          totalInvested: user.totalInvested + amount,
          isInvestor: true
        }
      });

      res.status(201).json({
        success: true,
        message: 'Investment created successfully',
        data: { investment }
      });
    } catch (error) {
      logger.error('Create investment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create investment'
      });
    }
  },

  // Get user investments
  async getMyInvestments(req: AuthRequest, res: Response) {
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
      logger.error('Get my investments error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get investments'
      });
    }
  },

  // Get investment by ID
  async getInvestment(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const investment = await prisma.investment.findFirst({
        where: {
          id,
          userId
        },
        include: {
          plan: true
        }
      });

      if (!investment) {
        return res.status(404).json({
          success: false,
          error: 'Investment not found'
        });
      }

      res.json({
        success: true,
        data: { investment }
      });
    } catch (error) {
      logger.error('Get investment error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get investment'
      });
    }
  }
};