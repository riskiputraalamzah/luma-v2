'use client';

import { motion } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { Footer } from '@/components/Footer';

const SECTIONS = (t: typeof translations.en) => [
  {
    label: t.aboutMission,
    text: t.aboutMissionDesc,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.58-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    color: 'indigo',
  },
  {
    label: t.aboutHow,
    text: t.aboutHowDesc,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    color: 'violet',
  },
  {
    label: t.aboutPrivacy,
    text: t.aboutPrivacyDesc,
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    color: 'emerald',
  },
];

export default function AboutPage() {
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;
  const sections = SECTIONS(t);

  const colorMap: Record<string, { border: string; bg: string; text: string }> = {
    indigo: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/10', text: 'text-indigo-400' },
    violet: { border: 'border-violet-500/20', bg: 'bg-violet-500/10', text: 'text-violet-400' },
    emerald: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  };

  return (
    <main className="flex-1 flex flex-col items-center overflow-x-hidden">

      {/* Hero */}
      <section className="w-full max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="flex flex-col items-center gap-6"
        >
          <span className="badge">
            <span className="status-dot" />
            {t.aboutTitle}
          </span>
          <h1 className="text-3xl md:text-4xl font-display font-light tracking-tight text-white/85 leading-snug max-w-xl">
            {t.aboutDesc}
          </h1>
        </motion.div>
      </section>

      {/* Sections */}
      <section className="w-full max-w-3xl mx-auto px-6 pb-24 flex flex-col gap-5">
        {sections.map((section, idx) => {
          const c = colorMap[section.color];
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              className={`glass-card p-7 flex items-start gap-6 ${c.border}`}
            >
              <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.bg} ${c.text} border ${c.border}`}>
                {section.icon}
              </div>
              <div className="flex flex-col gap-1.5">
                <h3 className="text-sm font-semibold uppercase tracking-widest text-white/75">{section.label}</h3>
                <p className="text-sm text-white/40 font-light leading-relaxed">{section.text}</p>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* CTA */}
      <section className="pb-20 text-center">
        <Link href="/reflection">
          <button className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 text-white font-medium tracking-wide text-sm shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]">
            {t.startBtn}
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </Link>
      </section>

      <Footer />
    </main>
  );
}
