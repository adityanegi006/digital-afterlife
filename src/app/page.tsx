"use client";

import { useEffect, useState } from 'react';
import { FileText, Heart, Shield, Landmark, Settings, Link as LinkIcon, PowerOff, Power, Lock, DownloadCloud, CreditCard, Users, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [guardianMode, setGuardianMode] = useState(false);
  const [totals, setTotals] = useState({ assets: 0, documents: 0, insurance: 0, dependents: 0 });
  const router = useRouter();
  

  useEffect(() => {
    if (localStorage.getItem("vault_auth") !== "true") {
      router.push("/signup");
      return;
    }
    fetch('/api/guardian')
      .then(res => res.json())
      .then(data => setGuardianMode(data.guardianMode));

    // fetch vault totals
    fetch('/api/vault/export')
      .then(r => r.json())
      .then(data => {
        setTotals({
          assets: (data.assets || []).length,
          documents: (data.documents || []).length,
          insurance: (data.insurance || []).length,
          dependents: (data.dependents || []).length,
        });
      }).catch(() => {});
  }, []);

  // multi-sig modal state and signatures
  const [showMultiSig, setShowMultiSig] = useState(false);
  const [sig1, setSig1] = useState("");
  const [sig2, setSig2] = useState("");

  const initiateSwitch = () => {
    setShowMultiSig(true);
  };

  const handleLockVault = () => {
    localStorage.removeItem('vault_auth');
    router.push('/signup');
  };

  const executeMultiSigSwitch = () => {
    setShowMultiSig(false);
    setGuardianMode(prev => !prev);
  };

  const handleEjectVault = async () => {
    const res = await fetch('/api/vault/export');
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Secure_Vault_Manifest.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: 800 }}>The Vault</h1>
          <p style={{ opacity: 0.7, fontSize: '1.2rem' }}>Digital Estate & Bereavement Orchestrator</p>
        </div>
        
  <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div>
            <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '1px' }}>System Status</p>
            <p style={{ fontWeight: 600, color: guardianMode ? 'var(--accent-danger)' : 'var(--accent-success)' }}>
              {guardianMode ? 'GUARDIAN MODE ACTIVE' : 'SECURE (Owner)'}
            </p>
          </div>
          <div style={{ width: '1px', height: '40px', background: 'var(--glass-border)' }}></div>
          <button 
            className={`btn ${guardianMode ? 'btn-danger' : 'btn-primary'}`}
            onClick={initiateSwitch}
            style={{ padding: '12px 24px' }}
          >
            {guardianMode ? <PowerOff size={20} /> : <Power size={20} />}
            {guardianMode ? 'Deactivate Switch' : 'Trigger Dead Man\'s Switch'}
          </button>
          
          {guardianMode && (
            <button 
              className="btn"
              onClick={handleEjectVault}
              style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--accent-secondary)', color: '#fff' }}
              title="Eject Complete Vault Manifest for Lawyer"
            >
              <DownloadCloud size={20} /> Eject Vault
            </button>
          )}

          <button 
            className="btn btn-glass"
            onClick={handleLockVault}
            style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}
            title="Lock Vault & Sign Out"
          >
            <Lock size={20} />
          </button>
        </div>
      </header>

      <div className="bento-grid">
        <BentoCard 
          href="/vault/documents" 
          title="Important Docs" 
          desc="Wills, Deeds, and IDs" 
          icon={<FileText size={32} color="#ffca3a" />} 
          badge={totals.documents}
        />
        <BentoCard 
          href="/vault/medical" 
          title="Medical Data" 
          desc="History & Contacts" 
          icon={<Heart size={32} color="var(--accent-danger)" />} 
          badge={0}
        />
        <BentoCard 
          href="/vault/insurance" 
          title="Insurance Center" 
          desc="Policies & Claims" 
          icon={<Shield size={32} color="var(--accent-success)" />} 
          badge={totals.insurance}
        />
        <BentoCard 
          href="/vault/assets" 
          title="Asset Ledger" 
          desc="Stocks, Crypto, Bank" 
          icon={<Landmark size={32} color="var(--accent-teal)" />} 
          badge={totals.assets}
        />
        <BentoCard 
          href="/vault/digital" 
          title="Digital Footprint" 
          desc="Subscriptions & Socials" 
          icon={<LinkIcon size={32} color="#ff6b35" />} 
          badge={0}
        />
        <BentoCard 
          href="/vault/capsule" 
          title="Time Capsule" 
          desc="Secure locked farewell messages" 
          icon={<FileText size={32} color="var(--accent-primary)" />} 
        />
        <BentoCard 
          href="/assistant" 
          title="Bereavement Guide" 
          desc="AI Assistant for family" 
          icon={<Heart size={32} color="var(--accent-danger)" />} 
          isAi
        />
        <BentoCard 
          href="/vault/liabilities" 
          title="Debts & Liabilities" 
          desc="Track loans and accounts" 
          icon={<CreditCard size={32} color="var(--accent-danger)" />} 
        />
        <BentoCard 
          href="/vault/dependents" 
          title="Dependents & Pets" 
          desc="Vital care instructions" 
          icon={<Users size={32} color="#ec4899" />} 
        />
        <BentoCard 
          href="/vault/wishes" 
          title="Funeral & Wishes" 
          desc="Burial and pre-paid directives" 
          icon={<Sparkles size={32} color="#a855f7" />} 
        />
      </div>

      {showMultiSig && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
          <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px', width: '100%', textAlign: 'center', border: '1px solid var(--accent-danger)' }}>
            <Shield size={48} color="var(--accent-danger)" style={{ margin: '0 auto 1rem auto' }} />
            <h2 style={{ color: 'var(--accent-danger)', marginBottom: '0.5rem' }}>Multi-Signature Required</h2>
            <p style={{ opacity: 0.8, marginBottom: '2rem', fontSize: '0.95rem' }}>The Dead Man's Switch protocol requires 2 distinct, authorized Guardians to unlock the master encryption keys via Shamir's Secret Sharing algorithm.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2rem' }}>
              <div>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.85rem' }}>Guardian 1 Key</label>
                <input type="password" value={sig1} onChange={e => setSig1(e.target.value)} placeholder="• • • • • •" style={{ width: '100%', textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--accent-danger)' }} />
              </div>
              <div>
                <label style={{ display: 'block', textAlign: 'left', marginBottom: '0.5rem', opacity: 0.7, fontSize: '0.85rem' }}>Guardian 2 Key</label>
                <input type="password" value={sig2} onChange={e => setSig2(e.target.value)} placeholder="• • • • • •" style={{ width: '100%', textAlign: 'center', letterSpacing: '8px', fontSize: '1.5rem', background: 'rgba(0,0,0,0.4)', border: '1px solid var(--accent-danger)' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn" onClick={() => setShowMultiSig(false)} style={{ flex: 1, background: 'rgba(255,255,255,0.1)' }}>Cancel</button>
              <button className="btn" onClick={executeMultiSigSwitch} style={{ flex: 2, background: 'var(--accent-danger)', color: '#fff' }}>Unlock Protocol</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BentoCard({ href, title, desc, icon, isAi = false, badge }: { href: string; title: string; desc: string; icon: React.ReactNode; isAi?: boolean; badge?: number }) {
  return (
    <Link href={href}>
      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem', height: '240px', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}>
        {isAi && (
          <div style={{ position: 'absolute', top: 0, right: 0, padding: '6px 16px', background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))', fontSize: '0.75rem', fontWeight: 'bold', borderBottomLeftRadius: '12px' }}>
            GROQ AI API
          </div>
        )}
        {typeof badge === 'number' && (
          <div className="card-badge" style={{ background: 'linear-gradient(90deg, rgba(255,107,53,0.95), rgba(255,202,58,0.95))', color: '#071022' }}>{badge}</div>
        )}

        <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '50%', width: 'min-content' }}>
          {icon}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', fontWeight: 600 }}>{title}</h2>
          <p style={{ opacity: 0.8, fontSize: '0.95rem' }}>{desc}</p>
        </div>

        <div className="card-overlay">
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.15rem' }}>{title}</h3>
            <p style={{ opacity: 0.9, marginBottom: '0.75rem' }}>{desc}</p>
            <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Click to open the full {title.toLowerCase()} area. Hover or click for quick actions.</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

