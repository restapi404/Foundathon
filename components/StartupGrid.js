'use client'

import { useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import StartupCard from './StartupCard'

export default function StartupGrid({ startups, sectors, stages }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [sector, setSector] = useState(searchParams.get('sector') || 'All')
  const [stage, setStage] = useState(searchParams.get('stage') || 'All')

  const applyFilters = (newSector, newStage, newSearch) => {
    const params = new URLSearchParams()
    if (newSearch) params.set('q', newSearch)
    if (newSector !== 'All') params.set('sector', newSector)
    if (newStage !== 'All') params.set('stage', newStage)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.inner}>
        <input
          type="text"
          placeholder="Search startups..."
          value={search}
          onChange={e => { setSearch(e.target.value); applyFilters(sector, stage, e.target.value) }}
          style={styles.searchInput}
        />

        <div style={styles.filterSection}>
          <div style={styles.filterRow}>
            <span style={styles.filterLabel}>Sector</span>
            <div style={styles.chips}>
              {sectors.map(s => (
                <button key={s} onClick={() => { setSector(s); applyFilters(s, stage, search) }}
                  style={{ ...styles.chip, ...(sector === s ? styles.chipActive : {}) }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div style={styles.filterRow}>
            <span style={styles.filterLabel}>Stage</span>
            <div style={styles.chips}>
              {stages.map(s => (
                <button key={s} onClick={() => { setStage(s); applyFilters(sector, s, search) }}
                  style={{ ...styles.chip, ...(stage === s ? styles.chipActive : {}) }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p style={styles.count}>{startups.length} startup{startups.length !== 1 ? 's' : ''} found</p>

        {startups.length === 0 ? (
          <div style={styles.empty}>
            <div style={styles.emptyIcon}>🌱</div>
            <p style={styles.emptyTitle}>No startups found</p>
            <p style={styles.emptySub}>Try adjusting your filters, or be the first to list one.</p>
          </div>
        ) : (
          <div style={styles.grid}>
            {startups.map((startup, i) => (
              <StartupCard key={startup.id} startup={startup} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: { padding: '40px 48px 80px' },
  inner: { maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' },
  searchInput: {
    background: '#f0f7f2', border: '1px solid #c8e0d0', color: '#0d1a0f',
    padding: '14px 20px', fontSize: '16px', width: '100%', maxWidth: '480px',
    outline: 'none', borderRadius: '4px', fontFamily: 'Fira Code, monospace',
  },
  filterSection: { display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '8px', borderBottom: '1px solid #e4ece5' },
  filterRow: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  filterLabel: { fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', color: '#4a6b52', fontFamily: 'Fira Code, monospace', minWidth: '44px' },
  chips: { display: 'flex', gap: '8px', flexWrap: 'wrap' },
  chip: {
    background: 'transparent', border: '1px solid #c8e0d0', color: '#4a6b52',
    padding: '6px 14px', fontSize: '14px', cursor: 'pointer', transition: 'all 0.18s ease',
    borderRadius: '3px', fontFamily: 'Fira Code, monospace',
  },
  chipActive: { background: '#00a63e', borderColor: '#00a63e', color: '#ffffff' },
  count: { fontSize: '14px', color: '#4a6b52', fontFamily: 'Fira Code, monospace' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' },
  empty: { textAlign: 'center', padding: '100px 20px' },
  emptyIcon: { fontSize: '48px', marginBottom: '20px' },
  emptyTitle: { fontFamily: 'Fira Sans Condensed, sans-serif', fontWeight: 700, fontSize: '22px', marginBottom: '10px', color: '#0d1a0f' },
  emptySub: { fontSize: '14px', color: '#4a6b52', fontWeight: 300 },
}