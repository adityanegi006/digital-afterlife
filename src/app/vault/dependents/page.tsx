"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Heart } from 'lucide-react';

export default function DependentsVault() {
  const [dependents, setDependents] = useState<{ pets: any[], people: any[] }>({ pets: [], people: [] });
  const [guardianMode, setGuardianMode] = useState(false);
  const [petForm, setPetForm] = useState({ name: '', type: '', care: '' });

  useEffect(() => {
    fetch('/api/vault/dependents').then(r => r.json()).then(data => {
      setDependents(data.dependents || { pets: [], people: [] });
      setGuardianMode(data.guardianMode || false);
    });
  }, []);

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault();
    if(guardianMode) return;

    const newPet = { id: Date.now().toString(), ...petForm };
    const updated = { ...dependents, pets: [...dependents.pets, newPet] };

    await fetch('/api/vault/dependents', { method: 'POST', body: JSON.stringify(updated) });
    setDependents(updated);
    setPetForm({ name: '', type: '', care: '' });
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/" style={{ color: 'var(--accent-primary)', marginBottom: '1rem', display: 'inline-block' }}>&larr; Back to Dashboard</Link>
      <header style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ background: 'rgba(236, 72, 153, 0.2)', padding: '1rem', borderRadius: '50%' }}>
          <Users size={32} color="#ec4899" />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', margin: 0 }}>Dependents & Pets</h1>
          <p style={{ opacity: 0.7 }}>Crucial care instructions for loved ones left behind.</p>
        </div>
      </header>

      {/* Pet Directives */}
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Heart size={20} color="#ec4899" /> Registered Pets</h2>
        
        {dependents.pets.length === 0 ? <p style={{ opacity: 0.5 }}>No pets registered.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {dependents.pets.map((pet: any) => (
              <div key={pet.id} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#ec4899' }}>{pet.name} ({pet.type})</h3>
                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', fontSize: '0.9rem', whiteSpace: 'pre-wrap' }}>
                  {pet.care}
                </div>
              </div>
            ))}
          </div>
        )}

        {!guardianMode && (
          <form onSubmit={handleAddPet} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" value={petForm.name} onChange={e => setPetForm({...petForm, name: e.target.value})} placeholder="Pet's Name" required style={{ width: '100%' }} />
              <input type="text" value={petForm.type} onChange={e => setPetForm({...petForm, type: e.target.value})} placeholder="Species / Breed" required style={{ width: '100%' }} />
            </div>
            <textarea value={petForm.care} onChange={e => setPetForm({...petForm, care: e.target.value})} placeholder="Dietary restrictions, Vet info, Guardian assignment..." rows={3} required style={{ width: '100%' }} />
            <div style={{ textAlign: 'right' }}>
              <button type="submit" className="btn" style={{ background: '#ec4899', color: '#fff' }}>Add Pet</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
