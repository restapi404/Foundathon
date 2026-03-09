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
        {/* Search + filters */}
        <div style={styles.filterBar}>
          <input
            type="text"
            placeholder="Search startups..."
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              applyFilters(sector, stage, e.target.value)
            }}
            style={styles.searchInput}
          />

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Sector</span>
            <div style={styles.chips}>
              {sectors.map(s => (
                <button
                  key={s}
                  onClick={() => { setSector(s); applyFilters(s, stage, search) }}
                  style={{ ...styles.chip, ...(sector === s ? styles.chipActive : {}) }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Stage</span>
            <div style={styles.chips}>
              {stages.map(s => (
                <button
                  key={s}
                  onClick={() => { setStage(s); applyFilters(sector, s, search) }}
                  style={{ ...styles.chip, ...(stage === s ? styles.chipActive : {}) }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid */}
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
  wrapper: {
    padding: '48px',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
  },
  filterBar: {
    marginBottom: '48px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  searchInput: {
    background: 'var(--gray-dark)',
    border: '1px solid rgba(26,255,107,0.15)',
    color: 'var(--offwhite)',
    padding: '14px 20px',
    fontSize: '13px',
    width: '100%',
    maxWidth: '480px',
    outline: 'none',
  },
  filterGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  filterLabel: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
    minWidth: '40px',
  },
  chips: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  },
  chip: {
    background: 'transparent',
    border: '1px solid rgba(26,255,107,0.15)',
    color: 'var(--gray)',
    padding: '6px 14px',
    fontSize: '11px',
    cursor: 'pointer',
    transition: 'all 0.2s',
    letterSpacing: '0.5px',
  },
  chipActive: {
    background: 'rgba(26,255,107,0.1)',
    borderColor: 'var(--green)',
    color: 'var(--green)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
    gap: '1px',
    background: 'var(--gray-mid)',
    border: '1px solid var(--gray-mid)',
  },
  empty: {
    textAlign: 'center',
    padding: '100px 20px',
  },
  emptyIcon: { fontSize: '48px', marginBottom: '20px' },
  emptyTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '20px',
    marginBottom: '10px',
  },
  emptySub: {
    fontSize: '13px',
    color: 'var(--gray)',
    fontWeight: 300,
  },
}
