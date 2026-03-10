import Link from 'next/link'

export default function HomePage() {
  return (
    <div style={styles.page}>
      {/* Subtle grid bg */}
      <div style={styles.gridBg} />

      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <div style={styles.badge} className="fade-up">
            <span style={styles.dot} />
            AI-Driven · Climate Tech
          </div>

          <h1 style={styles.title} className="fade-up delay-1">
            Where <span style={styles.italic}>climate</span> capital<br />
            finds its match
          </h1>

          <p style={styles.sub} className="fade-up delay-2">
            Verdant connects green innovators with investors, researchers,
            and talent — all focused on accelerating the world's most
            critical climate solutions.
          </p>

          <div style={styles.actions} className="fade-up delay-3">
            <Link href="/startups" style={styles.btnPrimary}>
              Explore Startups →
            </Link>
            <Link href="/auth?mode=signup" style={styles.btnGhost}>
              List Your Startup
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={styles.statsSection} className="fade-up delay-3">
        <div style={styles.statsInner}>
          {[
            { num: '$2.4B', label: 'Capital Tracked' },
            { num: '840+', label: 'Climate Ventures' },
            { num: '94%', label: 'Match Accuracy' },
            { num: '3.2×', label: 'Faster Funding' },
          ].map(s => (
            <div key={s.label} style={styles.statItem}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howSection}>
        <div style={styles.sectionInner}>
          <p style={styles.sectionTag} className="fade-up">// How It Works</p>
          <h2 style={styles.sectionTitle} className="fade-up delay-1">
            From pitch to funded —<br />intelligently.
          </h2>

          <div style={styles.stepsGrid}>
            {[
              {
                num: '01',
                icon: '🌱',
                title: 'Submit Your Project',
                desc: 'Climate startups onboard with structured data — financials, impact metrics, tech stack, team, and traction.',
              },
              {
                num: '02',
                icon: '🤖',
                title: 'AI Evaluation',
                desc: 'Our model scores each project across key dimensions — climate impact, market risk, financial health, and team credibility.',
              },
              {
                num: '03',
                icon: '⚡',
                title: 'Smart Matching',
                desc: 'Investors with matching thesis, check size, and sector focus are surfaced to your deal. No cold outreach. Just aligned capital.',
              },
            ].map((step, i) => (
              <div key={step.num} style={styles.stepCard} className="fade-up" style2={{ animationDelay: `${i * 0.1}s` }}>
                <div style={styles.stepNum}>{step.num}</div>
                <div style={styles.stepIcon}>{step.icon}</div>
                <h3 style={styles.stepTitle}>{step.title}</h3>
                <p style={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaInner}>
          <h2 style={styles.ctaTitle}>
            Ready to accelerate<br />
            <span style={styles.italic}>climate capital?</span>
          </h2>
          <p style={styles.ctaSub}>
            Join hundreds of founders, investors, and researchers already on Verdant.
          </p>
          <div style={styles.ctaActions}>
            <Link href="/auth?mode=signup" style={styles.ctaBtnPrimary}>
              Create Free Account →
            </Link>
            <Link href="/startups" style={styles.ctaBtnGhost}>
              Browse Startups
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
  },
  gridBg: {
    position: 'fixed',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(0,166,62,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,166,62,0.04) 1px, transparent 1px)
    `,
    backgroundSize: '52px 52px',
    pointerEvents: 'none',
    zIndex: 0,
  },

  // Hero
  hero: {
    minHeight: '88vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '160px 48px 100px',
    position: 'relative',
    zIndex: 1,
  },
  heroInner: {
    maxWidth: '820px',
    width: '100%',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    border: '1px solid #c8e0d0',
    background: '#f0f7f2',
    padding: '7px 18px',
    fontSize: '11px',
    letterSpacing: '2.5px',
    textTransform: 'uppercase',
    color: '#00a63e',
    marginBottom: '36px',
    borderRadius: '2px',
  },
  dot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    background: '#00a63e',
    display: 'inline-block',
    animation: 'pulse 2s ease-in-out infinite',
  },
  title: {
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(52px, 6.5vw, 88px)',
    lineHeight: 1.0,
    letterSpacing: '-4px',
    marginBottom: '40px',
    color: '#0d1a0f',
  },
  italic: {
    fontFamily: 'Fira Sans, sans-serif',
    fontStyle: 'italic',
    fontWeight: 700,
    color: '#00a63e',
  },
  sub: {
    fontSize: '18px',
    lineHeight: 1.8,
    color: '#4a6b52',
    maxWidth: '640px',
    margin: '0 auto 64px',
    fontWeight: 300,
    fontFamily: 'Fira Sans, sans-serif',
  },
  actions: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnPrimary: {
    background: '#00a63e',
    color: '#ffffff',
    padding: '20px 52px',
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    letterSpacing: '0.5px',
    display: 'inline-block',
    borderRadius: '3px',
    transition: 'all 0.2s',
  },
  btnGhost: {
    background: 'transparent',
    color: '#0d1a0f',
    padding: '20px 52px',
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    border: '1px solid #c8e0d0',
    display: 'inline-block',
    borderRadius: '3px',
    transition: 'all 0.2s',
  },

  // Stats
  statsSection: {
    borderTop: '1px solid #e4ece5',
    borderBottom: '1px solid #e4ece5',
    background: '#f8fbf8',
    position: 'relative',
    zIndex: 1,
  },
  statsInner: {
    maxWidth: '900px',
    margin: '0 auto',
    padding: '60px 48px',
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    textAlign: 'center',
  },
  statItem: {},
  statNum: {
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(32px, 4vw, 48px)',
    color: '#0d1a0f',
    letterSpacing: '-1.5px',
    lineHeight: 1,
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '11px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#4a6b52',
    fontFamily: 'Fira Code, monospace',
  },

  // How it works
  howSection: {
    padding: '120px 48px',
    position: 'relative',
    zIndex: 1,
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  sectionTag: {
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#00a63e',
    marginBottom: '20px',
    fontFamily: 'Fira Code, monospace',
  },
  sectionTitle: {
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(36px, 4vw, 56px)',
    letterSpacing: '-2px',
    lineHeight: 1.05,
    marginBottom: '64px',
    color: '#0d1a0f',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
  },
  stepCard: {
    background: '#f0f7f2',
    border: '1px solid #c8e0d0',
    borderRadius: '6px',
    padding: '40px 36px',
  },
  stepNum: {
    fontFamily: 'Fira Sans, sans-serif',
    fontStyle: 'italic',
    fontSize: '52px',
    color: 'rgba(0,166,62,0.15)',
    lineHeight: 1,
    marginBottom: '-8px',
    fontWeight: 700,
  },
  stepIcon: { fontSize: '28px', marginBottom: '16px' },
  stepTitle: {
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '20px',
    marginBottom: '12px',
    color: '#0d1a0f',
  },
  stepDesc: {
    fontSize: '14px',
    lineHeight: 1.8,
    color: '#4a6b52',
    fontWeight: 300,
    fontFamily: 'Fira Sans, sans-serif',
  },

  // CTA
  ctaSection: {
    background: '#0d1a0f',
    padding: '100px 48px',
    position: 'relative',
    zIndex: 1,
  },
  ctaInner: {
    maxWidth: '700px',
    margin: '0 auto',
    textAlign: 'center',
  },
  ctaTitle: {
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(36px, 5vw, 60px)',
    letterSpacing: '-2px',
    lineHeight: 1.05,
    marginBottom: '20px',
    color: '#e8efe9',
  },
  ctaSub: {
    fontSize: '15px',
    color: '#8a9e8d',
    marginBottom: '44px',
    lineHeight: 1.7,
    fontFamily: 'Fira Sans, sans-serif',
    fontWeight: 300,
  },
  ctaActions: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaBtnPrimary: {
    background: '#00a63e',
    color: '#ffffff',
    padding: '18px 40px',
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    display: 'inline-block',
    borderRadius: '3px',
  },
  ctaBtnGhost: {
    background: 'transparent',
    color: '#e8efe9',
    padding: '18px 40px',
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 700,
    fontSize: '16px',
    border: '1px solid rgba(232,239,233,0.2)',
    display: 'inline-block',
    borderRadius: '3px',
  },
}