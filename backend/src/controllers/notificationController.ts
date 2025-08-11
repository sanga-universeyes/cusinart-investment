import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const notificationController = {
  // Get user notifications
  async getNotifications(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { page = 1, limit = 10, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { userId };
      if (status) where.status = status;

      const notifications = await prisma.notification.findMany({
        where,
        skip,
        take: parseInt(limit as string),
        orderBy: { createdAt: 'desc' }
      });

      const total = await prisma.notification.count({ where });

      res.json({
        success: true,
        data: {
          notifications,
          pagination: {
            page: parseInt(page as string),
            limit: parseInt(limit as string),
            total,
            totalPages: Math.ceil(total / parseInt(limit as string))
          }
        }
      });
    } catch (error) {
      logger.error('Get notifications error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get notifications'
      });
    }
  },

  // Mark notification as read
  async markAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const notification = await prisma.notification.updateMany({
        where: {
          id,
          userId
        },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'Notification marked as read'
      });
    } catch (error) {
      logger.error('Mark notification as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark notification as read'
      });
    }
  },

  // Mark all notifications as read
  async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;

      await prisma.notification.updateMany({
        where: {
          userId,
          status: 'UNREAD'
        },
        data: {
          status: 'READ',
          readAt: new Date()
        }
      });

      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      logger.error('Mark all notifications as read error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to mark all notifications as read'
      });
    }
  }
};