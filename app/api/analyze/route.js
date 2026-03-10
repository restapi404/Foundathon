import { NextResponse } from 'next/server'

export async function POST(request) {
  const startup = await request.json()

  const prompt = `You are an expert climate tech investment analyst. Analyze this climate startup and return ONLY numbers and very short labels — no long sentences except where specified.

Startup:
- Name: ${startup.name}
- Tagline: ${startup.tagline || 'N/A'}
- Description: ${startup.description || 'N/A'}
- Sector: ${startup.sector}
- Stage: ${startup.stage}
- Location: ${startup.location || 'N/A'}
- Team Size: ${startup.team_size || 'N/A'}
- Funding Needed: ${startup.funding_needed || 'N/A'}

Respond ONLY with a valid JSON object (no markdown, no backticks):
{
  "verdict": "<one punchy sentence, max 15 words>",
  "thesis": "<one sentence max>",
  "scores": {
    "team": <1-10>,
    "market": <1-10>,
    "technology": <1-10>,
    "impact": <1-10>,
    "timing": <1-10>
  },
  "risks": [
    { "label": "<3-5 word risk label>", "severity": <1-10> },
    { "label": "<3-5 word risk label>", "severity": <1-10> },
    { "label": "<3-5 word risk label>", "severity": <1-10> },
    { "label": "<3-5 word risk label>", "severity": <1-10> }
  ],
  "fundingBreakdown": [
    { "label": "R&D", "pct": <integer> },
    { "label": "GTM", "pct": <integer> },
    { "label": "Ops", "pct": <integer> },
    { "label": "Hiring", "pct": <integer> }
  ],
  "marketReadiness": <integer 1-100>,
  "climateImpactScore": <integer 1-100>,
  "timeToRevenueMonths": <integer>,
  "comparable": "<2-4 words, company name only>",
  "investorFit": "<one sentence max>"
}`

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
          thinkingConfig: { thinkingBudget: 0 },
        },
      }),
    }
  )

  const data = await res.json()

  try {
    const text = data.candidates[0].content.parts[0].text
    const clean = text.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(clean)
    return NextResponse.json(parsed)
  } catch {
    console.error('Parse error:', JSON.stringify(data))
    return NextResponse.json({ error: 'Failed to parse analysis' }, { status: 500 })
  }
}
