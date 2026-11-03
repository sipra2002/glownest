import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export class BlogService {
  public static async getArticles(filters: { category?: string; q?: string; page?: number; limit?: number }) {
    const page = filters.page || 1;
    const limit = filters.limit || 9;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (filters.category) {
      where.category = { slug: filters.category };
    }
    if (filters.q) {
      where.OR = [
        { title: { contains: filters.q } },
        { excerpt: { contains: filters.q } },
      ];
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishedAt: 'desc' },
        include: { category: true },
      }),
    ]);

    return {
      items: articles,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public static async getArticleBySlug(slug: string) {
    const article = await prisma.article.findUnique({
      where: { slug },
      include: { category: true },
    });

    if (!article) throw new AppError('Article not found', 404, 'NOT_FOUND');
    return article;
  }

  public static async getCategories() {
    return prisma.articleCategory.findMany({
      include: {
        _count: { select: { articles: true } },
      },
    });
  }
}

