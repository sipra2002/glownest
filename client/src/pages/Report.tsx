import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Sun,
  Moon,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  ChevronRight,
  Share2
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { DemoBanner } from '../components/common/DemoBanner';
import { DisclaimerCard } from '../components/common/DisclaimerCard';
import { ScoreBar } from '../components/analysis/ScoreBar';

export const Report: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'AM' | 'PM'>('AM');
  const [addedRoutine, setAddedRoutine] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/analyses/${id}`)
      .then((res) => {
        if (res.data.success) {
          setReport(res.data.data);
        }
      })
      .catch((err) => {
        setError(err.response?.data?.error?.message || 'Report could not be retrieved.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-blush-200 border-t-blush-500 animate-spin mx-auto" />
        <p className="font-serif text-lg text-neutral-800 dark:text-neutral-200">
          Compiling your personalized skin analysis...
        </p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-rose-600 font-serif text-xl">Report Not Found</p>
        <p className="text-xs text-neutral-500">{error || 'This report may have been deleted or expired.'}</p>
        <Link
          to="/analyze"
          className="inline-block px-6 py-2.5 rounded-full bg-neutral-900 text-white text-xs font-semibold"
        >
          Start New Analysis →
        </Link>
      </div>
    );
  }

  // Radar chart data formatted for Recharts
  const radarData = report.scores.map((s: any) => ({
    concern: s.concern.charAt(0).toUpperCase() + s.concern.slice(1),
    score: s.score,
    fullMark: 100,
  }));

  const steps = report.routine?.steps || [];
  const amSteps = steps.filter((s: any) => s.period === 'AM');
  const pmSteps = steps.filter((s: any) => s.period === 'PM');
  const currentRoutineSteps = activeTab === 'AM' ? amSteps : pmSteps;

  const handleAddAllToCart = () => {
    steps.forEach((step: any) => {
      if (step.product) {
        addItem(step.product);
      }
    });
    setAddedRoutine(true);
    setTimeout(() => setAddedRoutine(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Header Info */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage-100 dark:bg-sage-950/60 text-sage-800 dark:text-sage-300 text-xs font-semibold uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          {report.source === 'image' ? 'Facial Photo Assessment' : 'Holistic Quiz Assessment'}
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 dark:text-neutral-100">
          Your Personalized Skin Report
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          Generated on {new Date(report.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {report.mode === 'demo' && <DemoBanner />}

      {/* Summary Box */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase tracking-widest text-neutral-500 font-medium">Estimated Profile</span>
            <span className="px-3 py-1 rounded-full bg-blush-100 dark:bg-blush-950/60 text-blush-700 dark:text-blush-300 text-xs font-bold uppercase tracking-wider">
              {report.skinTypeEstimate} Skin
            </span>
          </div>
          <h2 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Balanced Lipid & Barrier Insights
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed">
            {report.summary}
          </p>
        </div>

        {/* Radar Chart */}
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
              <PolarGrid stroke="#e5e7eb" />
              <PolarAngleAxis dataKey="concern" tick={{ fontSize: 10, fill: '#6b7280' }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar
                name="Score"
                dataKey="score"
                stroke="#E68CA0"
                fill="#F0B8C1"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Section: Visible Concern Breakdown */}
      <div className="space-y-4">
        <div>
          <h3 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
            Visible Concern Metrics
          </h3>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Evaluated on a standard 0–100 scale (lower scores indicate clearer, balanced areas).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.scores.map((s: any) => (
            <ScoreBar
              key={s.id}
              concern={s.concern}
              score={s.score}
              severity={s.severity}
              note={s.note}
            />
          ))}
        </div>
      </div>

      {/* Section: AM / PM Custom Routine */}
      {report.routine && (
        <div className="bg-cream-100/70 dark:bg-neutral-900/40 border border-cream-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
                Custom Formulation Match
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mt-1">
                Your Recommended Daily Regimen
              </h3>
            </div>

            <button
              onClick={handleAddAllToCart}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-sm self-start sm:self-auto"
            >
              {addedRoutine ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" /> Routine Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-blush-400" /> Add Entire Routine to Bag
                </>
              )}
            </button>
          </div>

          {/* AM / PM Toggle */}
          <div className="flex items-center gap-2 border-b border-cream-200 dark:border-neutral-800 pb-4">
            <button
              onClick={() => setActiveTab('AM')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition ${
                activeTab === 'AM'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-cream-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Sun className="w-4 h-4 text-amber-400" /> Morning Regimen ({amSteps.length} Steps)
            </button>
            <button
              onClick={() => setActiveTab('PM')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold transition ${
                activeTab === 'PM'
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'text-neutral-600 dark:text-neutral-400 hover:bg-cream-200/60 dark:hover:bg-neutral-800'
              }`}
            >
              <Moon className="w-4 h-4 text-indigo-400" /> Evening Regimen ({pmSteps.length} Steps)
            </button>
          </div>

          {/* Steps Timeline Cards */}
          <div className="space-y-4">
            {currentRoutineSteps.map((step: any) => (
              <div
                key={step.id}
                className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-cream-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {step.stepOrder}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-sage-600 dark:text-sage-400 block">
                      Step {step.stepOrder}: {step.stepType}
                    </span>
                    <h4 className="font-serif text-base font-semibold text-neutral-900 dark:text-neutral-100">
                      {step.product?.name || 'Targeted Cleanser'}
                    </h4>
                    <p className="text-xs text-neutral-500 font-light">
                      {step.instructions}
                    </p>
                  </div>
                </div>

                {step.product && (
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-neutral-100 dark:border-neutral-800">
                    <div className="text-right">
                      <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
                        ₹{(step.product.priceCents / 100).toLocaleString('en-IN')}
                      </p>
                      <span className="text-[10px] text-emerald-600 font-medium">In Stock</span>
                    </div>

                    <button
                      onClick={() => addItem(step.product)}
                      className="px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-blush-400" />
                      Add to Bag
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Dashboard Saving CTAs */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div>
          <h4 className="font-serif text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Track Your Progress Over Time
          </h4>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Log in to save this analysis to your profile and track barrier recovery trends.
          </p>
        </div>
        <Link
          to="/dashboard"
          className="px-6 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition"
        >
          View in Dashboard →
        </Link>
      </div>

      <DisclaimerCard />
    </div>
  );
};

