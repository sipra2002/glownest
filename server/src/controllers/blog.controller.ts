import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';
import { sendSuccess } from '../utils/response';

export class BlogController {
  public static async getArticles(req: Request, res: Response, next: NextFunction) {
    try {
      const { category, q, page, limit } = req.query;
      const result = await BlogService.getArticles({
        category: category ? String(category) : undefined,
        q: q ? String(q) : undefined,
        page: page ? parseInt(String(page), 10) : 1,
        limit: limit ? parseInt(String(limit), 10) : 9,
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

  public static async getArticleBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const article = await BlogService.getArticleBySlug(req.params.slug);
      return sendSuccess(res, article);
    } catch (error) {
      next(error);
    }
  }

  public static async getCategories(_req: Request, res: Response, next: NextFunction) {
    try {
      const categories = await BlogService.getCategories();
      return sendSuccess(res, categories);
    } catch (error) {
      next(error);
    }
  }
}

