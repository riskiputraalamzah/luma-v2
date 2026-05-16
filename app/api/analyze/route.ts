import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured on server.' },
        { status: 500 },
      );
    }

    const body = await req.json();
    const { reflectionData, language } = body;

    if (!reflectionData) {
      return NextResponse.json({ error: 'Missing reflection data.' }, { status: 400 });
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
    if (!resultText) {
      return NextResponse.json({ error: 'No response from AI.' }, { status: 502 });
    }

    const parsed = JSON.parse(resultText);
    return NextResponse.json(parsed);
  } catch (err: unknown) {
    console.error('[API /analyze]', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
