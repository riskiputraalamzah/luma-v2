'use client';

import { motion } from 'motion/react';
import { usePathname } from 'next/navigation';

/**
 * Cinematic page transition — fade + subtle blur on enter.
 * Note: Exit animations are not supported in Next.js App Router
 * without complex workarounds, so we focus on a polished enter animation.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 flex flex-col"
    >
      {children}
    </motion.div>
  );
}
