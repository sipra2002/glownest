import { Router } from 'express';
import { CartController } from '../controllers/cart.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.use(requireAuth);

router.get('/', CartController.getCart);
router.post('/items', CartController.addItem);
router.patch('/items/:itemId', CartController.updateItem);
router.delete('/items/:itemId', CartController.removeItem);
router.post('/merge', CartController.mergeCart);

export default router;

