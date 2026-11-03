import { Router } from 'express';
import { OrderController } from '../controllers/order.controller';
import { optionalAuth, requireAuth } from '../middleware/auth';

const router = Router();

router.post('/', optionalAuth, OrderController.createOrder);
router.get('/mine', requireAuth, OrderController.getUserOrders);
router.get('/:id', optionalAuth, OrderController.getOrderById);

export default router;

