'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { useAppStore, AIAnalysisResult } from '@/store/useAppStore';
import { GoogleGenAI, Type } from '@google/genai';
import { translations } from '@/lib/translations';

export default function AnalysisPage() {
  const router = useRouter();
  const reflectionData = useAppStore(state => state.reflectionData);
  const setAiAnalysisResult = useAppStore(state => state.setAiAnalysisResult);
  const setAnalysisLanguage = useAppStore(state => state.setAnalysisLanguage);
  const language = useAppStore(state => state.language);
  const [messageIndex, setMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const t = translations[language] || translations.en;

  const LOADING_MESSAGES = [t.loading1, t.loading2, t.loading3, t.loading4, t.loading5];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [LOADING_MESSAGES.length]);

  useEffect(() => {
    if (!reflectionData) {
      router.push('/reflection');
      return;
    }

    const analyzeData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
        if (!apiKey) {
          throw new Error('GEMINI_API_KEY is missing. Please configure it in the secrets panel.');
        }

        const ai = new GoogleGenAI({ apiKey });

        const toneInstruction = language === 'id'
          ? `CRITICAL TONE INSTRUCTIONS (BAHASA INDONESIA):
             Respond ONLY in Natural, Simple, Deeply Human, Relatable Bahasa Indonesia.
             DO NOT make it overly abstract, philosophical, or sound like a poem.
             DO NOT use stiff formal wording or direct machine translation.
             DO NOT use toxic positivity.
             The tone MUST be like a "calm late-night conversation" - deeply empathetic, grounded, and easy to understand for Gen Z.`
          : `CRITICAL TONE INSTRUCTIONS (ENGLISH):
             Respond ONLY in English.
             DO NOT use toxic positivity, generic motivational quotes, or robotic therapy speak.
             The tone MUST be poetic, incredibly empathetic, highly intuitive, deeply relatable, and emotionally resonant.`;

        const prompt = `
          Analyze the following user's life reflection data. The data represents a person (likely Gen Z or Millennial) dealing with digital burnout, emotional fatigue, or modern digital-era living.
          Reflection Data:
          - Energy/Exhaustion Level: ${reflectionData.mood}/10 (1 = completely exhausted, 10 = fully energized)
          - Sleep: ${reflectionData.sleep} hours/day
          - Screen Time: ${reflectionData.screenTime} hours/day
          - Stress Level: ${reflectionData.stress}/10 (1 = total peace, 10 = overwhelming)
          - Connection to self: ${reflectionData.energy}/10 (1 = disconnected, 10 = deeply connected)
          - Social Balance: ${reflectionData.social}/10 (1 = isolated, 10 = beautiful balance)
          - Productivity/Intentionality: ${reflectionData.productivity}/10 (1 = just surviving, 10 = highly intentional)
          - Main thoughts: "${reflectionData.shortText}"

          ${toneInstruction}

          Respond with a JSON object exactly matching the schema.
          - emotionalState: A short 2-4 word phrase of their current state.
          - hiddenPattern: A short profound observation.
          - burnoutRisk: "Low", "Moderate", "High", or "Critical" ${language === 'id' ? '(Translate: "Rendah", "Sedang", "Tinggi", "Sangat Tinggi")' : ''}.
          - innerSignal: A deeply profound realization summarizing their unspoken need. Must be deeply relatable.
          - radarData: Provide 6 key metrics for the Burnout Radar chart. Rate them from 0 to 100. Use exact keys (in English): "Emotional Energy", "Sleep Quality", "Stress Recovery", "Focus", "Social Balance", "Intentionality".
          - insights: An array of 3 distinct, personalized short sentences revealing the psychological reality behind their habits.
          - parallelFuture: Create a cinematic split-screen future simulation based on their habits.
            - currentPath.title: Title for continuing current heavy, chaotic habits.
            - currentPath.descriptions: array of 4 short impactful sentences detailing the heavy, chaotic, mentally exhausting trajectory.
            - betterPath.title: Title for the beautiful, calm, intentional path.
            - betterPath.descriptions: array of 4 short impactful sentences detailing the intentional, recovering, peaceful trajectory.
        `;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                emotionalState: { type: Type.STRING },
                hiddenPattern: { type: Type.STRING },
                burnoutRisk: { type: Type.STRING },
                innerSignal: { type: Type.STRING },
                radarData: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      subject: { type: Type.STRING },
                      A: { type: Type.NUMBER },
                      fullMark: { type: Type.NUMBER },
                    },
                    required: ['subject', 'A', 'fullMark'],
                  },
                },
                insights: { type: Type.ARRAY, items: { type: Type.STRING } },
                parallelFuture: {
                  type: Type.OBJECT,
                  properties: {
                    currentPath: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'descriptions'],
                    },
                    betterPath: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        descriptions: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'descriptions'],
                    },
                  },
                  required: ['currentPath', 'betterPath'],
                },
              },
              required: ['emotionalState', 'hiddenPattern', 'burnoutRisk', 'innerSignal', 'radarData', 'insights', 'parallelFuture'],
            },
          },
        });

        const resultText = response.text;
        if (!resultText) throw new Error('No response from AI');
        const parsed = JSON.parse(resultText) as AIAnalysisResult;

        setAiAnalysisResult(parsed);
        setAnalysisLanguage(language);
        router.push('/dashboard');
      } catch (err: unknown) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An error occurred during analysis.');
      }
    };

    analyzeData();
  }, [reflectionData, router, setAiAnalysisResult, language]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 relative min-h-[80vh]">

      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }}
      />

      <div className="relative z-10 flex flex-col items-center gap-12">

        {/* Orb */}
        <div className="relative w-24 h-24 flex items-center justify-center">
          {/* Outer pulse rings */}
          <motion.div
            animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full border border-indigo-500/30"
          />
          <motion.div
            animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            className="absolute inset-0 rounded-full border border-indigo-400/20"
          />
          {/* Core */}
          <div className="w-16 h-16 rounded-full glass-card-strong flex items-center justify-center"
            style={{ boxShadow: '0 0 30px rgba(99,102,241,0.3), inset 0 0 20px rgba(99,102,241,0.1)' }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="w-3 h-3 rounded-full bg-indigo-400"
              style={{ boxShadow: '0 0 12px rgba(99,102,241,0.8)' }}
            />
          </div>
        </div>

        {/* Loading message */}
        <div className="h-8 relative flex items-center justify-center min-w-[280px]">
          <AnimatePresence mode="wait">
            {error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 text-center"
              >
                <p className="text-red-400 text-sm max-w-sm leading-relaxed">{error}</p>
                <button
                  onClick={() => router.push('/reflection')}
                  className="text-[11px] uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors border border-white/10 hover:border-white/20 px-6 py-2 rounded-full"
                >
                  Try Again
                </button>
              </motion.div>
            ) : (
              <motion.p
                key={messageIndex}
                initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                transition={{ duration: 0.6 }}
                className="text-sm text-white/45 font-light tracking-wide text-center"
              >
                {LOADING_MESSAGES[messageIndex]}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Progress dots */}
        {!error && (
          <div className="flex items-center gap-2">
            {LOADING_MESSAGES.map((_, i) => (
              <motion.div
                key={i}
                animate={{ opacity: i === messageIndex ? 1 : 0.2, scale: i === messageIndex ? 1 : 0.7 }}
                transition={{ duration: 0.3 }}
                className="w-1.5 h-1.5 rounded-full bg-indigo-400"
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
