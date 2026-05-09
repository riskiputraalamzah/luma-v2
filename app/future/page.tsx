'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';

export default function FuturePage() {
  const router = useRouter();
  const aiAnalysisResult  = useAppStore(state => state.aiAnalysisResult);
  const language          = useAppStore(state => state.language);
  const analysisLanguage  = useAppStore(state => state.analysisLanguage);
  const [mounted, setMounted]             = useState(false);
  const [hoveredSide, setHoveredSide]     = useState<'left' | 'right' | null>(null);
  const [pageReady, setPageReady]         = useState(false);
  const [reanalyzing, setReanalyzing]     = useState(false);

  const t = translations[language] || translations.en;
  const languageMismatch = analysisLanguage !== null && analysisLanguage !== language;

  useEffect(() => {
    setMounted(true);
    if (!aiAnalysisResult) {
      router.push('/');
      return;
    }
    // Brief delay so enter animation feels smooth instead of instant pop
    const timer = setTimeout(() => setPageReady(true), 100);
    return () => clearTimeout(timer);
  }, [aiAnalysisResult, router]);

  const handleReanalyze = () => {
    setReanalyzing(true);
    setTimeout(() => router.push('/analysis'), 400);
  };

  if (!mounted || !aiAnalysisResult) return null;

  const { currentPath, betterPath } = aiAnalysisResult.parallelFuture;

  return (
    <main className="flex-1 flex flex-col md:flex-row relative min-h-[calc(100vh-4rem)]">

      {/* ── Page entry fade overlay ──────────────────────────── */}
      <AnimatePresence>
        {!pageReady && (
          <motion.div
            key="page-entry"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="fixed inset-0 z-50 bg-[#07080F] flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-10 h-10">
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full border border-indigo-500/40"
                />
                <div className="absolute inset-2 rounded-full bg-indigo-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
                </div>
              </div>
              <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{t.parallelFuture}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Language mismatch banner ─────────────────────────── */}
      <AnimatePresence>
        {languageMismatch && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-40 w-auto max-w-md"
          >
            <div className="glass px-5 py-3 flex items-center gap-3 border-amber-500/20 bg-amber-500/5"
              style={{ borderColor: 'rgba(245,158,11,0.2)' }}>
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.8)' }} />
              <p className="text-xs text-white/50 leading-relaxed">
                {language === 'id' ? 'Konten dibuat dalam Bahasa Inggris.' : 'Content was generated in Bahasa Indonesia.'}
              </p>
              <button
                onClick={handleReanalyze}
                disabled={reanalyzing}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] uppercase tracking-widest transition-all duration-200 disabled:opacity-50"
              >
                {reanalyzing ? (
                  <svg className="w-2.5 h-2.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                )}
                {language === 'id' ? 'Analisis Ulang' : 'Re-analyze'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Dynamic background overlays ─────────────────────── */}
      <AnimatePresence>
        {hoveredSide === 'left' && (
          <motion.div
            key="left-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse at 25% 50%, rgba(239,68,68,0.08) 0%, transparent 70%)' }}
          />
        )}
        {hoveredSide === 'right' && (
          <motion.div
            key="right-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ background: 'radial-gradient(ellipse at 75% 50%, rgba(99,102,241,0.1) 0%, transparent 70%)' }}
          />
        )}
      </AnimatePresence>

      {/* ── Top label — center ──────────────────────────────── */}
      <div className="absolute top-0 inset-x-0 z-30 flex justify-center pt-6 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="glass px-8 py-3"
        >
          <p className="text-xs font-light text-white/50 tracking-widest text-center italic">{t.futureQuote}</p>
        </motion.div>
      </div>

      {/* ── Vertical Divider ────────────────────────────────── */}
      <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-white/[0.06] z-20 -translate-x-1/2 overflow-hidden">
        <motion.div
          animate={{ y: ['-100%', '200%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          className="w-full h-32 bg-gradient-to-b from-transparent via-indigo-400/60 to-transparent blur-[1px]"
        />
      </div>

      {/* ── LEFT: Current Path ──────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center p-10 md:p-16 lg:p-20 relative z-10 overflow-hidden border-b md:border-b-0 md:border-r border-white/[0.06] min-h-[50vh]"
        onMouseEnter={() => setHoveredSide('left')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{
            opacity: hoveredSide === 'right' ? 0.35 : 1,
            x: 0,
          }}
          transition={{ duration: 0.6 }}
          className="max-w-lg"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-rose-500" style={{ boxShadow: '0 0 8px rgba(244,63,94,0.8)' }} />
            <span className="text-[10px] uppercase tracking-[0.35em] text-rose-500/70 font-mono">{t.theTrajectory}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight text-white/85 mb-10 leading-tight italic">
            {currentPath.title}
          </h2>

          {/* Items */}
          <ul className="flex flex-col gap-5">
            {currentPath.descriptions.map((desc, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                className="flex items-start gap-4 pb-5 border-b border-white/[0.06] last:border-0 last:pb-0"
              >
                <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500/50" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <span className="text-sm font-light text-white/55 leading-relaxed">{desc}</span>
                  <span className="flex-shrink-0 text-[9px] font-mono text-rose-400/70 border border-rose-500/20 px-2 py-0.5 rounded uppercase tracking-wider mt-0.5">
                    {t.warning}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Ambient hover effect */}
        <AnimatePresence>
          {hoveredSide === 'left' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(239,68,68,0.06) 0%, transparent 70%)' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── RIGHT: Better Path ──────────────────────────────── */}
      <div
        className="flex-1 flex flex-col justify-center p-10 md:p-16 lg:p-20 relative z-10 overflow-hidden min-h-[50vh]"
        onMouseEnter={() => setHoveredSide('right')}
        onMouseLeave={() => setHoveredSide(null)}
      >
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{
            opacity: hoveredSide === 'left' ? 0.35 : 1,
            x: 0,
          }}
          transition={{ duration: 0.6 }}
          className="max-w-lg ml-auto"
        >
          {/* Label */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 8px rgba(99,102,241,0.8)' }} />
            <span className="text-[10px] uppercase tracking-[0.35em] text-indigo-400/70 font-mono">{t.theIntentional}</span>
          </div>

          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight text-white/90 mb-10 leading-tight">
            {betterPath.title}
          </h2>

          {/* Items */}
          <ul className="flex flex-col gap-5">
            {betterPath.descriptions.map((desc, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.12, duration: 0.5 }}
                className="flex items-start gap-4 pb-5 border-b border-white/[0.06] last:border-0 last:pb-0"
              >
                <span className="flex-shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400/50" />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <span className="text-sm font-light text-white/70 leading-relaxed">{desc}</span>
                  <span className="flex-shrink-0 text-[9px] font-mono text-indigo-400/70 border border-indigo-400/20 px-2 py-0.5 rounded uppercase tracking-wider mt-0.5">
                    {t.optimal}
                  </span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Ambient hover effect */}
        <AnimatePresence>
          {hoveredSide === 'right' && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.07) 0%, transparent 70%)' }}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ── Bottom CTA ──────────────────────────────────────── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <Link href="/">
            <button className="flex items-center gap-2.5 px-7 py-3 glass rounded-full text-[10px] uppercase tracking-widest text-white/35 hover:text-white/70 transition-all duration-300 hover:border-white/20 hover:bg-white/5">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
              {t.restart}
            </button>
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
