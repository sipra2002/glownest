import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Clean existing records in reverse dependency order
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.routineStep.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.analysisScore.deleteMany();
  await prisma.quizResponse.deleteMany();
  await prisma.skinAnalysis.deleteMany();
  await prisma.uploadedImage.deleteMany();
  await prisma.skinProfile.deleteMany();
  await prisma.consent.deleteMany();
  await prisma.reminder.deleteMany();
  await prisma.productIngredient.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.article.deleteMany();
  await prisma.articleCategory.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  // 2. Seed Users
  const passwordHash = await bcrypt.hash('Password123!', 10);
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@glownest.com',
      passwordHash,
      name: 'GlowNest Admin',
      role: 'admin',
      emailVerified: true,
    },
  });

  const demoUser = await prisma.user.create({
    data: {
      email: 'demo@glownest.com',
      passwordHash,
      name: 'Pooja Sharma',
      role: 'user',
      emailVerified: true,
      skinProfile: {
        create: {
          skinType: 'combination',
          concerns: JSON.stringify(['acne', 'pores', 'pigmentation']),
          allergies: JSON.stringify(['Fragrance', 'Parabens']),
        },
      },
      consents: {
        create: {
          type: 'image_processing',
          version: '1.0',
        },
      },
    },
  });

  console.log('✅ Users seeded');

  // 3. Seed Categories
  const categoriesData = [
    { name: 'Cleansers', slug: 'cleansers', description: 'Gentle, pH-balanced washes and balms that cleanse without stripping natural moisture.' },
    { name: 'Toners & Essences', slug: 'toners', description: 'Hydrating, barrier-balancing preparatory waters enriched with botanical extracts.' },
    { name: 'Serums & Actives', slug: 'serums', description: 'Concentrated treatments targeting pigmentation, texture, fine lines, and blemishes.' },
    { name: 'Moisturizers', slug: 'moisturizers', description: 'Ceramide-rich creams and gel emulsions to repair lipid barrier and seal moisture.' },
    { name: 'Sunscreens', slug: 'sunscreens', description: 'Broad-spectrum SPF 50+ UVA/UVB protection with zero white cast and skin-nourishing finish.' },
    { name: 'Face Masks', slug: 'face-masks', description: 'Weekly restorative clay, hydrogel, and sheet masks for deep purification and glow.' },
    { name: 'Beauty Accessories', slug: 'accessories', description: 'Rose quartz rollers, gua sha tools, and plush microfiber headbands.' },
  ];

  const categoriesMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoriesMap.set(cat.slug, created.id);
  }

  console.log('✅ Categories seeded');

  // 4. Seed Products
  const productsData = [
    {
      sku: 'GN-CLN-01',
      name: 'Gentle Clarifying Oat Cleanser',
      slug: 'gentle-clarifying-oat-cleanser',
      brand: 'GlowNest Botanical Lab',
      categoryId: categoriesMap.get('cleansers')!,
      description: 'A foaming jelly cleanser packed with colloidal oatmeal, centella asiatica, and green tea to soothe redness and clear excess sebum while keeping the microbiome intact.',
      howToUse: 'Massage 1–2 pumps onto damp skin in circular motions for 60 seconds. Rinse thoroughly with lukewarm water.',
      priceCents: 69900, // ₹699
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228722-d0b771343729?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['all', 'sensitive', 'oily', 'combination']),
      targetConcerns: JSON.stringify(['acne', 'redness', 'oiliness', 'pores']),
      ratingAvg: 4.9,
      ratingCount: 128,
      stock: 85,
      ingredients: [
        { name: 'Colloidal Oatmeal', isKey: true, benefit: 'Calms inflammation and reinforces barrier' },
        { name: 'Centella Asiatica (Cica)', isKey: true, benefit: 'Accelerates skin healing and reduces erythema' },
        { name: 'Green Tea Extract', isKey: true, benefit: 'Potent antioxidant that balances sebum' },
      ],
    },
    {
      sku: 'GN-TNR-01',
      name: 'Rice & Niacinamide Milky Glow Toner',
      slug: 'rice-niacinamide-milky-glow-toner',
      brand: 'GlowNest Botanical Lab',
      categoryId: categoriesMap.get('toners')!,
      description: 'A lightweight bi-phase emulsion toner infused with 78% fermented rice water and 3% niacinamide to brighten dull skin, even out tone, and restore suppleness.',
      howToUse: 'Shake well before use. Pour onto palms or a reusable cotton pad and gently press into face and neck.',
      priceCents: 84900, // ₹849
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1608248597359-26d1a95a6390?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['all', 'dry', 'combination', 'normal']),
      targetConcerns: JSON.stringify(['pigmentation', 'texture', 'dryness']),
      ratingAvg: 4.8,
      ratingCount: 94,
      stock: 60,
      ingredients: [
        { name: 'Fermented Rice Bran Extract', isKey: true, benefit: 'Rich in amino acids and vitamins for luminosity' },
        { name: 'Niacinamide (3%)', isKey: true, benefit: 'Diminishes dark spots and refines pore texture' },
        { name: 'Hyaluronic Acid Complex', isKey: true, benefit: 'Multi-molecular deep hydration' },
      ],
    },
    {
      sku: 'GN-SRM-01',
      name: 'Barrier Defense 10% Niacinamide + Zinc Serum',
      slug: 'barrier-defense-niacinamide-zinc-serum',
      brand: 'GlowNest Clinical',
      categoryId: categoriesMap.get('serums')!,
      description: 'A high-potency restorative elixir engineered to minimize enlarged pores, regulate oil secretion, and fade post-acne erythema without causing irritation.',
      howToUse: 'Apply 3-4 drops morning and evening after toner and before moisturizer.',
      priceCents: 99900, // ₹999
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1608248597359-26d1a95a6390?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['oily', 'combination', 'sensitive']),
      targetConcerns: JSON.stringify(['acne', 'pores', 'oiliness', 'pigmentation']),
      ratingAvg: 4.9,
      ratingCount: 210,
      stock: 120,
      ingredients: [
        { name: 'Niacinamide (10%)', isKey: true, benefit: 'Targeted spot reduction and pore tightening' },
        { name: 'Zinc PCA (1%)', isKey: true, benefit: 'Bacteriostatic sebum regulation' },
        { name: 'Allantoin', isKey: true, benefit: 'Skin buffering and soothing agent' },
      ],
    },
    {
      sku: 'GN-SRM-02',
      name: 'Multi-Peptide + Copper Firming Serum',
      slug: 'multi-peptide-copper-firming-serum',
      brand: 'GlowNest Clinical',
      categoryId: categoriesMap.get('serums')!,
      description: 'An advanced regenerative formula blending 5 pro-collagen peptides with antioxidant copper tripeptide-1 to smooth uneven texture and boost skin elasticity.',
      howToUse: 'Dispense a pipette full over face, neck, and décolleté during evening routine.',
      priceCents: 149900, // ₹1,499
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['dry', 'normal', 'combination']),
      targetConcerns: JSON.stringify(['texture', 'dryness']),
      ratingAvg: 4.7,
      ratingCount: 65,
      stock: 40,
      ingredients: [
        { name: 'Copper Tripeptide-1', isKey: true, benefit: 'Rebuilds extracellular matrix and collagen' },
        { name: 'Matrixyl 3000', isKey: true, benefit: 'Visibly softens fine texture' },
      ],
    },
    {
      sku: 'GN-MST-01',
      name: 'Ceramide Peptide Water Cream',
      slug: 'ceramide-peptide-water-cream',
      brand: 'GlowNest Botanical Lab',
      categoryId: categoriesMap.get('moisturizers')!,
      description: 'A weightless, fast-absorbing gel-cream infused with 5 essential ceramides, squalane, and panthenol to seal moisture for 48 hours without greasiness.',
      howToUse: 'Smooth a dime-sized amount evenly over face and neck as the last hydrating step.',
      priceCents: 119900, // ₹1,199
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=800&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['all', 'combination', 'oily', 'dry', 'sensitive']),
      targetConcerns: JSON.stringify(['dryness', 'redness', 'texture']),
      ratingAvg: 4.9,
      ratingCount: 185,
      stock: 95,
      ingredients: [
        { name: 'Ceramides NP/AP/EOP', isKey: true, benefit: 'Restores skin lipid bilayer' },
        { name: 'Plant Squalane', isKey: true, benefit: 'Biocompatible non-comedogenic hydration' },
        { name: 'Panthenol (Pro-Vitamin B5)', isKey: true, benefit: 'Deep cellular moisture binding' },
      ],
    },
    {
      sku: 'GN-SPF-01',
      name: 'Invisible Dew Mineral Sunscreen SPF 50+ PA++++',
      slug: 'invisible-dew-mineral-sunscreen-spf50',
      brand: 'GlowNest Daily Shield',
      categoryId: categoriesMap.get('sunscreens')!,
      description: 'A revolutionary featherlight sunscreen providing broad spectrum protection against UVA, UVB, and blue light. Blends transparently on all Fitzpatrick skin tones.',
      howToUse: 'Apply liberally 15 minutes before stepping out. Reapply every 2 hours during continuous sun exposure.',
      priceCents: 89900, // ₹899
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1556228722-d0b771343729?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['all', 'sensitive', 'combination', 'oily', 'dry']),
      targetConcerns: JSON.stringify(['pigmentation', 'redness', 'dryness']),
      ratingAvg: 5.0,
      ratingCount: 312,
      stock: 150,
      ingredients: [
        { name: 'Zinc Oxide (18%)', isKey: true, benefit: 'Physical broad spectrum UV shield' },
        { name: 'Ectoin', isKey: true, benefit: 'Protects cells against urban pollution and blue light' },
        { name: 'Bisabolol', isKey: true, benefit: 'Soothes heat-stressed skin' },
      ],
    },
    {
      sku: 'GN-MSK-01',
      name: 'Kaolin & Matcha Pore Purifying Clay Mask',
      slug: 'kaolin-matcha-pore-purifying-clay-mask',
      brand: 'GlowNest Botanical Lab',
      categoryId: categoriesMap.get('face-masks')!,
      description: 'Creamy Amazonian white clay and ceremonial grade Japanese matcha to decongest pores, absorb micro-impurities, and tighten skin texture without overdrying.',
      howToUse: 'Apply an even layer to clean skin. Leave on for 10 minutes until semi-dry. Rinse with warm water.',
      priceCents: 79900, // ₹799
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1567928815116-248359b3d1f1?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['oily', 'combination', 'normal']),
      targetConcerns: JSON.stringify(['pores', 'oiliness', 'acne', 'texture']),
      ratingAvg: 4.8,
      ratingCount: 78,
      stock: 55,
      ingredients: [
        { name: 'Amazonian White Kaolin Clay', isKey: true, benefit: 'Magnetic drawing of sebum and toxins' },
        { name: 'Matcha Green Tea', isKey: true, benefit: 'Antioxidant and anti-inflammatory detox' },
      ],
    },
    {
      sku: 'GN-ACC-01',
      name: 'Handcrafted Rose Quartz Gua Sha Sculptor',
      slug: 'rose-quartz-gua-sha-sculptor',
      brand: 'GlowNest Rituals',
      categoryId: categoriesMap.get('accessories')!,
      description: '100% natural Grade-A Brazilian rose quartz crafted to boost lymphatic drainage, ease facial tension, and sculpt jawline contours.',
      howToUse: 'Use with your favorite GlowNest facial oil or moisturizer, gliding upward and outward.',
      priceCents: 64900, // ₹649
      currency: 'INR',
      imageUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1512290900672-1f414e21a220?q=80&w=800&auto=format&fit=crop'
      ]),
      suitableSkinTypes: JSON.stringify(['all']),
      targetConcerns: JSON.stringify(['texture', 'dryness']),
      ratingAvg: 4.9,
      ratingCount: 142,
      stock: 75,
      ingredients: [],
    },
  ];

  for (const prod of productsData) {
    const { ingredients, ...productInfo } = prod;
    const createdProduct = await prisma.product.create({
      data: productInfo,
    });

    if (ingredients.length > 0) {
      await prisma.productIngredient.createMany({
        data: ingredients.map((ing) => ({
          ...ing,
          productId: createdProduct.id,
        })),
      });
    }

    // Add a verified review
    await prisma.review.create({
      data: {
        productId: createdProduct.id,
        userId: demoUser.id,
        rating: 5,
        title: 'Obsessed with the visible transformation!',
        body: `I have been using ${prod.name} for 3 weeks after completing the GlowNest skin analysis. My skin texture has visibly smoothed and I received so many compliments!`,
        verifiedPurchase: true,
      },
    });
  }

  console.log('✅ Products & Reviews seeded');

  // 5. Seed Blog Articles
  const articleCats = [
    { name: 'Skincare Tips', slug: 'skincare-tips' },
    { name: 'Ingredient Guides', slug: 'ingredient-guides' },
    { name: 'Acne Care', slug: 'acne-care' },
    { name: 'Sunscreen Education', slug: 'sunscreen-education' },
  ];

  const artCatMap = new Map<string, string>();
  for (const ac of articleCats) {
    const created = await prisma.articleCategory.create({ data: ac });
    artCatMap.set(ac.slug, created.id);
  }

  const articlesData = [
    {
      slug: 'demystifying-the-skin-barrier',
      title: 'The Architecture of Skin: How to Repair Your Moisture Barrier',
      excerpt: 'Learn the warning signs of a compromised stratum corneum and the exact lipid ratio needed to rebuild healthy, glowing skin.',
      coverImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1200&auto=format&fit=crop',
      readTimeMinutes: 6,
      categoryId: artCatMap.get('skincare-tips')!,
      content: `## What Exactly is the Skin Barrier?

The skin barrier, technically known as the *stratum corneum*, is the outermost shield that protects your body from environmental stressors, pathogens, and trans-epidermal water loss (TEWL). 

Think of it like a brick-and-mortar wall:
- **The Bricks:** Corneocytes (hardened skin cells).
- **The Mortar:** Intercellular lipids composed of approximately 50% ceramides, 25% cholesterol, and 15% free fatty acids.

### Signs Your Barrier is Compromised
1. Stinging sensation when applying basic hydrating products.
2. Sudden patchiness, redness, or tightness after cleansing.
3. Breakthrough oiliness accompanied by underlying dehydration.
4. Increased frequency of small inflammatory breakouts.

### The 3-Step Recovery Protocol
- **Pause Harsh Actives:** Stop physical scrubs, AHAs/BHAs, and high-percentage retinoids for 14 days.
- **Switch to Non-Foaming Cleansers:** Use lukewarm water and barrier-supporting oat or lipid cleansers.
- **Replenish with Ceramides & Squalane:** Rebuild the mortar layer twice daily with soothing barrier creams.`,
    },
    {
      slug: 'niacinamide-benefits-and-layering',
      title: 'Niacinamide Masterclass: Concentration, Synergy, and Routine Timing',
      excerpt: 'Why 2% to 5% is the clinical sweet spot for vitamin B3, and how to safely layer it with Vitamin C, Retinol, and Peptides.',
      coverImage: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1200&auto=format&fit=crop',
      readTimeMinutes: 5,
      categoryId: artCatMap.get('ingredient-guides')!,
      content: `## The Vitamin B3 Phenomenon

Niacinamide is one of the most thoroughly researched and clinically proven topical ingredients in modern dermatological science. Unlike sensitizing acids, niacinamide acts as a versatile co-factor for cellular renewal.

### Proven Clinical Benefits
- **Regulates Sebum:** Normalizes oil gland activity without causing rebound dryness.
- **Fades Hyperpigmentation:** Inhibits melanosome transfer from melanocytes to keratinocytes.
- **Minimizes Pore Appearance:** Keeps pores free of hardened sebum while supporting elasticity around pore walls.

### How to Layer Niacinamide
- **With Hyaluronic Acid:** Apply HA first on damp skin, follow with Niacinamide.
- **With Retinoids:** Apply Niacinamide 10 minutes prior to buffer retinoid irritation.
- **With Vitamin C:** Modern cosmetic formulations are stable together when formulated at physiological pH!`,
    },
    {
      slug: 'mineral-vs-chemical-sunscreen-truth',
      title: 'Mineral vs. Chemical Sunscreen: The Ultimate Dermatologist Guide',
      excerpt: 'Everything you need to know about Zinc Oxide, UV filters, blue light protection, and preventing photo-aging.',
      coverImage: 'https://images.unsplash.com/photo-1556228722-d0b771343729?q=80&w=1200&auto=format&fit=crop',
      readTimeMinutes: 7,
      categoryId: artCatMap.get('sunscreen-education')!,
      content: `## Why Sunscreen is Your Non-Negotiable Anti-Aging Step

Up to 90% of visible skin aging—including premature wrinkles, loss of bounce, and stubborn dark spots—is caused by daily cumulative UV exposure rather than biological aging.

### Understanding the Differences
- **Physical (Mineral) Filters:** Zinc Oxide and Titanium Dioxide. They sit on top of the skin and reflect/scatter UV radiation. Ideal for rosacea, active acne, and ultra-sensitive skin.
- **Chemical (Organic) Filters:** Absorb UV rays and convert them into harmless trace heat. Often lighter and invisible on deeper skin tones.

### The GlowNest Gold Standard
Look for **Broad Spectrum SPF 50+ with PA++++** rating. Apply 1/4 teaspoon for the face, and remember to cover the ears, neck, and backs of hands!`,
    },
  ];

  for (const art of articlesData) {
    await prisma.article.create({ data: art });
  }

  console.log('✅ Articles seeded');

  // 6. Seed Testimonials
  const testimonialsData = [
    {
      name: 'Ananya Deshmukh',
      quote: 'The GlowNest skin analysis was eye-opening! It recognized my combination skin profile and pinpointed why my cheeks were flaky while my T-zone was breaking out. The recommended Oat Cleanser and Water Cream transformed my barrier in two weeks.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      skinType: 'Combination & Sensitive',
      concern: 'Pores & Redness',
      isFeatured: true,
    },
    {
      name: 'Rohan Mehra',
      quote: 'As a guy who knew nothing about skincare, I was overwhelmed by 10-step routines. The GlowNest quiz gave me an effortless 3-step AM and PM routine that cleared up my post-workout breakouts without feeling heavy.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
      skinType: 'Oily & Acne-Prone',
      concern: 'Acne & Sebum',
      isFeatured: true,
    },
    {
      name: 'Dr. Tanya Kapoor',
      quote: 'I love GlowNest’s transparent cosmetic positioning. The honesty about demo mode and cosmetic assessments rather than medical diagnosis is refreshing and ethically responsible. The formulations and ingredient synergies are truly top tier.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop',
      skinType: 'Normal to Dry',
      concern: 'Pigmentation & Glow',
      isFeatured: true,
    },
  ];

  for (const t of testimonialsData) {
    await prisma.testimonial.create({ data: t });
  }

  console.log('✅ Testimonials seeded');
  console.log('✨ All seed operations completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

