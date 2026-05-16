'use client';

import { useRef, useState } from 'react';
import { motion } from 'motion/react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { translations } from '@/lib/translations';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// ── Canvas-based card download ───────────────────────────────
function downloadCardAsImage(
  emotionalState: string,
  burnoutRisk: string,
  hiddenPattern: string,
  innerSignal: string,
  radarData: { subject: string; A: number }[],
  language: string,
) {
  const SCALE = 2;
  const W = 560;
  const H = 820;
  const canvas = document.createElement('canvas');
  canvas.width = W * SCALE;
  canvas.height = H * SCALE;
  const ctx = canvas.getContext('2d')!;
  ctx.scale(SCALE, SCALE);

  // ── Background ──
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#0D0E1A');
  bgGrad.addColorStop(1, '#07080F');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Top accent bar ──
  const barGrad = ctx.createLinearGradient(0, 0, W, 0);
  barGrad.addColorStop(0, 'rgba(99,102,241,0.9)');
  barGrad.addColorStop(0.6, 'rgba(139,92,246,0.6)');
  barGrad.addColorStop(1, 'rgba(139,92,246,0)');
  ctx.fillStyle = barGrad;
  ctx.fillRect(0, 0, W, 2);

  // ── Logo ──
  ctx.font = `600 11px monospace`;
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.letterSpacing = '0.25em';
  ctx.fillText('✦  LUMA', 48, 52);

  // ── Date ──
  ctx.font = '10px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.textAlign = 'right';
  ctx.fillText(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), W - 48, 52);
  ctx.textAlign = 'left';

  // ── Divider ──
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(48, 68, W - 96, 1);

  // ── Emotional State ──
  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(99,102,241,0.7)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('EMOTIONAL STATE', 48, 108);
  ctx.letterSpacing = '0';

  ctx.font = `300 30px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  const truncState = emotionalState.length > 28 ? emotionalState.slice(0, 28) + '…' : emotionalState;
  ctx.fillText(truncState, 48, 148);

  // ── Burnout Risk ──
  const burnoutColors: Record<string, string> = {
    Low: '#34d399', Rendah: '#34d399',
    Moderate: '#fbbf24', Sedang: '#fbbf24',
    High: '#f87171', Tinggi: '#f87171',
    Critical: '#ef4444', 'Sangat Tinggi': '#ef4444',
  };
  const burnColor = burnoutColors[burnoutRisk] || '#818cf8';

  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('BURNOUT RISK', 48, 188);
  ctx.letterSpacing = '0';

  // Dot
  ctx.beginPath();
  ctx.arc(56, 208, 5, 0, Math.PI * 2);
  ctx.fillStyle = burnColor;
  ctx.fill();

  ctx.font = `500 18px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = burnColor;
  ctx.fillText(burnoutRisk, 72, 214);

  // ── Divider ──
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(48, 234, W - 96, 1);

  // ── Hidden Pattern ──
  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(139,92,246,0.7)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('HIDDEN PATTERN', 48, 265);
  ctx.letterSpacing = '0';

  ctx.font = `300 16px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  const truncPattern = hiddenPattern.length > 55 ? hiddenPattern.slice(0, 55) + '…' : hiddenPattern;
  ctx.fillText(truncPattern, 48, 292);

  // ── Inner Signal ──
  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('INNER SIGNAL', 48, 336);
  ctx.letterSpacing = '0';

  // Word-wrapped inner signal
  ctx.font = `italic 300 14px "Segoe UI", Arial, sans-serif`;
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  const words = innerSignal.split(' ');
  let line = '';
  let lineY = 360;
  const maxWidth = W - 96;
  for (const word of words) {
    const test = line + (line ? ' ' : '') + word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, 48, lineY);
      line = word;
      lineY += 22;
      if (lineY > 420) { ctx.fillText(line + '…', 48, lineY); break; }
    } else {
      line = test;
    }
  }
  if (lineY <= 420) ctx.fillText(line, 48, lineY);

  // ── Divider ──
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(48, 440, W - 96, 1);

  // ── Recovery Radar bars ──
  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.letterSpacing = '0.2em';
  ctx.fillText('RECOVERY RADAR', 48, 468);
  ctx.letterSpacing = '0';

  const barStartY = 488;
  const barH = 4;
  const barGap = 28;
  const barW = W - 96;
  const barColors = ['#818cf8', '#34d399', '#fbbf24', '#67e8f9', '#a78bfa', '#f9a8d4'];

  radarData.slice(0, 6).forEach((item, i) => {
    const y = barStartY + i * barGap;
    const fill = (item.A / 100) * barW;

    // Subject label
    ctx.font = '9px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText(item.subject.toUpperCase(), 48, y - 4);

    // Value
    ctx.fillStyle = 'rgba(255,255,255,0.45)';
    ctx.textAlign = 'right';
    ctx.fillText(`${item.A}`, W - 48, y - 4);
    ctx.textAlign = 'left';

    // Track
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.beginPath();
    ctx.roundRect(48, y, barW, barH, 2);
    ctx.fill();

    // Fill
    ctx.fillStyle = barColors[i] || '#818cf8';
    ctx.beginPath();
    ctx.roundRect(48, y, Math.max(fill, 4), barH, 2);
    ctx.fill();
  });

  // ── Bottom ──
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fillRect(48, H - 64, W - 96, 1);

  ctx.font = '9px monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.2)';
  ctx.letterSpacing = '0.15em';
  ctx.fillText('luma.app  ·  AI Reflection Companion', 48, H - 38);

  // ── Download ──
  const link = document.createElement('a');
  link.download = `luma-reflection-${Date.now()}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

