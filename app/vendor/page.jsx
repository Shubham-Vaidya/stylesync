'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Package, TrendingUp, DollarSign, UploadCloud } from 'lucide-react';
import { useToast } from '@/components/Toast';

const INITIAL_PRODUCTS = [
  { id: 1, emoji: '🥻', name: 'Silk Charmeuse Blouse', category: 'Tops',    price: 340, units: 47, date: '2025-01-12' },
  { id: 2, emoji: '👖', name: 'Wide-leg Trousers',      category: 'Bottoms', price: 420, units: 32, date: '2025-01-20' },
  { id: 3, emoji: '🧥', name: 'Oversized Cashmere Knit', category: 'Tops',   price: 980, units: 18, date: '2025-02-03' },
  { id: 4, emoji: '👜', name: 'Structured Leather Bag',  category: 'Accessories', price: 495, units: 24, date: '2025-02-14' },
  { id: 5, emoji: '⌚', name: 'Minimalist Gold Watch',   category: 'Watches', price: 395, units: 9,  date: '2025-03-01' },
];

const CATEGORIES = ['Tops', 'Bottoms', 'Accessories', 'Caps', 'Watches'];

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
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="input-base" />
      <div style={{ position: 'relative', height: '1px' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#333' }} />
        <motion.div animate={{ scaleX: focused ? 1 : 0, transformOrigin: 'left center' }} transition={{ duration: 0.25 }}
          style={{ position: 'absolute', inset: 0, background: '#C8A96E' }} />
      </div>
    </div>
  );
}

