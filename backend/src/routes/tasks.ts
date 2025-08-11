import { Router } from 'express';
import { taskController } from '../controllers/taskController';

const router = Router();

// Get tasks
router.get('/', taskController.getTasks);

// Create task
router.post('/', taskController.createTask);

// Complete task
router.post('/:id/complete', taskController.completeTask);

// Get task by ID
router.get('/:id', taskController.getTask);

export default router;