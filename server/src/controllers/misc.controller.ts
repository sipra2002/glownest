import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { MiscService } from '../services/misc.service';
import { sendSuccess } from '../utils/response';

const supportSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const reminderSchema = z.object({
  routinePeriod: z.enum(['AM', 'PM']),
  timeLocal: z.string().regex(/^\d{2}:\d{2}$/, 'Format must be HH:MM'),
  channel: z.enum(['in_app', 'email']).default('in_app'),
});

export class MiscController {
  public static async getTestimonials(_req: Request, res: Response, next: NextFunction) {
    try {
      const testimonials = await MiscService.getTestimonials();
      return sendSuccess(res, testimonials);
    } catch (error) {
      next(error);
    }
  }

  public static async submitSupport(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = supportSchema.parse(req.body);
      const ticket = await MiscService.submitSupport(validated);
      return sendSuccess(res, { ticketId: ticket.id, message: 'Message sent successfully. We will be in touch soon!' }, 201);
    } catch (error) {
      next(error);
    }
  }

  public static getPublicConfig(_req: Request, res: Response) {
    return sendSuccess(res, MiscService.getPublicConfig());
  }

  public static async getReminders(req: Request, res: Response, next: NextFunction) {
    try {
      const reminders = await MiscService.getReminders(req.user!.userId);
      return sendSuccess(res, reminders);
    } catch (error) {
      next(error);
    }
  }

  public static async createReminder(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = reminderSchema.parse(req.body);
      const reminder = await MiscService.createReminder(req.user!.userId, validated);
      return sendSuccess(res, reminder, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async deleteReminder(req: Request, res: Response, next: NextFunction) {
    try {
      await MiscService.deleteReminder(req.params.id, req.user!.userId);
      return sendSuccess(res, { message: 'Reminder deleted' });
    } catch (error) {
      next(error);
    }
  }
}

