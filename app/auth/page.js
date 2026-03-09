'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function AuthForm() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState(searchParams.get('mode') === 'signup' ? 'signup' : 'login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('founder')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, role }
        }
      })

      if (error) {
        setError(error.message)
      } else {
        // Insert profile
        if (data.user) {
          await supabase.from('profiles').upsert({
            id: data.user.id,
            full_name: fullName,
            role,
          })
        }
        setSuccess('Account created! Check your email to confirm, then sign in.')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError(error.message)
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <div style={styles.page}>
      <div style={styles.gridBg} />

      <div style={styles.card} className="fade-up">
        <div style={styles.cardHeader}>
          <div style={styles.logo}>VERDANT</div>
          <h1 style={styles.title}>
            {mode === 'login' ? 'Welcome back.' : 'Join the platform.'}
          </h1>
          <p style={styles.sub}>
            {mode === 'login'
              ? 'Sign in to access your dashboard.'
              : 'Create your account to list startups and connect with investors.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {mode === 'signup' && (
            <>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ada Lovelace"
                  required
                  style={styles.input}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>I am a</label>
                <div style={styles.roleGrid}>
                  {[
                    { value: 'founder', label: '🌱 Founder' },
                    { value: 'investor', label: '💰 Investor' },
                    { value: 'researcher', label: '🧑‍🔬 Researcher' },
                    { value: 'talent', label: '🧑‍💻 Talent' },
                  ].map(r => (
                    <button
                      key={r.value}
                      type="button"
                      onClick={() => setRole(r.value)}
                      style={{
                        ...styles.roleBtn,
                        ...(role === r.value ? styles.roleBtnActive : {})
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          <div style={styles.field}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={styles.input}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              style={styles.input}
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.successMsg}>{success}</div>}

          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </button>
        </form>

        <div style={styles.toggle}>
          {mode === 'login' ? (
            <>
              Don't have an account?{' '}
              <button onClick={() => { setMode('signup'); setError(''); setSuccess('') }} style={styles.toggleBtn}>
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => { setMode('login'); setError(''); setSuccess('') }} style={styles.toggleBtn}>
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div style={{ color: 'var(--gray)', padding: '120px 48px', textAlign: 'center' }}>Loading...</div>}>
      <AuthForm />
    </Suspense>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '120px 24px 60px',
    position: 'relative',
  },
  gridBg: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(26,255,107,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,255,107,0.02) 1px, transparent 1px)
    `,
    backgroundSize: '60px 60px',
    pointerEvents: 'none',
  },
  card: {
    background: 'var(--gray-dark)',
    border: '1px solid rgba(26,255,107,0.12)',
    padding: '52px 48px',
    width: '100%',
    maxWidth: '480px',
    position: 'relative',
    zIndex: 2,
  },
  cardHeader: {
    marginBottom: '40px',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '13px',
    letterSpacing: '3px',
    color: 'var(--green)',
    marginBottom: '20px',
  },
  title: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '28px',
    letterSpacing: '-1px',
    marginBottom: '10px',
  },
  sub: {
    fontSize: '12px',
    color: 'var(--gray)',
    lineHeight: 1.7,
    fontWeight: 300,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gray)',
  },
  input: {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(26,255,107,0.15)',
    color: 'var(--offwhite)',
    padding: '14px 16px',
    fontSize: '13px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
  },
  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
  },
  roleBtn: {
    background: 'transparent',
    border: '1px solid rgba(26,255,107,0.15)',
    color: 'var(--gray)',
    padding: '10px',
    fontSize: '12px',
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  roleBtnActive: {
    background: 'rgba(26,255,107,0.1)',
    borderColor: 'var(--green)',
    color: 'var(--green)',
  },
  error: {
    background: 'rgba(255,77,77,0.1)',
    border: '1px solid rgba(255,77,77,0.3)',
    color: '#ff6b6b',
    padding: '12px 14px',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  successMsg: {
    background: 'rgba(26,255,107,0.08)',
    border: '1px solid rgba(26,255,107,0.3)',
    color: 'var(--green)',
    padding: '12px 14px',
    fontSize: '12px',
    lineHeight: 1.5,
  },
  submitBtn: {
    background: 'var(--green)',
    color: 'var(--black)',
    border: 'none',
    padding: '16px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '14px',
    letterSpacing: '0.5px',
    cursor: 'pointer',
    marginTop: '8px',
    transition: 'all 0.2s',
  },
  toggle: {
    textAlign: 'center',
    marginTop: '28px',
    fontSize: '12px',
    color: 'var(--gray)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--green)',
    cursor: 'pointer',
    fontSize: '12px',
    fontFamily: 'DM Mono, monospace',
    textDecoration: 'underline',
  },
}
