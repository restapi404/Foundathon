'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <nav style={styles.nav}>
      <Link href="/" style={styles.logo}>
        VERD<span style={{ color: 'var(--offwhite)' }}>ANT</span>
      </Link>

      <div style={styles.links}>
        <Link href="/startups" style={{
          ...styles.link,
          color: pathname === '/startups' ? 'var(--green)' : 'var(--gray)'
        }}>
          Explore
        </Link>

        {!loading && (
          user ? (
            <>
              <Link href="/dashboard" style={{
                ...styles.link,
                color: pathname === '/dashboard' ? 'var(--green)' : 'var(--gray)'
              }}>
                Dashboard
              </Link>
              <button onClick={handleSignOut} style={styles.ghostBtn}>
                Sign Out
              </button>
              <Link href="/startups/create" style={styles.ctaBtn}>
                + List Startup
              </Link>
            </>
          ) : (
            <>
              <Link href="/auth" style={styles.ghostBtn}>
                Sign In
              </Link>
              <Link href="/auth?mode=signup" style={styles.ctaBtn}>
                Get Started
              </Link>
            </>
          )
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: {
    position: 'fixed',
    top: 0, left: 0, right: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 48px',
    zIndex: 100,
    borderBottom: '1px solid rgba(26,255,107,0.08)',
    backdropFilter: 'blur(16px)',
    background: '#ffffff',
    borderBottom: '1px solid #e4ece5',
  },
  logo: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '26px',
    letterSpacing: '-0.5px',
    color: 'var(--green)',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
  },
  link: {
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    transition: 'color 0.2s',
  },
  ghostBtn: {
    background: 'transparent',
    color: 'var(--offwhite)',
    border: '1px solid rgba(232,239,233,0.2)',
    padding: '9px 20px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 600,
    fontSize: '15px',
    letterSpacing: '0.5px',
    transition: 'all 0.2s',
  },
  ctaBtn: {
    background: 'var(--green)',
    color: 'var(--black)',
    border: 'none',
    padding: '10px 22px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 700,
    fontSize: '15px',
    letterSpacing: '0.5px',
    transition: 'all 0.2s',
    display: 'inline-block',
  },
}
