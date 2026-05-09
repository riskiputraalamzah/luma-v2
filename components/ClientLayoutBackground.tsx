'use client';

import { motion } from 'motion/react';
import TopNav from './TopNav';

export function ClientLayoutBackground() {
  return (
    <>
      {/* ── Aurora Orbs ─────────────────────────────────────── */}
      <div
        className="fixed top-[-15%] left-[-5%] w-[700px] h-[700px] rounded-full pointer-events-none z-[-2]"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float1 8s ease-in-out infinite',
        }}
      />
      <div
        className="fixed bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full pointer-events-none z-[-2]"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'float2 10s ease-in-out infinite',
        }}
      />
      <div
        className="fixed top-[40%] right-[15%] w-[350px] h-[350px] rounded-full pointer-events-none z-[-2]"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.07) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float3 12s ease-in-out infinite',
        }}
      />

      {/* ── Subtle Noise Grain ──────────────────────────────── */}
      <div
        className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px',
        }}
      />

      {/* ── Floating ambient glow ──────────────────────────── */}
      <motion.div
        animate={{ x: [-30, 30, -30], y: [-20, 20, -20] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="fixed bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full pointer-events-none z-[-2]"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      <TopNav />

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, 20px) scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, -30px) scale(1.05); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(20px, -15px) scale(1.08); }
        }
      `}</style>
    </>
  );
}
