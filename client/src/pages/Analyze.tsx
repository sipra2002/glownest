import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, Check, AlertCircle, Sparkles, RefreshCw, X, ShieldCheck } from 'lucide-react';
import api from '../api/client';
import { DemoBanner } from '../components/common/DemoBanner';
import { DisclaimerCard } from '../components/common/DisclaimerCard';

const CONCERN_LABELS: Record<string, { label: string; desc: string }> = {
  acne: { label: 'Acne & Blemishes', desc: 'Breakouts, blackheads, or clogged pores' },
  pigmentation: { label: 'Dark Spots & Pigmentation', desc: 'Sun spots, post-blemish marks, uneven tone' },
  texture: { label: 'Uneven Texture', desc: 'Roughness, fine lines, or bumpy surface' },
  pores: { label: 'Visible Pores', desc: 'Enlarged pore appearance on T-zone or cheeks' },
  redness: { label: 'Redness & Irritation', desc: 'Sensitivity, rosacea-like flushing, stinging' },
  dryness: { label: 'Dryness & Flaking', desc: 'Tightness, dullness, or compromised barrier' },
  oiliness: { label: 'Excess Shine & Oiliness', desc: 'Midday sebum breakthrough, shiny forehead' },
};

export const Analyze: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [consentGranted, setConsentGranted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedConcerns, setSelectedConcerns] = useState<string[]>(['acne', 'pores']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5 MB in size.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be under 5 MB in size.');
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError(null);
    }
  };

  const toggleConcern = (concern: string) => {
    setSelectedConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern]
    );
  };

  const handleAnalyze = async () => {
    if (!consentGranted) {
      setError('Please review and check the consent box to proceed with facial analysis.');
      return;
    }
    if (!selectedFile) {
      setError('Please upload or capture a clear photo of your face.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    // Progressive step simulation while calling API
    setAnalysisStep('Sanitizing photo & stripping metadata...');
    await new Promise((r) => setTimeout(r, 600));

    setAnalysisStep('Evaluating 7 key visible facial indicators...');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      formData.append('selectedConcerns', JSON.stringify(selectedConcerns));
      formData.append('retention', 'delete_after_analysis');

      const res = await api.post('/analyses/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setAnalysisStep('Constructing personalized AM/PM regimen...');
      await new Promise((r) => setTimeout(r, 500));

      if (res.data.success) {
        navigate(`/report/${res.data.data.id}`);
      }
    } catch (err: any) {
      setIsAnalyzing(false);
      setError(err.response?.data?.error?.message || 'Analysis failed. Please try another clear photo.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 sm:py-12">
      <div className="text-center space-y-2 mb-8">
        <span className="text-xs uppercase tracking-widest font-bold text-blush-600 dark:text-blush-400">
          Skin Diagnostic
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-100">
          Facial Photo Analysis
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto font-light">
          Get a detailed cosmetic assessment of visible concerns and discover your optimal botanical routine.
        </p>
      </div>

      <DemoBanner />

      {error && (
        <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3.5 rounded-xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isAnalyzing ? (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl">
          <div className="relative w-24 h-24 mx-auto">
            <div className="w-24 h-24 rounded-full border-4 border-blush-200 dark:border-blush-900 border-t-blush-500 animate-spin" />
            <Sparkles className="w-8 h-8 text-blush-500 absolute inset-0 m-auto" />
          </div>
          <div className="space-y-2">
            <h3 className="font-serif text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Analyzing Your Skin
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 animate-pulse">
              {analysisStep}
            </p>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            GlowNest securely strips all location and camera metadata prior to processing.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Step 1: Consent */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-3 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              <ShieldCheck className="w-5 h-5 text-sage-600 dark:text-sage-400" />
              <span>Step 1: Facial Image Processing Consent</span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-light">
              We respect your privacy. Uploaded photos are stripped of EXIF metadata and used solely to evaluate visible skin characteristics for cosmetic suggestions. Images are deleted immediately following analysis by default.
            </p>
            <label className="flex items-start gap-3 pt-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentGranted}
                onChange={(e) => setConsentGranted(e.target.checked)}
                className="mt-0.5 rounded border-neutral-300 text-blush-600 focus:ring-blush-500 w-4 h-4"
              />
              <span className="text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                I understand this is a cosmetic assessment (not a medical diagnosis) and consent to automated analysis of my facial photo.
              </span>
            </label>
          </div>

          {/* Step 2: Image Uploader */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              Step 2: Upload or Capture Clear Selfie
            </h3>

            {previewUrl ? (
              <div className="relative aspect-[4/3] sm:aspect-[16/9] max-w-md mx-auto rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl(null);
                  }}
                  className="absolute top-3 right-3 p-2 bg-neutral-900/80 text-white rounded-full hover:bg-neutral-900"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-2xl p-8 sm:p-12 text-center hover:border-blush-400 transition-colors bg-cream-50/50 dark:bg-neutral-900/50 cursor-pointer"
                onClick={() => document.getElementById('photoInput')?.click()}
              >
                <div className="w-12 h-12 rounded-full bg-cream-200/80 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-600 dark:text-neutral-300 mb-3">
                  <Upload className="w-6 h-6 text-blush-500" />
                </div>
                <p className="font-serif text-base font-semibold text-neutral-800 dark:text-neutral-200">
                  Drag and drop your photo here, or click to browse
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  Supports JPEG, PNG, WebP up to 5 MB
                </p>

                <input
                  id="photoInput"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>
            )}
          </div>

          {/* Step 3: Concern Selector */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                Step 3: What are your primary skin concerns?
              </h3>
              <p className="text-xs text-neutral-500 font-light mt-0.5">
                Select any areas you would like the recommendation engine to prioritize.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {Object.entries(CONCERN_LABELS).map(([key, info]) => {
                const isSelected = selectedConcerns.includes(key);
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => toggleConcern(key)}
                    className={`p-3 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'border-blush-400 bg-blush-50/70 dark:bg-blush-950/40 text-neutral-900 dark:text-neutral-100 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center text-white ${
                        isSelected ? 'bg-blush-500' : 'border border-neutral-300 dark:border-neutral-700'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <p className="text-xs font-semibold">{info.label}</p>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-light mt-0.5">
                        {info.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit CTA */}
          <div className="pt-2">
            <button
              onClick={handleAnalyze}
              className="w-full py-4 rounded-full bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-blush-400" />
              Generate My Skin Report
            </button>
          </div>

          <DisclaimerCard />
        </div>
      )}
    </div>
  );
};
