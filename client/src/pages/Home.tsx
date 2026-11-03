import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Camera, CheckCircle2, ArrowRight, ShieldCheck, Leaf, Heart, Star } from 'lucide-react';
import api from '../api/client';
import { ProductCard } from '../components/product/ProductCard';

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);

  useEffect(() => {
    // Fetch home data
    api.get('/products?limit=4').then((res) => {
      if (res.data.success) setFeaturedProducts(res.data.data);
    }).catch(() => {});

    api.get('/testimonials').then((res) => {
      if (res.data.success) setTestimonials(res.data.data);
    }).catch(() => {});

    api.get('/articles?limit=3').then((res) => {
      if (res.data.success) setArticles(res.data.data);
    }).catch(() => {});
  }, []);

  return (
    <div className="space-y-20 sm:space-y-28">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blush-100/80 dark:bg-blush-950/60 border border-blush-200/60 dark:border-blush-800 text-xs font-semibold text-blush-700 dark:text-blush-300">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Botanical Intelligence</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-neutral-900 dark:text-neutral-50 leading-[1.15]">
                Your Skin, <br className="hidden sm:inline" />
                <span className="italic font-normal text-blush-500">Your Glow</span>
              </h1>

              <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                Discover your skin’s unique biological profile through smart cosmetic analysis. Receive personalized AM/PM routines and clean, clinical-grade formulations tailored just for you.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/analyze"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-md flex items-center justify-center gap-2 group"
                >
                  <Camera className="w-4 h-4 text-blush-400 group-hover:scale-110 transition-transform" />
                  Analyze My Skin
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-neutral-700 font-semibold text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/60 transition shadow-sm text-center"
                >
                  Explore Products
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-cream-200 dark:border-neutral-800 flex items-center justify-center lg:justify-start gap-6 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500" /> Barrier-First Care</span>
                <span className="flex items-center gap-1.5"><Leaf className="w-4 h-4 text-sage-500" /> Clean Actives</span>
                <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-500" /> 100% Cruelty-Free</span>
              </div>
            </div>

            {/* Right Visual Image Showcase */}
            <div className="relative mx-auto max-w-md lg:max-w-none w-full">
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800">
                <img
                  src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=1200&auto=format&fit=crop"
                  alt="Glowing healthy skin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent" />
                
                {/* Floating mini analysis card */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 dark:border-neutral-700 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-serif font-bold text-neutral-900 dark:text-neutral-100">Live Cosmetic Analysis</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Combination Skin
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
                      <span>Barrier Integrity</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">88%</span>
                    </div>
                    <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-sage-500 h-full w-[88%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How GlowNest Works (3-4 steps) */}
      <section className="bg-cream-100/60 dark:bg-neutral-900/40 py-16 sm:py-20 border-y border-cream-200/60 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
              Personalized Simplicity
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mt-2">
              How GlowNest Works
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-3 font-light">
              From photo to customized regimen in under 60 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
            {[
              {
                step: '01',
                title: 'Share Your Skin',
                desc: 'Upload a quick selfie with natural lighting, or answer our 5-question holistic skin quiz.',
              },
              {
                step: '02',
                title: 'Smart Evaluation',
                desc: 'Our engine assesses 7 key visible traits: acne, pigmentation, texture, redness, pores, and lipid balance.',
              },
              {
                step: '03',
                title: 'Targeted Regimen',
                desc: 'Receive an actionable morning and evening routine with ingredient synergy recommendations.',
              },
              {
                step: '04',
                title: 'Track & Compare',
                desc: 'Save reports to your dashboard to visualize barrier improvements and texture smoothing over time.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 relative shadow-sm hover:-translate-y-1 transition duration-300"
              >
                <span className="font-serif text-3xl font-bold text-blush-300 dark:text-blush-900 block mb-3">
                  {item.step}
                </span>
                <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-light">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/quiz"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blush-600 dark:text-blush-400 hover:underline"
            >
              Prefer not to upload a photo? Take the 2-minute Skin Quiz instead →
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-blush-600 dark:text-blush-400">
              Clean Botanical Formulas
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              Curated Essentials
            </h2>
          </div>
          <Link
            to="/shop"
            className="mt-4 sm:mt-0 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blush-500 flex items-center gap-1"
          >
            Browse All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-blush-50/50 dark:bg-neutral-900/30 py-16 sm:py-20 border-y border-blush-100/60 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
              Loved by Real Skin
            </h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 font-light">
              See what our community has to say about their GlowNest journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700"
                  />
                  <div>
                    <h4 className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                      {t.name}
                    </h4>
                    <span className="text-[10px] text-sage-600 dark:text-sage-400 font-medium uppercase tracking-wider block">
                      {t.skinType}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
              Skincare Education
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
              From the Glow Journal
            </h2>
          </div>
          <Link
            to="/blog"
            className="mt-4 sm:mt-0 text-sm font-semibold text-neutral-800 dark:text-neutral-200 hover:text-blush-500 flex items-center gap-1"
          >
            Read All Articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={`/blog/${art.slug}`}
              className="group bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                <img
                  src={art.coverImage}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blush-600 dark:text-blush-400">
                    {art.category?.name || 'Skincare Tips'} • {art.readTimeMinutes} min read
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blush-500 transition-colors mt-1.5 line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 line-clamp-2 leading-relaxed">
                    {art.excerpt}
                  </p>
                </div>
                <span className="mt-4 text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1">
                  Read Guide →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

