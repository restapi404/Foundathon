import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: startups } = await supabase
    .from('startups')
    .select('*')
    .eq('founder_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header} className="fade-up">
          <div>
            <p style={styles.tag}>// Dashboard</p>
            <h1 style={styles.title}>
              Welcome back,{' '}
              <span style={{ color: 'var(--green)', fontFamily: 'Instrument Serif, serif', fontStyle: 'italic', fontWeight: 400 }}>
                {profile?.full_name?.split(' ')[0] || 'Founder'}.
              </span>
            </h1>
            <p style={styles.sub}>{user.email} · {profile?.role || 'founder'}</p>
          </div>

          <Link href="/startups/create" style={styles.ctaBtn}>
            + List New Startup
          </Link>
        </div>

        {/* Stats */}
        <div style={styles.statsRow} className="fade-up delay-1">
          {[
            { num: startups?.length ?? 0, label: 'Your Listings' },
            { num: '—', label: 'Profile Views' },
            { num: '—', label: 'Connections' },
          ].map(s => (
            <div key={s.label} style={styles.statCard}>
              <div style={styles.statNum}>{s.num}</div>
              <div style={styles.statLabel}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Startups */}
        <section className="fade-up delay-2">
          <h2 style={styles.sectionTitle}>Your Startups</h2>

          {!startups || startups.length === 0 ? (
            <div style={styles.empty}>
              <p style={styles.emptyTitle}>No startups listed yet.</p>
              <p style={styles.emptySub}>Share your climate venture with investors and researchers.</p>
              <Link href="/startups/create" style={styles.emptyBtn}>
                List Your First Startup →
              </Link>
            </div>
          ) : (
            <div style={styles.listingTable}>
              {startups.map(startup => (
                <Link key={startup.id} href={`/startups/${startup.id}`} style={styles.listingRow}>
                  <div>
                    <div style={styles.listingName}>{startup.name}</div>
                    <div style={styles.listingMeta}>{startup.sector} · {startup.stage}</div>
                  </div>
                  <div style={styles.listingRight}>
                    <span style={styles.listingFunding}>{startup.funding_needed || '—'}</span>
                    <span style={styles.listingArrow}>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

const styles = {
  page: {
    paddingTop: '80px',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '60px 48px 100px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: '52px',
    flexWrap: 'wrap',
    gap: '24px',
  },
  tag: {
    fontSize: '10px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--green)',
    marginBottom: '12px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(28px, 4vw, 44px)',
    letterSpacing: '-1.5px',
    marginBottom: '8px',
  },
  sub: {
    fontSize: '12px',
    color: 'var(--gray)',
    fontWeight: 300,
    letterSpacing: '0.5px',
  },
  ctaBtn: {
    background: 'var(--green)',
    color: 'var(--black)',
    padding: '14px 28px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '13px',
    letterSpacing: '0.5px',
    display: 'inline-block',
    flexShrink: 0,
  },
  statsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1px',
    background: 'var(--gray-mid)',
    border: '1px solid var(--gray-mid)',
    marginBottom: '60px',
  },
  statCard: {
    background: 'var(--gray-dark)',
    padding: '32px',
  },
  statNum: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '40px',
    letterSpacing: '-2px',
    color: 'var(--offwhite)',
    lineHeight: 1,
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
  },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid var(--gray-mid)',
  },
  empty: {
    background: 'var(--gray-dark)',
    border: '1px solid rgba(26,255,107,0.1)',
    padding: '60px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '18px',
    marginBottom: '10px',
  },
  emptySub: {
    fontSize: '13px',
    color: 'var(--gray)',
    fontWeight: 300,
    marginBottom: '32px',
  },
  emptyBtn: {
    display: 'inline-block',
    background: 'var(--green)',
    color: 'var(--black)',
    padding: '14px 28px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '13px',
  },
  listingTable: {
    border: '1px solid var(--gray-mid)',
    overflow: 'hidden',
  },
  listingRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: '1px solid var(--gray-mid)',
    transition: 'background 0.2s',
    cursor: 'pointer',
    textDecoration: 'none',
  },
  listingName: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '15px',
    color: 'var(--offwhite)',
    marginBottom: '4px',
  },
  listingMeta: {
    fontSize: '11px',
    color: 'var(--gray)',
    letterSpacing: '1px',
  },
  listingRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  listingFunding: {
    fontSize: '12px',
    color: 'var(--green)',
  },
  listingArrow: {
    color: 'var(--green)',
    fontSize: '16px',
  },
}
