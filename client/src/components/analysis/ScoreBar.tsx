import React from 'react';

interface ScoreBarProps {
  concern: string;
  score: number;
  severity: string;
  note?: string;
}

export const ScoreBar: React.FC<ScoreBarProps> = ({ concern, score, severity, note }) => {
  const getBadgeStyle = () => {
    if (score >= 65) return 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200';
    if (score >= 40) return 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200';
    return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200';
  };

  const getBarStyle = () => {
    if (score >= 65) return 'bg-gradient-to-r from-rose-400 to-rose-500';
    if (score >= 40) return 'bg-gradient-to-r from-amber-400 to-amber-500';
    return 'bg-gradient-to-r from-emerald-400 to-emerald-500';
  };

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-2.5">
      <div className="flex items-center justify-between">
        <div>
          <span className="font-serif font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
            {capitalize(concern)}
          </span>
          <span className={`ml-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getBadgeStyle()}`}>
            {severity} ({score}/100)
          </span>
        </div>
      </div>

      <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getBarStyle()}`}
          style={{ width: `${score}%` }}
        />
      </div>

      {note && (
        <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
          {note}
        </p>
      )}
    </div>
  );
};

