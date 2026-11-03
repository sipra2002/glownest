import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../api/client';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post('/support', formData);
      if (res.data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to send message.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs uppercase tracking-widest font-bold text-sage-600 dark:text-sage-400">
          Client Care
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          We're Here For Your Glow
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-light">
          Have questions about ingredient compatibility, analysis results, or orders? Drop us a note.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <Mail className="w-5 h-5 text-blush-500" />
            <h3 className="font-serif font-semibold text-sm">Email Us</h3>
            <p className="text-xs text-neutral-500 font-light">support@glownest.com</p>
            <p className="text-[11px] text-neutral-400">Response within 24 hours</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <Phone className="w-5 h-5 text-sage-500" />
            <h3 className="font-serif font-semibold text-sm">Call Our Specialists</h3>
            <p className="text-xs text-neutral-500 font-light">+91 (800) 456-7890</p>
            <p className="text-[11px] text-neutral-400">Mon - Sat: 9:00 AM - 6:00 PM IST</p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-2">
            <MapPin className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-semibold text-sm">Botanical Laboratory</h3>
            <p className="text-xs text-neutral-500 font-light">
              GlowNest R&D Center, Brigade Gateway, Bengaluru, Karnataka, India
            </p>
          </div>
        </div>

        {/* Message Form */}
        <div className="md:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-serif text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
                Message Sent!
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Thank you for reaching out. One of our skincare specialists will reply to your email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-full border border-neutral-300 text-xs font-semibold"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {error && (
                <div className="bg-rose-50 text-rose-700 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">Your Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                    placeholder="Pooja Sharma"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-neutral-700 dark:text-neutral-300">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                    placeholder="pooja@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Subject</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                  placeholder="Routine consultation / Order inquiry"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-neutral-700 dark:text-neutral-300">Message</label>
                <textarea
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-blush-500"
                  placeholder="Tell us about your skin concerns or questions..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-xs hover:bg-neutral-800 transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5 text-blush-400" />
                {submitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

