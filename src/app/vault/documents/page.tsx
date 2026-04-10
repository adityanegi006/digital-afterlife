"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Download } from 'lucide-react';

export default function DocumentVault() {
  const [docs, setDocs] = useState([]);
  const [guardianMode, setGuardianMode] = useState(false);
  const [formData, setFormData] = useState({ title: '', filePath: '', notes: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/vault/documents').then(r => r.json()).then(data => {
      setDocs(data.documents);
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

    const res = await fetch('/api/vault/documents', {
      method: 'POST', body: JSON.stringify({ ...formData, fileUrl, filePath: fileUrl ? 'Attached Locally' : formData.filePath })
    });
    const data = await res.json();
    setDocs(data.documents);
    setFormData({ title: '', filePath: '', notes: '' });
    setFile(null);
    setUploading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <FileText size={32} color="var(--accent-primary)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Important Documents</h1>
          <p style={{ opacity: 0.7 }}>Secure storage references and local uploads for IDs, Wills, and Deeds.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> Please consult these documents carefully for final instructions.
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>{guardianMode ? 'Vault Contents' : 'Your Uploaded Documents'}</h2>
        {docs.length === 0 ? <p style={{ opacity: 0.5 }}>No documents stored yet.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {docs.map((doc: any) => (
              <div key={doc.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <FileText size={18} /> {doc.title}
                </h3>
                <p style={{ opacity: 0.6, fontSize: '0.85rem', marginBottom: '1rem', wordBreak: 'break-all' }}>📍 {doc.filePath}</p>
                {doc.notes && (
                  <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', borderLeft: '2px solid var(--accent-primary)', marginBottom: doc.fileUrl ? '1rem' : 0 }}>
                    {doc.notes}
                  </div>
                )}
                {doc.fileUrl && (
                    <a href={doc.fileUrl} target="_blank" style={{ marginTop: '1rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none' }}>
                      <Download size={16} /> Download File
                    </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Document</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Document Title</span>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. Last Will and Testament" />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Physical Location (Optional if uploading)</span>
                <input type="text" value={formData.filePath} onChange={e => setFormData({...formData, filePath: e.target.value})} style={{ width: '100%' }} placeholder="Safe Box #2" />
              </label>
            </div>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Special Instructions for Guardian</span>
              <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3} style={{ width: '100%' }} placeholder="Contact Lawyer Smith at 555-0199..." />
            </label>
            
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Upload Digital Copy (PDF/Image)</span>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} disabled={uploading} style={{ width: '100%' }} />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn btn-primary" disabled={uploading} style={{ padding: '12px 24px' }}>
                {uploading ? 'Encrypting & Uploading...' : 'Secure in Vault'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
