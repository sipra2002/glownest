import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import api from '../api/client';

export const ArticleDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.get(`/articles/${slug}`)
      .then((res) => {
        if (res.data.success) setArticle(res.data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center">
        <div className="w-12 h-12 rounded-full border-4 border-blush-200 border-t-blush-500 animate-spin mx-auto" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="font-serif text-xl">Article not found</p>
        <Link to="/blog" className="text-xs font-semibold text-blush-600 hover:underline">
          ← Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-800 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Journal
        </Link>
      </div>

      <div className="space-y-4 text-center sm:text-left">
        <span className="text-xs font-bold uppercase tracking-wider text-blush-600 dark:text-blush-400">
          {article.category?.name}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100 leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center justify-center sm:justify-start gap-4 text-xs text-neutral-500 pt-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {article.author}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTimeMinutes} min read</span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Hero Cover */}
      <div className="aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-neutral-200 dark:border-neutral-800">
        <img src={article.coverImage} alt={article.title} className="w-full h-full object-cover" />
      </div>

      {/* Content Rendering */}
      <div className="prose dark:prose-invert max-w-none text-neutral-700 dark:text-neutral-300 text-sm sm:text-base leading-relaxed space-y-4 font-light">
        {article.content.split('\n\n').map((paragraph: string, idx: number) => {
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={idx} className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mt-8 mb-3">
                {paragraph.replace('## ', '')}
              </h2>
            );
          }
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100 mt-6 mb-2">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('- ')) {
            const listItems = paragraph.split('\n').map((item) => item.replace('- ', ''));
            return (
              <ul key={idx} className="list-disc pl-5 space-y-1.5 my-3">
                {listItems.map((li, i) => (
                  <li key={i}>{li}</li>
                ))}
              </ul>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Explore Products CTA */}
      <div className="mt-12 p-8 rounded-3xl bg-cream-100/70 dark:bg-neutral-900 border border-cream-200 dark:border-neutral-800 text-center space-y-3">
        <h3 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
          Ready to Personalize Your Skincare?
        </h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400 max-w-sm mx-auto font-light">
          Take our 60-second cosmetic analysis to find matching barrier-protecting formulas.
        </p>
        <Link
          to="/analyze"
          className="inline-block mt-2 px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800"
        >
          Analyze My Skin Now →
        </Link>
      </div>
    </article>
  );
};

