import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { items, updateQuantity, removeItem, subtotalCents, itemCount } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  const freeShippingThreshold = 99900;
  const shippingCents = subtotalCents >= freeShippingThreshold || subtotalCents === 0 ? 0 : 9900;
  const discountCents = Math.round((subtotalCents * discountPercent) / 100);
  const totalCents = Math.max(0, subtotalCents - discountCents + shippingCents);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'GLOW10') {
      setDiscountPercent(10);
      setPromoMessage('Promo code GLOW10 applied: 10% discount!');
    } else {
      setPromoMessage('Invalid coupon code. Try GLOW10.');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-cream-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-400">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Your Shopping Bag is Empty
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Explore our targeted botanical formulations to find the perfect additions to your regimen.
        </p>
        <Link
          to="/shop"
          className="inline-block mt-4 px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
        >
          Explore Botanical Catalog →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Shopping Bag
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Review your chosen formulas before proceeding to checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex gap-4 sm:gap-6 items-center shadow-sm"
            >
              <img
                src={item.product.imageUrls[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800'}
                alt={item.product.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0"
              />

              <div className="flex-1 min-w-0 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400">
                  {item.product.brand}
                </span>
                <Link to={`/shop/${item.product.slug}`} className="block">
                  <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-neutral-100 truncate hover:text-blush-500">
                    {item.product.name}
                  </h3>
                </Link>
                <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  ₹{(item.product.priceCents / 100).toLocaleString('en-IN')}
                </p>

                <div className="flex items-center gap-4 pt-2">
                  <div className="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-lg overflow-hidden bg-neutral-50 dark:bg-neutral-800">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-neutral-200/60 text-neutral-600 dark:text-neutral-300"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-neutral-200/60 text-neutral-600 dark:text-neutral-300"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-xs text-neutral-400 hover:text-rose-500 flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Order Summary
          </h2>

          {/* Promo code form */}
          <form onSubmit={handleApplyPromo} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Discount code (try GLOW10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 uppercase focus:outline-none focus:ring-1 focus:ring-blush-500"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className={`text-[11px] ${discountPercent > 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                {promoMessage}
              </p>
            )}
          </form>

          {/* Totals */}
          <div className="space-y-3 text-xs pt-2 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Subtotal ({itemCount} items)</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                ₹{(subtotalCents / 100).toLocaleString('en-IN')}
              </span>
            </div>

            {discountCents > 0 && (
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Discount (GLOW10)</span>
                <span>-₹{(discountCents / 100).toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Shipping</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {shippingCents === 0 ? 'FREE' : `₹${(shippingCents / 100).toLocaleString('en-IN')}`}
              </span>
            </div>

            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between text-base font-bold text-neutral-900 dark:text-neutral-100">
              <span>Estimated Total</span>
              <span>₹{(totalCents / 100).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-xs sm:text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-md flex items-center justify-center gap-2"
          >
            Proceed to Demo Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2 text-[11px] text-neutral-400 justify-center">
            <ShieldCheck className="w-3.5 h-3.5 text-sage-500" />
            <span>Phase 1 Demonstration Mode • Zero Real Charge</span>
          </div>
        </div>
      </div>
    </div>
  );
};

