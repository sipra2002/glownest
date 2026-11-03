import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import api from '../api/client';
import { DemoBanner } from '../components/common/DemoBanner';
import { DisclaimerCard } from '../components/common/DisclaimerCard';

const QUIZ_QUESTIONS = [
  {
    id: 'midday_feel',
    title: 'How does your skin typically feel around 2:00 PM?',
    subtitle: 'This helps estimate your natural lipid production rate.',
    options: [
      { label: 'Shiny and slick across my forehead, nose, and cheeks', value: 'very_oily', type: 'oily' },
      { label: 'Shiny along my T-zone, but cheeks feel normal or tight', value: 'combination', type: 'combination' },
      { label: 'Tight, flaky, or visibly dull', value: 'dry', type: 'dry' },
      { label: 'Comfortable, balanced, and neither greasy nor tight', value: 'balanced', type: 'normal' },
    ],
  },
  {
    id: 'sensitivity',
    title: 'How does your skin react to new actives or climate changes?',
    subtitle: 'Assessing your skin barrier reactivity.',
    options: [
      { label: 'Readily flushes red, stings, or burns', value: 'high_sensitivity', concern: 'redness' },
      { label: 'Occasionally reacts to strong fragrances or harsh acids', value: 'mild_sensitivity', concern: 'redness' },
      { label: 'Rarely reacts; can tolerate most topical formulas', value: 'resilient' },
    ],
  },
  {
    id: 'primary_goal',
    title: 'What is your primary skincare focal point?',
    subtitle: 'We will target this concern with active botanical extracts.',
    options: [
      { label: 'Clearing blemishes and decongesting enlarged pores', value: 'acne', concerns: ['acne', 'pores'] },
      { label: 'Fading dark spots, post-acne marks, and boosting glow', value: 'pigmentation', concerns: ['pigmentation'] },
      { label: 'Smoothing rough texture and fine lines', value: 'texture', concerns: ['texture'] },
      { label: 'Deeply restoring moisture barrier and relieving tightness', value: 'dryness', concerns: ['dryness'] },
    ],
  },
  {
    id: 'environment',
    title: 'What best describes your daily environment?',
    subtitle: 'External stressors directly affect barrier function.',
    options: [
      { label: 'Humid, hot, or tropical climate', value: 'humid' },
      { label: 'Dry indoor air conditioning or cold heating', value: 'dry_air' },
      { label: 'Urban city with high air pollution exposure', value: 'urban' },
      { label: 'Temperate / mild seasonal climate', value: 'temperate' },
    ],
  },
  {
    id: 'routine_style',
    title: 'What is your routine preference?',
    subtitle: 'Tailoring the steps for maximum consistency.',
    options: [
      { label: 'Streamlined & Fast (Cleanser + Moisturizer + SPF)', value: 'minimal' },
      { label: 'Balanced & Targeted (Cleanser + Toner + Active Serum + Moisturizer + SPF)', value: 'balanced' },
      { label: 'Comprehensive Ritual (Full layered morning & evening protocol)', value: 'ritual' },
    ],
  },
];

export const Quiz: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[currentStep];

  const handleSelect = (value: string) => {
    setAnswers((prev) => ({ ...prev, [question.id]: value }));
  };

  const handleNext = async () => {
    if (!answers[question.id]) {
      setError('Please select an option to continue.');
      return;
    }
    setError(null);

    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Final submission
      setIsSubmitting(true);
      try {
        // Collect concerns based on answers
        const selectedConcerns: string[] = [];
        if (answers.primary_goal === 'acne') selectedConcerns.push('acne', 'pores', 'oiliness');
        if (answers.primary_goal === 'pigmentation') selectedConcerns.push('pigmentation');
        if (answers.primary_goal === 'texture') selectedConcerns.push('texture');
        if (answers.primary_goal === 'dryness') selectedConcerns.push('dryness');
        if (answers.sensitivity === 'high_sensitivity') selectedConcerns.push('redness');

        const res = await api.post('/analyses/quiz', {
          quizAnswers: answers,
          selectedConcerns,
        });

        if (res.data.success) {
          navigate(`/report/${res.data.data.id}`);
        }
      } catch (err: any) {
        setIsSubmitting(false);
        setError(err.response?.data?.error?.message || 'Failed to submit quiz. Please try again.');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setError(null);
    }
  };

  const progress = ((currentStep + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
          Quiz-Based Assessment
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Find Your Skin Type & Routine
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 font-light">
          No photo required. Answer 5 quick questions for a complete cosmetic assessment.
        </p>
      </div>

      <DemoBanner />

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-neutral-500 mb-2">
          <span>Question {currentStep + 1} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Completed</span>
        </div>
        <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-blush-500 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Question Card */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            {question.title}
          </h2>
          <p className="text-xs text-neutral-500 font-light mt-1">
            {question.subtitle}
          </p>
        </div>

        <div className="space-y-3">
          {question.options.map((opt) => {
            const isSelected = answers[question.id] === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'border-blush-500 bg-blush-50/70 dark:bg-blush-950/40 text-neutral-900 dark:text-neutral-100 shadow-sm'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <span className="text-sm font-medium">{opt.label}</span>
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ml-3 ${
                    isSelected ? 'bg-blush-500 text-white' : 'border border-neutral-300 dark:border-neutral-700'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
            className={`flex items-center gap-1 text-xs font-semibold px-4 py-2 rounded-full ${
              currentStep === 0
                ? 'opacity-0 pointer-events-none'
                : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-sm"
          >
            {isSubmitting ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-blush-400" />
                Calculating Scores...
              </>
            ) : currentStep === QUIZ_QUESTIONS.length - 1 ? (
              <>
                See My Results <Sparkles className="w-4 h-4 text-blush-400" />
              </>
            ) : (
              <>
                Next Question <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>

      <DisclaimerCard />
    </div>
  );
};

