import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Avatar from '@/components/Avatar'

const ROLE_COLORS = {
  founder:    'var(--green)',
  investor:   '#60a5fa',
  researcher: '#a78bfa',
  talent:     '#f59e0b',
}

export default async function ProfilePage({ params }) {
  const supabase = createClient()

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', params.id).single()

  if (!profile) notFound()

  const { data: startups } = await supabase
    .from('startups').select('*').eq('founder_id', params.id)
    .order('created_at', { ascending: false })

  const roleColor = ROLE_COLORS[profile.role] || 'var(--green)'
  const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  return (
    <div style={s.page}>
      <div style={s.container}>

        {/* Header */}
        <div style={s.header} className="fade-up">
          <div style={s.avatarWrap}>
            <Avatar name={profile.full_name} size={72} />
          </div>
          <div style={s.headerInfo}>
            <div style={s.nameRow}>
              <h1 style={s.name}>{profile.full_name || 'Anonymous'}</h1>
              <span style={{ ...s.rolePill, borderColor: roleColor, color: roleColor }}>
                {profile.role}
              </span>
            </div>
            <div style={s.metaRow}>
              {profile.location && <span style={s.metaItem}>📍 {profile.location}</span>}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" style={s.websiteLink}>
                  ↗ {profile.website.replace(/^https?:\/\//, '')}
                </a>
              )}
              <span style={s.metaItem}>Joined {joinDate}</span>
            </div>
            {profile.bio && <p style={s.bio}>{profile.bio}</p>}
          </div>
          <Link href={`/profile/${params.id}/edit`} style={s.editBtn}>
            Edit Profile
          </Link>
        </div>

        <div style={s.divider} />

        {/* Startups */}
        {profile.role === 'founder' && (
          <section className="fade-up delay-1">
            <h2 style={s.sectionTitle}>
              Climate Ventures
              {startups?.length > 0 && <span style={s.count}>{startups.length}</span>}
            </h2>

            {!startups || startups.length === 0 ? (
              <div style={s.empty}>
                <p style={s.emptyTitle}>No startups listed yet.</p>
              </div>
            ) : (
              <div style={s.listingTable}>
                {startups.map(startup => (
                  <Link key={startup.id} href={`/startups/${startup.id}`} style={s.listingRow}>
                    <div>
                      <div style={s.listingName}>{startup.name}</div>
                      <div style={s.listingMeta}>{startup.sector} · {startup.stage}</div>
                      {startup.tagline && <div style={s.listingTagline}>{startup.tagline}</div>}
                    </div>
                    <div style={s.listingRight}>
                      {startup.funding_needed && (
                        <span style={s.funding}>{startup.funding_needed}</span>
                      )}
                      <span style={s.arrow}>→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        )}

        {profile.role !== 'founder' && (
          <div style={s.empty}>
            <p style={s.emptyTitle}>
              {profile.role === 'investor' ? 'Exploring climate investment opportunities.' :
               profile.role === 'researcher' ? 'Advancing climate research and knowledge.' :
               'Looking for climate opportunities.'}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', paddingTop: '80px' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '60px 48px 100px' },
  header: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '28px',
    marginBottom: '48px',
    flexWrap: 'wrap',
  },
  avatarWrap: { flexShrink: 0, paddingTop: '4px' },
  headerInfo: { flex: 1 },
  nameRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' },
  name: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(24px, 4vw, 40px)',
    letterSpacing: '-1.5px',
    color: 'var(--offwhite)',
  },
  rolePill: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    border: '1px solid',
    padding: '4px 12px',
  },
  metaRow: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', marginBottom: '16px' },
  metaItem: { fontSize: '12px', color: 'var(--gray)', letterSpacing: '0.5px' },
  websiteLink: { fontSize: '12px', color: 'var(--green)', letterSpacing: '0.5px' },
  bio: {
    fontSize: '14px',
    lineHeight: 1.8,
    color: 'var(--gray)',
    fontWeight: 300,
    maxWidth: '520px',
  },
  editBtn: {
    flexShrink: 0,
    background: 'transparent',
    border: '1px solid rgba(232,239,233,0.2)',
    color: 'var(--gray)',
    padding: '9px 20px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '11px',
    letterSpacing: '1px',
    display: 'inline-block',
  },
  divider: { height: '1px', background: 'var(--gray-mid)', marginBottom: '48px' },
  sectionTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  count: {
    background: 'var(--gray-mid)',
    color: 'var(--green)',
    fontSize: '10px',
    padding: '2px 8px',
    letterSpacing: '1px',
  },
  empty: {
    background: 'var(--gray-dark)',
    border: '1px solid rgba(26,255,107,0.1)',
    padding: '48px',
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: '14px',
    color: 'var(--gray)',
    fontWeight: 300,
    fontFamily: 'DM Mono, monospace',
    fontStyle: 'italic',
  },
  listingTable: { border: '1px solid var(--gray-mid)', overflow: 'hidden' },
  listingRow: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px', borderBottom: '1px solid var(--gray-mid)',
    transition: 'background 0.2s', textDecoration: 'none',
  },
  listingName: {
    fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '15px',
    color: 'var(--offwhite)', marginBottom: '4px',
  },
  listingMeta: { fontSize: '11px', color: 'var(--gray)', letterSpacing: '1px', marginBottom: '4px' },
  listingTagline: { fontSize: '12px', color: 'var(--gray)', fontWeight: 300, fontStyle: 'italic' },
  listingRight: { display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 },
  funding: { fontSize: '12px', color: 'var(--green)' },
  arrow: { color: 'var(--green)', fontSize: '16px' },
}
