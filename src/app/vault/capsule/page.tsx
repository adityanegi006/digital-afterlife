"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock, Unlock } from 'lucide-react';

export default function TimeCapsule() {
  const [capsules, setCapsules] = useState([]);
  const [guardianMode, setGuardianMode] = useState(false);
  const [formData, setFormData] = useState({ toName: '', message: '' });

  useEffect(() => {
    fetch('/api/vault/capsule').then(r => r.json()).then(data => {
      setCapsules(data.capsules);
      setGuardianMode(data.guardianMode);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    const res = await fetch('/api/vault/capsule', {
      method: 'POST', body: JSON.stringify(formData)
    });
    const data = await res.json();
    setCapsules(data.capsules);
    setFormData({ toName: '', message: '' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          {guardianMode ? <Unlock size={32} color="var(--accent-primary)" /> : <Lock size={32} color="var(--accent-primary)" />}
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>The Time Capsule</h1>
          <p style={{ opacity: 0.7 }}>Secure final messages that only unlock in Guardian Mode.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{guardianMode ? 'Unlocked Messages' : 'Locked Capsules'}</h2>
        {capsules.length === 0 ? <p style={{ opacity: 0.5 }}>No capsules sealed yet.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {capsules.map((capsule: any) => (
              <div key={capsule.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: guardianMode ? 'var(--accent-success)' : 'var(--foreground)' }}>
                  {guardianMode ? <Unlock size={18} /> : <Lock size={18} />}
                  <h3 style={{ margin: 0, fontWeight: 500 }}>To: {capsule.toName}</h3>
                </div>
                {guardianMode ? (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.95rem', whiteSpace: 'pre-wrap', borderLeft: '3px solid var(--accent-success)', lineHeight: 1.5 }}>
                    {capsule.message}
                  </div>
                ) : (
                  <div style={{ background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--accent-warning)', border: '1px dashed var(--glass-border)', textAlign: 'center' }}>
                    Content encrypted. Will unlock when Dead Man's Switch is activated.
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Seal a New Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Recipient Name</span>
              <input type="text" value={formData.toName} onChange={e => setFormData({...formData, toName: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. My Dear Daughter" />
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Final Message</span>
              <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows={6} style={{ width: '100%' }} placeholder="Type your message here..." />
            </label>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }}>Seal Capsule</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
