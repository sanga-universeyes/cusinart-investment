import { Router } from 'express';
import { adminAuthMiddleware } from '../middleware/auth';
import { adminController } from '../controllers/adminController';

const router = Router();

// Apply admin auth middleware to all routes
router.use(adminAuthMiddleware);

// Dashboard stats
router.get('/dashboard', adminController.getDashboardStats);

// Users management
router.get('/users', adminController.getUsers);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Transactions management
router.get('/transactions', adminController.getTransactions);
router.put('/transactions/:id/approve', adminController.approveTransaction);
router.put('/transactions/:id/reject', adminController.rejectTransaction);

// Investments management
router.get('/investments', adminController.getInvestments);
router.get('/investment-plans', adminController.getInvestmentPlans);

// Tasks management
router.get('/tasks', adminController.getTasks);
router.put('/task-executions/:id/approve', adminController.approveTaskExecution);
router.put('/task-executions/:id/reject', adminController.rejectTaskExecution);

export default router;