// ── Share via Web Share API ──────────────────────────────────
async function shareCard(title: string) {
  const shareData = {
    title: 'My LUMA Reflection',
    text: title,
    url: window.location.origin,
  };
  if (navigator.share && navigator.canShare(shareData)) {
    await navigator.share(shareData);
  } else {
    await navigator.clipboard.writeText(window.location.origin);
  }
}

// ── Page ────────────────────────────────────────────────────
export default function CardPage() {
  const router = useRouter();
  const aiAnalysisResult = useAppStore(state => state.aiAnalysisResult);
  const language = useAppStore(state => state.language);
  const [mounted, setMounted] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [shared, setShared] = useState(false);

  const t = translations[language] || translations.en;

  useEffect(() => {
    setMounted(true);
    if (!aiAnalysisResult) router.push('/');
  }, [aiAnalysisResult, router]);

  if (!mounted || !aiAnalysisResult) return null;

  const burnoutColors: Record<string, string> = {
    Low: '#34d399', Rendah: '#34d399',
    Moderate: '#fbbf24', Sedang: '#fbbf24',
    High: '#f87171', Tinggi: '#f87171',
    Critical: '#ef4444', 'Sangat Tinggi': '#ef4444',
  };
  const burnColor = burnoutColors[aiAnalysisResult.burnoutRisk] || '#818cf8';

  const handleDownload = () => {
    setDownloading(true);
    downloadCardAsImage(
      aiAnalysisResult.emotionalState,
      aiAnalysisResult.burnoutRisk,
      aiAnalysisResult.hiddenPattern,
      aiAnalysisResult.innerSignal,
      aiAnalysisResult.radarData,
      language,
    );
    setTimeout(() => setDownloading(false), 1200);
  };

  const handleShare = async () => {
    await shareCard(aiAnalysisResult.emotionalState);
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <main className="flex-1 flex flex-col items-center py-12 px-6 relative">

      {/* Center glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(60px)' }}
      />

      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-8">

        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="self-start"
        >
          <Link href="/dashboard">
            <button className="text-[11px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors font-mono flex items-center gap-2">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              {t.backToDashboard}
            </button>
          </Link>
        </motion.div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-full"
        >
          <div
            className="w-full rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, #0D0E1A 0%, #07080F 100%)',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
            }}
          >
            {/* Top accent */}
            <div className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, rgba(99,102,241,0.9), rgba(139,92,246,0.6) 60%, transparent)' }} />

            <div className="p-8 flex flex-col gap-7">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L9.5 9.5H2L8 14L5.5 21.5L12 17L18.5 21.5L16 14L22 9.5H14.5L12 2Z" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-mono tracking-[0.25em] uppercase text-white/40">LUMA</span>
                </div>
                <span className="text-[9px] font-mono text-white/20">
                  {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Emotional State */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-indigo-400/60">
                  {t.emotionalState}
                </span>
                <p className="text-2xl font-display font-light text-white/92 leading-tight">
                  {aiAnalysisResult.emotionalState}
                </p>
              </div>

              {/* Burnout Risk */}
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: burnColor, boxShadow: `0 0 8px ${burnColor}` }} />
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/25">{t.burnoutRisk}:</span>
                <span className="text-sm font-mono font-medium" style={{ color: burnColor }}>{aiAnalysisResult.burnoutRisk}</span>
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Hidden Pattern */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-violet-400/60">{t.hiddenPattern}</span>
                <p className="text-sm font-light text-white/70 leading-relaxed">{aiAnalysisResult.hiddenPattern}</p>
              </div>

              {/* Inner Signal */}
              <div className="flex flex-col gap-1.5 p-4 rounded-2xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.12)' }}>
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/25">{t.innerSignal}</span>
                <p className="text-sm font-display font-light italic text-white/65 leading-relaxed line-clamp-3">{aiAnalysisResult.innerSignal}</p>
              </div>

              {/* Radar bars */}
              <div className="flex flex-col gap-3">
                <span className="text-[9px] font-mono tracking-[0.25em] uppercase text-white/25">{t.recoveryRadar}</span>
                {aiAnalysisResult.radarData.slice(0, 6).map((item, i) => {
                  const colors = ['#818cf8', '#34d399', '#fbbf24', '#67e8f9', '#a78bfa', '#f9a8d4'];
                  return (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-[9px] font-mono text-white/35 w-28 flex-shrink-0 truncate uppercase tracking-wide">{item.subject}</span>
                      <div className="flex-1 h-1 rounded-full bg-white/[0.06] overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${item.A}%` }}
                          transition={{ delay: 0.4 + i * 0.05, duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: colors[i] }}
                        />
                      </div>
                      <span className="text-[9px] font-mono text-white/30 w-6 text-right flex-shrink-0">{item.A}</span>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/[0.06]" />

              {/* Footer */}
              <p className="text-[9px] font-mono text-white/18 tracking-[0.2em] uppercase">{t.cardTagline}</p>
            </div>
          </div>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex items-center gap-3 w-full"
        >
          {/* Download */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 transition-all duration-200 text-white text-xs font-medium tracking-wide shadow-[0_0_30px_rgba(99,102,241,0.3)] hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]"
          >
            {downloading ? (
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
            )}
            {downloading ? '...' : t.downloadCard}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl glass-card hover:border-indigo-500/30 transition-all duration-200 text-white/60 hover:text-white text-xs font-medium tracking-wide"
          >
            {shared ? (
              <>
                <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                <span className="text-green-400">{language === 'id' ? 'Tersalin!' : 'Copied!'}</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                {t.shareCard}
              </>
            )}
          </button>
        </motion.div>
      </div>
    </main>
  );
}
