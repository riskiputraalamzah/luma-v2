'use client';

import Link from 'next/link';
import { useAppStore, Language } from '@/store/useAppStore';

export default function TopNav() {
  const language = useAppStore(state => state.language);
  const setLanguage = useAppStore(state => state.setLanguage);

  return (
    <nav className="fixed top-0 w-full h-16 flex items-center justify-between px-6 md:px-10 z-50 border-b border-white/[0.06] bg-[#07080F]/80 backdrop-blur-xl">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 group">
        <div className="relative w-7 h-7 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg opacity-90 group-hover:opacity-100 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg blur-md opacity-50 group-hover:opacity-70 transition-opacity" />
          <svg className="relative w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L9.5 9.5H2L8 14L5.5 21.5L12 17L18.5 21.5L16 14L22 9.5H14.5L12 2Z" />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-[0.25em] uppercase text-white/90 group-hover:text-white transition-colors">
          LUMA
        </span>
      </Link>

      {/* Right: Language Switcher */}
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-white/[0.05] rounded-full p-0.5 border border-white/[0.08]">
          {(['en', 'id'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-4 py-1.5 text-[10px] font-medium uppercase tracking-widest rounded-full transition-all duration-200 ${
                language === lang
                  ? 'bg-white/10 text-white shadow-inner'
                  : 'text-white/30 hover:text-white/60'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
