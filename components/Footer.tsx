'use client';

import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';

export function Footer() {
  const language = useAppStore(state => state.language);

  return (
    <footer className="w-full border-t border-white/[0.06] bg-[#07080F]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12 flex flex-col gap-8">

        {/* Top row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L9.5 9.5H2L8 14L5.5 21.5L12 17L18.5 21.5L16 14L22 9.5H14.5L12 2Z" />
                </svg>
              </div>
              <span className="text-sm font-display font-light tracking-widest text-white/70 uppercase">LUMA</span>
            </div>
            <p className="text-[11px] text-white/25 font-light leading-relaxed max-w-xs">
              {language === 'id'
                ? 'Cermin AI untuk kehidupanmu. Berhenti sejenak, refleksikan, dan tumbuh.'
                : 'An AI mirror for your life. Pause, reflect, and grow.'}
            </p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/about" className="text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors font-mono">
              {language === 'id' ? 'Tentang' : 'About'}
            </Link>
            <Link href="/reflection" className="text-[10px] uppercase tracking-widest text-white/25 hover:text-white/60 transition-colors font-mono">
              {language === 'id' ? 'Mulai Refleksi' : 'Start Reflection'}
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/[0.06]" />

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[9px] text-white/15 font-mono tracking-wider uppercase">
            © {new Date().getFullYear()} LUMA · AI Reflection Companion
          </p>
          <p className="text-[9px] text-white/15 font-mono tracking-wider">
            {language === 'id' ? 'Dibuat dengan ❤️ untuk Gen Z' : 'Made with ❤️ for Gen Z'}
          </p>
        </div>
      </div>
    </footer>
  );
}
