import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const transactionController = {
  // Create deposit
  async createDeposit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { amount, currency, method } = req.body;

      const transaction = await prisma.transaction.create({
        data: {
          userId,
          type: 'DEPOSIT',
          currency,
          amount,
          method,
          status: 'PENDING'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Deposit created successfully',
        data: { transaction }
      });
    } catch (error) {
      logger.error('Create deposit error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create deposit'
      });
    }
  },

  // Create withdrawal
  async createWithdrawal(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { amount, currency, method, accountDetails, withdrawalPassword } = req.body;

      // Verify withdrawal password
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || user.withdrawalPassword !== withdrawalPassword) {
        return res.status(400).json({
          success: false,
          error: 'Invalid withdrawal password'
        });
      }

      // Check balance
      const balanceField = currency === 'AR' ? 'balanceAr' : 'balanceUsdt';
      if (user[balanceField] < amount) {
        return res.status(400).json({
          success: false,
          error: 'Insufficient balance'
        });
      }

      const transaction = await prisma.transaction.create({
        data: {
          userId,
          type: 'WITHDRAWAL',
          currency,
          amount,
          method,
          status: 'PENDING'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Withdrawal created successfully',
        data: { transaction }
      });
    } catch (error) {
      logger.error('Create withdrawal error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create withdrawal'
      });
    }
  },

  // Get transaction history
  async getHistory(req: AuthRequest, res: Response) {
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
      logger.error('Get transaction history error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get transaction history'
      });
    }
  },

  // Get transaction by ID
  async getTransaction(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const transaction = await prisma.transaction.findFirst({
        where: {
          id,
          userId
        }
      });

      if (!transaction) {
        return res.status(404).json({
          success: false,
          error: 'Transaction not found'
        });
      }

      res.json({
        success: true,
        data: { transaction }
      });
    } catch (error) {
      logger.error('Get transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get transaction'
      });
    }
  }
};