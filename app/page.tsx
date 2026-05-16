'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { Footer } from '@/components/Footer';

const FEATURE_ITEMS = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    colorClass: 'text-rose-400',
    bgClass: 'bg-rose-500/10 border-rose-500/20',
    glowClass: 'group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    colorClass: 'text-amber-400',
    bgClass: 'bg-amber-500/10 border-amber-500/20',
    glowClass: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
    colorClass: 'text-indigo-400',
    bgClass: 'bg-indigo-500/10 border-indigo-500/20',
    glowClass: 'group-hover:shadow-[0_0_30px_rgba(99,102,241,0.15)]',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    colorClass: 'text-violet-400',
    bgClass: 'bg-violet-500/10 border-violet-500/20',
    glowClass: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]',
  },
];

const STEP_ICONS = [
  <svg key="s1" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>,
  <svg key="s2" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
  </svg>,
  <svg key="s3" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
  </svg>,
];

export default function LandingPage() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;

  const features = [
    { title: t.emotionalFatigue, desc: t.emotionalFatigueDesc, ...FEATURE_ITEMS[0] },
    { title: t.digitalOverload, desc: t.digitalOverloadDesc, ...FEATURE_ITEMS[1] },
    { title: t.disconnectedRoutines, desc: t.disconnectedRoutinesDesc, ...FEATURE_ITEMS[2] },
    { title: t.hiddenBurnout, desc: t.hiddenBurnoutDesc, ...FEATURE_ITEMS[3] },
  ];

  const steps = [
    { num: '01', title: t.step1Title, desc: t.step1Desc, color: 'indigo' },
    { num: '02', title: t.step2Title, desc: t.step2Desc, color: 'violet' },
    { num: '03', title: t.step3Title, desc: t.step3Desc, color: 'emerald' },
  ];

  const stats = [
    { value: t.problemStat1, label: t.problemStat1Desc },
    { value: t.problemStat2, label: t.problemStat2Desc },
    { value: t.problemStat3, label: t.problemStat3Desc },
  ];

  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden">

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="w-full flex flex-col items-center justify-center text-center px-6 pt-24 pb-32 relative min-h-[85vh]">

        {/* Soft center glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(99,102,241,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <span className="badge">
            <span className="status-dot" />
            AI Reflection Companion
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
          className="max-w-4xl"
        >
          <h1 className="font-display font-light text-5xl md:text-7xl lg:text-8xl tracking-tight leading-[1.05] mb-6">
            <span className="gradient-text">{t.hero}</span>
          </h1>
          <p className="text-base md:text-lg text-white/45 max-w-xl mx-auto leading-relaxed font-light tracking-wide">
            {t.subhero}
          </p>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10"
        >
          <Link href="/reflection">
            <button className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 text-white font-medium tracking-wide text-sm shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]">
              {t.startBtn}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-white/20" />
        </motion.div>
      </section>

      {/* ── Problem / Stats Section ─────────────────────────── */}
      <section className="w-full max-w-5xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-rose-400/50 mb-3">{t.problemTitle}</p>
          <p className="text-lg md:text-xl font-display font-light text-white/75 italic">{t.problemTagline}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {stats.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.7 }}
              className="glass-card p-8 text-center group hover:border-rose-500/15 transition-all duration-500"
            >
              <p className="text-4xl md:text-5xl font-display font-light gradient-text mb-3">{stat.value}</p>
              <p className="text-xs text-white/35 font-light leading-relaxed">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────── */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="mb-12 text-center"
        >
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/25">{t.whatLumaSees}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.7, ease: 'easeOut' }}
              className={`glass-card group p-7 flex flex-col gap-5 cursor-default transition-all duration-500 ${item.glowClass}`}
            >
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.bgClass} ${item.colorClass} flex-shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                {item.icon}
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-widest text-white/80 mb-1.5">{item.title}</h4>
                <p className="text-xs text-white/35 leading-relaxed font-light">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works Section ──────────────────────────────── */}
      <section className="w-full max-w-4xl mx-auto px-6 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] font-mono tracking-[0.4em] uppercase text-white/25 mb-3">{t.howItWorks}</p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {steps.map((step, idx) => {
            const colors: Record<string, { border: string; icon: string; glow: string }> = {
              indigo: { border: 'border-indigo-500/20', icon: 'text-indigo-400 bg-indigo-500/10', glow: 'rgba(99,102,241,0.15)' },
              violet: { border: 'border-violet-500/20', icon: 'text-violet-400 bg-violet-500/10', glow: 'rgba(139,92,246,0.15)' },
              emerald: { border: 'border-emerald-500/20', icon: 'text-emerald-400 bg-emerald-500/10', glow: 'rgba(52,211,153,0.15)' },
            };
            const c = colors[step.color];
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.7 }}
                className={`glass-card p-7 flex items-start gap-6 group hover:shadow-[0_0_30px_${c.glow}] transition-all duration-500 ${c.border}`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.icon} border ${c.border}`}>
                  {STEP_ICONS[idx]}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/20 tracking-widest">{step.num}</span>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-white/80">{step.title}</h3>
                  </div>
                  <p className="text-sm text-white/40 font-light leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA after steps */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="text-center mt-12"
        >
          <Link href="/reflection">
            <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 text-white font-medium tracking-wide text-sm shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]">
              {t.startBtn}
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </Link>
        </motion.div>
      </section>

      {/* ── Footer Quote ─────────────────────────────────────── */}
      <motion.div
        className="pb-20 text-center"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3, duration: 1.5 }}
      >
        <div className="divider w-24 mx-auto mb-8" />
        <p className="text-[11px] text-white/20 font-mono tracking-[0.5em] uppercase">{t.mirrorText}</p>
      </motion.div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <Footer />
    </main>
  );
}
