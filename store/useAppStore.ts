import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'id';

export interface ReflectionData {
  mood: number;
  sleep: number;
  screenTime: number;
  stress: number;
  energy: number;
  social: number;
  productivity: number;
  shortText: string;
}

export interface AIRadarData {
  subject: string;
  A: number;
  fullMark: number;
}

export interface AIAnalysisResult {
  emotionalState: string;
  hiddenPattern: string;
  burnoutRisk: string;
  innerSignal: string;
  radarData: AIRadarData[];
  insights: string[];
  parallelFuture: {
    currentPath: { title: string; descriptions: string[] };
    betterPath: { title: string; descriptions: string[] };
  };
}

interface AppState {
  language: Language;
  analysisLanguage: Language | null;
  setLanguage: (lang: Language) => void;
  reflectionData: ReflectionData | null;
  aiAnalysisResult: AIAnalysisResult | null;
  setReflectionData: (data: ReflectionData) => void;
  setAiAnalysisResult: (result: AIAnalysisResult) => void;
  setAnalysisLanguage: (lang: Language) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      language: 'en',
      analysisLanguage: null,
      setLanguage: (lang) => set({ language: lang }),
      reflectionData: null,
      aiAnalysisResult: null,
      setReflectionData: (data) => set({ reflectionData: data }),
      setAiAnalysisResult: (result) => set({ aiAnalysisResult: result }),
      setAnalysisLanguage: (lang) => set({ analysisLanguage: lang }),
      reset: () => set({ reflectionData: null, aiAnalysisResult: null, analysisLanguage: null }),
    }),
    {
      name: 'luma-store',
    },
  ),
);
