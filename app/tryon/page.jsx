'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { gsap } from 'gsap';
import { UploadCloud, Download, Zap, X, ChevronDown, CheckCircle, Search, AlertTriangle } from 'lucide-react';
import { useTryOn } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

/* ─── Category grouping ──────────────────────────── */
function categorize(filename) {
  const f = filename.toLowerCase();
  if (/shirt|hoodie|tshirt|top|blouse|jacket|blazer|knit|coat/.test(f)) return 'Tops';
  if (/jeans|pants|trouser|skirt|bottom|short/.test(f)) return 'Bottoms';
  if (/bag|belt|scarf|watch|accessory|jewelry/.test(f)) return 'Accessories';
  if (/cap|hat|fedora|beret/.test(f)) return 'Caps';
  if (/watch|chrono/.test(f)) return 'Watches';
  return 'Other';
}

/* ─── Hardcoded garments (fallback if API down) ─── */
const FALLBACK_GARMENTS = [
  { id: 'top_1', filename: 'silk_blouse.jpg',    name: 'Silk Charmeuse Blouse',   price: '$340',  category: 'Tops',        emoji: '🥻' },
  { id: 'top_2', filename: 'cashmere_knit.jpg',  name: 'Oversized Cashmere Knit', price: '$520',  category: 'Tops',        emoji: '🧥' },
  { id: 'top_3', filename: 'blazer.jpg',          name: 'Structured Blazer',       price: '$890',  category: 'Tops',        emoji: '🥼' },
  { id: 'top_4', filename: 'linen_shirt.jpg',    name: 'Linen Column Shirt',      price: '$210',  category: 'Tops',        emoji: '👔' },
  { id: 'bot_1', filename: 'trousers.jpg',        name: 'Wide-leg Trousers',       price: '$420',  category: 'Bottoms',     emoji: '👖' },
  { id: 'bot_2', filename: 'midi_skirt.jpg',     name: 'Asymmetric Midi Skirt',   price: '$380',  category: 'Bottoms',     emoji: '👗' },
  { id: 'bot_3', filename: 'shorts.jpg',          name: 'Tailored Shorts',         price: '$120',  category: 'Bottoms',     emoji: '🩳' },
  { id: 'acc_1', filename: 'leather_bag.jpg',    name: 'Structured Leather Bag',  price: '$495',  category: 'Accessories', emoji: '👜' },
  { id: 'acc_2', filename: 'silk_scarf.jpg',     name: 'Silk Scarf',              price: '$400',  category: 'Accessories', emoji: '🧣' },
  { id: 'cap_1', filename: 'fedora.jpg',          name: 'Wool Fedora',             price: '$310',  category: 'Caps',        emoji: '🎩' },
  { id: 'cap_2', filename: 'beret.jpg',           name: 'Beret Noir',              price: '$145',  category: 'Caps',        emoji: '🪖' },
  { id: 'wtc_1', filename: 'gold_watch.jpg',     name: 'Minimalist Gold Watch',   price: '$395',  category: 'Watches',     emoji: '⌚' },
  { id: 'wtc_2', filename: 'chronograph.jpg',    name: 'Swiss Chronograph',       price: '$680',  category: 'Watches',     emoji: '🕰️' },
];

/* ─── Draggable Garment Card ─────────────────────── */
function GarmentCard({ item, isSelected, onSelect, index }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'GARMENT',
    item,
    collect: monitor => ({ isDragging: monitor.isDragging() }),
  }));

  return (
    <motion.div
      ref={drag}
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: isDragging ? 0.3 : 1 }}
      transition={{ delay: index * 0.035, duration: 0.4, type: 'spring', stiffness: 400, damping: 30 }}
      whileHover={{ scale: 1.04 }}
      onClick={() => onSelect(item)}
      data-cursor="drag"
      style={{
        background: isSelected ? 'rgba(200,169,110,0.08)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isSelected ? '#C8A96E' : '#252525'}`,
        boxShadow: isSelected ? '0 0 16px rgba(200,169,110,0.2)' : 'none',
        padding: '8px',
        cursor: 'none',
        position: 'relative',
        borderRadius: '2px',
        transition: 'border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease',
      }}
      onMouseEnter={e => { if (!isSelected) { e.currentTarget.style.borderColor = 'rgba(200,169,110,0.4)'; e.currentTarget.style.boxShadow = '0 0 16px rgba(200,169,110,0.12)'; } }}
      onMouseLeave={e => { if (!isSelected) { e.currentTarget.style.borderColor = '#252525'; e.currentTarget.style.boxShadow = 'none'; } }}
    >
      {/* Selected check */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          style={{ position: 'absolute', top: '6px', right: '6px', width: '16px', height: '16px',
            borderRadius: '50%', background: '#C8A96E', display: 'flex', alignItems: 'center',
            justifyContent: 'center', zIndex: 2 }}>
          <CheckCircle size={10} style={{ color: '#080808' }} />
        </motion.div>
      )}

      {/* Image */}
      <div style={{ aspectRatio: '1', background: '#0f0f0f', borderRadius: '1px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', marginBottom: '6px' }}>
        {item.emoji}
      </div>

      <p className="label-sm" style={{ color: '#888', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        {item.name}
      </p>
      <p className="label-caps" style={{ color: '#C8A96E', fontSize: '0.6rem' }}>{item.price}</p>
    </motion.div>
  );
}

