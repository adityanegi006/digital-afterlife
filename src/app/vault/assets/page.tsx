"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Landmark, FileText } from 'lucide-react';
import { generateClaimMemo } from '@/lib/pdfGenerator';

export default function AssetVault() {
  const [assets, setAssets] = useState([]);
  const [guardianMode, setGuardianMode] = useState(false);
  const [formData, setFormData] = useState({ type: 'Bank', details: '', beneficiary: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/vault/assets').then(r => r.json()).then(data => {
      setAssets(data.assets);
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

    const res = await fetch('/api/vault/assets', {
      method: 'POST', body: JSON.stringify({ ...formData, fileUrl })
    });
    const data = await res.json();
    setAssets(data.assets);
    setFormData({ type: 'Bank', details: '', beneficiary: '' });
    setFile(null);
    setUploading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Landmark size={32} color="var(--accent-warning)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Asset & Investment Ledger</h1>
          <p style={{ opacity: 0.7 }}>A secure ledger for Stocks, Crypto hints, and bank accounts.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> Please contact the respective institutions to claim the listed assets. Use the Transfer Memo generator for standard banks.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Asset Portfolio</h2>
        {assets.length === 0 ? <p style={{ opacity: 0.5 }}>No assets registered.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {assets.map((asset: any) => (
              <div key={asset.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <span style={{ display: 'inline-block', padding: '4px 12px', background: 'var(--glass-bg)', borderRadius: '12px', fontSize: '0.8rem', marginBottom: '1rem', border: '1px solid var(--glass-border)' }}>
                  {asset.type}
                </span>
                <p style={{ opacity: 0.9, fontSize: '1rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>{asset.details}</p>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: asset.fileUrl ? '1rem' : 0 }}>
                  <strong>Beneficiary:</strong> {asset.beneficiary}
                </div>
                {asset.fileUrl && (
                    <a href={asset.fileUrl} target="_blank" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none' }}>
                      <FileText size={16} /> View Proof Document
                    </a>
                )}
                {guardianMode && asset.type === 'Bank' && (
                  <button className="btn" style={{ background: 'var(--accent-warning)', color: '#000', padding: '8px 16px', marginTop: '1rem', width: '100%' }} onClick={() => generateClaimMemo('Asset', asset)}>
                    Generate Bank PDF Transfer Memo
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add Asset to Ledger</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Asset Category</span>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} style={{ width: '100%', height: '42px' }}>
                  <option value="Bank">Bank Account</option>
                  <option value="Stock">Stocks / Demat</option>
                  <option value="Crypto">Cryptocurrency (Hints)</option>
                  <option value="Physical">Physical Asset / Locker</option>
                </select>
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Designated Beneficiary</span>
                <input type="text" value={formData.beneficiary} onChange={e => setFormData({...formData, beneficiary: e.target.value})} required style={{ width: '100%' }} />
              </label>
            </div>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Asset Details (e.g. Bank Name & Account #, Exchange Name)</span>
              <textarea value={formData.details} onChange={e => setFormData({...formData, details: e.target.value})} required rows={3} style={{ width: '100%' }} />
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Upload Proof of Ownership / Deed (Optional)</span>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} disabled={uploading} style={{ width: '100%' }} />
            </label>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{ padding: '12px 24px', background: 'var(--accent-warning)', color: '#000' }}>
               {uploading ? 'Processing & Securing...' : 'Add Asset'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
