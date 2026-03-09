'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

const SECTOR_COLORS = {
  'Solar': '#f59e0b', 'Wind': '#60a5fa', 'Carbon Capture': '#1aff6b',
  'EV': '#a78bfa', 'Climate Data': '#f472b6', 'Sustainable Agriculture': '#34d399',
  'Geothermal': '#fb923c', 'Ocean Energy': '#38bdf8',
}

export default function AnalysisPage() {
  const { id } = useParams()
  const [startup, setStartup] = useState(null)
  const [analysis, setAnalysis] = useState(null)
  const [status, setStatus] = useState('loading-startup')

  useEffect(() => {
    async function run() {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('startups')
        .select('*, profiles(full_name, role)')
        .eq('id', id)
        .single()

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

  const accent = startup ? (SECTOR_COLORS[startup.sector] || '#1aff6b') : '#1aff6b'
  const scoreColor =
    analysis?.score >= 80 ? '#1aff6b' :
    analysis?.score >= 60 ? '#f59e0b' :
    analysis?.score >= 40 ? '#60a5fa' : '#9ca3af'

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
            <span style={{ ...p.sectorTag, borderColor: accent, color: accent }}>
              {startup.sector}
            </span>
            <h1 style={p.title}>{startup.name}</h1>
            <p style={p.tagline}>{startup.tagline}</p>
          </div>
        )}

        {(status === 'loading-startup' || status === 'analyzing') && (
          <div style={p.loadingWrap}>
            <div style={p.pulseRing} />
            <div style={p.loadingInner}>
              <div style={p.spinnerWrap}>
                <div style={p.spinner} />
              </div>
              <p style={p.loadingTitle}>
                {status === 'loading-startup' ? 'Fetching startup data...' : `Analyzing ${startup?.name || 'startup'}...`}
              </p>
              <p style={p.loadingSubtitle}>
                {status === 'analyzing' && 'Evaluating investment thesis, risks, and market opportunity'}
              </p>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div style={p.errorBox}>
            <p style={p.errorTitle}>Analysis failed</p>
            <p style={p.errorSub}>Something went wrong. Check your GEMINI_API_KEY in .env.local.</p>
            {startup && (
              <button onClick={() => generateAnalysis(startup)} style={p.retryBtn}>
                Retry →
              </button>
            )}
          </div>
        )}

        {status === 'done' && analysis && (
          <div className="fade-up">
            <div style={p.verdictBanner}>
              <span style={p.verdictIcon}>✦</span>
              <p style={p.verdictText}>{analysis.verdict}</p>
            </div>

            <div style={p.scoreGrid}>
              <div style={p.scoreCard}>
                <div style={p.scoreTop}>
                  <span style={{ ...p.scoreNum, color: scoreColor }}>{analysis.score}</span>
                  <span style={p.scoreSlash}>/100</span>
                </div>
                <div style={{ ...p.scoreLabel, color: scoreColor }}>{analysis.scoreLabel}</div>
                <div style={p.scoreBarTrack}>
                  <div style={{ ...p.scoreBarFill, width: `${analysis.score}%`, background: scoreColor }} />
                </div>
                <div style={p.scoreSubLabel}>Investment Attractiveness</div>
              </div>

              <div style={p.comparableCard}>
                <div style={p.cardTag}>// Comparable</div>
                <p style={p.cardText}>{analysis.comparable}</p>
              </div>

              <div style={p.investorCard}>
                <div style={p.cardTag}>// Ideal Investor</div>
                <p style={p.cardText}>{analysis.investorFit}</p>
              </div>
            </div>

            <div style={p.blocks}>
              <div style={p.block}>
                <div style={p.blockTag}>// Investment Thesis</div>
                <p style={p.blockText}>{analysis.thesis}</p>
              </div>
              <div style={p.block}>
                <div style={p.blockTag}>// Market Opportunity</div>
                <p style={p.blockText}>{analysis.opportunity}</p>
              </div>
              <div style={{ ...p.block, borderBottom: 'none' }}>
                <div style={p.blockTag}>// Risk Factors</div>
                <ul style={p.riskList}>
                  {analysis.risks.map((r, i) => (
                    <li key={i} style={p.riskItem}>
                      <span style={p.riskIcon}>▲</span>
                      {r}
                    </li>
                  ))}
                </ul>
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
  page: { minHeight: '100vh', paddingTop: '80px', position: 'relative' },
  accentBar: { position: 'fixed', top: 0, left: 0, right: 0, height: '2px', zIndex: 200, opacity: 0.7 },
  container: { maxWidth: '900px', margin: '0 auto', padding: '60px 48px 120px' },
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '52px' },
  back: { fontSize: '11px', letterSpacing: '1px', color: 'var(--gray)' },
  navTag: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)' },
  header: { marginBottom: '52px' },
  sectorTag: { display: 'inline-block', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid', padding: '4px 12px', marginBottom: '20px' },
  title: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '-2px', lineHeight: 1.0, marginBottom: '12px' },
  tagline: { fontSize: '15px', color: 'var(--gray)', fontWeight: 300, lineHeight: 1.6 },
  loadingWrap: { position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '100px 0' },
  pulseRing: { position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', border: '1px solid rgba(26,255,107,0.08)', animation: 'pulse 2s ease-in-out infinite' },
  loadingInner: { textAlign: 'center', position: 'relative', zIndex: 2 },
  spinnerWrap: { display: 'flex', justifyContent: 'center', marginBottom: '24px' },
  spinner: { width: '32px', height: '32px', border: '2px solid var(--gray-mid)', borderTop: '2px solid var(--green)', borderRadius: '50%', animation: 'spin 0.9s linear infinite' },
  loadingTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', marginBottom: '8px', color: 'var(--offwhite)' },
  loadingSubtitle: { fontSize: '12px', color: 'var(--gray)', fontWeight: 300 },
  errorBox: { background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.2)', padding: '60px', textAlign: 'center' },
  errorTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '18px', color: '#f87171', marginBottom: '8px' },
  errorSub: { fontSize: '13px', color: 'var(--gray)', fontWeight: 300, marginBottom: '28px' },
  retryBtn: { background: 'var(--green)', color: 'var(--black)', border: 'none', padding: '14px 32px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', cursor: 'pointer' },
  verdictBanner: { background: 'rgba(26,255,107,0.04)', border: '1px solid rgba(26,255,107,0.2)', padding: '24px 28px', display: 'flex', gap: '16px', alignItems: 'flex-start', marginBottom: '1px' },
  verdictIcon: { color: 'var(--green)', fontSize: '14px', flexShrink: 0, marginTop: '2px' },
  verdictText: { fontSize: '15px', lineHeight: 1.7, color: 'var(--offwhite)', fontWeight: 400, fontStyle: 'italic', fontFamily: 'Instrument Serif, serif' },
  scoreGrid: { display: 'grid', gridTemplateColumns: '200px 1fr 1fr', gap: '1px', background: 'var(--gray-mid)', border: '1px solid var(--gray-mid)', marginBottom: '1px' },
  scoreCard: { background: 'var(--gray-dark)', padding: '28px' },
  scoreTop: { display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '6px' },
  scoreNum: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '52px', letterSpacing: '-2px', lineHeight: 1 },
  scoreSlash: { fontSize: '14px', color: 'var(--gray)' },
  scoreLabel: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', marginBottom: '12px' },
  scoreBarTrack: { height: '2px', background: 'var(--gray-mid)', marginBottom: '8px' },
  scoreBarFill: { height: '100%', transition: 'width 1.2s ease' },
  scoreSubLabel: { fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--gray)' },
  comparableCard: { background: 'var(--gray-dark)', padding: '28px' },
  investorCard: { background: 'var(--gray-dark)', padding: '28px' },
  cardTag: { fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '12px', fontFamily: 'Syne, sans-serif' },
  cardText: { fontSize: '13px', color: 'var(--offwhite)', lineHeight: 1.7, fontWeight: 300 },
  blocks: { border: '1px solid var(--gray-mid)', overflow: 'hidden', marginBottom: '1px' },
  block: { padding: '28px', borderBottom: '1px solid var(--gray-mid)', background: 'var(--gray-dark)' },
  blockTag: { fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '12px', fontFamily: 'Syne, sans-serif' },
  blockText: { fontSize: '14px', lineHeight: 1.9, color: 'var(--offwhite)', fontWeight: 300 },
  riskList: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' },
  riskItem: { display: 'flex', gap: '12px', alignItems: 'flex-start', fontSize: '14px', color: 'var(--offwhite)', fontWeight: 300, lineHeight: 1.7 },
  riskIcon: { color: '#f59e0b', fontSize: '8px', marginTop: '6px', flexShrink: 0 },
  regenBtn: { background: 'var(--gray-dark)', border: '1px solid var(--gray-mid)', color: 'var(--gray)', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer', padding: '16px 24px', display: 'block', width: '100%', textAlign: 'left', fontFamily: 'Syne, sans-serif' },
}
