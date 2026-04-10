"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Heart, FileText, Activity } from 'lucide-react';

export default function MedicalVault() {
  const [medical, setMedical] = useState<{
    bloodType: string;
    allergies: string;
    reports: { id: string; condition: string; doctor: string; fileUrl?: string }[];
  }>({ bloodType: '', allergies: '', reports: [] });
  
  const [guardianMode, setGuardianMode] = useState(false);
  const [reportForm, setReportForm] = useState({ condition: '', doctor: '' });
  const [file, setFile] = useState<File | null>(null);
  const [uploadingInfo, setUploadingInfo] = useState(false);
  const [uploadingReport, setUploadingReport] = useState(false);

  useEffect(() => {
    fetch('/api/vault/medical').then(r => r.json()).then(data => {
      if(data.medical) setMedical({ 
        bloodType: data.medical.bloodType || '', 
        allergies: data.medical.allergies || '', 
        reports: data.medical.reports || []
      });
      setGuardianMode(data.guardianMode);
    });
  }, []);

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    setUploadingInfo(true);
    await fetch('/api/vault/medical', { method: 'POST', body: JSON.stringify(medical) });
    setUploadingInfo(false);
    setTimeout(() => alert('Basic Emergency Info Updated!'), 100);
  };

  const handleAddReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;
    setUploadingReport(true);
    
    let fileUrl = undefined;
    if (file) {
      const fd = new FormData();
      fd.append('file', file);
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd });
      const uploadData = await uploadRes.json();
      if (uploadData.url) fileUrl = uploadData.url;
    }

    const newReport = {
      id: Date.now().toString(),
      condition: reportForm.condition,
      doctor: reportForm.doctor,
      fileUrl
    };

    const updatedMedical = { ...medical, reports: [...medical.reports, newReport] };

    await fetch('/api/vault/medical', {
      method: 'POST', body: JSON.stringify(updatedMedical)
    });
    
    setMedical(updatedMedical);
    setReportForm({ condition: '', doctor: '' });
    setFile(null);
    if(document.querySelector('input[type="file"]')) {
      (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
    }
    setUploadingReport(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Heart size={32} color="var(--accent-danger)" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Medical & Emergency Vault</h1>
          <p style={{ opacity: 0.7 }}>Crucial health data and structured medical history.</p>
        </div>
      </header>
      
      {guardianMode && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)', borderRadius: '8px', marginBottom: '2rem' }}>
          <strong>Guardian Mode Active:</strong> Editing is disabled. Share this life-saving history with EMTs immediately if needed.
        </div>
      )}

      {/* Basic Info Section */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Core Emergency Statistics</h2>
        <form onSubmit={handleUpdateInfo} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Blood Type</span>
              <input type="text" value={medical.bloodType} onChange={e => setMedical({...medical, bloodType: e.target.value})} disabled={guardianMode} style={{ width: '100%' }} placeholder="e.g. O+" />
            </label>
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Severe Allergies</span>
              <input type="text" value={medical.allergies} onChange={e => setMedical({...medical, allergies: e.target.value})} disabled={guardianMode} style={{ width: '100%' }} placeholder="e.g. Penicillin, Peanuts" />
            </label>
          </div>
          {!guardianMode && (
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn" disabled={uploadingInfo} style={{ padding: '10px 20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: '#fff' }}>
                {uploadingInfo ? 'Saving...' : 'Save Core Info'}
              </button>
            </div>
          )}
        </form>
      </div>

      {/* Existing Medical Reports List */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Registered Medical Reports</h2>
        {medical.reports.length === 0 ? <p style={{ opacity: 0.5 }}>No medical reports logged yet.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {medical.reports.map((report) => (
              <div key={report.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-danger)', margin: 0, fontSize: '1.1rem' }}>
                  <Activity size={18} /> {report.condition}
                </h3>
                <p style={{ opacity: 0.7, fontSize: '0.9rem', margin: 0 }}><strong>Doctor/Clinic:</strong> {report.doctor}</p>
                {report.fileUrl && (
                  <a href={report.fileUrl} target="_blank" style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--accent-primary)', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 12px', borderRadius: '8px', textDecoration: 'none', width: 'fit-content' }}>
                    <FileText size={16} /> View Medical Document
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add New Report Form */}
      {!guardianMode && (
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Add New Medical Problem / Report</h2>
          <form onSubmit={handleAddReport} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Medical Problem / Condition</span>
                <input type="text" value={reportForm.condition} onChange={e => setReportForm({...reportForm, condition: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. Asthma, Knee Surgery" />
              </label>
              <label>
                <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Doctor or Clinic</span>
                <input type="text" value={reportForm.doctor} onChange={e => setReportForm({...reportForm, doctor: e.target.value})} required style={{ width: '100%' }} placeholder="e.g. Dr. Roberts (City Hospital)" />
              </label>
            </div>
            
            <label>
              <span style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>Upload Prescriptions, Scans, or Documents (Optional)</span>
              <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} disabled={uploadingReport} style={{ width: '100%' }} />
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button type="submit" className="btn" disabled={uploadingReport} style={{ padding: '12px 24px', background: 'var(--accent-danger)', color: '#fff' }}>
                {uploadingReport ? 'Saving Report...' : 'Add Medical Report'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