/* ─── Category Accordion ─────────────────────────── */
function CategoryAccordion({ category, items, selectedGarment, onSelect, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 10px', background: 'none', border: 'none', cursor: 'none',
          color: '#888', borderBottom: '1px solid #1c1c1c' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="label-sm" style={{ color: '#C8A96E' }}>{category.toUpperCase()}</span>
          <span style={{ background: '#252525', color: '#555', fontFamily: '"DM Mono", monospace',
            fontSize: '0.5rem', padding: '1px 5px', borderRadius: '10px' }}>{items.length}</span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={12} style={{ color: '#555' }} />
        </motion.div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '10px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {items.map((item, i) => (
                <GarmentCard key={item.id} item={item} index={i}
                  isSelected={selectedGarment === item.filename} onSelect={(item) => onSelect(item.filename)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Upload Drop Zone ───────────────────────────── */
function UploadZone({ personImage, onUpload, onClear }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  const [{ isGarmentOver }, dropRef] = useDrop(() => ({
    accept: 'GARMENT',
    collect: monitor => ({ isGarmentOver: monitor.isOver() }),
  }));

  const processFile = useCallback((file) => {
    if (!file?.type.startsWith('image/')) return;
    if (file.size > 10 * 1024 * 1024) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      onUpload(e.target.result); // this is "data:image/jpeg;base64,..." — keep full data URI
    };
    reader.readAsDataURL(file);
  }, [onUpload]);

  const activeBorder = isDragOver || isGarmentOver;

  return (
    <div ref={dropRef} style={{ width: '100%', maxWidth: '300px', margin: '0 auto', position: 'relative' }}>
      <motion.div
        style={{ aspectRatio: '3/4', position: 'relative', borderRadius: '2px' }}
        animate={{
          borderColor: activeBorder ? '#C8A96E' : '#333',
          scale: activeBorder ? 1.01 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <AnimatePresence mode="wait">
          {personImage ? (
            <motion.div key="image"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              style={{ width: '100%', height: '100%', position: 'relative', border: '1.5px solid #333', borderRadius: '2px', overflow: 'hidden' }}>
              <img src={personImage} alt="Your photo"
                style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#0f0f0f' }} />
              <button onClick={onClear} data-cursor="view"
                style={{ position: 'absolute', top: '10px', right: '10px', width: '28px', height: '28px',
                  borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F0EDE8', cursor: 'none' }}>
                <X size={12} />
              </button>
              <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
                <span className="label-sm" style={{ background: 'rgba(0,0,0,0.6)', color: '#C8A96E', padding: '3px 8px', backdropFilter: 'blur(8px)' }}>
                  ✓ PHOTO READY
                </span>
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => inputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
              onDragLeave={() => setIsDragOver(false)}
              onDrop={e => { e.preventDefault(); setIsDragOver(false); processFile(e.dataTransfer.files[0]); }}
              style={{
                width: '100%', height: '100%',
                border: `1.5px dashed ${activeBorder ? '#C8A96E' : '#333'}`,
                background: activeBorder ? 'rgba(200,169,110,0.04)' : 'rgba(255,255,255,0.02)',
                borderRadius: '2px', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '12px', cursor: 'none',
                boxShadow: activeBorder ? 'inset 0 0 40px rgba(200,169,110,0.04)' : 'none',
              }}
              className={!activeBorder ? 'animate-breathe' : ''}
            >
              {/* Corner decorators */}
              <div style={{ position: 'absolute', top: '12px', left: '12px', width: '16px', height: '16px', borderTop: '1px solid rgba(200,169,110,0.3)', borderLeft: '1px solid rgba(200,169,110,0.3)' }} />
              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '16px', height: '16px', borderTop: '1px solid rgba(200,169,110,0.3)', borderRight: '1px solid rgba(200,169,110,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '12px', left: '12px', width: '16px', height: '16px', borderBottom: '1px solid rgba(200,169,110,0.3)', borderLeft: '1px solid rgba(200,169,110,0.3)' }} />
              <div style={{ position: 'absolute', bottom: '12px', right: '12px', width: '16px', height: '16px', borderBottom: '1px solid rgba(200,169,110,0.3)', borderRight: '1px solid rgba(200,169,110,0.3)' }} />

              <UploadCloud size={32} style={{ color: '#C8A96E' }} />
              <div style={{ textAlign: 'center' }}>
                <p className="font-sans text-sm" style={{ color: '#F0EDE8' }}>
                  {activeBorder ? 'Release to upload' : 'Drop your photo here'}
                </p>
                <p className="label-sm mt-1" style={{ color: '#555' }}>or click to browse</p>
                <p className="label-sm mt-1" style={{ color: '#444' }}>JPG · PNG · WEBP</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => processFile(e.target.files[0])} />
    </div>
  );
}

/* ─── Result Zone ────────────────────────────────── */
function ResultZone({ isProcessing, resultImage, error, selectedGarment }) {
  function download() {
    if (!resultImage) return;
    const link = document.createElement('a');
    link.href = resultImage; // base64 data URI works directly as href
    link.download = 'stylesync-tryon-result.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}>
      <div style={{ aspectRatio: '3/4', position: 'relative', borderRadius: '2px', border: `1.5px solid ${error ? '#c0392b' : '#333'}`, overflow: 'hidden', background: '#0f0f0f' }}>
        <AnimatePresence mode="wait">
          {isProcessing && (
            <motion.div key="processing"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div className="shimmer" style={{ position: 'absolute', inset: 0 }} />
              <div style={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
                <p className="label-caps mb-4" style={{ color: '#C8A96E' }}>PROCESSING</p>
                <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                  {[0,1,2].map(i => (
                    <motion.div key={i} animate={{ scale: [1,0.4,1], opacity: [1,0.3,1] }}
                      transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                      style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#C8A96E' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {!isProcessing && resultImage && (
            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <img 
                src={resultImage}
                alt="Try-on result"
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
            </motion.div>
          )}

          {!isProcessing && !resultImage && !error && (
            <motion.div key="waiting"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              {/* Scan line */}
              <div className="scan-line" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '1px', background: 'rgba(200,169,110,0.25)' }} />
                <div style={{ width: '70px', height: '1px', background: 'rgba(200,169,110,0.15)' }} />
                <div style={{ width: '50px', height: '1px', background: 'rgba(200,169,110,0.2)' }} />
              </div>
              <p className="label-caps" style={{ color: '#333' }}>AWAITING INPUT</p>
            </motion.div>
          )}

          {!isProcessing && error && (
            <motion.div key="error"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
              <AlertTriangle size={24} style={{ color: '#c0392b', marginBottom: '12px' }} />
              <p className="label-caps mb-2" style={{ color: '#c0392b' }}>ERROR</p>
              <p className="font-mono text-xs" style={{ color: '#888', wordBreak: 'break-all', lineHeight: 1.4 }}>{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Actions below */}
      <AnimatePresence>
        {resultImage && !isProcessing && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <p className="label-caps" style={{ color: '#C8A96E', textAlign: 'center' }}>✓ TRY-ON COMPLETE</p>
            <button className="btn-ghost w-full" style={{ padding: '0.75rem', fontSize: '0.65rem' }}
              onClick={download} data-cursor="view">
              DOWNLOAD RESULT <Download size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── TryOn Content (inside DndProvider) ─────────── */
function TryOnContent() {
  const { selectedGarment, setSelectedGarment, personImage, setPersonImage,
    resultImage, isProcessing, error, reset, generateTryOn } = useTryOn();
  const toast = useToast();

  const [garments,     setGarments]     = useState([]);
  const [garmentQuery, setGarmentQuery] = useState('');
  const canGenerate = personImage && selectedGarment && !isProcessing;

  // Fetch garments from API
  useEffect(() => {
    fetch('http://localhost:5000/garments')
      .then(r => r.json())
      .then(data => {
        if (data.garments) {
          setGarments(data.garments); // array of filename strings
        }
      })
      .catch(err => {
        console.error('Failed to load garments:', err);
        // Fallback: hardcode some filenames so panel is not empty
        setGarments(['shirt.png', 'hoodie.png', 'jeans.png']);
      });
  }, []);

  // GSAP entrance
  const panelRef  = useRef(null);
  const col2Ref   = useRef(null);
  const col3Ref   = useRef(null);
  const headRef   = useRef(null);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const tl = gsap.timeline();
    tl.fromTo(panelRef.current,  { x: -80, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
    tl.fromTo(col2Ref.current,   { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.4');
    tl.fromTo(col3Ref.current,   { scale: 0.95, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6 }, '-=0.4');
    tl.fromTo(headRef.current,   { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: 0.8, ease: 'power3.out' }, 0.2);
  }, []);

  // Right panel drop target (drop garment onto right panel area)
  const [{ isOver }, rightDrop] = useDrop(() => ({
    accept: 'GARMENT',
    drop: (item) => {
      setSelectedGarment(item.filename);
      toast.info(`${item.name} selected`);
    },
    collect: monitor => ({ isOver: monitor.isOver() }),
  }));

  // Filtered garments by category
  const grouped = garments.reduce((acc, g) => {
    const isStr = typeof g === 'string';
    const filename = isStr ? g : g.filename;
    const name = isStr ? filename.replace(/\.\w+$/, '').replace(/[_-]/g, ' ') : g.name;
    const cat = isStr ? categorize(filename) : g.category;
    
    if (!acc[cat]) acc[cat] = [];
    const matchQ = !garmentQuery ||
      name.toLowerCase().includes(garmentQuery.toLowerCase()) ||
      filename.toLowerCase().includes(garmentQuery.toLowerCase());
      
    if (matchQ) {
      acc[cat].push({
        id: filename, filename, name, category: cat, emoji: isStr ? '👔' : g.emoji, price: isStr ? '' : g.price
      });
    }
    return acc;
  }, {});

  async function handleGenerate() {
    if (!personImage) { toast.error('Upload your photo first'); return; }
    if (!selectedGarment) { toast.error('Select a garment to try on'); return; }
    toast.info('Generating your try-on…');
    await generateTryOn();
    if (resultImage) toast.success('Try-on complete!');
  }

  return (
    <div style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column', background: '#080808' }}>
      {/* Page header */}
      <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid #1c1c1c', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Zap size={12} style={{ color: '#C8A96E' }} />
            <span className="label-sm" style={{ color: '#C8A96E' }}>VIRTUAL TRY-ON STUDIO</span>
          </div>
          <h1 ref={headRef} className="font-display" style={{
            fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 300, color: '#F0EDE8',
            clipPath: 'inset(0 100% 0 0)'
          }}>
            Dress the <em style={{ color: '#C8A96E' }}>Moment.</em>
          </h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(personImage || selectedGarment || resultImage) && (
            <button onClick={reset} className="btn-ghost" style={{ padding: '8px 16px', fontSize: '0.6rem' }}>
              <X size={12} /> RESET
            </button>
          )}
          <div style={{ textAlign: 'right' }}>
            <p className="label-sm" style={{ color: selectedGarment ? '#C8A96E' : '#444' }}>
              {selectedGarment ? `✓ ${garments.find(g => g.filename === selectedGarment)?.name || selectedGarment}` : 'NO GARMENT'}
            </p>
            <p className="label-sm" style={{ color: personImage ? '#C8A96E' : '#444' }}>
              {personImage ? '✓ PHOTO READY' : 'NO PHOTO'}
            </p>
          </div>
        </div>
      </div>

      {/* Main 3-column grid */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '280px 1fr 1fr', overflow: 'hidden' }}>

        {/* ─── COLUMN 1: Outfit Panel ─────────────────── */}
        <div ref={panelRef} className="glass-panel thin-scroll"
          style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 14px 10px', borderBottom: '1px solid #1c1c1c', flexShrink: 0 }}>
            <p className="label-sm" style={{ color: '#C8A96E', letterSpacing: '0.2em', marginBottom: '12px' }}>
              SELECT A GARMENT
            </p>
            {/* Search */}
            <div style={{ position: 'relative' }}>
              <Search size={11} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: '#444', pointerEvents: 'none' }} />
              <input value={garmentQuery} onChange={e => setGarmentQuery(e.target.value)}
                placeholder="Filter garments…"
                style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #252525',
                  color: '#F0EDE8', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem',
                  letterSpacing: '0.08em', padding: '6px 8px 6px 24px', outline: 'none' }} />
            </div>
          </div>

          {/* Selected garment preview */}
          <AnimatePresence>
            {selectedGarment && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                style={{ overflow: 'hidden', borderBottom: '1px solid #1c1c1c', flexShrink: 0 }}
              >
                <div style={{ padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'center',
                  background: 'rgba(200,169,110,0.04)' }}>
                  <span style={{ fontSize: '1.5rem' }}>{garments.find(g => g.filename === selectedGarment)?.emoji || '👔'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className="label-sm" style={{ color: '#888' }}>{garments.find(g => g.filename === selectedGarment)?.category || 'Other'}</p>
                    <p className="font-sans text-xs mt-0.5" style={{ color: '#F0EDE8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {garments.find(g => g.filename === selectedGarment)?.name || selectedGarment}
                    </p>
                    {garments.find(g => g.filename === selectedGarment)?.price && <p className="label-caps" style={{ color: '#C8A96E', fontSize: '0.55rem', marginTop: '2px' }}>{garments.find(g => g.filename === selectedGarment)?.price}</p>}
                  </div>
                  <button onClick={() => setSelectedGarment(null)} style={{ color: '#555', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <X size={12} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Categories */}
          <div style={{ flex: 1, overflowY: 'auto' }} className="thin-scroll">
            {Object.entries(grouped).map(([cat, items], i) =>
              items.length > 0 && (
                <CategoryAccordion key={cat} category={cat} items={items}
                  selectedGarment={selectedGarment} onSelect={setSelectedGarment}
                  defaultOpen={i === 0} />
              )
            )}
            {Object.values(grouped).every(a => a.length === 0) && (
              <p className="label-sm p-4" style={{ color: '#444' }}>No garments found</p>
            )}
          </div>
        </div>

        {/* ─── COLUMN 2: Person Upload ─────────────────── */}
        <div ref={col2Ref} style={{ display: 'flex', flexDirection: 'column', borderRight: '1px solid #1c1c1c',
          padding: '24px 20px', gap: '16px', overflow: 'hidden' }}>
          <p className="label-sm" style={{ color: '#C8A96E', letterSpacing: '0.2em', flexShrink: 0 }}>YOUR PHOTO</p>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <UploadZone personImage={personImage} onUpload={setPersonImage}
              onClear={() => setPersonImage(null)} />
          </div>
        </div>

        {/* ─── COLUMN 3: Result ──────────────────────────── */}
        <div ref={col3Ref} style={{ display: 'flex', flexDirection: 'column', padding: '24px 20px', gap: '16px', overflow: 'hidden' }}
          data-cursor="drop">
          <p className="label-sm" style={{ color: '#C8A96E', letterSpacing: '0.2em', flexShrink: 0 }}>TRY-ON RESULT</p>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <ResultZone isProcessing={isProcessing} resultImage={resultImage} error={error} selectedGarment={selectedGarment} />
          </div>
        </div>
      </div>

      {/* ─── GENERATE BUTTON ─────────────────────────────── */}
      <div ref={rightDrop} style={{ borderTop: '1px solid #1c1c1c', padding: '14px 24px', flexShrink: 0,
        display: 'grid', gridTemplateColumns: '280px 1fr', gap: '0' }}>
        <div /> {/* spacer for column 1 */}
        <motion.button
          onClick={handleGenerate}
          disabled={!canGenerate}
          whileHover={canGenerate ? { scale: 1.015, boxShadow: '0 12px 40px rgba(200,169,110,0.4)' } : {}}
          whileTap={canGenerate ? { scale: 0.97 } : {}}
          className="btn-gold"
          style={{ height: '52px', fontSize: '0.75rem', letterSpacing: '0.2em', opacity: canGenerate ? 1 : 0.35 }}
          data-cursor={canGenerate ? 'try' : undefined}
        >
          {isProcessing ? (
            <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              PROCESSING
              <span style={{ display: 'flex', gap: '4px' }}>
                {[0,1,2].map(i => (
                  <motion.span key={i} animate={{ scale: [1,0.4,1], opacity: [1,0.3,1] }}
                    transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                    style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#080808', display: 'block' }} />
                ))}
              </span>
            </span>
          ) : (
            <><Zap size={15} fill="currentColor" /> GENERATE TRY-ON</>
          )}
        </motion.button>
      </div>
    </div>
  );
}

/* ─── Page export (DndProvider wrapper) ─────────── */
export default function TryOnPage() {
  return (
    <DndProvider backend={HTML5Backend}>
      <TryOnContent />
    </DndProvider>
  );
}
