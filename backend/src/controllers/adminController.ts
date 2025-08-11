import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  admin?: any;
}

export const adminController = {
  // Get dashboard stats
  async getDashboardStats(_req: AuthRequest, res: Response) {
    try {
      const [
        totalUsers,
        activeUsers,
        totalInvestments,
        totalBalance,
        pendingTransactions,
        completedTransactions
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { status: 'ACTIVE' } }),
        prisma.investment.count({ where: { status: 'ACTIVE' } }),
        prisma.user.aggregate({
          _sum: {
            balanceAr: true,
            balanceUsdt: true
          }
        }),
        prisma.transaction.count({ where: { status: 'PENDING' } }),
        prisma.transaction.count({ where: { status: 'COMPLETED' } })
      ]);

      const stats = {
        totalUsers,
        activeUsers,
        totalInvestments,
        totalBalance: {
          ar: totalBalance._sum.balanceAr || 0,
          usdt: totalBalance._sum.balanceUsdt || 0
        },
        pendingTransactions,
        completedTransactions
      };

      res.json({
        success: true,
        data: { stats }
      });
    } catch (error) {
      logger.error('Get dashboard stats error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get dashboard stats'
      });
    }
  },

  // Get users
  async getUsers(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, status, search } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (status) where.status = status;
      if (search) {
        where.OR = [
          { firstName: { contains: search as string, mode: 'insensitive' } },
          { lastName: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } }
        ];
      }

      const users = await prisma.user.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
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
          createdAt: true
        }
      });

      const total = await prisma.user.count({ where });

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            totalPages: Math.ceil(total / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      logger.error('Get users error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get users'
      });
    }
  },

  // Update user
  async updateUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { status, isInvestor } = req.body;

      const user = await prisma.user.update({
        where: { id },
        data: { status, isInvestor },
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
          createdAt: true
        }
      });

      res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
      });
    } catch (error) {
      logger.error('Update user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update user'
      });
    }
  },

  // Delete user
  async deleteUser(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await prisma.user.delete({
        where: { id }
      });

      res.json({
        success: true,
        message: 'User deleted successfully'
      });
    } catch (error) {
      logger.error('Delete user error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete user'
      });
    }
  },

  // Get transactions
  async getTransactions(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, type, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (type) where.type = type;
      if (status) where.status = status;

      const transactions = await prisma.transaction.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
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

  // Approve transaction
  async approveTransaction(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.admin.id;

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          status: 'COMPLETED',
          approvedBy: adminId,
          approvedAt: new Date()
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
      });

      // Update user balance if it's a deposit
      if (transaction.type === 'DEPOSIT') {
        const balanceField = transaction.currency === 'AR' ? 'balanceAr' : 'balanceUsdt';
        await prisma.user.update({
          where: { id: transaction.userId },
          data: {
            [balanceField]: {
              increment: transaction.amount
            }
          }
        });
      }

      res.json({
        success: true,
        message: 'Transaction approved successfully',
        data: { transaction }
      });
    } catch (error) {
      logger.error('Approve transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve transaction'
      });
    }
  },

  // Reject transaction
  async rejectTransaction(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.admin.id;

      const transaction = await prisma.transaction.update({
        where: { id },
        data: {
          status: 'FAILED',
          rejectionReason: reason,
          rejectedBy: adminId,
          rejectedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Transaction rejected successfully',
        data: { transaction }
      });
    } catch (error) {
      logger.error('Reject transaction error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject transaction'
      });
    }
  },

  // Get investments
  async getInvestments(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (status) where.status = status;

      const investments = await prisma.investment.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          },
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

  // Get investment plans
  async getInvestmentPlans(_req: AuthRequest, res: Response) {
    try {
      const plans = await prisma.investmentPlan.findMany({
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

  // Get tasks
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = {};
      if (status) where.status = status;

      const tasks = await prisma.task.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
      });

      const total = await prisma.task.count({ where });

      res.json({
        success: true,
        data: {
          tasks,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            totalPages: Math.ceil(total / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      logger.error('Get tasks error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get tasks'
      });
    }
  },

  // Approve task execution
  async approveTaskExecution(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const adminId = req.admin.id;

      const execution = await prisma.taskExecution.update({
        where: { id },
        data: {
          status: 'APPROVED',
          approvedBy: adminId,
          approvedAt: new Date()
        },
        include: {
          task: true,
          executor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              phone: true
            }
          }
        }
      });

      // Add points to user
      await prisma.user.update({
        where: { id: execution.executorId },
        data: {
          pointsBalance: {
            increment: execution.task.points
          }
        }
      });

      res.json({
        success: true,
        message: 'Task execution approved successfully',
        data: { execution }
      });
    } catch (error) {
      logger.error('Approve task execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to approve task execution'
      });
    }
  },

  // Reject task execution
  async rejectTaskExecution(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { reason } = req.body;
      const adminId = req.admin.id;

      const execution = await prisma.taskExecution.update({
        where: { id },
        data: {
          status: 'REJECTED',
          rejectionReason: reason,
          rejectedBy: adminId,
          rejectedAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Task execution rejected successfully',
        data: { execution }
      });
    } catch (error) {
      logger.error('Reject task execution error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to reject task execution'
      });
    }
  }
};