'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useRouter } from 'next/navigation';
import { useAppStore, ReflectionData } from '@/store/useAppStore';
import { translations } from '@/lib/translations';

// ── Cinematic Slider ─────────────────────────────────────────
const CinematicSlider = ({
  value, min, max, onChange,
}: {
  value: number; min: number; max: number; onChange: (val: number) => void;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const updateValue = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const newPerc = x / rect.width;
    const val = Math.round(min + newPerc * (max - min));
    onChange(val);
  }, [min, max, onChange]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => { if (isDragging) updateValue(e.clientX); };
    const handleUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('pointermove', handleMove);
      document.addEventListener('pointerup', handleUp);
    }
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
  }, [isDragging, updateValue]);

  const percentage = ((value - min) / (max - min)) * 100;
  const isWarm = percentage < 50;
  const fillColor = isWarm ? 'rgba(251,146,60,0.9)' : 'rgba(99,102,241,0.9)';
  const glowColor = isWarm ? 'rgba(251,146,60,0.4)' : 'rgba(99,102,241,0.4)';
  const thumbColor = isWarm ? '#fb923c' : '#818cf8';

  return (
    <div
      ref={containerRef}
      className="relative w-full h-14 flex items-center cursor-grab active:cursor-grabbing touch-none select-none"
      onPointerDown={(e) => { setIsDragging(true); updateValue(e.clientX); }}
    >
      {/* Track background */}
      <div className="absolute inset-x-0 h-[3px] bg-white/8 rounded-full">
        {/* Fill */}
        <motion.div
          className="absolute left-0 top-0 bottom-0 rounded-full"
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          style={{ background: fillColor }}
        />
        {/* Glow on fill */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-6 rounded-full pointer-events-none"
          animate={{ width: `${percentage}%` }}
          transition={{ type: 'spring', damping: 30, stiffness: 400 }}
          style={{ background: `linear-gradient(90deg, transparent, ${glowColor})`, filter: 'blur(8px)' }}
        />
      </div>

      {/* Thumb */}
      <motion.div
        className="absolute w-7 h-7 rounded-full -translate-x-1/2 flex items-center justify-center"
        animate={{ left: `${percentage}%`, scale: isDragging ? 1.2 : 1 }}
        transition={{ type: 'spring', damping: 30, stiffness: 400 }}
        style={{
          background: 'rgba(7,8,15,0.8)',
          border: `2px solid ${thumbColor}`,
          boxShadow: `0 0 16px ${glowColor}, 0 2px 8px rgba(0,0,0,0.5)`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="w-2 h-2 rounded-full" style={{ background: thumbColor }} />
      </motion.div>
    </div>
  );
};

// ── Main Page ────────────────────────────────────────────────
export default function ReflectionPage() {
  const router = useRouter();
  const setReflectionData = useAppStore(state => state.setReflectionData);
  const language = useAppStore(state => state.language);
  const t = translations[language] || translations.en;

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<ReflectionData>>({
    mood: 5, sleep: 6, screenTime: 8, stress: 5, energy: 5, social: 5, productivity: 5, shortText: '',
  });

  const QUESTIONS = [
    { id: 'mood', question: t.q1, type: 'slider', min: 1, max: 10, leftLabel: t.q1_min, rightLabel: t.q1_max },
    { id: 'sleep', question: t.q2, type: 'slider', min: 0, max: 12, leftLabel: t.q2_min, rightLabel: t.q2_max },
    { id: 'screenTime', question: t.q3, type: 'slider', min: 0, max: 24, leftLabel: t.q3_min, rightLabel: t.q3_max },
    { id: 'stress', question: t.q4, type: 'slider', min: 1, max: 10, leftLabel: t.q4_min, rightLabel: t.q4_max },
    { id: 'energy', question: t.q5, type: 'slider', min: 1, max: 10, leftLabel: t.q5_min, rightLabel: t.q5_max },
    { id: 'social', question: t.q6, type: 'slider', min: 1, max: 10, leftLabel: t.q6_min, rightLabel: t.q6_max },
    { id: 'productivity', question: t.q7, type: 'slider', min: 1, max: 10, leftLabel: t.q7_min, rightLabel: t.q7_max },
    { id: 'shortText', question: t.q8, type: 'textarea', placeholder: t.q8_placeholder },
  ];

  const totalSteps = QUESTIONS.length;
  const progressPercent = ((step) / (totalSteps - 1)) * 100;

  const nextStep = () => {
    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setReflectionData(answers as ReflectionData);
      router.push('/analysis');
    }
  };

  const prevStep = () => { if (step > 0) setStep(step - 1); };

  const currentQ = QUESTIONS[step];
  const currentValue = currentQ.type === 'slider'
    ? (answers[currentQ.id as keyof ReflectionData] as number) || (currentQ.max! / 2)
    : 5;
  const percentage = currentQ.type === 'slider'
    ? ((currentValue - currentQ.min!) / (currentQ.max! - currentQ.min!))
    : 0.5;

  return (
    <main className="flex-1 flex flex-col items-center justify-center py-16 px-6 relative min-h-[100dvh]">

      {/* Subtle reactive glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{
          background: percentage < 0.4
            ? 'radial-gradient(ellipse at 50% 60%, rgba(251,146,60,0.06) 0%, transparent 60%)'
            : 'radial-gradient(ellipse at 50% 60%, rgba(99,102,241,0.06) 0%, transparent 60%)',
        }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
      />

      {/* ── Header bar ─────────────────────────────────────── */}
      <div className="absolute top-20 left-0 right-0 px-6 md:px-12 flex items-center justify-between z-20">

        {/* Back button */}
        <button
          onClick={prevStep}
          className={`flex items-center gap-2 text-white/30 hover:text-white/70 transition-all duration-200 text-[11px] uppercase tracking-widest group ${step === 0 ? 'invisible' : ''}`}
        >
          <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {t.back}
        </button>

        {/* Step counter */}
        <span className="text-[10px] font-mono text-white/25 tracking-widest">
          {String(step + 1).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
        </span>
      </div>

      {/* ── Progress bar ───────────────────────────────────── */}
      <div className="absolute top-16 left-0 right-0 h-[2px] bg-white/[0.05]">
        <motion.div
          className="h-full bg-indigo-500"
          animate={{ width: `${step === 0 ? 4 : progressPercent}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{ boxShadow: '0 0 10px rgba(99,102,241,0.6)' }}
        />
      </div>

      {/* ── Question Content ────────────────────────────────── */}
      <div className="w-full max-w-xl relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -16, filter: 'blur(8px)' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-10"
          >
            {/* Question text */}
            <h2 className="text-2xl md:text-3xl font-display font-light text-center leading-snug text-white/85 tracking-tight">
              {currentQ.question}
            </h2>

            {/* Input card */}
            <div className="w-full glass-card p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none rounded-3xl" />

              {currentQ.type === 'slider' ? (
                <div className="flex flex-col gap-8 relative z-10">
                  {/* Value display */}
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[10px] text-white/30 uppercase tracking-widest leading-tight max-w-[90px] font-light">
                      {currentQ.leftLabel}
                    </span>
                    <motion.div
                      key={`val-${step}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl font-display font-light"
                      style={{ color: percentage < 0.4 ? '#fb923c' : '#818cf8' }}
                    >
                      {answers[currentQ.id as keyof ReflectionData]}
                    </motion.div>
                    <span className="text-[10px] text-white/30 uppercase tracking-widest leading-tight max-w-[90px] text-right font-light">
                      {currentQ.rightLabel}
                    </span>
                  </div>

                  {/* Slider */}
                  <CinematicSlider
                    value={answers[currentQ.id as keyof ReflectionData] as number || (currentQ.max! / 2)}
                    min={currentQ.min!}
                    max={currentQ.max!}
                    onChange={(val) => setAnswers(prev => ({ ...prev, [currentQ.id]: val }))}
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-3 relative z-10">
                  <textarea
                    autoFocus
                    value={answers.shortText || ''}
                    onChange={(e) => setAnswers(prev => ({ ...prev, shortText: e.target.value }))}
                    placeholder={currentQ.placeholder}
                    rows={5}
                    className="w-full bg-transparent border-0 border-b border-white/10 focus:border-indigo-500/50 focus:ring-0 text-base resize-none placeholder-white/20 py-3 transition-colors outline-none font-light leading-relaxed text-white/80"
                  />
                </div>
              )}
            </div>

            {/* Continue button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              onClick={nextStep}
              className="group flex items-center gap-3 px-10 py-3.5 rounded-full bg-white/5 hover:bg-indigo-600 border border-white/10 hover:border-indigo-500 text-white/60 hover:text-white transition-all duration-300 text-sm tracking-widest uppercase font-light hover:shadow-[0_0_30px_rgba(99,102,241,0.4)]"
            >
              {step === QUESTIONS.length - 1 ? t.analyzeBtn : t.continueBtn}
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </motion.button>

          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}
