import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, RefreshCw, X } from 'lucide-react';
import api from '../api/client';
import { ProductCard } from '../components/product/ProductCard';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter states from URL
  const selectedCategory = searchParams.get('category') || '';
  const selectedSkinType = searchParams.get('skinType') || '';
  const selectedConcern = searchParams.get('concern') || '';
  const selectedSort = searchParams.get('sort') || '';
  const searchQuery = searchParams.get('q') || '';

  const [searchInput, setSearchInput] = useState(searchQuery);

  useEffect(() => {
    api.get('/products/categories')
      .then((res) => {
        if (res.data.success) setCategories(res.data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const query = new URLSearchParams(searchParams).toString();
    api.get(`/products?${query}`)
      .then((res) => {
        if (res.data.success) {
          setProducts(res.data.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
    const updated = new URLSearchParams(searchParams);
    if (value) {
      updated.set(key, value);
    } else {
      updated.delete(key);
    }
    updated.delete('page');
    setSearchParams(updated);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter('q', searchInput);
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    selectedCategory || selectedSkinType || selectedConcern || selectedSort || searchQuery
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-blush-600 dark:text-blush-400">
          Clean Botanical Store
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Formulas for Every Skin Type
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light">
          Clinically targeted barrier support, bio-compatible antioxidants, and weightless hydration.
        </p>
      </div>

      {/* Search & Sort Bar */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search by ingredient, concern, name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-1 focus:ring-blush-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sort By:</span>
          </div>
          <select
            value={selectedSort}
            onChange={(e) => updateFilter('sort', e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 focus:outline-none"
          >
            <option value="">Featured</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        <button
          onClick={() => updateFilter('category', '')}
          className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
            !selectedCategory
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
              : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
          }`}
        >
          All Categories
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => updateFilter('category', c.slug)}
            className={`px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
              selectedCategory === c.slug
                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Active Filter Tags */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="text-neutral-400">Active filters:</span>
          {selectedCategory && (
            <span className="inline-flex items-center gap-1 bg-cream-200 dark:bg-neutral-800 px-2.5 py-1 rounded-full text-neutral-800 dark:text-neutral-200">
              Category: {selectedCategory}
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('category', '')} />
            </span>
          )}
          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-cream-200 dark:bg-neutral-800 px-2.5 py-1 rounded-full text-neutral-800 dark:text-neutral-200">
              "{searchQuery}"
              <X className="w-3 h-3 cursor-pointer" onClick={() => updateFilter('q', '')} />
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-blush-600 dark:text-blush-400 font-semibold hover:underline ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <RefreshCw className="w-8 h-8 text-blush-500 animate-spin mx-auto mb-3" />
          <p className="text-xs text-neutral-500 font-light">Loading botanicals...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 space-y-3">
          <p className="font-serif text-lg font-semibold text-neutral-800 dark:text-neutral-200">
            No matching products found
          </p>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto">
            Try adjusting your search query or removing active category filters.
          </p>
          <button
            onClick={clearAllFilters}
            className="px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};

