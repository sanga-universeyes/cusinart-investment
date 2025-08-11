import { Router } from 'express';
import { transactionController } from '../controllers/transactionController';

const router = Router();

// Create deposit
router.post('/deposit', transactionController.createDeposit);

// Create withdrawal
router.post('/withdrawal', transactionController.createWithdrawal);

// Get transaction history
router.get('/history', transactionController.getHistory);

// Get transaction by ID
router.get('/:id', transactionController.getTransaction);

export default router;