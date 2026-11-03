import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Clock,
  Sparkles,
  TrendingDown,
  ShoppingBag,
  Trash2,
  Calendar,
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { DemoBanner } from '../components/common/DemoBanner';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'history' | 'compare' | 'progress' | 'orders'>('history');
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Compare state
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [comparing, setComparing] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [analysesRes, progressRes, ordersRes] = await Promise.all([
        api.get('/analyses/mine'),
        api.get('/analyses/progress'),
        api.get('/orders/mine'),
      ]);

      if (analysesRes.data.success) {
        setAnalyses(analysesRes.data.data);
        if (analysesRes.data.data.length >= 2) {
          setCompareA(analysesRes.data.data[0].id);
          setCompareB(analysesRes.data.data[1].id);
        }
      }
      if (progressRes.data.success) setProgressData(progressRes.data.data);
      if (ordersRes.data.success) setOrders(ordersRes.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRunComparison = async () => {
    if (!compareA || !compareB) return;
    setComparing(true);
    try {
      const res = await api.get(`/analyses/compare?a=${compareA}&b=${compareB}`);
      if (res.data.success) {
        setComparisonResult(res.data.data);
      }
    } catch (err) {
      console.error('Comparison error:', err);
    } finally {
      setComparing(false);
    }
  };

  const handleDeleteAnalysis = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this analysis report and associated facial image?')) return;
    try {
      await api.delete(`/analyses/${id}`);
      setAnalyses((prev) => prev.filter((a) => a.id !== id));
      if (comparisonResult && (compareA === id || compareB === id)) {
        setComparisonResult(null);
      }
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
            Personal Skin Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
            Hello, {user ? user.name.split(' ')[0] : 'Guest'}
          </h1>
          <p className="text-xs text-neutral-500 font-light mt-0.5">
            Monitor your skin barrier progress and review custom regimens.
          </p>
        </div>

        <Link
          to="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 transition shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-blush-400" />
          New Skin Analysis
        </Link>
      </div>

      <DemoBanner />

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('history')}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
            activeTab === 'history'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Analysis History ({analyses.length})
        </button>
        <button
          onClick={() => setActiveTab('progress')}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
            activeTab === 'progress'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Progress Trends
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
            activeTab === 'compare'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Compare Reports
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-full transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
              : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {/* Tab: Analysis History */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {analyses.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-neutral-400 mx-auto" />
              <h3 className="font-serif text-lg font-semibold text-neutral-800 dark:text-neutral-200">
                No Skin Analyses Found
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Complete a photo analysis or take our 5-question skin quiz to generate your first cosmetic assessment.
              </p>
              <Link
                to="/analyze"
                className="inline-block px-5 py-2 rounded-full bg-neutral-900 text-white text-xs font-semibold"
              >
                Analyze Skin Now →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analyses.map((a) => (
                <div
                  key={a.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-500 uppercase tracking-wider text-[10px]">
                        {new Date(a.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold uppercase">
                        {a.mode} mode
                      </span>
                    </div>

                    <h4 className="font-serif text-base font-semibold text-neutral-900 dark:text-neutral-100 capitalize">
                      {a.skinTypeEstimate} Skin Assessment ({a.source})
                    </h4>

                    {/* Concern pills */}
                    <div className="flex flex-wrap gap-1">
                      {a.selectedConcerns?.map((c: string) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-[10px] text-neutral-600 dark:text-neutral-400 capitalize"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
                    <Link
                      to={`/report/${a.id}`}
                      className="text-xs font-semibold text-blush-600 dark:text-blush-400 hover:underline flex items-center gap-1"
                    >
                      View Full Report <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <button
                      onClick={() => handleDeleteAnalysis(a.id)}
                      className="text-neutral-400 hover:text-rose-500 p-1"
                      title="Delete Report"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Progress Trends */}
      {activeTab === 'progress' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Skin Concern Evolution (0–100 Scale)
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Tracking cosmetic scores across your assessments. Downward trajectories signify clearer skin.
            </p>
          </div>

          {progressData.length < 2 ? (
            <div className="p-12 text-center text-xs text-neutral-500 space-y-2">
              <p>You need at least 2 analysis reports to generate a meaningful progress curve.</p>
              <Link to="/analyze" className="text-blush-600 font-semibold hover:underline">
                Run another assessment →
              </Link>
            </div>
          ) : (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="acne" stroke="#E68CA0" strokeWidth={2} name="Acne" />
                  <Line type="monotone" dataKey="pigmentation" stroke="#84A485" strokeWidth={2} name="Pigmentation" />
                  <Line type="monotone" dataKey="texture" stroke="#D5B47B" strokeWidth={2} name="Texture" />
                  <Line type="monotone" dataKey="pores" stroke="#6366f1" strokeWidth={2} name="Pores" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Tab: Compare Reports */}
      {activeTab === 'compare' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Side-by-Side Report Comparison
            </h3>
            <p className="text-xs text-neutral-500 font-light mt-0.5">
              Select two past assessments to measure cosmetic delta improvements.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Baseline Assessment (Report A):
              </label>
              <select
                value={compareA}
                onChange={(e) => setCompareA(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="">Select report</option>
                {analyses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {new Date(a.createdAt).toLocaleDateString()} - {a.skinTypeEstimate} ({a.source})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 block mb-1">
                Current Assessment (Report B):
              </label>
              <select
                value={compareB}
                onChange={(e) => setCompareB(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800"
              >
                <option value="">Select report</option>
                {analyses.map((a) => (
                  <option key={a.id} value={a.id}>
                    {new Date(a.createdAt).toLocaleDateString()} - {a.skinTypeEstimate} ({a.source})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleRunComparison}
            disabled={!compareA || !compareB || compareA === compareB}
            className="px-6 py-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 disabled:opacity-50"
          >
            {comparing ? 'Analyzing Deltas...' : 'Compare Two Reports'}
          </button>

          {comparisonResult && (
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
              <h4 className="font-serif text-base font-semibold text-neutral-900 dark:text-neutral-100">
                Comparison Findings:
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                {comparisonResult.deltas.map((d: any) => (
                  <div
                    key={d.concern}
                    className="p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 space-y-1"
                  >
                    <div className="flex justify-between font-semibold capitalize">
                      <span>{d.concern}</span>
                      <span className={d.improved ? 'text-emerald-600' : 'text-neutral-500'}>
                        {d.delta < 0 ? `${d.delta} pts (Smoother)` : `+${d.delta} pts`}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Baseline: {d.reportAScore} → Current: {d.reportBScore}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-12 text-center space-y-3">
              <ShoppingBag className="w-8 h-8 text-neutral-400 mx-auto" />
              <p className="font-serif text-lg text-neutral-800 dark:text-neutral-200">No Orders Yet</p>
              <Link to="/shop" className="text-xs font-semibold text-blush-600 hover:underline">
                Explore Botanical Shop →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((o) => (
                <div
                  key={o.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-neutral-900 dark:text-neutral-100 text-sm">
                        {o.orderNumber}
                      </span>
                      <span className="text-neutral-400 ml-2">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold uppercase text-[10px]">
                      {o.status} ({o.paymentMode})
                    </span>
                  </div>

                  <div className="text-xs text-neutral-600 dark:text-neutral-400">
                    <p>{o.items?.length || 1} item(s) • Total: ₹{(o.totalCents / 100).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

