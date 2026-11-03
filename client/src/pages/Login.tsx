import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail, User, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, register, demoLogin } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signin') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = async () => {
    setLoading(true);
    setError(null);
    try {
      await demoLogin();
      navigate('/dashboard');
    } catch (err: any) {
      setError('Failed to login with demo credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
      <div className="text-center space-y-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blush-400 to-sage-400 flex items-center justify-center text-white mx-auto shadow-sm">
          <Sparkles className="w-5 h-5" />
        </div>
        <h1 className="font-serif text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
          {mode === 'signin' ? 'Welcome Back' : 'Join GlowNest'}
        </h1>
        <p className="text-xs text-neutral-500 font-light">
          {mode === 'signin'
            ? 'Sign in to access your saved routines and skin progress.'
            : 'Create an account to track your skin barrier journey.'}
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-neutral-100 dark:border-neutral-800 pb-2">
          <button
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 pb-2 text-xs font-semibold text-center transition border-b-2 ${
              mode === 'signin'
                ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 pb-2 text-xs font-semibold text-center transition border-b-2 ${
              mode === 'signup'
                ? 'border-neutral-900 dark:border-neutral-100 text-neutral-900 dark:text-neutral-100'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 text-xs p-3 rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Demo Fast Login Button */}
        {mode === 'signin' && (
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl space-y-2">
            <p className="text-[11px] text-amber-900 dark:text-amber-200 font-medium">
              Want to test immediately?
            </p>
            <button
              type="button"
              onClick={handleDemoFill}
              disabled={loading}
              className="w-full py-2 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 text-xs font-bold hover:bg-amber-300 transition"
            >
              Sign In as Demo User (Pooja Sharma) →
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'signup' && (
            <div className="space-y-1">
              <label className="font-semibold text-neutral-700 dark:text-neutral-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                  placeholder="Pooja Sharma"
                />
                <User className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-semibold text-neutral-700 dark:text-neutral-300">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                placeholder="name@example.com"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-neutral-700 dark:text-neutral-300">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                placeholder="••••••••"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-xs hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Create My Account'}
          </button>
        </form>
      </div>
    </div>
  );
};

