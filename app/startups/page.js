import { createClient } from '@/lib/supabase/server'
import StartupGrid from '@/components/StartupGrid'

export const revalidate = 0

const SECTORS = ['All', 'Solar', 'Wind', 'Carbon Capture', 'EV', 'Climate Data', 'Sustainable Agriculture', 'Geothermal', 'Ocean Energy']
const STAGES = ['All', 'Idea', 'Prototype', 'Early Startup', 'Scaling']

export default async function StartupsPage({ searchParams }) {
  const supabase = createClient()

  let query = supabase
    .from('startups')
    .select('*, profiles(full_name, role)')
    .order('created_at', { ascending: false })

  if (searchParams.sector && searchParams.sector !== 'All') {
    query = query.eq('sector', searchParams.sector)
  }
  if (searchParams.stage && searchParams.stage !== 'All') {
    query = query.eq('stage', searchParams.stage)
  }
  if (searchParams.q) {
    query = query.ilike('name', `%${searchParams.q}%`)
  }

  const { data: startups, error } = await query

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <p style={styles.tag}>// Climate Startup Explorer</p>
          <h1 style={styles.title}>
            Find your next<br />
            <span style={styles.italic}>climate investment.</span>
          </h1>
          <p style={styles.sub}>
            {startups?.length ?? 0} verified climate ventures — browse, filter, and connect.
          </p>
        </div>
      </div>

      <StartupGrid startups={startups || []} sectors={SECTORS} stages={STAGES} />
    </div>
  )
}

const styles = {
  page: {
    paddingTop: '80px',
    minHeight: '100vh',
  },
  header: {
    borderBottom: '1px solid var(--gray-mid)',
    padding: '60px 48px 52px',
  },
  headerInner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  tag: {
    fontSize: '13px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: 'var(--green)',
    marginBottom: '16px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: 'clamp(40px, 5vw, 64px)',
    letterSpacing: '-2px',
    lineHeight: 1.05,
    marginBottom: '16px',
  },
  italic: {
    fontFamily: 'Instrument Serif, serif',
    fontStyle: 'italic',
    fontWeight: 400,
    color: 'var(--green)',
  },
  sub: {
    fontSize: '16px',
    color: 'var(--gray)',
    fontWeight: 300,
  },
}
