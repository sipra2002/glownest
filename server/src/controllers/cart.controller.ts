import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { CartService } from '../services/cart.service';
import { sendSuccess } from '../utils/response';

export class CartController {
  public static async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.getCart(req.user!.userId);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  public static async addItem(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        productId: z.string().min(1),
        quantity: z.number().int().positive().default(1),
      });

      const validated = schema.parse(req.body);
      const cart = await CartService.addItem(req.user!.userId, validated.productId, validated.quantity);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  public static async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        quantity: z.number().int().min(0),
      });

      const validated = schema.parse(req.body);
      const cart = await CartService.updateItem(req.user!.userId, req.params.itemId, validated.quantity);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  public static async removeItem(req: Request, res: Response, next: NextFunction) {
    try {
      const cart = await CartService.removeItem(req.user!.userId, req.params.itemId);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }

  public static async mergeCart(req: Request, res: Response, next: NextFunction) {
    try {
      const schema = z.object({
        items: z.array(
          z.object({
            productId: z.string(),
            quantity: z.number().int().positive(),
          })
        ),
      });

      const validated = schema.parse(req.body);
      const cart = await CartService.mergeCart(req.user!.userId, validated.items);
      return sendSuccess(res, cart);
    } catch (error) {
      next(error);
    }
  }
}

