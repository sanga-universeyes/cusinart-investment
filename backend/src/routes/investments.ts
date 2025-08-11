import { Router } from 'express';
import { investmentController } from '../controllers/investmentController';

const router = Router();

// Get investment plans
router.get('/plans', investmentController.getPlans);

// Create investment
router.post('/create', investmentController.createInvestment);

// Get user investments
router.get('/my', investmentController.getMyInvestments);

// Get investment by ID
router.get('/:id', investmentController.getInvestment);

export default router;