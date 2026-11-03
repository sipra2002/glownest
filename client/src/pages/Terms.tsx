import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      <div className="space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
          User Agreement
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Terms of Service
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Last updated: November 2026 • GlowNest Platform
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed shadow-sm">
        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing or using GlowNest, you agree to comply with and be bound by these Terms of Service. If you do not agree, please do not access or use the services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            2. Nature of Service (Cosmetic, Non-Medical)
          </h2>
          <p>
            GlowNest provides non-medical cosmetic and beauty recommendations. The platform does not offer medical advice, dermatological diagnosis, or treatment plans for pathological skin conditions. Always consult a qualified physician or dermatologist.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            3. Phase 1 Demonstration Mode
          </h2>
          <p>
            You acknowledge that in Phase 1, skin analyses and e-commerce checkout operate in Demonstration Mode. Results represent simulated illustrative data, and checkout transactions incur zero monetary charges.
          </p>
        </section>
      </div>
    </div>
  );
};

