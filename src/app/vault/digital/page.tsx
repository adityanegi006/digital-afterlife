"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Link as LinkIcon, Mail } from 'lucide-react';

export default function DigitalFootprintVault() {
  const [subscriptions, setSubscriptions] = useState([]);
  const [guardianMode, setGuardianMode] = useState(false);
  const [formData, setFormData] = useState({ service: '', actionRequired: 'Cancel Account' });

  useEffect(() => {
    fetch('/api/vault/digital').then(r => r.json()).then(data => {
      setSubscriptions(data.subscriptions);
      setGuardianMode(data.guardianMode);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    const res = await fetch('/api/vault/digital', {
      method: 'POST', body: JSON.stringify(formData)
    });
    const data = await res.json();
    setSubscriptions(data.subscriptions);
    setFormData({ service: '', actionRequired: 'Cancel Account' });
  };

  const handleAutoCancel = (service: string) => {
    const subject = encodeURIComponent(`Deceased Account Holder - Cancellation Request: ${service}`);
    const body = encodeURIComponent(`To Whom It May Concern,\n\nI am writing to formally request the cancellation and closure of the ${service} account belonging to the deceased account holder.\n\nPlease find the attached Death Certificate. Let me know what further information is required.\n\nThank you,\n[Beneficiary Name]`);
    window.location.href = `mailto:support@${service.toLowerCase().replace(' ', '')}.com?subject=${subject}&body=${body}`;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(139, 92, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <LinkIcon size={32} color="var(--accent-secondary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Digital Footprint</h1>
          <p style={{ opacity: 0.7 }}>Manage active subscriptions and online presence.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> Please delete or memorialize these accounts using the provided automated email templates.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Digital Assets</h2>
        {subscriptions.length === 0 ? <p style={{ opacity: 0.5 }}>No active subscriptions.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {subscriptions.map((sub: any) => (
              <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--accent-secondary)' }}>{sub.service}</h3>
                  <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: '12px', fontSize: '0.8rem', border: '1px solid var(--glass-border)' }}>
                    {sub.actionRequired}
                  </span>
                </div>
                {guardianMode && (
                  <button className="btn" style={{ background: 'var(--accent-secondary)', color: '#fff', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => handleAutoCancel(sub.service)}>
                    <Mail size={16} /> Auto-Cancel Email
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Log New Subscription</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Service Name</span>
                <input type="text" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. Netflix, Spotify" />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Directive for Guardian</span>
                <select value={formData.actionRequired} onChange={e => setFormData({...formData, actionRequired: e.target.value})} style={{ width: '100%', height: '42px' }}>
                  <option value="Cancel Account">Cancel Account</option>
                  <option value="Memorialize">Memorialize (Facebook/IG)</option>
                  <option value="Keep Active for Family">Keep Active for Family</option>
                </select>
              </label>
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px', background: 'var(--accent-secondary)', color: '#fff' }}>Log Subscription</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
