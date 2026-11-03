import { Router } from 'express';
import { BlogController } from '../controllers/blog.controller';

const router = Router();

router.get('/', BlogController.getArticles);
router.get('/categories', BlogController.getCategories);
router.get('/:slug', BlogController.getArticleBySlug);

export default router;

