'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Avatar from '@/components/Avatar'
import Link from 'next/link'

export default function EditProfilePage() {
  const router = useRouter()
  const supabase = createClient()

  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ full_name: '', bio: '', location: '', website: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      setUser(user)
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (profile) {
        setForm({
          full_name: profile.full_name || '',
          bio: profile.bio || '',
          location: profile.location || '',
          website: profile.website || '',
        })
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSave() {
    setSaving(true)
    await supabase.from('profiles').update({
      full_name: form.full_name,
      bio: form.bio,
      location: form.location,
      website: form.website,
    }).eq('id', user.id)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (loading) return (
    <div style={s.loadingPage}>
      <div style={s.spinner} />
    </div>
  )

  return (
    <div style={s.page}>
      <div style={s.container}>

        <div style={s.header} className="fade-up">
          <div>
            <p style={s.tag}>// Profile</p>
            <h1 style={s.title}>Edit Profile</h1>
          </div>
          <Link href={`/profile/${user?.id}`} style={s.backBtn}>
            ← View Profile
          </Link>
        </div>

        <div style={s.body}>

          {/* Preview */}
          <div style={s.preview} className="fade-up delay-1">
            <p style={s.previewTag}>// Preview</p>
            <div style={s.previewCard}>
              <div style={s.previewTop}>
                <Avatar name={form.full_name} size={52} />
                <div>
                  <div style={s.previewName}>{form.full_name || 'Your Name'}</div>
                  <div style={s.previewRole}>{/* role from profile */}</div>
                </div>
              </div>
              {form.bio && <p style={s.previewBio}>{form.bio}</p>}
              {form.location && <p style={s.previewMeta}>📍 {form.location}</p>}
              {form.website && <p style={s.previewMeta}>↗ {form.website.replace(/^https?:\/\//, '')}</p>}
            </div>
          </div>

          {/* Form */}
          <div style={s.form} className="fade-up delay-1">
            <div style={s.field}>
              <label style={s.label}>Full Name</label>
              <input style={s.input} value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                placeholder="Your full name" />
            </div>

            <div style={s.field}>
              <label style={s.label}>Bio</label>
              <textarea style={{ ...s.input, ...s.textarea }} value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="A short bio about yourself..." rows={4} />
            </div>

            <div style={s.field}>
              <label style={s.label}>Location</label>
              <input style={s.input} value={form.location}
                onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="City, Country" />
            </div>

            <div style={s.field}>
              <label style={s.label}>Website / LinkedIn</label>
              <input style={s.input} value={form.website}
                onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                placeholder="https://..." />
            </div>

            <button onClick={handleSave} style={s.saveBtn} disabled={saving}>
              {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Changes'}
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}

const s = {
  loadingPage: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  spinner: { width: '24px', height: '24px', border: '2px solid var(--gray-mid)', borderTop: '2px solid var(--green)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  page: { minHeight: '100vh', paddingTop: '80px' },
  container: { maxWidth: '900px', margin: '0 auto', padding: '60px 48px 100px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '52px' },
  tag: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '12px' },
  title: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-1.5px', color: 'var(--offwhite)' },
  backBtn: { fontSize: '11px', letterSpacing: '1px', color: 'var(--gray)', border: '1px solid var(--gray-mid)', padding: '9px 18px', fontFamily: 'Syne, sans-serif', display: 'inline-block' },
  body: { display: 'grid', gridTemplateColumns: '260px 1fr', gap: '48px', alignItems: 'start' },

  // Preview
  preview: { position: 'sticky', top: '100px' },
  previewTag: { fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--green)', marginBottom: '16px' },
  previewCard: { background: 'var(--gray-dark)', border: '1px solid rgba(26,255,107,0.12)', padding: '24px' },
  previewTop: { display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' },
  previewName: { fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '16px', color: 'var(--offwhite)', marginBottom: '4px' },
  previewBio: { fontSize: '12px', lineHeight: 1.7, color: 'var(--gray)', fontWeight: 300, marginBottom: '8px' },
  previewMeta: { fontSize: '11px', color: 'var(--gray)', marginBottom: '4px' },

  // Form
  form: { display: 'flex', flexDirection: 'column', gap: '24px' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)', fontFamily: 'Syne, sans-serif' },
  input: { background: 'var(--gray-dark)', border: '1px solid var(--gray-mid)', color: 'var(--offwhite)', padding: '12px 16px', fontSize: '13px', outline: 'none', fontFamily: 'DM Mono, monospace', width: '100%', transition: 'border-color 0.2s' },
  textarea: { resize: 'vertical', lineHeight: 1.7 },
  saveBtn: { background: 'var(--green)', color: 'var(--black)', border: 'none', padding: '14px 32px', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '13px', letterSpacing: '0.5px', cursor: 'pointer', alignSelf: 'flex-start', transition: 'opacity 0.2s' },
}
