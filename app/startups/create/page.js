'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const SECTORS = ['Solar', 'Wind', 'Carbon Capture', 'EV', 'Climate Data', 'Sustainable Agriculture', 'Geothermal', 'Ocean Energy']
const STAGES = ['Idea', 'Prototype', 'Early Startup', 'Scaling']
const FUNDING = ['< $50k', '$50k–$500k', '$500k–$2M', '$2M+', 'Not seeking funding']

export default function CreateStartupPage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [checking, setChecking] = useState(true)
  const [form, setForm] = useState({
    name: '', tagline: '', description: '',
    sector: '', stage: '', location: '',
    funding_needed: '', website: '', team_size: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth')
      } else {
        setUser(user)
        setChecking(false)
      }
    })
  }, [])

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await supabase
      .from('startups')
      .insert({ ...form, founder_id: user.id })
      .select()
      .single()

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push(`/startups/${data.id}`)
    }
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gray)', fontFamily: 'DM Mono, monospace', fontSize: '13px' }}>
        Checking session...
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />

      <div style={styles.container}>
        <div style={styles.header} className="fade-up">
          <p style={styles.tag}>// New Listing</p>
          <h1 style={styles.title}>List your startup.</h1>
          <p style={styles.sub}>Tell the Verdant community about your climate venture.</p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form} className="fade-up delay-1">

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Basic Info</h2>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Startup Name *</label>
                <input required value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. SolarGrid Africa" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Tagline *</label>
                <input required value={form.tagline} onChange={e => set('tagline', e.target.value)} placeholder="One line — what do you do?" style={styles.input} />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Description *</label>
              <textarea required value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe your startup, the problem you solve, and your approach..." rows={5} style={{ ...styles.input, resize: 'vertical' }} />
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Classification</h2>
            <div style={styles.field}>
              <label style={styles.label}>Sector *</label>
              <div style={styles.optionGrid}>
                {SECTORS.map(s => (
                  <button key={s} type="button" onClick={() => set('sector', s)}
                    style={{ ...styles.optionBtn, ...(form.sector === s ? styles.optionBtnActive : {}) }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Stage *</label>
              <div style={styles.optionGrid}>
                {STAGES.map(s => (
                  <button key={s} type="button" onClick={() => set('stage', s)}
                    style={{ ...styles.optionBtn, ...(form.stage === s ? styles.optionBtnActive : {}) }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </section>

          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Details</h2>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label}>Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} placeholder="e.g. Bangalore, India" style={styles.input} />
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Team Size</label>
                <input value={form.team_size} onChange={e => set('team_size', e.target.value)} placeholder="e.g. 3" type="number" min="1" style={styles.input} />
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Funding Needed</label>
              <div style={styles.optionGrid}>
                {FUNDING.map(f => (
                  <button key={f} type="button" onClick={() => set('funding_needed', f)}
                    style={{ ...styles.optionBtn, ...(form.funding_needed === f ? styles.optionBtnActive : {}) }}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Website</label>
              <input value={form.website} onChange={e => set('website', e.target.value)} placeholder="https://yourstartup.com" type="url" style={styles.input} />
            </div>
          </section>

          {error && <div style={styles.error}>{error}</div>}

          <button type="submit" disabled={loading || !form.sector || !form.stage} style={styles.submitBtn}>
            {loading ? 'Publishing...' : 'Publish Startup →'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', paddingTop: '80px', position: 'relative' },
  gridBg: {
    position: 'absolute', inset: 0,
    backgroundImage: `linear-gradient(rgba(26,255,107,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(26,255,107,0.02) 1px, transparent 1px)`,
    backgroundSize: '60px 60px', pointerEvents: 'none',
  },
  container: { maxWidth: '800px', margin: '0 auto', padding: '60px 48px 100px', position: 'relative', zIndex: 2 },
  header: { marginBottom: '52px' },
  tag: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' },
  title: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '40px', letterSpacing: '-2px', marginBottom: '10px' },
  sub: { fontSize: '13px', color: 'var(--gray)', fontWeight: 300 },
  form: { display: 'flex', flexDirection: 'column', gap: '48px' },
  section: { display: 'flex', flexDirection: 'column', gap: '24px', borderTop: '1px solid var(--gray-mid)', paddingTop: '32px' },
  sectionTitle: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' },
  row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '10px' },
  label: { fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' },
  input: { background: 'var(--gray-dark)', border: '1px solid rgba(26,255,107,0.15)', color: 'var(--offwhite)', padding: '14px 16px', fontSize: '13px', outline: 'none', width: '100%' },
  optionGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  optionBtn: { background: 'transparent', border: '1px solid rgba(26,255,107,0.15)', color: 'var(--gray)', padding: '8px 16px', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s' },
  optionBtnActive: { background: 'rgba(26,255,107,0.1)', borderColor: 'var(--green)', color: 'var(--green)' },
  error: { background: 'rgba(255,77,77,0.1)', border: '1px solid rgba(255,77,77,0.3)', color: '#ff6b6b', padding: '12px 16px', fontSize: '12px' },
  submitBtn: { background: 'var(--green)', color: 'var(--black)', border: 'none', padding: '18px 40px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px', cursor: 'pointer', alignSelf: 'flex-start' },
}