export default function VendorPage() {
  const toast = useToast();
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [newName,     setNewName]     = useState('');
  const [newPrice,    setNewPrice]    = useState('');
  const [newCategory, setNewCategory] = useState('Tops');
  const [newImageUri, setNewImageUri] = useState(null);
  const [submitting, setSubmitting]  = useState(false);
  const imageRef = useRef(null);

  const totalRevenue = products.reduce((s, p) => s + p.price * p.units, 0);
  const totalUnits   = products.reduce((s, p) => s + p.units, 0);

  async function handleAddProduct() {
    if (!newName || !newPrice) { toast.error('Fill in name and price'); return; }
    setSubmitting(true);
    try {
      await fetch('http://localhost:3001/api/vendor/product', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, price: Number(newPrice), category: newCategory }),
      });
    } catch { /* ignore if backend down */ }
    const newItem = {
      id: Date.now(), emoji: '✨', name: newName,
      category: newCategory, price: Number(newPrice), units: 0,
      date: new Date().toISOString().slice(0,10),
    };
    setProducts(p => [newItem, ...p]);
    setNewName(''); setNewPrice(''); setNewImageUri(null);
    setDrawerOpen(false);
    toast.success(`${newName} added to inventory`);
    setSubmitting(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', paddingTop: '56px', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p className="label-caps mb-2" style={{ color: '#C8A96E' }}>PARTNER PORTAL</p>
              <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#F0EDE8' }}>
                Vendor Dashboard
              </h1>
              <p className="font-body mt-2" style={{ color: '#888' }}>Manage your products and track performance.</p>
            </div>
            <motion.button
              onClick={() => setDrawerOpen(true)}
              whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(200,169,110,0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold" style={{ padding: '0.85rem 1.5rem', fontSize: '0.7rem' }}>
              <Plus size={14} /> ADD PRODUCT
            </motion.button>
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px', marginBottom: '40px' }}>
            {[
              { icon: Package,    label: 'Total Products', value: products.length },
              { icon: TrendingUp, label: 'Units Sold',     value: totalUnits },
              { icon: DollarSign, label: 'Total Revenue',  value: `$${totalRevenue.toLocaleString()}` },
            ].map(({ icon: Icon, label, value }, i) => (
              <motion.div key={label}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, borderColor: 'rgba(200,169,110,0.25)' }}
                className="glass-card" style={{ padding: '24px', borderColor: 'rgba(255,255,255,0.07)', transition: 'all 0.3s' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(200,169,110,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={15} style={{ color: '#C8A96E' }} />
                </div>
                <p className="font-display" style={{ fontSize: '2rem', color: '#F0EDE8', fontWeight: 300 }}>{value}</p>
                <p className="label-sm mt-1" style={{ color: '#555' }}>{label.toUpperCase()}</p>
              </motion.div>
            ))}
          </div>

          {/* Products table */}
          <div className="glass-card" style={{ overflow: 'hidden', borderColor: 'rgba(255,255,255,0.07)' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #1c1c1c', display: 'flex', justifyContent: 'space-between' }}>
              <p className="font-sans font-medium" style={{ color: '#F0EDE8' }}>Products</p>
              <span className="label-sm" style={{ color: '#555' }}>× {products.length} ITEMS</span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1c1c1c' }}>
                    {['PRODUCT', 'CATEGORY', 'PRICE', 'UNITS SOLD', 'PROFIT', 'DATE'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontFamily: '"DM Mono", monospace',
                        fontSize: '0.55rem', letterSpacing: '0.12em', color: '#555', fontWeight: 400 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {products.map((p, i) => (
                      <motion.tr key={p.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.04 }}
                        style={{ borderBottom: '1px solid #141414', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span style={{ fontSize: '1.3rem' }}>{p.emoji}</span>
                            <span className="font-sans text-sm" style={{ color: '#F0EDE8' }}>{p.name}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className="label-sm" style={{ color: '#888' }}>{p.category.toUpperCase()}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className="label-caps" style={{ color: '#C8A96E' }}>${p.price}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className="font-sans text-sm" style={{ color: '#F0EDE8' }}>{p.units}</span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className="font-sans text-sm" style={{ color: '#27ae60' }}>
                            ${(p.price * p.units * 0.6).toLocaleString()}
                          </span>
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span className="label-sm" style={{ color: '#555' }}>{p.date}</span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* Profit calculator */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #1c1c1c', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
              <p className="label-sm" style={{ color: '#555' }}>GROSS REVENUE: <span style={{ color: '#F0EDE8' }}>${totalRevenue.toLocaleString()}</span></p>
              <p className="label-sm" style={{ color: '#555' }}>
                EST. PROFIT (60%): <span style={{ color: '#27ae60' }}>${Math.floor(totalRevenue * 0.6).toLocaleString()}</span>
              </p>
              <p className="label-sm" style={{ color: '#555' }}>PLATFORM FEE (10%): <span style={{ color: '#c0392b' }}>−${Math.floor(totalRevenue * 0.1).toLocaleString()}</span></p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ─── Add Product Drawer ───────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Overlay */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 1000, backdropFilter: 'blur(4px)' }} />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: '480px', zIndex: 1001,
                background: 'rgba(15,15,15,0.98)', borderLeft: '1px solid #252525',
                backdropFilter: 'blur(24px)', display: 'flex', flexDirection: 'column' }}>

              <div style={{ padding: '28px 32px', borderBottom: '1px solid #1c1c1c', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p className="font-display italic" style={{ fontSize: '1.4rem', color: '#F0EDE8' }}>Add Product</p>
                <button onClick={() => setDrawerOpen(false)} style={{ color: '#888', background: 'none', border: 'none', cursor: 'none' }}>
                  <X size={18} />
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', padding: '28px 32px' }}>
                {/* Image upload */}
                <div
                  onClick={() => imageRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setNewImageUri(ev.target.result); r.readAsDataURL(f); } }}
                  style={{ border: '1.5px dashed #333', borderRadius: '2px', padding: '24px', textAlign: 'center',
                    cursor: 'none', marginBottom: '24px', background: 'rgba(255,255,255,0.02)' }}>
                  {newImageUri ? (
                    <img src={newImageUri} alt="Preview" style={{ height: '120px', objectFit: 'contain', margin: '0 auto' }} />
                  ) : (
                    <>
                      <UploadCloud size={24} style={{ color: '#C8A96E', margin: '0 auto 8px' }} />
                      <p className="label-sm" style={{ color: '#555' }}>Upload product image</p>
                    </>
                  )}
                  <input ref={imageRef} type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setNewImageUri(ev.target.result); r.readAsDataURL(f); } }} />
                </div>

                <FloatingInput id="productName" label="Product Name" type="text" value={newName} onChange={e => setNewName(e.target.value)} />
                <FloatingInput id="productPrice" label="Price (USD)" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} />

                {/* Category */}
                <div style={{ marginTop: '20px', marginBottom: '8px' }}>
                  <p className="label-sm mb-3" style={{ color: '#555' }}>CATEGORY</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {CATEGORIES.map(c => (
                      <button key={c} onClick={() => setNewCategory(c)}
                        style={{ padding: '6px 14px', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem',
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          border: `1px solid ${newCategory === c ? '#C8A96E' : '#333'}`,
                          background: newCategory === c ? 'rgba(200,169,110,0.1)' : 'transparent',
                          color: newCategory === c ? '#C8A96E' : '#555', borderRadius: '1px', cursor: 'none' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ padding: '20px 32px', borderTop: '1px solid #1c1c1c', display: 'flex', gap: '12px' }}>
                <button onClick={() => setDrawerOpen(false)} className="btn-ghost" style={{ flex: 1, padding: '0.85rem', fontSize: '0.65rem' }}>
                  CANCEL
                </button>
                <motion.button onClick={handleAddProduct} disabled={submitting}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  className="btn-gold" style={{ flex: 1, padding: '0.85rem', fontSize: '0.65rem' }}>
                  {submitting ? '···' : 'ADD TO INVENTORY'}
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
