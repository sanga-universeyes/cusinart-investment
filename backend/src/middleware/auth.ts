import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
  admin?: any;
}

export const authMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(403).json({ error: 'Account is not active' });
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const adminAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.adminId },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        permissions: true,
        lastLoginAt: true
      }
    });

    if (!admin) {
      return res.status(401).json({ error: 'Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    logger.error('Admin auth middleware error:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export const optionalAuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    if (user && user.status === 'ACTIVE') {
      req.user = user;
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};