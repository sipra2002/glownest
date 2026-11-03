import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ArrowRight, Clock, BookOpen } from 'lucide-react';
import api from '../api/client';

export const Blog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [articles, setArticles] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    api.get('/articles/categories').then((res) => {
      if (res.data.success) setCategories(res.data.data);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(searchParams).toString();
    api.get(`/articles?${query}`).then((res) => {
      if (res.data.success) setArticles(res.data.data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, [searchParams]);

  const updateCategory = (slug: string) => {
    const updated = new URLSearchParams(searchParams);
    if (slug) updated.set('category', slug);
    else updated.delete('category');
    setSearchParams(updated);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = new URLSearchParams(searchParams);
    if (searchInput) updated.set('q', searchInput);
    else updated.delete('q');
    setSearchParams(updated);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
          The Glow Journal
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Dermatological Science & Regimens
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light">
          Evidence-based education on skin barrier biology, ingredient synergies, and sun protection.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto text-xs">
          <button
            onClick={() => updateCategory('')}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
              !selectedCategory
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            All Articles
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => updateCategory(c.slug)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                selectedCategory === c.slug
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search guides..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
          />
          <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
        </form>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-neutral-400">Loading articles...</div>
      ) : articles.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 border rounded-3xl p-8">
          <p className="font-serif text-lg text-neutral-800 dark:text-neutral-200">No articles found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={`/blog/${art.slug}`}
              className="group bg-white dark:bg-neutral-900 border border-neutral-200/70 dark:border-neutral-800 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blush-600 dark:text-blush-400 block">
                    {art.category?.name || 'Education'} • {art.readTimeMinutes} min read
                  </span>
                  <h3 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100 group-hover:text-blush-500 transition-colors line-clamp-2">
                    {art.title}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed font-light">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 flex items-center gap-1 group-hover:underline">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

