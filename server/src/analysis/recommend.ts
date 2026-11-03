import { prisma } from '../prisma/client';
import { ConcernType, SkinType } from '../config/constants';

export interface RoutineStepDefinition {
  period: 'AM' | 'PM';
  stepOrder: number;
  stepType: 'cleanser' | 'toner' | 'serum' | 'moisturizer' | 'sunscreen';
  instructions: string;
  product?: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    priceCents: number;
    currency: string;
    imageUrls: string[];
    ratingAvg: number;
  };
}

export async function generateRoutineRecommendation(
  skinType: SkinType,
  highConcerns: ConcernType[]
): Promise<RoutineStepDefinition[]> {
  // Fetch active products
  const products = await prisma.product.findMany({
    where: { isActive: true },
    include: { category: true },
  });

  const parsedProducts = products.map((p) => {
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
      parsedImages: images,
      parsedSkinTypes: skinTypes,
      parsedConcerns: concerns,
    };
  });

  // Find best matching product for a category/step
  const findBestProduct = (stepType: string) => {
    const matchingCategory = parsedProducts.filter((p) =>
      p.category.slug.toLowerCase().includes(stepType.toLowerCase()) ||
      p.name.toLowerCase().includes(stepType.toLowerCase())
    );

    if (matchingCategory.length === 0) return parsedProducts[0];

    // Score products based on matching skinType and concerns
    const scored = matchingCategory.map((p) => {
      let score = 0;
      if (p.parsedSkinTypes.includes(skinType) || p.parsedSkinTypes.includes('all')) score += 3;
      highConcerns.forEach((c) => {
        if (p.parsedConcerns.includes(c)) score += 2;
      });
      return { product: p, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored[0]?.product || matchingCategory[0];
  };

  const amCleanser = findBestProduct('cleanser');
  const toner = findBestProduct('toner');
  const serum = findBestProduct('serum');
  const moisturizer = findBestProduct('moisturizer');
  const sunscreen = findBestProduct('sunscreen');

  const formatProduct = (p: typeof parsedProducts[0] | undefined) => {
    if (!p) return undefined;
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      brand: p.brand,
      priceCents: p.priceCents,
      currency: p.currency,
      imageUrls: p.parsedImages,
      ratingAvg: p.ratingAvg,
    };
  };

  const steps: RoutineStepDefinition[] = [
    // AM Routine
    {
      period: 'AM',
      stepOrder: 1,
      stepType: 'cleanser',
      instructions: 'Gently cleanse facial skin with lukewarm water to remove overnight sebum.',
      product: formatProduct(amCleanser),
    },
    {
      period: 'AM',
      stepOrder: 2,
      stepType: 'toner',
      instructions: 'Pat lightly into skin to balance pH and prep for antioxidant absorption.',
      product: formatProduct(toner),
    },
    {
      period: 'AM',
      stepOrder: 3,
      stepType: 'serum',
      instructions: 'Apply 3-4 drops focusing on zones with visible concern or dullness.',
      product: formatProduct(serum),
    },
    {
      period: 'AM',
      stepOrder: 4,
      stepType: 'moisturizer',
      instructions: 'Smooth over face and neck to lock in hydration without clogging pores.',
      product: formatProduct(moisturizer),
    },
    {
      period: 'AM',
      stepOrder: 5,
      stepType: 'sunscreen',
      instructions: 'Apply generous amount (two finger lengths) 15 minutes before sun exposure.',
      product: formatProduct(sunscreen),
    },
    // PM Routine
    {
      period: 'PM',
      stepOrder: 1,
      stepType: 'cleanser',
      instructions: 'Double cleanse in the evening to break down SPF, pollutants, and debris.',
      product: formatProduct(amCleanser),
    },
    {
      period: 'PM',
      stepOrder: 2,
      stepType: 'toner',
      instructions: 'Soften and hydrate skin to maximize nightly restorative absorption.',
      product: formatProduct(toner),
    },
    {
      period: 'PM',
      stepOrder: 3,
      stepType: 'serum',
      instructions: 'Apply active evening serum to promote cellular turnover and barrier recovery.',
      product: formatProduct(serum),
    },
    {
      period: 'PM',
      stepOrder: 4,
      stepType: 'moisturizer',
      instructions: 'Apply a nourishing layer to seal moisture and prevent trans-epidermal water loss.',
      product: formatProduct(moisturizer),
    },
  ];

  return steps;
}

