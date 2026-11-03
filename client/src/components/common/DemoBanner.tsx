import React from 'react';
import { Sparkles, Info } from 'lucide-react';

interface DemoBannerProps {
  text?: string;
  subtext?: string;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  text = 'Demo results – sample data, not a real AI analysis',
  subtext = 'GlowNest Phase 1 generates illustrative skincare metrics. A real vision AI provider will be connected in Phase 2.',
}) => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3.5 sm:p-4 my-4 flex items-start gap-3 shadow-sm">
      <div className="p-1.5 bg-amber-100 dark:bg-amber-900/60 rounded-lg text-amber-800 dark:text-amber-300 mt-0.5">
        <Sparkles className="w-4 h-4" />
      </div>
      <div className="flex-1 text-sm">
        <span className="font-semibold text-amber-900 dark:text-amber-200 block">
          {text}
        </span>
        <span className="text-amber-700/90 dark:text-amber-300/80 text-xs mt-0.5 block">
          {subtext}
        </span>
      </div>
    </div>
  );
};

