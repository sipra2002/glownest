import { Router } from 'express';
import { AnalysisController } from '../controllers/analysis.controller';
import { optionalAuth, requireAuth } from '../middleware/auth';
import { uploadSingleImage } from '../middleware/upload';

const router = Router();

router.post('/image', optionalAuth, uploadSingleImage, AnalysisController.analyzeImage);
router.post('/quiz', optionalAuth, AnalysisController.analyzeQuiz);
router.get('/compare', optionalAuth, AnalysisController.compare);
router.get('/progress', requireAuth, AnalysisController.getProgress);
router.get('/mine', requireAuth, AnalysisController.listMine);
router.get('/:id', optionalAuth, AnalysisController.getById);
router.delete('/:id', requireAuth, AnalysisController.delete);

export default router;

