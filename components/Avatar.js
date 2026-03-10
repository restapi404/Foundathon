// components/Avatar.js
const COLORS = [
  { bg: '#0a4d22', text: '#1aff6b' },
  { bg: '#1a2b1d', text: '#34d399' },
  { bg: '#1e1a2b', text: '#a78bfa' },
  { bg: '#2b1a1a', text: '#f472b6' },
  { bg: '#2b2a1a', text: '#f59e0b' },
  { bg: '#1a2b2b', text: '#38bdf8' },
  { bg: '#2b1a2a', text: '#fb923c' },
]

function getColor(name) {
  if (!name) return COLORS[0]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}

function getInitials(name) {
  if (!name) return '?'
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export default function Avatar({ name, size = 40 }) {
  const color = getColor(name)
  const initials = getInitials(name)
  const fontSize = size * 0.36

  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: '50%',
      background: color.bg,
      color: color.text,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize,
      fontWeight: 700,
      fontFamily: 'Syne, sans-serif',
      flexShrink: 0,
      letterSpacing: '0.05em',
      border: `1px solid ${color.text}33`,
    }}>
      {initials}
    </div>
  )
}
