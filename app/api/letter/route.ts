import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured on server.' }, { status: 500 });
    }

    const body = await req.json();
    const { reflectionData, aiAnalysisResult, language } = body;

    if (!reflectionData || !aiAnalysisResult) {
      return NextResponse.json({ error: 'Missing data.' }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are LUMA, a deeply empathetic AI reflection companion designed for Gen Z.
Based on the following reflection data and AI analysis, write a short, deeply personal letter to the user.

Reflection Data:
- Energy level: ${reflectionData.mood}/10
- Sleep: ${reflectionData.sleep} hours/day
- Screen time: ${reflectionData.screenTime} hours/day
- Stress: ${reflectionData.stress}/10
- Self-connection: ${reflectionData.energy}/10
- Social balance: ${reflectionData.social}/10
- Productivity: ${reflectionData.productivity}/10
- On their mind: "${reflectionData.shortText}"

AI Analysis Results:
- Emotional State: ${aiAnalysisResult.emotionalState}
- Burnout Risk: ${aiAnalysisResult.burnoutRisk}
- Hidden Pattern: ${aiAnalysisResult.hiddenPattern}
- Inner Signal: ${aiAnalysisResult.innerSignal}

LETTER REQUIREMENTS:
- Write in ${language === 'id' ? 'natural, warm Bahasa Indonesia (Gen Z relatable, NOT stiff or formal)' : 'warm, poetic English (emotionally resonant, NOT generic)'}
- 3-4 paragraphs only
- Tone: like a wise, caring friend who truly SEES them — not a therapist, not a robot
- DO NOT use toxic positivity or generic advice ("just rest more")
- DO NOT start with "Dear..." — start directly with something that feels like you already know them
- DO reference their specific situation (their screen time, stress, sleep, what's on their mind)
- End with one short, memorable sentence — something they'll want to remember
- The goal: make them feel "someone truly understands me"

Output ONLY the letter text. No labels, no JSON, no extra formatting.
    `.trim();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) {
      return NextResponse.json({ error: 'No letter generated.' }, { status: 502 });
    }

    return NextResponse.json({ letter: text });
  } catch (err: unknown) {
    console.error('[API /letter]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
