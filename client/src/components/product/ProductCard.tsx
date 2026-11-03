import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    slug: string;
    brand: string;
    priceCents: number;
    currency: string;
    imageUrls: string[] | string;
    ratingAvg: number;
    ratingCount?: number;
    category?: { name: string; slug: string };
    targetConcerns?: string[] | string;
    suitableSkinTypes?: string[] | string;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  let images: string[] = [];
  if (Array.isArray(product.imageUrls)) {
    images = product.imageUrls;
  } else if (typeof product.imageUrls === 'string') {
    try {
      images = JSON.parse(product.imageUrls);
    } catch {
      images = [product.imageUrls];
    }
  }

  const primaryImage = images[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800';
  const priceDisplay = `₹${(product.priceCents / 100).toLocaleString('en-IN')}`;

  return (
    <div className="group relative bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      {/* Image container */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
        <img
          src={primaryImage}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Quick add button overlay */}
        <button
          onClick={(e) => {
            e.preventDefault();
            addItem(product);
          }}
          className="absolute bottom-3 right-3 p-2.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-neutral-100 shadow-md hover:bg-blush-500 hover:text-white transition-all transform translate-y-1 opacity-90 group-hover:translate-y-0 group-hover:opacity-100"
          title="Add to Cart"
          aria-label="Add to Cart"
        >
          <ShoppingBag className="w-4 h-4" />
        </button>
      </div>

      {/* Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400 mb-1">
            <span className="uppercase tracking-wider text-[10px] font-semibold text-sage-600 dark:text-sage-400">
              {product.brand}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-medium text-xs">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.ratingAvg.toFixed(1)}</span>
            </div>
          </div>

          <Link to={`/shop/${product.slug}`} className="block">
            <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blush-500 transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <span className="font-sans font-bold text-neutral-900 dark:text-neutral-100 text-base">
            {priceDisplay}
          </span>
          <Link
            to={`/shop/${product.slug}`}
            className="text-xs font-semibold text-blush-600 dark:text-blush-400 hover:underline"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

