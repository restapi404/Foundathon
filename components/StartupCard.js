'use client'

import Link from 'next/link'
import { useState } from 'react'

const SECTOR_COLORS = {
  'Solar': '#f59e0b',
  'Wind': '#60a5fa',
  'Carbon Capture': '#00a63e',
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
  const [hovered, setHovered] = useState(false)
  const accentColor = SECTOR_COLORS[startup.sector] || '#00a63e'

  return (
    <Link href={`/startups/${startup.id}`} style={{ textDecoration: 'none', display: 'flex' }}>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          ...styles.card,
          transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
          boxShadow: hovered
            ? `0 16px 48px rgba(0,0,0,0.10), 0 0 0 1.5px ${accentColor}`
            : '0 2px 10px rgba(0,0,0,0.05)',
          animationDelay: `${index * 0.06}s`,
        }}
        className="fade-up"
      >
        {/* Accent top bar */}
        <div style={{ ...styles.accentLine, background: accentColor }} />

        <div style={styles.inner}>
          {/* Sector + Stage */}
          <div style={styles.topRow}>
            <div style={styles.sectorBadge}>
              <span style={{ ...styles.dot, background: accentColor }} />
              <span style={styles.sectorText}>{startup.sector}</span>
            </div>
            <span style={styles.stageText}>
              {STAGE_LABELS[startup.stage] || '◆'} {startup.stage}
            </span>
          </div>

          {/* Name */}
          <h3 style={{
            ...styles.name,
            color: hovered ? accentColor : '#0d1a0f',
          }}>
            {startup.name}
          </h3>

          {/* Tagline */}
          {startup.tagline && (
            <p style={styles.tagline}>{startup.tagline}</p>
          )}

          {/* Description */}
          <p style={styles.desc}>
            {startup.description?.slice(0, 110)}{startup.description?.length > 110 ? '...' : ''}
          </p>

          {/* Footer */}
          <div style={styles.footer}>
            <div style={styles.meta}>
              {startup.location && <span style={styles.metaItem}>📍 {startup.location}</span>}
              {startup.funding_needed && <span style={styles.metaItem}>💰 {startup.funding_needed}</span>}
            </div>
            <span style={{
              ...styles.arrow,
              color: accentColor,
              transform: hovered ? 'translateX(5px)' : 'translateX(0)',
            }}>→</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

const styles = {
  card: {
    background: '#f0f7f2',
    border: '1px solid #c8e0d0',
    borderRadius: '6px',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  accentLine: {
    height: '4px',
    width: '100%',
    flexShrink: 0,
  },
  inner: {
    padding: '24px 26px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1,
  },
  topRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectorBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '7px',
  },
  dot: {
    width: '7px', height: '7px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  sectorText: {
    fontSize: '13px',
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#4a6b52',
    fontFamily: 'Fira Code, monospace',
  },
  stageText: {
    fontSize: '13px',
    color: '#4a6b52',
    fontFamily: 'Fira Code, monospace',
  },
  name: {
    fontFamily: 'Fira Sans Condensed, sans-serif',
    fontWeight: 800,
    fontSize: '26px',
    letterSpacing: '-0.3px',
    lineHeight: 1.15,
    transition: 'color 0.2s ease',
    marginTop: '4px',
  },
  tagline: {
    fontSize: '15px',
    color: '#4a6b52',
    fontWeight: 600,
    fontFamily: 'Fira Sans, sans-serif',
    lineHeight: 1.4,
  },
  desc: {
    fontSize: '15px',
    lineHeight: 1.8,
    color: '#5a7a62',
    fontWeight: 300,
    flex: 1,
    minHeight: '60px',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '14px',
    marginTop: '8px',
    borderTop: '1px solid #c8e0d0',
  },
  meta: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },
  metaItem: {
    fontSize: '14px',
    color: '#4a6b52',
    fontFamily: 'Fira Code, monospace',
  },
  arrow: {
    fontSize: '18px',
    transition: 'transform 0.2s ease',
    flexShrink: 0,
  },
}