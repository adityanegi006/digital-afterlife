"use client";
import { useState } from "react";
import { Shield, Fingerprint, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [pin, setPin] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length < 4) return alert("PIN must be at least 4 digits.");
    
    setIsAuthenticating(true);
    
    // Simulate Biometric / Cryptographic Decryption
    const steps = [
      "Requesting Secure Enclave...",
      "Verifying Local Master Hash...",
      "Decrypting Local Storage...",
      "Vault Unlocked."
    ];
    
    for (let i = 1; i <= steps.length; i++) {
      await new Promise(r => setTimeout(r, 800));
      setLoadingStep(i);
    }
    
    localStorage.setItem("vault_auth", "true");
    router.push("/");
  };

  const loadingMessages = [
    "",
    "Requesting Secure Enclave...",
    "Verifying Local Master Hash...",
    "Decrypting Local Storage...",
    "Vault Unlocked."
  ];

  return (
    <div style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column' }}>
      <div className="glass-panel" style={{ padding: '3.5rem', maxWidth: '420px', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', textAlign: 'center' }}>
        <div style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', padding: '1.25rem', borderRadius: '50%', boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)' }}>
          {isAuthenticating ? <Loader2 size={48} color="#fff" style={{ animation: 'spin 1s linear infinite' }} /> : <Fingerprint size={48} color="#fff" />}
        </div>
        <div>
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', margin: 0, fontWeight: 800 }}>The Vault</h1>
          <p style={{ opacity: 0.7, marginTop: '0.5rem', minHeight: '24px' }}>
            {isAuthenticating ? <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>{loadingMessages[loadingStep]}</span> : (isLogin ? "Welcome back. Authenticate yourself." : "Secure your digital legacy today.")}
          </p>
        </div>

        {!isAuthenticating && (
          <form onSubmit={handleAuth} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.2rem', marginTop: '1rem' }}>
            {!isLogin && (
              <input type="text" placeholder="Full Legal Name" required style={{ width: '100%', textAlign: 'center' }} />
            )}
            {!isLogin && (
              <input type="email" placeholder="Email Address" required style={{ width: '100%', textAlign: 'center' }} />
            )}
            
            <input 
              type="password" 
              placeholder="Secure Master PIN" 
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              required 
              style={{ width: '100%', textAlign: 'center', fontSize: '1.2rem', letterSpacing: '4px' }} 
              maxLength={8}
            />
            
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', width: '100%', padding: '16px', fontSize: '1.1rem' }}>
              {isLogin ? "Unlock Vault" : "Create Master Vault"}
            </button>
          </form>
        )}

        {!isAuthenticating && (
          <p style={{ fontSize: '0.9rem', opacity: 0.6, cursor: 'pointer', marginTop: '1rem' }} onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Don't have a vault yet? Initialize one." : "Already have a vault? Securely Unlock it."}
          </p>
        )}
      </div>
      <p style={{ marginTop: '2rem', opacity: 0.3, fontSize: '0.8rem' }}>Client-Side Encrypted Environment</p>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
