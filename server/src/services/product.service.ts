import { prisma } from '../prisma/client';
import { AppError } from '../utils/AppError';

export interface ProductFilters {
  q?: string;
  category?: string;
  skinType?: string;
  concern?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sort?: 'price_asc' | 'price_desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export class ProductService {
  public static async getProducts(filters: ProductFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 12;
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (filters.category) {
      where.category = { slug: filters.category };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.priceCents = {};
      if (filters.minPrice !== undefined) where.priceCents.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.priceCents.lte = filters.maxPrice;
    }

    if (filters.rating !== undefined) {
      where.ratingAvg = { gte: filters.rating };
    }

    if (filters.q) {
      where.OR = [
        { name: { contains: filters.q } },
        { description: { contains: filters.q } },
        { brand: { contains: filters.q } },
      ];
    }

    let orderBy: any = { createdAt: 'desc' };
    if (filters.sort === 'price_asc') orderBy = { priceCents: 'asc' };
    if (filters.sort === 'price_desc') orderBy = { priceCents: 'desc' };
    if (filters.sort === 'rating') orderBy = { ratingAvg: 'desc' };

    const [total, products] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          ingredients: { where: { isKey: true } },
        },
      }),
    ]);

    // Client-side/memory filtering for JSON array attributes (skinType, concern)
    let filtered = products.map((p) => {
      let images: string[] = [];
      let skinTypes: string[] = [];
      let concerns: string[] = [];
      try {
        images = JSON.parse(p.imageUrls);
      } catch {
        images = [p.imageUrls];
      }
      try {
        skinTypes = JSON.parse(p.suitableSkinTypes);
      } catch {
        skinTypes = [];
      }
      try {
        concerns = JSON.parse(p.targetConcerns);
      } catch {
        concerns = [];
      }

      return {
        ...p,
        imageUrls: images,
        suitableSkinTypes: skinTypes,
        targetConcerns: concerns,
      };
    });

    if (filters.skinType) {
      filtered = filtered.filter(
        (p) => p.suitableSkinTypes.includes(filters.skinType!) || p.suitableSkinTypes.includes('all')
      );
    }

    if (filters.concern) {
      filtered = filtered.filter((p) => p.targetConcerns.includes(filters.concern!));
    }

    return {
      items: filtered,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  public static async getProductBySlug(slug: string) {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        ingredients: true,
        reviews: {
          include: {
            user: { select: { id: true, name: true } },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!product) throw new AppError('Product not found', 404, 'NOT_FOUND');

    let images: string[] = [];
    let skinTypes: string[] = [];
    let concerns: string[] = [];
    try {
      images = JSON.parse(product.imageUrls);
    } catch {
      images = [product.imageUrls];
    }
    try {
      skinTypes = JSON.parse(product.suitableSkinTypes);
    } catch {
      skinTypes = [];
    }
    try {
      concerns = JSON.parse(product.targetConcerns);
    } catch {
      concerns = [];
    }

    return {
      ...product,
      imageUrls: images,
      suitableSkinTypes: skinTypes,
      targetConcerns: concerns,
    };
  }

  public static async getCategories() {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description,
      productCount: c._count.products,
    }));
  }
}

