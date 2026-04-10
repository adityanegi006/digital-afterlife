"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Settings, Send } from 'lucide-react';

export default function AssistantPage() {
  const [messages, setMessages] = useState([{ role: 'assistant', content: 'Hello. I am the digitally orchestrated Executive Assistant & Bereavement Guide. How can I help you navigate the vault today?' }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!input.trim()) return;
    
    const newMsgs = [...messages, { role: 'user', content: input }];
    setMessages(newMsgs);
    setInput('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/assistant', {
        method: 'POST', body: JSON.stringify({ messages: newMsgs })
      });
      const data = await res.json();
      if(data.error) throw new Error(data.error);
      
      setMessages([...newMsgs, { role: 'assistant', content: data.message }]);
    } catch(err: any) {
      setMessages([...newMsgs, { role: 'assistant', content: 'System API Error: ' + err.message + '. Please ensure GROQ_API_KEY is set in .env.local' }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block', flexShrink: 0 }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <div style={{ background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)', padding: '1rem', borderRadius: '50%' }}>
          <Settings size={32} color="#fff" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Bereavement Guide AI</h1>
          <p style={{ opacity: 0.7 }}>Powered by Groq. Ask me anything about the vaults or transfer memos.</p>
        </div>
      </header>

      <div className="glass-panel" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', marginBottom: '2rem' }}>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', background: msg.role === 'user' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', borderRadius: '16px', borderBottomRightRadius: msg.role === 'user' ? '0' : '16px', borderBottomLeftRadius: msg.role === 'assistant' ? '0' : '16px', border: msg.role === 'assistant' ? '1px solid var(--glass-border)' : 'none' }}>
              <p style={{ color: msg.role === 'user' ? '#fff' : 'inherit', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>{msg.content}</p>
            </div>
          ))}
          {loading && (
            <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '1rem 1.5rem', borderRadius: '16px', borderBottomLeftRadius: '0', border: '1px solid var(--glass-border)' }}>
              <p style={{ opacity: 0.5 }}>Analyzing vault context...</p>
            </div>
          )}
        </div>
        
        <form onSubmit={sendMessage} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '1rem', background: 'rgba(0,0,0,0.2)' }}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)} placeholder="E.g., What are my father's Life Insurance details?" style={{ flexGrow: 1, borderRadius: '24px', padding: '12px 20px', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }} />
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} disabled={loading}>
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
}
