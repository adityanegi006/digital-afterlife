"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, FileText } from 'lucide-react';
import { generateClaimMemo } from '@/lib/pdfGenerator';

export default function InsuranceVault() {
  const [policies, setPolicies] = useState([]);
  const [guardianMode, setGuardianMode] = useState(false);
  const [formData, setFormData] = useState({ provider: '', policyNumber: '', type: 'Life', beneficiary: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/vault/insurance').then(r => r.json()).then(data => {
      setPolicies(data.insurance);
      setGuardianMode(data.guardianMode);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    setUploading(true);
    
    let fileUrl = undefined;
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      if (uploadData.url) fileUrl = uploadData.url;
    }

    const res = await fetch('/api/vault/insurance', {
      method: 'POST', body: JSON.stringify({ ...formData, fileUrl })
    });
    const data = await res.json();
    setPolicies(data.insurance);
    setFormData({ provider: '', policyNumber: '', type: 'Life', beneficiary: '' });
    setFile(null);
    setUploading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Shield size={32} color="var(--accent-success)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Insurance Command Center</h1>
          <p style={{ opacity: 0.7 }}>Track all Life, Health, and Property policies securely.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> You can automatically generate pre-filled claim forms for these policies.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Active Policies</h2>
        {policies.length === 0 ? <p style={{ opacity: 0.5 }}>No policies added.</p> : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {policies.map((policy: any) => (
              <div key={policy.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <div>
                  <h3 style={{ marginBottom: '0.25rem', color: 'var(--accent-success)' }}>{policy.type} Insurance - {policy.provider}</h3>
                  <p style={{ opacity: 0.7, fontSize: '0.9rem', marginBottom: '0.5rem' }}>Policy #: {policy.policyNumber}</p>
                  <p style={{ fontSize: '0.85rem', marginBottom: policy.fileUrl ? '1rem' : 0 }}><strong>Beneficiary:</strong> {policy.beneficiary}</p>
                  {policy.fileUrl && (
                    <a href={policy.fileUrl} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none' }}>
                      <FileText size={16} /> View Policy Document
                    </a>
                  )}
                </div>
                {guardianMode && (
                  <button className="btn" style={{ background: 'var(--accent-success)', color: '#fff', padding: '10px 16px' }} onClick={() => generateClaimMemo('Insurance', policy)}>
                    Generate PDF Claim Memo
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Register New Policy</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Provider Name</span>
                <input type="text" value={formData.provider} onChange={e => setFormData({...formData, provider: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. State Farm, LIC" />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Policy Number</span>
                <input type="text" value={formData.policyNumber} onChange={e => setFormData({...formData, policyNumber: e.target.value})} required style={{ width: '100%' }} />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Insurance Type</span>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', height: '42px' }}>
                  <option value="Life">Life Insurance</option>
                  <option value="Health">Health Insurance</option>
                  <option value="Motor">Motor Insurance</option>
                  <option value="Property">Property Insurance</option>
                </select>
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Designated Beneficiary</span>
                <input type="text" value={formData.beneficiary} onChange={e => setFormData({...formData, beneficiary: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. John Doe (Son)" />
              </label>
            </div>
            
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Upload Policy Contract (PDF/Image)</span>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} disabled={uploading} style={{ width: '100%' }} />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{ padding: '12px 24px', background: 'var(--accent-success)' }}>
                {uploading ? 'Uploading...' : 'Register Policy'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
