import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrderService } from '../services/order.service';
import { sendSuccess } from '../utils/response';

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().positive(),
    })
  ).min(1, 'Order must contain at least one item'),
  shippingAddress: z.object({
    fullName: z.string().min(2, 'Full name is required'),
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    postalCode: z.string().min(4, 'Postal code is required'),
    country: z.string().default('India'),
    phone: z.string().min(8, 'Phone number is required'),
  }),
  idempotencyKey: z.string().optional(),
});

export class OrderController {
  public static async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const validated = createOrderSchema.parse(req.body);
      const order = await OrderService.createOrder({
        userId: req.user?.userId,
        items: validated.items,
        shippingAddress: validated.shippingAddress,
        idempotencyKey: validated.idempotencyKey,
      });

      return sendSuccess(res, order, 201);
    } catch (error) {
      next(error);
    }
  }

  public static async getUserOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const orders = await OrderService.getUserOrders(req.user!.userId);
      return sendSuccess(res, orders);
    } catch (error) {
      next(error);
    }
  }

  public static async getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
      const order = await OrderService.getOrderById(req.params.id, req.user?.userId);
      return sendSuccess(res, order);
    } catch (error) {
      next(error);
    }
  }
}

