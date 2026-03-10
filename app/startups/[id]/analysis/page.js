'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const SECTOR_COLORS = {
  'Solar': '#f59e0b', 'Wind': '#60a5fa', 'Carbon Capture': '#00a63e',
  'EV': '#a78bfa', 'Climate Data': '#f472b6', 'Sustainable Agriculture': '#34d399',
  'Geothermal': '#fb923c', 'Ocean Energy': '#38bdf8',
}

// ── Radar Chart ────────────────────────────────────────────────────
function RadarChart({ scores }) {
  const axes = ['Team', 'Market', 'Technology', 'Impact', 'Timing']
  const vals = axes.map(a => (scores[a.toLowerCase()] ?? 5) / 10)
  const cx = 110, cy = 110, r = 80
  const angle = i => -Math.PI / 2 + i * (2 * Math.PI / axes.length)
  const pt = (i, v) => [cx + r * v * Math.cos(angle(i)), cy + r * v * Math.sin(angle(i))]
  const dataPoints = vals.map((v, i) => pt(i, v)).map(p => p.join(',')).join(' ')
  const gridLevel = lv => axes.map((_, i) => pt(i, lv)).map(p => p.join(',')).join(' ')

  return (
    <svg width="220" height="220" viewBox="0 0 220 220">
      {[0.25, 0.5, 0.75, 1].map(lv => (
        <polygon key={lv} points={gridLevel(lv)} fill="none" stroke="var(--gray-mid)" strokeWidth="1" />
      ))}
      {axes.map((_, i) => {
        const [x, y] = pt(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--gray-mid)" strokeWidth="1" />
      })}
      <polygon points={dataPoints} fill="rgba(0,166,62,0.1)" stroke="var(--green)" strokeWidth="1.5" />
      {vals.map((v, i) => {
        const [x, y] = pt(i, v)
        return <circle key={i} cx={x} cy={y} r="3.5" fill="var(--green)" />
      })}
      {axes.map((label, i) => {
        const [x, y] = pt(i, 1.28)
        return (
          <text key={label} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fontFamily="Fira Sans Condensed, sans-serif" fontWeight="700"
            fill="var(--gray)" letterSpacing="1">
            {label.toUpperCase()}
          </text>
        )
      })}
      {vals.map((v, i) => {
        const [x, y] = pt(i, v * 0.62)
        if (v < 0.25) return null
        return (
          <text key={`v${i}`} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fontFamily="Fira Sans Condensed, sans-serif" fontWeight="800" fill="var(--green-dim)">
            {Math.round(v * 10)}
          </text>
        )
      })}
    </svg>
  )
}

// ── Donut Chart ────────────────────────────────────────────────────
function DonutChart({ data, colors }) {
  const total = data.reduce((s, d) => s + d.pct, 0)
  const cx = 70, cy = 70, R = 55, r = 32
  let cumAngle = -Math.PI / 2

  const slices = data.map((d, i) => {
    const angle = (d.pct / total) * 2 * Math.PI
    const x1 = cx + R * Math.cos(cumAngle)
    const y1 = cy + R * Math.sin(cumAngle)
    cumAngle += angle
    const x2 = cx + R * Math.cos(cumAngle)
    const y2 = cy + R * Math.sin(cumAngle)
    const xi1 = cx + r * Math.cos(cumAngle - angle)
    const yi1 = cy + r * Math.sin(cumAngle - angle)
    const xi2 = cx + r * Math.cos(cumAngle)
    const yi2 = cy + r * Math.sin(cumAngle)
    const large = angle > Math.PI ? 1 : 0
    return {
      d: `M${x1},${y1} A${R},${R} 0 ${large},1 ${x2},${y2} L${xi2},${yi2} A${r},${r} 0 ${large},0 ${xi1},${yi1} Z`,
      color: colors[i % colors.length], pct: d.pct, label: d.label
    }
  })

  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      {slices.map((s, i) => (
        <path key={i} d={s.d} fill={s.color} opacity="0.85" />
      ))}
    </svg>
  )
}

