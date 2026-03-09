import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'

const SECTOR_COLORS = {
  'Solar': '#f59e0b', 'Wind': '#60a5fa', 'Carbon Capture': '#1aff6b',
  'EV': '#a78bfa', 'Climate Data': '#f472b6', 'Sustainable Agriculture': '#34d399',
  'Geothermal': '#fb923c', 'Ocean Energy': '#38bdf8',
}

export default async function StartupDetailPage({ params }) {
  const supabase = createClient()

  const { data: startup } = await supabase
    .from('startups')
    .select('*, profiles(full_name, role)')
    .eq('id', params.id)
    .single()

  if (!startup) notFound()

  const accent = SECTOR_COLORS[startup.sector] || 'var(--green)'

  return (
    <div style={styles.page}>
      <div style={{ ...styles.accentTop, background: accent }} />

      <div style={styles.container}>
        <Link href="/startups" style={styles.back}>← Back to Explorer</Link>
        <Link href={`/startups/${startup.id}/analysis`} style={{ ...styles.websiteBtn, borderColor: 'var(--green)', color: 'var(--green)' }}>
  View AI Analysis →
</Link>

        <div style={styles.header} className="fade-up">
          <div style={styles.tags}>
            <span style={{ ...styles.sectorTag, borderColor: accent, color: accent }}>
              {startup.sector}
            </span>
            <span style={styles.stageTag}>{startup.stage}</span>
          </div>

          <h1 style={styles.title}>{startup.name}</h1>
          <p style={styles.tagline}>{startup.tagline}</p>
        </div>

        <div style={styles.body}>
          <div style={styles.main} className="fade-up delay-1">
            <section style={styles.section}>
              <h2 style={styles.sectionTitle}>About</h2>
              <p style={styles.description}>{startup.description}</p>
            </section>
          </div>

          <aside style={styles.sidebar} className="fade-up delay-2">
            <div style={styles.infoCard}>
              <h3 style={styles.cardTitle}>Details</h3>

              {[
                { label: 'Sector', value: startup.sector },
                { label: 'Stage', value: startup.stage },
                { label: 'Location', value: startup.location || '—' },
                { label: 'Team Size', value: startup.team_size ? `${startup.team_size} people` : '—' },
                { label: 'Funding', value: startup.funding_needed || '—' },
                { label: 'Founded by', value: startup.profiles?.full_name || 'Anonymous' },
              ].map(item => (
                <div key={item.label} style={styles.infoRow}>
                  <span style={styles.infoLabel}>{item.label}</span>
                  <span style={styles.infoValue}>{item.value}</span>
                </div>
              ))}

              {startup.website && (
                <a
                  href={startup.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ ...styles.websiteBtn, borderColor: accent, color: accent }}
                >
                  Visit Website →
                </a>
              )}
            </div>

            <div style={{ ...styles.infoCard, borderColor: accent, background: `${accent}08` }}>
              <p style={{ fontSize: '11px', color: 'var(--gray)', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Interested in this startup?
              </p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, color: 'var(--offwhite)', fontWeight: 300 }}>
                Connect with the founder to explore investment, research, or collaboration opportunities.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    paddingTop: '80px',
    position: 'relative',
  },
  accentTop: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    height: '2px',
    zIndex: 200,
    opacity: 0.6,
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '60px 48px 100px',
  },
  back: {
    display: 'inline-block',
    fontSize: '11px',
    letterSpacing: '1px',
    color: 'var(--gray)',
    marginBottom: '48px',
    transition: 'color 0.2s',
  },
  header: { marginBottom: '60px' },
  tags: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  sectorTag: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: '1px solid',
    padding: '4px 12px',
  },
  stageTag: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: '1px solid rgba(26,255,107,0.2)',
    color: 'var(--gray)',
    padding: '4px 12px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(36px, 5vw, 64px)',
    letterSpacing: '-2.5px',
    lineHeight: 1.0,
    marginBottom: '16px',
  },
  tagline: {
    fontSize: '16px',
    color: 'var(--gray)',
    fontWeight: 300,
    lineHeight: 1.6,
    maxWidth: '600px',
  },
  body: {
    display: 'grid',
    gridTemplateColumns: '1fr 320px',
    gap: '60px',
    alignItems: 'start',
  },
  main: {},
  section: { marginBottom: '48px' },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: '1px solid var(--gray-mid)',
  },
  description: {
    fontSize: '15px',
    lineHeight: 2.0,
    color: 'var(--offwhite)',
    fontWeight: 300,
    whiteSpace: 'pre-wrap',
  },
  sidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    position: 'sticky',
    top: '100px',
  },
  infoCard: {
    background: 'var(--gray-dark)',
    border: '1px solid rgba(26,255,107,0.12)',
    padding: '28px',
  },
  cardTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    marginBottom: '20px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: '12px',
    marginBottom: '12px',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    gap: '16px',
  },
  infoLabel: {
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    flexShrink: 0,
  },
  infoValue: {
    fontSize: '12px',
    color: 'var(--offwhite)',
    textAlign: 'right',
  },
  websiteBtn: {
    display: 'block',
    marginTop: '20px',
    padding: '12px',
    border: '1px solid',
    textAlign: 'center',
    fontSize: '12px',
    letterSpacing: '1px',
    transition: 'all 0.2s',
  },
}
