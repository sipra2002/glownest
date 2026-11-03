import { Router } from 'express';
import { MiscController } from '../controllers/misc.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

router.get('/testimonials', MiscController.getTestimonials);
router.post('/support', MiscController.submitSupport);
router.get('/config/public', MiscController.getPublicConfig);

router.get('/reminders', requireAuth, MiscController.getReminders);
router.post('/reminders', requireAuth, MiscController.createReminder);
router.delete('/reminders/:id', requireAuth, MiscController.deleteReminder);

export default router;

