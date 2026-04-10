"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email?: string }>({});
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  useEffect(() => {
    // pull from local storage as the quick user info store
    const raw = localStorage.getItem('afterlife_user');
    if (raw) setUser(JSON.parse(raw));
  }, []);

  useEffect(() => {
    setForm({ name: user.name || '', email: user.email || '' });
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('vault_auth');
    router.push('/signup');
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Settings</h1>
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem' }}>User Information</h2>
        {!editing ? (
          <>
            <p><strong>Name:</strong> {user.name || '—'}</p>
            <p><strong>Email:</strong> {user.email || '—'}</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button className="btn btn-glass" onClick={() => setEditing(true)}>Edit Profile</button>
              <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <label>Name</label>
            <input value={form.name} onChange={e => setForm(v => ({ ...v, name: e.target.value }))} />
            <label>Email</label>
            <input value={form.email} onChange={e => setForm(v => ({ ...v, email: e.target.value }))} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary" onClick={() => { localStorage.setItem('afterlife_user', JSON.stringify(form)); setUser(form); setEditing(false); }}>Save</button>
              <button className="btn btn-glass" onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3>Advanced</h3>
        <div className="glass-panel" style={{ padding: '1rem' }}>
          <p style={{ opacity: 0.8 }}>Revoke keys, manage guardians, and export your vault.</p>
          <Link href="/vault/export"><button className="btn btn-primary" style={{ marginTop: '1rem' }}>Export Vault</button></Link>
        </div>
      </div>
    </div>
  );
}
