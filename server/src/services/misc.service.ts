import { prisma } from '../prisma/client';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';
import { analysisPipeline } from '../analysis/pipeline';

export class MiscService {
  public static async getTestimonials() {
    return prisma.testimonial.findMany({
      where: { isFeatured: true },
      take: 6,
    });
  }

  public static async submitSupport(data: { name: string; email: string; subject: string; message: string }) {
    return prisma.supportTicket.create({
      data: {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      },
    });
  }

  public static getPublicConfig() {
    return {
      appName: 'GlowNest',
      analysisMode: analysisPipeline.getProviderMode(), // 'demo'
      analysisProvider: analysisPipeline.getProviderName(), // 'demo'
      currency: 'INR',
      currencySymbol: '₹',
      version: '1.0.0',
    };
  }

  public static async getReminders(userId: string) {
    return prisma.reminder.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  public static async createReminder(
    userId: string,
    data: { routinePeriod: 'AM' | 'PM'; timeLocal: string; channel?: string }
  ) {
    return prisma.reminder.create({
      data: {
        userId,
        routinePeriod: data.routinePeriod,
        timeLocal: data.timeLocal,
        channel: data.channel || 'in_app',
      },
    });
  }

  public static async deleteReminder(id: string, userId: string) {
    const reminder = await prisma.reminder.findUnique({ where: { id } });
    if (!reminder || reminder.userId !== userId) throw new AppError('Reminder not found', 404, 'NOT_FOUND');
    await prisma.reminder.delete({ where: { id } });
    return { success: true };
  }
}

