import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, ShoppingBag, Check, ShieldCheck, Leaf, Heart, Plus, Minus, ArrowLeft } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/products/${slug}`)
      .then((res) => {
        if (res.data.success) {
          setProduct(res.data.data);
          setSelectedImage(0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-12 h-12 rounded-full border-4 border-blush-200 border-t-blush-500 animate-spin mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-xl text-neutral-800 dark:text-neutral-200">Product not found</p>
        <Link to="/shop" className="text-xs font-semibold text-blush-600 hover:underline">
          ← Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const images = product.imageUrls || [];
  const primaryImage = images[selectedImage] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Back button */}
      <div>
        <Link
          to="/shop"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-800 shadow-md">
            <img src={primaryImage} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {images.length > 1 && (
            <div className="flex items-center gap-3">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === idx
                      ? 'border-blush-500 shadow-sm'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Buying */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
                {product.brand}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.ratingAvg.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">({product.ratingCount || 100}+ reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <span className="font-sans text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                ₹{(product.priceCents / 100).toLocaleString('en-IN')}
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold">
                In Stock ({product.stock} available)
              </span>
            </div>
          </div>

          <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
            {product.description}
          </p>

          {/* Suitable for pills */}
          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 block">
              Ideal Skin Match & Concerns:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.suitableSkinTypes?.map((type: string) => (
                <span
                  key={type}
                  className="px-2.5 py-1 rounded-full bg-cream-100 dark:bg-neutral-800 border border-cream-200 dark:border-neutral-700 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 capitalize"
                >
                  {type} Skin
                </span>
              ))}
              {product.targetConcerns?.map((c: string) => (
                <span
                  key={c}
                  className="px-2.5 py-1 rounded-full bg-blush-50 dark:bg-blush-950/50 border border-blush-200 dark:border-blush-900 text-[11px] font-medium text-blush-700 dark:text-blush-300 capitalize"
                >
                  Target: {c}
                </span>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Bag */}
          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-4">
            <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden bg-neutral-50 dark:bg-neutral-800">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="p-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-4 text-xs font-bold text-neutral-800 dark:text-neutral-200">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="p-3 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200/60 dark:hover:bg-neutral-700"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className="flex-1 py-3.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-xs sm:text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-md flex items-center justify-center gap-2"
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Added to Bag
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-blush-400" /> Add to Bag • ₹{((product.priceCents * quantity) / 100).toLocaleString('en-IN')}
                </>
              )}
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500">
            <div className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Dermatologically Safe</div>
            <div className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-sage-500" /> Clean Botanical</div>
            <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> Zero Cruelty</div>
          </div>
        </div>
      </div>

      {/* Tabs / Deep-dive Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-neutral-200/80 dark:border-neutral-800">
        {/* Ingredients */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Key Active Ingredients
          </h3>
          <div className="space-y-3">
            {product.ingredients?.map((ing: any) => (
              <div key={ing.id} className="p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-xl border border-neutral-100 dark:border-neutral-800">
                <span className="font-serif font-semibold text-xs text-neutral-900 dark:text-neutral-100 block">
                  {ing.name}
                </span>
                <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light block mt-0.5">
                  {ing.benefit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
          <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            How to Use
          </h3>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">
            {product.howToUse}
          </p>
          <div className="p-4 bg-cream-100/70 dark:bg-neutral-800/60 rounded-2xl text-xs text-neutral-600 dark:text-neutral-400">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 block mb-1">
              GlowNest Pro Tip:
            </span>
            Patch test on your inner arm 24 hours prior to first facial application. Always follow with broad spectrum SPF 50 during daytime wear.
          </div>
        </div>
      </div>
    </div>
  );
};

