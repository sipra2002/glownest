import React from 'react';
import { AlertCircle } from 'lucide-react';

export const DisclaimerCard: React.FC = () => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-4 my-4 flex items-start gap-3 text-xs text-neutral-600 dark:text-neutral-400">
      <AlertCircle className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-neutral-800 dark:text-neutral-200 mb-0.5">
          Cosmetic Assessment Disclaimer
        </p>
        <p>
          AI-generated cosmetic assessment, not a medical diagnosis. GlowNest does not detect diseases, infections, or pathological skin conditions. Always consult a certified dermatologist or healthcare professional for medical concerns.
        </p>
      </div>
    </div>
  );
};

