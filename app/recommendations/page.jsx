'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, Sparkles, X, AlertTriangle } from 'lucide-react';
import { useToast } from '@/components/Toast';

const MOCK_PALETTE = [
  { color: '#2C3E50', name: 'Navy'     },
  { color: '#7F8C8D', name: 'Charcoal' },
  { color: '#BDC3C7', name: 'Stone'    },
  { color: '#E8C99E', name: 'Cream'    },
  { color: '#C8A96E', name: 'Gold'     },
];

const MOCK_RECOMMENDATIONS = [
  { id: 1, emoji: '🥻', name: 'Silk Charmeuse Blouse', brand: 'THE ROW',    price: '$340', match: 97, why: 'The cream silk complements your warm undertone perfectly.' },
  { id: 2, emoji: '👖', name: 'Wide-Leg Trousers',      brand: 'LEMAIRE',   price: '$420', match: 94, why: 'Navy balances your detected cool-warm mix in proportions.' },
  { id: 3, emoji: '🧥', name: 'Cashmere Overcoat',      brand: 'LORO PIANA', price: '$2800', match: 91, why: 'Charcoal grey creates an elegant tonal contrast.' },
  { id: 4, emoji: '👗', name: 'Asymmetric Midi Dress',  brand: 'TOTEME',    price: '$560', match: 88, why: 'Stone tones harmonize with your detected neutral palette.' },
  { id: 5, emoji: '👜', name: 'Structured Tote',        brand: 'A.P.C.',    price: '$495', match: 85, why: 'Gold hardware echoes the warm accent from your palette.' },
  { id: 6, emoji: '🧣', name: 'Merino Scarf',           brand: 'JOHNSTONS', price: '$180', match: 82, why: 'A soft neutral accessory to tie the look together.' },
];

function RecommendCard({ item, index }) {
  const [showWhy, setShowWhy] = useState(false);
  return (
    <motion.div
      initial={{ y: 30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: index * 0.07, duration: 0.5 }}
      className="glass-card overflow-hidden"
      style={{ borderColor: 'rgba(255,255,255,0.07)', position: 'relative' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      {/* Match badge */}
      <div style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>
        <span style={{ background: '#C8A96E', color: '#080808', fontFamily: '"DM Mono", monospace',
          fontSize: '0.55rem', padding: '3px 7px', letterSpacing: '0.1em' }}>
          {item.match}% MATCH
        </span>
      </div>

      {/* Image */}
      <div style={{ aspectRatio: '3/4', background: 'rgba(255,255,255,0.02)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem' }}>
        {item.emoji}
      </div>

      <div style={{ padding: '14px', position: 'relative' }}>
        <p className="label-sm mb-1" style={{ color: '#888' }}>{item.brand}</p>
        <p className="font-sans text-sm mb-1" style={{ color: '#F0EDE8' }}>{item.name}</p>
        <p className="label-caps" style={{ color: '#C8A96E' }}>{item.price}</p>

        {/* Why this? */}
        <button
          onClick={() => setShowWhy(p => !p)}
          className="label-sm mt-2 block"
          style={{ color: '#555', background: 'none', border: 'none', cursor: 'none',
            borderBottom: '1px solid #252525', paddingBottom: '1px' }}>
          WHY THIS?
        </button>

        <AnimatePresence>
          {showWhy && (
            <motion.p
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="font-sans text-xs mt-2 overflow-hidden"
              style={{ color: '#888', lineHeight: 1.5 }}>
              {item.why}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export default function RecommendationsPage() {
  const [image,      setImage]      = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [palette,    setPalette]    = useState(null);
  const [results,    setResults]    = useState(null);
  const [error,      setError]      = useState(null);
  const inputRef = useRef(null);
  const toast    = useToast();

  const handleUpload = useCallback(async (file) => {
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUri = e.target.result;
      setImage(dataUri);
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('http://localhost:5000/recommend', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ person_image: dataUri }),
        });
        const data = await res.json();
        setPalette(data.palette || MOCK_PALETTE);
        setResults(data.recommendations || MOCK_RECOMMENDATIONS);
      } catch {
        setPalette(MOCK_PALETTE);
        setResults(MOCK_RECOMMENDATIONS);
        toast.info('Showing demo recommendations — API offline');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  }, [toast]);

  return (
    <div style={{ minHeight: '100vh', background: '#080808', paddingTop: '56px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="label-caps mb-3" style={{ color: '#C8A96E' }}>AI STYLIST</p>
          <h1 className="font-display mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: '#F0EDE8' }}>
            Styled for <em>You</em>
          </h1>
          <p className="font-body mb-12" style={{ color: '#888' }}>
            Upload your photo and our AI will analyse your color palette to curate the perfect wardrobe.
          </p>
        </motion.div>

        {!image ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
              onChange={e => handleUpload(e.target.files[0])} />
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); handleUpload(e.dataTransfer.files[0]); }}
              style={{ maxWidth: '400px', aspectRatio: '3/4', border: '1.5px dashed #333', borderRadius: '2px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
                cursor: 'none', background: 'rgba(255,255,255,0.02)' }}
              data-cursor="view"
            >
              <UploadCloud size={36} style={{ color: '#C8A96E' }} />
              <div style={{ textAlign: 'center' }}>
                <p className="font-sans" style={{ color: '#F0EDE8' }}>Upload your photo</p>
                <p className="label-sm mt-2" style={{ color: '#555' }}>Click or drag to start</p>
              </div>
            </div>
          </motion.div>
        ) : (
          <div>
            {/* Uploaded photo + clear */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start', marginBottom: '48px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '160px', flexShrink: 0 }}>
                <img src={image} alt="Uploaded" style={{ width: '100%', aspectRatio: '3/4', objectFit: 'contain', background: '#0f0f0f', border: '1px solid #252525', borderRadius: '2px' }} />
                <button onClick={() => { setImage(null); setPalette(null); setResults(null); }}
                  style={{ position: 'absolute', top: '8px', right: '8px', width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0EDE8', cursor: 'none' }}>
                  <X size={11} />
                </button>
              </div>

              {/* Palette */}
              {palette && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
                  <p className="label-caps mb-4" style={{ color: '#888' }}>DETECTED COLOUR PALETTE</p>
                  <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                    {palette.map((c, i) => (
                      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08, type: 'spring', stiffness: 400 }}
                        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: c.color, border: '1px solid rgba(255,255,255,0.1)' }} />
                        <span className="label-sm" style={{ color: '#888' }}>{c.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Loading */}
            {loading && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ scale: [1,0.4,1], opacity: [1,0.3,1] }}
                    transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                    style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#C8A96E' }} />
                ))}
              </div>
            )}

            {/* Results grid */}
            {results && (
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '24px' }}>
                  <Sparkles size={14} style={{ color: '#C8A96E' }} />
                  <p className="label-caps" style={{ color: '#C8A96E' }}>CURATED FOR YOUR PALETTE</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                  {results.map((r, i) => <RecommendCard key={r.id} item={r} index={i} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
