import Link from 'next/link'

const SECTOR_COLORS = {
  'Solar': '#f59e0b',
  'Wind': '#60a5fa',
  'Carbon Capture': '#1aff6b',
  'EV': '#a78bfa',
  'Climate Data': '#f472b6',
  'Sustainable Agriculture': '#34d399',
  'Geothermal': '#fb923c',
  'Ocean Energy': '#38bdf8',
}

const STAGE_LABELS = {
  'Idea': '💡',
  'Prototype': '🔬',
  'Early Startup': '🌱',
  'Scaling': '🚀',
}

export default function StartupCard({ startup, index }) {
  const accentColor = SECTOR_COLORS[startup.sector] || 'var(--green)'

  return (
    <Link href={`/startups/${startup.id}`} style={{ textDecoration: 'none' }}>
      <div style={{ ...styles.card, animationDelay: `${index * 0.05}s` }} className="fade-up">
        <div style={{ ...styles.accentBar, background: accentColor }} />

        <div style={styles.top}>
          <div style={styles.sectorTag}>
            <span style={{ ...styles.sectorDot, background: accentColor }} />
            {startup.sector}
          </div>
          <div style={styles.stageTag}>
            {STAGE_LABELS[startup.stage] || '◆'} {startup.stage}
          </div>
        </div>

        <h3 style={styles.name}>{startup.name}</h3>

        <p style={styles.desc}>
          {startup.description?.slice(0, 120)}{startup.description?.length > 120 ? '...' : ''}
        </p>

        <div style={styles.footer}>
          <div style={styles.meta}>
            {startup.location && (
              <span style={styles.metaItem}>📍 {startup.location}</span>
            )}
            {startup.funding_needed && (
              <span style={styles.metaItem}>💰 {startup.funding_needed}</span>
            )}
          </div>
          <span style={styles.arrow}>→</span>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    background: 'var(--black)',
    padding: '36px 32px',
    position: 'relative',
    overflow: 'hidden',
    transition: 'background 0.2s',
    cursor: 'pointer',
    display: 'block',
    minHeight: '220px',
  },
  accentBar: {
    position: 'absolute',
    left: 0, top: 0, bottom: 0,
    width: '3px',
    opacity: 0.7,
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  sectorTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '10px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
  },
  sectorDot: {
    width: '6px', height: '6px',
    borderRadius: '50%',
    display: 'inline-block',
  },
  stageTag: {
    fontSize: '10px',
    color: 'var(--gray)',
    letterSpacing: '1px',
  },
  name: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '20px',
    letterSpacing: '-0.5px',
    marginBottom: '12px',
    color: 'var(--offwhite)',
  },
  desc: {
    fontSize: '12px',
    lineHeight: 1.8,
    color: 'var(--gray)',
    fontWeight: 300,
    marginBottom: '24px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '11px',
    color: 'var(--gray)',
  },
  arrow: {
    color: 'var(--green)',
    fontSize: '18px',
    transition: 'transform 0.2s',
  },
}
