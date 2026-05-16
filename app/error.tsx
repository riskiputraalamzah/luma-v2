'use client';

import { useEffect } from 'react';
import { motion } from 'motion/react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[LUMA Error]', error);
  }, [error]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-6 min-h-[60vh]">
      <div className="flex flex-col items-center gap-8 max-w-md text-center">

        {/* Error orb */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.2)',
            boxShadow: '0 0 30px rgba(239,68,68,0.15)',
          }}
        >
          <svg className="w-6 h-6 text-red-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
        </motion.div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-display font-light text-white/80 tracking-wide">
            Something went wrong
          </h2>
          <p className="text-xs text-white/35 font-light leading-relaxed">
            An unexpected error occurred. Your reflection data is safe.
          </p>
          {error.message && (
            <p className="text-[10px] font-mono text-red-400/50 mt-2 leading-relaxed break-all">
              {error.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-2.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs tracking-widest uppercase transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.3)]"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-5 py-2.5 rounded-full glass-card text-white/40 hover:text-white/70 text-xs tracking-widest uppercase transition-all duration-200"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
