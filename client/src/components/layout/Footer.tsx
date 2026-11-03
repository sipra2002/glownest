import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, Leaf, Sparkle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-cream-100 dark:bg-neutral-900 border-t border-cream-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 text-sm mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand & Mission */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blush-400 to-sage-400 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-serif text-2xl tracking-tight font-medium text-neutral-900 dark:text-neutral-100">
                Glow<span className="text-blush-500 font-semibold italic">Nest</span>
              </span>
            </Link>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Empowering personalized skincare through intelligent cosmetic analysis, clean formulations, and barrier-first regimens.
            </p>
            <div className="flex items-center gap-4 text-xs font-medium text-neutral-700 dark:text-neutral-300">
              <span className="flex items-center gap-1"><Leaf className="w-3.5 h-3.5 text-sage-500" /> Clean</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> Cruelty-Free</span>
              <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Tested</span>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-3 tracking-wide">
              Skin Intelligence
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/analyze" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Facial Photo Analysis
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Holistic Skin Quiz
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Skin Progress Tracking
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Personalized Formulas
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources & Guides */}
          <div>
            <h4 className="font-serif text-sm font-semibold text-neutral-900 dark:text-neutral-200 mb-3 tracking-wide">
              Education & Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/blog" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Skincare Journal
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Contact Care Team
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Facial Data Privacy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-blush-500 dark:hover:text-blush-400 transition">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Transparency */}
          <div className="bg-white/60 dark:bg-neutral-800/60 p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-700/60 text-[11px] leading-relaxed">
            <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
              Cosmetic Assessment Notice
            </p>
            <p className="text-neutral-500 dark:text-neutral-400">
              GlowNest assessments are cosmetic evaluations only and never constitute medical diagnoses. Phase 1 operates in Demonstration Mode with simulated scores. Consult a board-certified dermatologist for medical concerns.
            </p>
          </div>
        </div>

        <div className="border-t border-neutral-200 dark:border-neutral-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} GlowNest Laboratory. All rights reserved.</p>
          <p className="flex items-center gap-1 text-[11px]">
            Designed with <Sparkle className="w-3 h-3 text-blush-500" /> for your healthiest glow
          </p>
        </div>
      </div>
    </footer>
  );
};

