"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';

export default function WishesVault() {
  const [wishes, setWishes] = useState({ burialPreference: '', prepaidDetails: '', music: '', notes: '' });
  const [guardianMode, setGuardianMode] = useState(false);

  useEffect(() => {
    fetch('/api/vault/wishes').then(r => r.json()).then(data => {
      setWishes(data.wishes || { burialPreference: '', prepaidDetails: '', music: '', notes: '' });
      setGuardianMode(data.guardianMode || false);
    });
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    await fetch('/api/vault/wishes', { method: 'POST', body: JSON.stringify(wishes) });
    alert('Funeral Arrangements Updated');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(168, 85, 247, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Sparkles size={32} color="#a855f7" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Funeral & Final Wishes</h1>
          <p style={{ opacity: 0.7 }}>Ensure the family doesn't have to guess during emotional times.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', border: '1px solid var(--accent-primary)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> Please honor these specific directives to the best of your ability.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <label>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Burial vs Cremation Preference</span>
            <input type="text" value={wishes.burialPreference} onChange={e => setWishes({...wishes, burialPreference: e.target.value})} disabled={guardianMode} style={{ width: '100%' }} placeholder="e.g. Cremation, spread ashes at the lake." />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Pre-paid Arrangements / Budget Details</span>
            <input type="text" value={wishes.prepaidDetails} onChange={e => setWishes({...wishes, prepaidDetails: e.target.value})} disabled={guardianMode} style={{ width: '100%' }} placeholder="e.g. Pre-paid plot at Sunnyside Cemetery, File #123" />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Preferred Music / Readings</span>
            <input type="text" value={wishes.music} onChange={e => setWishes({...wishes, music: e.target.value})} disabled={guardianMode} style={{ width: '100%' }} placeholder="e.g. Play 'My Way' by Frank Sinatra." />
          </label>
          <label>
            <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>General Notes & 'Do Not Invite' List</span>
            <textarea value={wishes.notes} onChange={e => setWishes({...wishes, notes: e.target.value})} disabled={guardianMode} rows={4} style={{ width: '100%' }} />
          </label>

          {!guardianMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="submit" className="btn" style={{ padding: '12px 24px', background: '#a855f7', color: '#fff' }}>Save Final Directives</button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
