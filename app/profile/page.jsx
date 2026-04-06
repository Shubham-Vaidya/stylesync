'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Save } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

function FloatingInput({ id, label, type = 'text', value, onChange }) {
  const [focused, setFocused] = useState(false);
  const raised = focused || String(value).length > 0;
  return (
    <div style={{ position: 'relative', paddingTop: '22px', marginBottom: '8px' }}>
      <motion.label htmlFor={id}
        animate={{ y: raised ? -24 : 0, scale: raised ? 0.82 : 1, transformOrigin: 'left center' }}
        transition={{ duration: 0.2 }}
        style={{ position: 'absolute', left: 0, top: '24px', fontFamily: '"DM Mono", monospace',
          fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: raised ? '#C8A96E' : '#888', pointerEvents: 'none' }}>
        {label}
      </motion.label>
      <input id={id} type={type} value={value} onChange={onChange}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="input-base" />
      <div style={{ position: 'relative', height: '1px' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#333' }} />
        <motion.div animate={{ scaleX: focused ? 1 : 0, transformOrigin: 'left center' }} transition={{ duration: 0.25 }}
          style={{ position: 'absolute', inset: 0, background: '#C8A96E' }} />
      </div>
    </div>
  );
}

const BODY_TYPES = ['Slim', 'Regular', 'Athletic', 'Curvy'];
const SIZE_LABELS = { XS: 'Extra Small', S: 'Small', M: 'Medium', L: 'Large', XL: 'Extra Large' };
const LANG_OPTIONS = [
  { code: 'en', flag: '🇬🇧', name: 'English' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'ja', flag: '🇯🇵', name: '日本語' },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const toast     = useToast();
  const name = user?.name || 'Shubham Vaidya';
  const email = user?.email || 'user@stylesync.ai';
  const initials = name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase();

  const [height,   setHeight]   = useState('');
  const [weight,   setWeight]   = useState('');
  const [chest,    setChest]    = useState('');
  const [waist,    setWaist]    = useState('');
  const [bodyType, setBodyType] = useState('Regular');
  const [lang,     setLang]     = useState('en');
  const [sizeResult, setSizeResult] = useState(null);
  const [loading,  setLoading]  = useState(false);

  async function handleGetSize() {
    if (!height || !weight) { toast.error('Enter at least height and weight'); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/size', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ height: Number(height), weight: Number(weight),
          chest: Number(chest), waist: Number(waist), body_type: bodyType }),
      });
      const data = await res.json();
      setSizeResult(data.size || deriveSize(weight, height));
      toast.success('Size recommendation ready!');
    } catch {
      setSizeResult(deriveSize(weight, height));
      toast.info('Showing estimated size — API offline');
    } finally { setLoading(false); }
  }

  function deriveSize(w, h) {
    const bmi = Number(w) / ((Number(h) / 100) ** 2);
    if (bmi < 18.5) return 'XS';
    if (bmi < 21)   return 'S';
    if (bmi < 24)   return 'M';
    if (bmi < 27)   return 'L';
    return 'XL';
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', paddingTop: '56px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 5%' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Avatar */}
          <div style={{ display: 'flex', gap: '28px', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap' }}>
            <div className="group" style={{ position: 'relative' }}>
              <div style={{ width: '96px', height: '96px', borderRadius: '50%',
                background: 'rgba(200,169,110,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid rgba(200,169,110,0.3)', fontSize: '1.8rem', color: '#C8A96E',
                fontFamily: '"Playfair Display", serif' }}>
                {initials}
              </div>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(0,0,0,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: 'opacity 0.2s' }}
                className="group-hover:opacity-100">
                <Camera size={18} style={{ color: '#C8A96E' }} />
              </div>
            </div>
            <div>
              <p className="label-caps mb-1" style={{ color: '#C8A96E' }}>PROFILE</p>
              <h1 className="font-display" style={{ fontSize: '2rem', fontWeight: 300, color: '#F0EDE8' }}>{name}</h1>
              <p className="font-body mt-1" style={{ color: '#888' }}>{email}</p>
              {user?.role && (
                <span className="label-sm mt-2 inline-block px-2 py-1" style={{
                  border: '1px solid #252525', color: '#888', textTransform: 'uppercase' }}>
                  {user.role}
                </span>
              )}
            </div>
          </div>

          {/* Measurements form */}
          <div className="glass-card" style={{ padding: '32px', marginBottom: '24px', borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="label-caps mb-6" style={{ color: '#C8A96E' }}>BODY MEASUREMENTS</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0 32px' }}>
              <FloatingInput id="height" label="Height (cm)" type="number" value={height} onChange={e => setHeight(e.target.value)} />
              <FloatingInput id="weight" label="Weight (kg)" type="number" value={weight} onChange={e => setWeight(e.target.value)} />
              <FloatingInput id="chest"  label="Chest (cm)"  type="number" value={chest}  onChange={e => setChest(e.target.value)} />
              <FloatingInput id="waist"  label="Waist (cm)"  type="number" value={waist}  onChange={e => setWaist(e.target.value)} />
            </div>

            {/* Body type */}
            <div style={{ marginTop: '24px' }}>
              <p className="label-sm mb-3" style={{ color: '#555' }}>BODY TYPE</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {BODY_TYPES.map(t => (
                  <button key={t} onClick={() => setBodyType(t)}
                    style={{ padding: '6px 16px', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem',
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      border: `1px solid ${bodyType === t ? '#C8A96E' : '#333'}`,
                      background: bodyType === t ? 'rgba(200,169,110,0.1)' : 'transparent',
                      color: bodyType === t ? '#C8A96E' : '#555', borderRadius: '1px', cursor: 'none' }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <motion.button onClick={handleGetSize} disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: '0 8px 32px rgba(200,169,110,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold" style={{ marginTop: '28px', padding: '0.85rem 2rem', fontSize: '0.7rem' }}>
              {loading ? '···' : 'GET MY SIZE →'}
            </motion.button>

            {/* Size result */}
            <AnimatePresence>
              {sizeResult && (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  style={{ marginTop: '24px', display: 'inline-flex', alignItems: 'center', gap: '16px' }}
                >
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#C8A96E',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#080808', fontWeight: 600 }}>
                    {sizeResult}
                  </div>
                  <div>
                    <p className="font-display italic" style={{ color: '#C8A96E', fontSize: '1.1rem' }}>Your size: {sizeResult}</p>
                    <p className="label-sm mt-0.5" style={{ color: '#888' }}>{SIZE_LABELS[sizeResult]}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Language preference */}
          <div className="glass-card" style={{ padding: '28px', borderColor: 'rgba(255,255,255,0.07)' }}>
            <p className="label-caps mb-5" style={{ color: '#C8A96E' }}>LANGUAGE</p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {LANG_OPTIONS.map(l => (
                <button key={l.code} onClick={() => setLang(l.code)}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px',
                    border: `1px solid ${lang === l.code ? '#C8A96E' : '#252525'}`,
                    background: lang === l.code ? 'rgba(200,169,110,0.08)' : 'transparent',
                    borderRadius: '1px', cursor: 'none' }}>
                  <span style={{ fontSize: '1rem' }}>{l.flag}</span>
                  <span className="label-sm" style={{ color: lang === l.code ? '#C8A96E' : '#555' }}>{l.name}</span>
                </button>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
