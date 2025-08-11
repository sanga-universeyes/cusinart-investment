import { Router } from 'express';
import { notificationController } from '../controllers/notificationController';

const router = Router();

// Get user notifications
router.get('/', notificationController.getNotifications);

// Mark notification as read
router.put('/:id/read', notificationController.markAsRead);

// Mark all notifications as read
router.put('/read-all', notificationController.markAllAsRead);

export default router;