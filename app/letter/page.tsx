'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';

export default function LetterPage() {
  const router = useRouter();
  const aiAnalysisResult = useAppStore(state => state.aiAnalysisResult);
  const reflectionData = useAppStore(state => state.reflectionData);
  const language = useAppStore(state => state.language);

  const [mounted, setMounted]   = useState(false);
  const [letter, setLetter]     = useState<string | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const hasFetched              = useRef(false);

  const t = translations[language] || translations.en;

  useEffect(() => {
    setMounted(true);
    if (!aiAnalysisResult || !reflectionData) {
      router.push('/');
      return;
    }

    // Prevent double-fetch in React Strict Mode
    if (hasFetched.current) return;
    hasFetched.current = true;

    const generateLetter = async () => {
      try {
        const res = await fetch('/api/letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reflectionData, aiAnalysisResult, language }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || `Server error (${res.status})`);
        }

        const data = await res.json();
        if (!data.letter) throw new Error('No letter generated.');

        setLetter(data.letter);
        setLoading(false);

        // Slight delay then reveal
        setTimeout(() => setRevealed(true), 300);

      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Something went wrong.');
        setLoading(false);
      }
    };

    generateLetter();
  }, [aiAnalysisResult, reflectionData, language, router]);

  if (!mounted) return null;

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-6 relative min-h-[80vh]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[300px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative z-10 w-full max-w-xl flex flex-col gap-8">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="self-start"
        >
          <Link href="/future">
            <button className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-mono flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.backToFuture}
            </button>
          </Link>
        </motion.div>

        {/* Loading state */}
        <AnimatePresence mode="wait">
          {loading && !error && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center gap-8 py-24"
            >
              {/* Orb */}
              <div className="relative w-16 h-16">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-full border border-violet-500/30"
                />
                <motion.div
                  animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeOut', delay: 0.4 }}
                  className="absolute inset-0 rounded-full border border-indigo-400/20"
                />
                <div className="absolute inset-3 rounded-full glass-card-strong flex items-center justify-center"
                  style={{ boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}
                >
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-2 h-2 rounded-full bg-violet-400"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center gap-2 text-center">
                <p className="text-sm text-white/45 font-light tracking-wide">{t.letterLoading}</p>
                <p className="text-[11px] text-white/20 font-mono">{t.letterLoadingDetail}</p>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-4 py-24 text-center"
            >
              <p className="text-sm text-red-400/80">{error}</p>
              <button
                onClick={() => router.push('/future')}
                className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-mono"
              >
                {t.backToFuture}
              </button>
            </motion.div>
          )}

          {/* Letter revealed */}
          {letter && revealed && (
            <motion.div
              key="letter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-10"
            >
              {/* Header */}
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex items-center gap-2"
                >
                  <span className="status-dot" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/30">{t.letterFrom}</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl md:text-3xl font-display font-light tracking-tight text-white/85"
                >
                  {t.letterPageTitle}
                </motion.h1>
              </div>

              {/* Divider */}
              <div className="divider" />

              {/* Letter text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 1 }}
                className="flex flex-col gap-6"
              >
                {letter.split('\n\n').filter(p => p.trim()).map((paragraph, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.2, duration: 0.8, ease: 'easeOut' }}
                    className={`font-light leading-[1.85] ${
                      i === letter.split('\n\n').filter(p => p.trim()).length - 1
                        ? 'text-white/90 text-base font-display italic'
                        : 'text-white/60 text-sm md:text-base'
                    }`}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </motion.div>

              {/* Divider */}
              <div className="divider" />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="flex items-center justify-between"
              >
                <Link href="/">
                  <button className="text-xs text-white/25 hover:text-white/55 transition-colors font-mono uppercase tracking-widest">
                    {t.restart}
                  </button>
                </Link>

                <Link href="/dashboard">
                  <button className="flex items-center gap-2 px-5 py-2.5 glass-card hover:border-indigo-500/30 transition-all duration-300 text-xs text-white/50 hover:text-white/80 rounded-xl tracking-wide">
                    {t.backToDashboard}
                  </button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
