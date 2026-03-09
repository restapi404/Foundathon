import { NextResponse } from 'next/server'

export async function POST(request) {
  const startup = await request.json()

  const prompt = `You are an expert climate tech investment analyst. Analyze this climate startup.

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
  "score": <integer 1-100>,
  "scoreLabel": "<Speculative|Emerging|Promising|Strong|Exceptional>",
  "thesis": "<2-3 sentence investment thesis>",
  "opportunity": "<2-3 sentence market opportunity and sector tailwinds>",
  "risks": ["<risk 1>", "<risk 2>", "<risk 3>"],
  "investorFit": "<1-2 sentence ideal investor profile>",
  "comparable": "<1-2 real comparable companies or deals in this space>",
  "verdict": "<one bold sentence — the single most important thing to know about this startup>"
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
          maxOutputTokens: 2000,
          thinkingConfig: {
            thinkingBudget: 0,
          },
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
