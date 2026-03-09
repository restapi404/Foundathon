import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={styles.page}>
      {/* Grid background */}
      <div style={styles.gridBg} />

      <div style={styles.hero}>
        <div style={styles.badge} className="fade-up">
          <span style={styles.dot} />
          AI-Powered · Climate Tech
        </div>

        <h1 style={styles.title} className="fade-up delay-1">
          Where <span style={styles.italic}>climate</span><br />
          capital finds<br />
          its match.
        </h1>

        <p style={styles.sub} className="fade-up delay-2">
          Verdant connects green innovators with investors, researchers,
          and talent — all focused on accelerating climate solutions.
        </p>

        <div style={styles.actions} className="fade-up delay-3">
          <Link href="/startups" style={styles.btnPrimary}>
            Explore Startups →
          </Link>
          <Link href="/auth?mode=signup" style={styles.btnGhost}>
            List Your Startup
          </Link>
        </div>

        {/* Stats row */}
        <div style={styles.statsRow} className="fade-up delay-3">
          {[
            { num: '$2.4B', label: 'Capital Tracked' },
            { num: '840+', label: 'Climate Ventures' },
            { num: '94%', label: 'Match Accuracy' },
          ].map(s => (
            <div key={s.label} style={styles.statItem}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 48px 80px',
    position: 'relative',
    overflow: 'hidden',
  },
  gridBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(26,255,107,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,255,107,0.03) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  hero: {
    maxWidth: '700px',
    position: 'relative',
    zIndex: 2,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid var(--green-muted)',
    padding: '6px 16px',
    fontSize: '10px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: 'var(--green)',
    marginBottom: '32px',
  },
  dot: {
    width: '6px', height: '6px',
    borderRadius: '50%',
    background: 'var(--green)',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(48px, 6vw, 80px)',
    lineHeight: 1.0,
    letterSpacing: '-3px',
    marginBottom: '28px',
  },
  italic: {
    fontFamily: 'Instrument Serif, serif',
    fontStyle: 'italic',
    fontWeight: 400,
    color: 'var(--green)',
  },
  sub: {
    fontSize: '14px',
    lineHeight: 1.9,
    color: 'var(--gray)',
    maxWidth: '480px',
    marginBottom: '48px',
    fontWeight: 300,
  },
  actions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '80px',
  },
  btnPrimary: {
    background: 'var(--green)',
    color: 'var(--black)',
    padding: '16px 36px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.5px',
    display: 'inline-block',
    transition: 'all 0.2s',
  },
  btnGhost: {
    background: 'transparent',
    color: 'var(--offwhite)',
    padding: '16px 36px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '13px',
    border: '1px solid rgba(232,239,233,0.2)',
    display: 'inline-block',
    transition: 'all 0.2s',
  },
  statsRow: {
    display: 'flex',
    gap: '60px',
    borderTop: '1px solid var(--gray-mid)',
    paddingTop: '40px',
  },
  statItem: {},
  statNum: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '32px',
    color: 'var(--offwhite)',
    letterSpacing: '-1.5px',
    lineHeight: 1,
  },
  statLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    marginTop: '6px',
  },
}
