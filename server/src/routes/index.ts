import { Router } from 'express';
import authRoutes from './auth.routes';
import analysisRoutes from './analysis.routes';
import productRoutes from './product.routes';
import cartRoutes from './cart.routes';
import orderRoutes from './order.routes';
import blogRoutes from './blog.routes';
import miscRoutes from './misc.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/analyses', analysisRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/orders', orderRoutes);
router.use('/articles', blogRoutes);
router.use('/', miscRoutes);

export default router;

