import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle2, ShoppingBag, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { DemoBanner } from '../components/common/DemoBanner';

export const Checkout: React.FC = () => {
  const { items, subtotalCents, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user ? user.name : 'Pooja Sharma',
    street: '14 Lotus Residency, Park Avenue',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
    phone: '+91 98765 43210',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const freeShippingThreshold = 99900;
  const shippingCents = subtotalCents >= freeShippingThreshold || subtotalCents === 0 ? 0 : 9900;
  const totalCents = subtotalCents + shippingCents;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      setError('Cannot checkout with an empty bag.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: formData,
        idempotencyKey: `checkout_${Date.now()}_${Math.random()}`,
      };

      const res = await api.post('/orders', orderPayload);
      if (res.data.success) {
        setConfirmedOrder(res.data.data);
        clearCart();
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to place demo order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
            Order Confirmed (Demo)
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
            Thank you, {formData.fullName.split(' ')[0]}!
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
            Your demo order <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{confirmedOrder.orderNumber}</span> has been created.
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 text-left space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800 text-xs">
            <span className="text-neutral-500">Status</span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold uppercase tracking-wider">
              {confirmedOrder.status}
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <span className="font-semibold text-neutral-800 dark:text-neutral-200 block">Shipping To:</span>
            <p className="text-neutral-600 dark:text-neutral-400">
              {formData.street}, {formData.city}, {formData.state} - {formData.postalCode}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400">Phone: {formData.phone}</p>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-sm font-bold text-neutral-900 dark:text-neutral-100">
            <span>Total Amount</span>
            <span>₹{(confirmedOrder.totalCents / 100).toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800"
          >
            View in Dashboard →
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto px-6 py-3 rounded-full border border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 text-xs font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-xl text-neutral-800">Your bag is empty.</p>
        <Link to="/shop" className="text-xs font-semibold text-blush-600 hover:underline">
          Return to Shop →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <div className="space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Demo Checkout
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Simulate placing an order with our zero-charge Phase 1 checkout flow.
        </p>
      </div>

      <DemoBanner
        text="Phase 1 Demo Checkout – No Real Payment Charged"
        subtext="This checkout stores a confirmed simulated order in the database for tracking. Payment gateway integration will be attached in a subsequent phase."
      />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-xl text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Shipping Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              <MapPin className="w-4 h-4 text-blush-500" />
              <span>Shipping Information</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Street Address</label>
                <input
                  type="text"
                  name="street"
                  required
                  value={formData.street}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">State</label>
                <input
                  type="text"
                  name="state"
                  required
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">PIN / Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Option */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
              Payment Gateway
            </span>
            <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
              Demo Transaction Mode
            </h3>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between">
              <span>Simulated Instant Clearance (No real billing)</span>
              <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 dark:bg-amber-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-lg flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-blush-400" />
                Processing Demo Order...
              </>
            ) : (
              <>
                Confirm & Place Demo Order • ₹{(totalCents / 100).toLocaleString('en-IN')}
              </>
            )}
          </button>
        </form>

        {/* Order Items Overview */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <h2 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Items in Order ({items.length})
          </h2>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {items.map((i) => (
              <div key={i.id} className="flex gap-3 text-xs items-center">
                <img
                  src={i.product.imageUrls[0] || 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=800'}
                  alt=""
                  className="w-12 h-12 rounded-lg object-cover bg-neutral-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{i.product.name}</p>
                  <p className="text-neutral-500">Qty: {i.quantity}</p>
                </div>
                <span className="font-semibold">
                  ₹{((i.product.priceCents * i.quantity) / 100).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-500">
              <span>Subtotal</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                ₹{(subtotalCents / 100).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-neutral-500">
              <span>Shipping</span>
              <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                {shippingCents === 0 ? 'FREE' : `₹${(shippingCents / 100).toLocaleString('en-IN')}`}
              </span>
            </div>
            <div className="pt-3 border-t border-neutral-200 dark:border-neutral-700 flex justify-between text-sm font-bold text-neutral-900 dark:text-neutral-100">
              <span>Total</span>
              <span>₹{(totalCents / 100).toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