// ── Score Bar ──────────────────────────────────────────────────────
function HBar({ label, value }) {
  const barColor = value >= 7 ? '#00a63e' : value >= 5 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gray)', fontFamily: 'Fira Sans Condensed, sans-serif' }}>{label}</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: barColor, fontFamily: 'Fira Sans Condensed, sans-serif' }}>{value}/10</span>
      </div>
      <div style={{ height: '3px', background: 'var(--gray-mid)', width: '100%' }}>
        <div style={{ height: '100%', width: `${value * 10}%`, background: barColor, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

// ── Risk Bar ───────────────────────────────────────────────────────
function RiskBar({ label, severity }) {
  const color = severity >= 8 ? '#ef4444' : severity >= 6 ? '#f59e0b' : '#60a5fa'
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
        <span style={{ fontSize: '12px', color: 'var(--offwhite)', fontWeight: 400 }}>{label}</span>
        <span style={{ fontSize: '10px', fontWeight: 800, color, fontFamily: 'Fira Sans Condensed, sans-serif' }}>{severity}/10</span>
      </div>
      <div style={{ height: '3px', background: 'var(--gray-mid)' }}>
        <div style={{ height: '100%', width: `${severity * 10}%`, background: color, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────────
export default function AnalysisPage() {
  const { id } = useParams()
  const [startup, setStartup] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [status, setStatus] = useState('loading-startup')

  useEffect(() => {
    async function run() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('startups').select('*, profiles(full_name, role)').eq('id', id).single()
      if (error || !data) { setStatus('error'); return }
      setStartup(data)
      setStatus('analyzing')
      await generateAnalysis(data)
    }
    run()
  }, [id])

  async function generateAnalysis(s) {
    setAnalysis(null)
    setStatus('analyzing')
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(s),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setAnalysis(data)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const accent = startup ? (SECTOR_COLORS[startup.sector] || 'var(--green)') : 'var(--green)'
  const DONUT_COLORS = ['#00a63e', '#60a5fa', '#f59e0b', '#a78bfa']

  return (
    <div style={p.page}>
      <div style={{ ...p.accentBar, background: accent }} />

      <div style={p.container}>
        <div style={p.nav}>
          <Link href={`/startups/${id}`} style={p.back}>← Back to Startup</Link>
          <span style={p.navTag}>// AI Analysis</span>
        </div>

        {startup && (
          <div style={p.header} className="fade-up">
            <span style={{ ...p.sectorTag, borderColor: accent, color: accent }}>{startup.sector}</span>
            <h1 style={p.title}>{startup.name}</h1>
            {startup.tagline && <p style={p.tagline}>{startup.tagline}</p>}
          </div>
        )}

        {(status === 'loading-startup' || status === 'analyzing') && (
          <div style={p.loadingWrap}>
            <div style={p.loadingInner}>
              <div style={p.spinnerWrap}><div style={p.spinner} /></div>
              <p style={p.loadingTitle}>
                {status === 'loading-startup' ? 'Fetching startup data...' : `Analyzing ${startup?.name || 'startup'}...`}
              </p>
              <p style={p.loadingSubtitle}>{status === 'analyzing' && 'Crunching numbers...'}</p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={p.errorBox}>
            <p style={p.errorTitle}>Analysis failed</p>
            <p style={p.errorSub}>Something went wrong. Check your GEMINI_API_KEY in .env.local.</p>
            {startup && <button onClick={() => generateAnalysis(startup)} style={p.retryBtn}>Retry →</button>}
          </div>
        )}

        {status === 'done' && analysis && (
          <div className="fade-up">

            {/* Verdict */}
            <div style={p.verdictBanner}>
              <span style={p.verdictIcon}>✦</span>
              <p style={p.verdictText}>{analysis.verdict}</p>
            </div>

            {/* Key metrics */}
            <div style={p.metricsRow}>
              <div style={p.metricCard}>
                <div style={p.metricTag}>// Market Readiness</div>
                <div style={p.metricNum}>{analysis.marketReadiness}<span style={p.metricUnit}>%</span></div>
                <div style={{ height: '3px', background: 'var(--gray-mid)', marginTop: '12px' }}>
                  <div style={{ height: '100%', width: `${analysis.marketReadiness}%`, background: 'var(--green)', transition: 'width 1.2s ease' }} />
                </div>
              </div>
              <div style={p.metricCard}>
                <div style={p.metricTag}>// Climate Impact</div>
                <div style={p.metricNum}>{analysis.climateImpactScore}<span style={p.metricUnit}>%</span></div>
                <div style={{ height: '3px', background: 'var(--gray-mid)', marginTop: '12px' }}>
                  <div style={{ height: '100%', width: `${analysis.climateImpactScore}%`, background: '#34d399', transition: 'width 1.2s ease' }} />
                </div>
              </div>
              <div style={p.metricCard}>
                <div style={p.metricTag}>// Time to Revenue</div>
                <div style={p.metricNum}>{analysis.timeToRevenueMonths}<span style={p.metricUnit}>mo</span></div>
                <div style={p.metricSubLabel}>estimated</div>
              </div>
              <div style={p.metricCard}>
                <div style={p.metricTag}>// Comparable</div>
                <div style={{ ...p.metricNum, fontSize: '20px', marginTop: '8px', lineHeight: 1.2 }}>{analysis.comparable}</div>
              </div>
            </div>

            {/* Radar + Bars */}
            <div style={p.row2}>
              <div style={p.chartCard}>
                <div style={p.cardTag}>// Dimension Scores</div>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                  <RadarChart scores={analysis.scores} />
                </div>
              </div>
              <div style={p.chartCard}>
                <div style={p.cardTag}>// Score Breakdown</div>
                <div style={{ marginTop: '8px' }}>
                  {Object.entries(analysis.scores).map(([key, val]) => (
                    <HBar key={key} label={key} value={val} />
                  ))}
                </div>
              </div>
            </div>

            {/* Donut + Risk */}
            <div style={p.row3}>
              <div style={p.chartCard}>
                <div style={p.cardTag}>// Funding Allocation</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginTop: '12px' }}>
                  <DonutChart data={analysis.fundingBreakdown} colors={DONUT_COLORS} />
                  <div style={{ flex: 1 }}>
                    {analysis.fundingBreakdown.map((item, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: DONUT_COLORS[i % DONUT_COLORS.length], flexShrink: 0 }} />
                          <span style={{ fontSize: '11px', color: 'var(--gray)', letterSpacing: '1px' }}>{item.label}</span>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--offwhite)', fontFamily: 'Fira Sans Condensed, sans-serif' }}>{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={p.chartCard}>
                <div style={p.cardTag}>// Risk Profile</div>
                <div style={{ marginTop: '12px' }}>
                  {analysis.risks.map((risk, i) => (
                    <RiskBar key={i} label={risk.label} severity={risk.severity} />
                  ))}
                </div>
              </div>
            </div>

            {/* Thesis + Investor */}
            <div style={p.row4}>
              <div style={p.infoCard}>
                <div style={p.cardTag}>// Thesis</div>
                <p style={p.infoText}>{analysis.thesis}</p>
              </div>
              <div style={p.infoCard}>
                <div style={p.cardTag}>// Investor Fit</div>
                <p style={p.infoText}>{analysis.investorFit}</p>
              </div>
            </div>

            <button onClick={() => generateAnalysis(startup)} style={p.regenBtn}>
              ↺ Regenerate Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

const p = {
  page: { minHeight: '100vh', paddingTop: '80px', position: 'relative', background: 'var(--bg)' },
  accentBar: { position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, opacity: 0.8 },
  container: { maxWidth: '1000px', margin: '0 auto', padding: '60px 48px 120px' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '52px' },
  back: { fontSize: '11px', letterSpacing: '1px', color: 'var(--gray)' },
  navTag: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)' },
  header: { marginBottom: '48px' },
  sectorTag: { display: 'inline-block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid', padding: '4px 12px', marginBottom: '20px' },
  title: { fontFamily: 'Fira Sans Condensed, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-1px', lineHeight: 1.0, marginBottom: '12px', color: 'var(--offwhite)' },
  tagline: { fontSize: '15px', color: 'var(--gray)', fontWeight: 300, lineHeight: 1.6 },

  loadingWrap: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0' },
  loadingInner: { textAlign: 'center' },
  spinnerWrap: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
  spinner: { width: '28px', height: '28px', border: '2px solid var(--gray-mid)', borderTop: '2px solid var(--green)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' },
  loadingTitle: { fontFamily: 'Fira Sans Condensed, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: 'var(--offwhite)' },
  loadingSubtitle: { fontSize: '12px', color: 'var(--gray)' },

  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', padding: '60px', textAlign: 'center' },
  errorTitle: { fontFamily: 'Fira Sans Condensed, sans-serif', fontWeight: 700, fontSize: '18px', color: '#ef4444', marginBottom: '8px' },
  errorSub: { fontSize: '13px', color: 'var(--gray)', marginBottom: '28px' },
  retryBtn: { background: 'var(--green)', color: '#fff', border: 'none', padding: '12px 28px', fontFamily: 'Fira Sans Condensed, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer' },

  verdictBanner: { background: 'rgba(0,166,62,0.04)', border: '1px solid rgba(0,166,62,0.2)', padding: '20px 24px', display: 'flex', gap: '14px', alignItems: 'flex-start', marginBottom: '1px' },
  verdictIcon: { color: 'var(--green)', fontSize: '14px', flexShrink: 0, marginTop: '2px' },
  verdictText: { fontSize: '15px', lineHeight: 1.7, color: 'var(--offwhite)', fontStyle: 'italic', fontFamily: 'Fira Sans, sans-serif' },

  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--gray-mid)', border: '1px solid var(--gray-mid)', marginBottom: '1px' },
  metricCard: { background: 'var(--surface)', padding: '24px' },
  metricTag: { fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green-dim)', marginBottom: '10px', fontFamily: 'Fira Sans Condensed, sans-serif' },
  metricNum: { fontFamily: 'Fira Sans Condensed, sans-serif', fontWeight: 800, fontSize: '36px', letterSpacing: '-1px', color: 'var(--offwhite)', lineHeight: 1 },
  metricUnit: { fontSize: '14px', color: 'var(--gray)', fontWeight: 400, marginLeft: '2px' },
  metricSubLabel: { fontSize: '9px', color: 'var(--gray)', letterSpacing: '1px', marginTop: '8px' },

  row2: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--gray-mid)', border: '1px solid var(--gray-mid)', marginBottom: '1px' },
  row3: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--gray-mid)', border: '1px solid var(--gray-mid)', marginBottom: '1px' },
  row4: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'var(--gray-mid)', border: '1px solid var(--gray-mid)', marginBottom: '1px' },

  chartCard: { background: 'var(--surface)', padding: '24px' },
  infoCard: { background: 'var(--surface)', padding: '24px' },
  cardTag: { fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green-dim)', marginBottom: '12px', fontFamily: 'Fira Sans Condensed, sans-serif' },
  infoText: { fontSize: '13px', lineHeight: 1.8, color: 'var(--offwhite)', fontWeight: 400 },

  regenBtn: { background: 'var(--gray-dark)', border: '1px solid var(--gray-mid)', color: 'var(--gray)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', padding: '16px 24px', display: 'block', width: '100%', textAlign: 'left', fontFamily: 'Fira Sans Condensed, sans-serif', marginTop: '1px' },
}
