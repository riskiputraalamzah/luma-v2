'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore, AIAnalysisResult } from '@/store/useAppStore';
import { translations } from '@/lib/translations';

export default function AnalysisPage() {
  const router = useRouter();
  const reflectionData = useAppStore(state => state.reflectionData);
  const setAiAnalysisResult = useAppStore(state => state.setAiAnalysisResult);
  const setAnalysisLanguage = useAppStore(state => state.setAnalysisLanguage);
  const language = useAppStore(state => state.language);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const hasFetched = useRef(false);

  const t = translations[language] || translations.en;

  const LOADING_MESSAGES = [t.loading1, t.loading2, t.loading3, t.loading4, t.loading5];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [LOADING_MESSAGES.length]);

  useEffect(() => {
    if (!reflectionData) {
      router.push('/reflection');
      return;
    }

    // Prevent double-fetch in React 18+ StrictMode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const analyzeData = async () => {
      try {
        const res = await fetch('/api/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reflectionData, language }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server error (${res.status})`);
        }

        const parsed = (await res.json()) as AIAnalysisResult;
        setAiAnalysisResult(parsed);
        setAnalysisLanguage(language);
        router.push('/dashboard');
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred during analysis.');
      }
    };

    analyzeData();
  }, [reflectionData, router, setAiAnalysisResult, setAnalysisLanguage, language]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative min-h-[80vh]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12">

        {/* Orb */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-indigo-500/30"
          />
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            className="absolute inset-0 rounded-full border border-indigo-400/20"
          />
          {/* Core */}
          <div className="w-16 h-16 rounded-full glass-card-strong flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(99,102,241,0.3), inset 0 0 20px rgba(99,102,241,0.1)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-3 rounded-full bg-indigo-400"
              style={{ boxShadow: '0 0 12px rgba(99,102,241,0.8)' }}
            />
          </div>
        </div>

        {/* Loading message */}
        <div className="h-8 relative flex items-center justify-center min-w-[280px]">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <p className="text-red-400 text-sm max-w-sm leading-relaxed">{error}</p>
                <button
                  onClick={() => router.push('/reflection')}
                  className="text-[11px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 px-6 py-2 rounded-full"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.6 }}
                className="text-sm text-white/45 font-light tracking-wide text-center"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        {!error && (
          <div className="flex items-center gap-2">
            {LOADING_MESSAGES.map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: i === messageIndex ? 1 : 0.2, scale: i === messageIndex ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
