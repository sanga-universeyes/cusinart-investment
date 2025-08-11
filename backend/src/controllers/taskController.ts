import { Request, Response } from 'express';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const taskController = {
  // Get tasks
  async getTasks(req: AuthRequest, res: Response) {
    try {
      const { page = 1, limit = 10, type, status } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);

      const where: any = { status: 'ACTIVE' };
      if (type) where.type = type;

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
              lastName: true
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

  // Create task
  async createTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { title, description, type, points, requirements } = req.body;

      const task = await prisma.task.create({
        data: {
          creatorId: userId,
          title,
          description,
          type,
          points,
          requirements,
          status: 'ACTIVE'
        },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: { task }
      });
    } catch (error) {
      logger.error('Create task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create task'
      });
    }
  },

  // Complete task
  async completeTask(req: AuthRequest, res: Response) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      const task = await prisma.task.findUnique({
        where: { id }
      });

      if (!task || task.status !== 'ACTIVE') {
        return res.status(404).json({
          success: false,
          error: 'Task not found or not active'
        });
      }

      // Create task execution
      const execution = await prisma.taskExecution.create({
        data: {
          taskId: id,
          executorId: userId,
          status: 'PENDING'
        }
      });

      res.status(201).json({
        success: true,
        message: 'Task completed successfully',
        data: { execution }
      });
    } catch (error) {
      logger.error('Complete task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to complete task'
      });
    }
  },

  // Get task by ID
  async getTask(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const task = await prisma.task.findUnique({
        where: { id },
        include: {
          creator: {
            select: {
              id: true,
              firstName: true,
              lastName: true
            }
          }
        }
      });

      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      res.json({
        success: true,
        data: { task }
      });
    } catch (error) {
      logger.error('Get task error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get task'
      });
    }
  }
};