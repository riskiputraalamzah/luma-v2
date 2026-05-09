'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import { translations } from '@/lib/translations';

const BURNOUT_COLORS: Record<string, { color: string; bg: string }> = {
  Low:         { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  Rendah:      { color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
  Moderate:    { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  Sedang:      { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
  High:        { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  Tinggi:      { color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
  Critical:    { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  'Sangat Tinggi': { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

export default function DashboardPage() {
  const router = useRouter();
  const aiAnalysisResult  = useAppStore(state => state.aiAnalysisResult);
  const language          = useAppStore(state => state.language);
  const analysisLanguage  = useAppStore(state => state.analysisLanguage);
  const [mounted, setMounted]           = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [reanalyzing, setReanalyzing]   = useState(false);

  const t = translations[language] || translations.en;

  useEffect(() => {
    setMounted(true);
    if (!aiAnalysisResult) router.push('/');
  }, [aiAnalysisResult, router]);

  if (!mounted || !aiAnalysisResult) return null;

  const burnout = BURNOUT_COLORS[aiAnalysisResult.burnoutRisk] || { color: '#818cf8', bg: 'rgba(129,140,248,0.1)' };
  const languageMismatch = analysisLanguage !== null && analysisLanguage !== language;

  const handleGoToFuture = () => {
    setIsNavigating(true);
    setTimeout(() => router.push('/future'), 600);
  };

  const handleReanalyze = () => {
    setReanalyzing(true);
    setTimeout(() => router.push('/analysis'), 400);
  };

  return (
    <main className="flex-1 px-6 md:px-10 py-8 relative">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* ── Header ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/25 font-mono mb-1">{t.aiReflectionSummary}</p>
            <h1 className="text-xl font-display font-light tracking-wide text-white/90">{t.headerTitle}</h1>
          </div>
          <span className="badge">
            <span className="status-dot" />
            {t.analysisComplete}
          </span>
        </motion.div>

        {/* ── Language mismatch banner ─────────────────────── */}
        <AnimatePresence>
          {languageMismatch && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.4 }}
              className="glass-card px-5 py-4 flex items-center justify-between gap-4 border-amber-500/20 bg-amber-500/5"
              style={{ borderColor: 'rgba(245,158,11,0.2)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" style={{ boxShadow: '0 0 6px rgba(245,158,11,0.8)' }} />
                <p className="text-xs text-white/55 leading-relaxed">
                  {language === 'id'
                    ? 'Analisis ini dibuat dalam Bahasa Inggris. Analisis ulang untuk konten Bahasa Indonesia.'
                    : 'This analysis was generated in Bahasa Indonesia. Re-analyze for English content.'}
                </p>
              </div>
              <button
                onClick={handleReanalyze}
                disabled={reanalyzing}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[10px] uppercase tracking-widest transition-all duration-200 disabled:opacity-50"
              >
                {reanalyzing ? (
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                )}
                {language === 'id' ? 'Analisis Ulang' : 'Re-analyze'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Main grid ──────────────────────────────────────── */}
        <div className="flex flex-col lg:flex-row gap-5">

          {/* Left column */}
          <div className="flex-[3] flex flex-col gap-4">

            {/* Top metric cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Emotional State */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500/60 to-transparent" />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-white/35 font-mono">{t.emotionalState}</span>
                </div>
                <p className="text-xl font-display font-light text-white/90 leading-snug">{aiAnalysisResult.emotionalState}</p>
              </motion.div>

              {/* Burnout Risk */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px]" style={{ background: `linear-gradient(90deg, ${burnout.color}60, transparent)` }} />
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: burnout.color, boxShadow: `0 0 6px ${burnout.color}` }} />
                  <span className="text-[10px] uppercase tracking-widest text-white/35 font-mono">{t.burnoutRisk}</span>
                </div>
                <p className="text-2xl font-mono font-light" style={{ color: burnout.color }}>{aiAnalysisResult.burnoutRisk}</p>
              </motion.div>

              {/* Hidden Pattern */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500/50 to-transparent" />
                <span className="text-[10px] uppercase tracking-widest text-white/35 font-mono">{t.hiddenPattern}</span>
                <p className="text-base font-light text-white/80 leading-relaxed">{aiAnalysisResult.hiddenPattern}</p>
              </motion.div>

              {/* Inner Signal */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="glass-card p-6 flex flex-col gap-3 relative overflow-hidden"
                style={{ background: 'rgba(99,102,241,0.04)' }}
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-400/40 to-transparent" />
                <span className="text-[10px] uppercase tracking-widest text-white/35 font-mono">{t.innerSignal}</span>
                <p className="text-base font-display font-light italic text-white/75 leading-relaxed">{aiAnalysisResult.innerSignal}</p>
              </motion.div>
            </div>

            {/* Insights */}
            <div className="flex flex-col gap-3">
              {aiAnalysisResult.insights.map((insight, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + idx * 0.1, duration: 0.6 }}
                  className="glass-card p-5 flex items-start gap-4 group"
                >
                  <span className="flex-shrink-0 text-[10px] font-mono text-white/20 mt-0.5 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <p className="text-sm font-light text-white/55 leading-relaxed group-hover:text-white/80 transition-colors duration-300">
                    {insight}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right column */}
          <div className="flex-[2] flex flex-col gap-4">

            {/* Radar Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="glass-card p-6 flex flex-col"
            >
              <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-mono mb-4">{t.recoveryRadar}</p>
              <div className="w-full h-64 md:h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="65%" data={aiAnalysisResult.radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.06)" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: 'rgba(255,255,255,0.35)', fontSize: 9, fontFamily: 'monospace' }}
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar name="User" dataKey="A" stroke="#818cf8" strokeWidth={1.5} fill="#818cf8" fillOpacity={0.12} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* ── CTA — Parallel Future ────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
            >
              <button
                onClick={handleGoToFuture}
                disabled={isNavigating}
                className="w-full group text-left relative overflow-hidden rounded-3xl border transition-all duration-500 disabled:pointer-events-none"
                style={{
                  background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
                  borderColor: isNavigating ? 'rgba(99,102,241,0.5)' : 'rgba(99,102,241,0.2)',
                  boxShadow: isNavigating ? '0 0 40px rgba(99,102,241,0.25)' : undefined,
                }}
              >
                {/* Shimmer sweep on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none" />

                <div className="relative p-6 flex flex-col gap-4">
                  {/* Top row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" style={{ boxShadow: '0 0 6px rgba(99,102,241,0.8)' }} />
                      <span className="text-[10px] uppercase tracking-widest text-indigo-400/70 font-mono">{t.nextStep}</span>
                    </div>

                    {/* Icon / Spinner */}
                    <div className="w-9 h-9 rounded-full border border-indigo-500/30 flex items-center justify-center transition-all duration-300 group-hover:border-indigo-400/60 group-hover:bg-indigo-600/20">
                      {isNavigating ? (
                        <svg className="w-4 h-4 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-indigo-400 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                        </svg>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="text-lg font-display font-light text-white/90 mb-1.5 tracking-wide group-hover:text-white transition-colors duration-300">
                      {t.parallelFuture}
                    </h3>
                    <p className="text-xs text-white/35 leading-relaxed font-light">
                      {language === 'id'
                        ? 'Lihat dua kemungkinan masa depan — jalur saat ini vs jalur yang lebih baik — berdasarkan kebiasaanmu sekarang.'
                        : 'See two possible futures — your current path vs a better one — based on your habits right now.'}
                    </p>
                  </div>

                  {/* Mini preview pills */}
                  <div className="flex items-center gap-2 pt-1">
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-mono text-rose-400/70 border border-rose-500/20 bg-rose-500/5">
                      <span className="w-1 h-1 rounded-full bg-rose-500/60" />
                      {t.currentPath}
                    </span>
                    <span className="text-white/15 text-xs">vs</span>
                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-mono text-indigo-400/70 border border-indigo-400/20 bg-indigo-500/5">
                      <span className="w-1 h-1 rounded-full bg-indigo-400/60" />
                      {t.betterPath}
                    </span>
                  </div>
                </div>
              </button>
            </motion.div>

            {/* Restart */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="flex justify-center"
            >
              <Link href="/">
                <button className="text-[10px] uppercase tracking-widest text-white/20 hover:text-white/50 transition-colors font-mono">
                  {t.restart}
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
