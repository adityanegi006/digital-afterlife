"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CreditCard, FileText } from 'lucide-react';

export default function LiabilitiesVault() {
  const [liabilities, setLiabilities] = useState([]);
  const [guardianMode, setGuardianMode] = useState(false);
  const [formData, setFormData] = useState({ type: 'Credit Card', provider: '', amount: '', notes: '' });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/vault/liabilities').then(r => r.json()).then(data => {
      setLiabilities(data.liabilities || []);
      setGuardianMode(data.guardianMode || false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    setUploading(true);

    const res = await fetch('/api/vault/liabilities', {
      method: 'POST', body: JSON.stringify(formData)
    });
    const data = await res.json();
    setLiabilities(data.liabilities || []);
    setFormData({ type: 'Credit Card', provider: '', amount: '', notes: '' });
    setUploading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <CreditCard size={32} color="var(--accent-danger)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Debts & Liabilities</h1>
          <p style={{ opacity: 0.7 }}>Track mortgages, car loans, and credit lines explicitly.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> Please prioritize settling these accounts using the deceased's Asset Ledger.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Liabilities</h2>
        {liabilities.length === 0 ? <p style={{ opacity: 0.5 }}>No liabilities reported.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {liabilities.map((item: any) => (
              <div key={item.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '1rem' }}>
                  {item.type}
                </span>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.provider}</h3>
                <p style={{ opacity: 0.9, fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--accent-danger)' }}><strong>${item.amount}</strong></p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {item.notes}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Register Liability</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Type of Debt</span>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', height: '42px' }}>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Mortgage">Mortgage</option>
                  <option value="Car Loan">Car Loan</option>
                  <option value="Personal Loan">Personal Loan</option>
                  <option value="Tax Debt">Tax Debt</option>
                </select>
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Company / Provider</span>
                <input type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. Chase Bank" />
              </label>
            </div>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Approximate Amount Owed</span>
              <input type="number" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. 5000" />
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Notes (Account Number, Contact info)</span>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} style={{ width: '100%' }} />
            </label>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{ padding: '12px 24px', background: 'var(--accent-danger)' }}>
               {uploading ? 'Registering...' : 'Add Liability'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
