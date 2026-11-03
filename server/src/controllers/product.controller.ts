import { Request, Response, NextFunction } from 'express';
import { ProductService } from '../services/product.service';
import { sendSuccess } from '../utils/response';

export class ProductController {
  public static async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        q,
        category,
        skinType,
        concern,
        minPrice,
        maxPrice,
        rating,
        sort,
        page,
        limit,
      } = req.query;

      const result = await ProductService.getProducts({
        q: q ? String(q) : undefined,
        category: category ? String(category) : undefined,
        skinType: skinType ? String(skinType) : undefined,
        concern: concern ? String(concern) : undefined,
        minPrice: minPrice ? parseInt(String(minPrice), 10) : undefined,
        maxPrice: maxPrice ? parseInt(String(maxPrice), 10) : undefined,
        rating: rating ? parseFloat(String(rating)) : undefined,
        sort: sort as any,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 12,
      });

      return sendSuccess(res, result.items, 200, {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getProductBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const product = await ProductService.getProductBySlug(req.params.slug);
      return sendSuccess(res, product);
    } catch (error) {
      next(error);
    }
  }

  public static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await ProductService.getCategories();
      return sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }
}

