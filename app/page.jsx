'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Zap, Camera, Sparkles, ChevronDown } from 'lucide-react';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

/* ─── Floating Fashion Silhouette ─────────────── */
function FloatingSilhouette({ style, delay = 0, amplitude = 18, duration = 5 }) {
  return (
    <motion.div
      style={{ position: 'absolute', pointerEvents: 'none', opacity: 0.12, filter: 'blur(1px)', ...style }}
      animate={{ y: [0, -amplitude, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {style.shape === 'dress' ? (
        <svg width="60" height="90" viewBox="0 0 60 90" fill="none">
          <path d="M20 0 L40 0 L50 20 L60 80 L40 90 L20 90 L0 80 L10 20 Z" fill="#C8A96E" opacity="0.6"/>
          <ellipse cx="30" cy="0" rx="12" ry="8" fill="#C8A96E" opacity="0.4"/>
        </svg>
      ) : style.shape === 'jacket' ? (
        <svg width="70" height="80" viewBox="0 0 70 80" fill="none">
          <path d="M10 10 L0 0 L15 5 L30 15 L45 5 L60 0 L50 10 L55 80 L15 80 Z" fill="#C8A96E" opacity="0.5"/>
        </svg>
      ) : (
        <svg width="50" height="80" viewBox="0 0 50 80" fill="none">
          <rect x="5" y="0" width="40" height="60" rx="2" fill="#C8A96E" opacity="0.4"/>
          <rect x="0" y="60" width="22" height="20" rx="1" fill="#C8A96E" opacity="0.5"/>
          <rect x="28" y="60" width="22" height="20" rx="1" fill="#C8A96E" opacity="0.5"/>
        </svg>
      )}
    </motion.div>
  );
}

/* ─── Stats Ticker ─────────────────────────────── */
const TICKER_ITEMS = [
  '10,000+ Items Tried On', '95% Match Accuracy', '50+ Brands',
  'Real-time AI Processing', 'Zero Returns Guarantee',
  '10,000+ Items Tried On', '95% Match Accuracy', '50+ Brands',
  'Real-time AI Processing', 'Zero Returns Guarantee',
];

function StatsTicker() {
  return (
    <div style={{ background: '#0f0f0f', borderTop: '1px solid #1c1c1c', borderBottom: '1px solid #1c1c1c',
      padding: '12px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      <div className="marquee-track">
        {TICKER_ITEMS.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '20px' }}>
            <span className="label-sm" style={{ color: '#888' }}>{item}</span>
            <span style={{ color: '#C8A96E', margin: '0 12px' }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Feature Card ─────────────────────────────── */
function FeatureCard({ num, title, body, delay }) {
  const cardRef = useRef(null);
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay,
        scrollTrigger: { trigger: cardRef.current, start: 'top 85%', toggleActions: 'play none none reverse' }
      }
    );
  }, [delay]);

  return (
    <motion.div
      ref={cardRef}
      whileHover={{ y: -8, boxShadow: '0 0 32px rgba(200,169,110,0.12)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="glass-card p-8 flex flex-col gap-4"
      style={{ borderColor: 'rgba(255,255,255,0.07)', transition: 'box-shadow 0.3s ease, border-color 0.3s ease', cursor: 'default' }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(200,169,110,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
    >
      <span className="label-caps" style={{ color: '#C8A96E', fontSize: '0.7rem' }}>{num}</span>
      <h3 className="font-display text-2xl" style={{ color: '#F0EDE8', fontWeight: 400 }}>{title}</h3>
      <p className="font-body text-sm leading-relaxed" style={{ color: '#888' }}>{body}</p>
    </motion.div>
  );
}

/* ─── Product Preview Card ─────────────────────── */
function ProductPreviewCard({ index, emoji, name, brand, price }) {
  const cardRef = useRef(null);
  useEffect(() => {
    if (!cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { x: 60, opacity: 0 },
      { x: 0, opacity: 1, duration: 0.6, delay: index * 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: cardRef.current, start: 'top 88%', toggleActions: 'play none none reverse' }
      }
    );
  }, [index]);

  return (
    <div ref={cardRef} className="flex-shrink-0 w-52 glass-card overflow-hidden group" data-cursor="view">
      <div className="relative aspect-[3/4] flex items-center justify-center overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: '4rem' }} className="transition-transform duration-500 group-hover:scale-110">{emoji}</span>
        {/* TRY ON hover button */}
        <motion.div
          initial={{ y: '100%' }}
          whileHover={{ y: 0 }}
          className="absolute inset-x-0 bottom-0"
        >
          <div style={{ display: 'none' }} />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <Link href="/tryon" className="btn-gold w-full py-2.5 text-xs" style={{ borderRadius: 0 }} data-cursor="try">
            TRY ON
          </Link>
        </div>
      </div>
      <div className="p-3">
        <p className="label-sm mb-1" style={{ color: '#888' }}>{brand}</p>
        <p className="font-sans text-sm" style={{ color: '#F0EDE8' }}>{name}</p>
        <p className="label-caps mt-1" style={{ color: '#C8A96E' }}>{price}</p>
      </div>
    </div>
  );
}

const PREVIEW_PRODUCTS = [
  { emoji: '🥻', name: 'Silk Charmeuse Blouse', brand: 'THE ROW', price: '$340' },
  { emoji: '🧥', name: 'Oversized Cashmere Coat', brand: 'LORO PIANA', price: '$2,800' },
  { emoji: '👖', name: 'Wide-Leg Trousers', brand: 'LEMAIRE', price: '$680' },
  { emoji: '👗', name: 'Asymmetric Midi Dress', brand: 'TOTEME', price: '$560' },
  { emoji: '👜', name: 'Structured Leather Tote', brand: 'A.P.C.', price: '$495' },
  { emoji: '⌚', name: 'Minimalist Gold Watch', brand: 'UNIFORM WARES', price: '$395' },
];

/* ─── Landing Page ─────────────────────────────── */
export default function LandingPage() {
  const heroLineRef1  = useRef(null);
  const heroLineRef2  = useRef(null);
  const heroLineRef3  = useRef(null);
  const eyebrowRef    = useRef(null);
  const topLineRef    = useRef(null);
  const subtextRef    = useRef(null);
  const ctaRef        = useRef(null);
  const scrollRef     = useRef(null);
  const featureTitleRef = useRef(null);
  const parallaxRef   = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });

    // 1. Top gold line
    tl.fromTo(topLineRef.current,
      { scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1, ease: 'power3.out' }
    );
    // 2. Eyebrow
    tl.fromTo(eyebrowRef.current, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.5');
    // 3. Hero lines
    tl.fromTo([heroLineRef1.current, heroLineRef2.current, heroLineRef3.current],
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15 },
      '-=0.2'
    );
    // 4. Subtext
    tl.fromTo(subtextRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.3');
    // 5. CTA
    tl.fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, '-=0.2');
    // 6. Scroll indicator
    tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4 }, '-=0.1');

    // Features section title clip-path reveal
    if (featureTitleRef.current) {
      gsap.fromTo(featureTitleRef.current,
        { clipPath: 'inset(0 100% 0 0)' },
        { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: featureTitleRef.current, start: 'top 85%' }
        }
      );
    }

    // Parallax on showcase section
    if (parallaxRef.current) {
      gsap.to(parallaxRef.current, {
        y: 80,
        ease: 'none',
        scrollTrigger: { trigger: parallaxRef.current, scrub: 0.5, start: 'top bottom', end: 'bottom top' }
      });
    }
  }, []);

  return (
    <div style={{ background: '#080808' }}>

      {/* ── HERO ───────────────────────────────── */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '56px',
        position: 'relative',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 100%, rgba(200,169,110,0.08) 0%, transparent 60%)',
      }}>

        {/* Floating silhouettes */}
        <FloatingSilhouette shape="dress"  style={{ left: '8%',  top: '20%', shape: 'dress'  }} delay={0}   amplitude={20} duration={6}   />
        <FloatingSilhouette shape="jacket" style={{ right: '8%', top: '28%', shape: 'jacket' }} delay={1}   amplitude={14} duration={4.5} />
        <FloatingSilhouette shape="pants"  style={{ right: '20%',bottom: '25%', shape: 'pants' }} delay={0.5} amplitude={10} duration={3.5} />

        {/* Gold line */}
        <div className="absolute left-0 right-0" style={{ top: '88px', height: '1px', overflow: 'hidden', padding: '0 10%' }}>
          <div ref={topLineRef} style={{ height: '1px', background: '#C8A96E', opacity: 0.4 }} />
        </div>

        {/* Eyebrow */}
        <div ref={eyebrowRef} className="flex items-center gap-3 mb-6">
          <Zap size={12} style={{ color: '#C8A96E' }} />
          <span className="label-caps" style={{ color: '#C8A96E' }}>AI-Powered Virtual Fashion</span>
          <Zap size={12} style={{ color: '#C8A96E' }} />
        </div>

        {/* Hero heading */}
        <div style={{ overflow: 'hidden', marginBottom: '0.2em' }}>
          <h1 ref={heroLineRef1} className="font-display" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 300, color: '#F0EDE8', lineHeight: 1.0 }}>
            Wear It
          </h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: '0.2em' }}>
          <h1 ref={heroLineRef2} className="font-display italic" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 300, color: '#F0EDE8', lineHeight: 1.0 }}>
            Before You
          </h1>
        </div>
        <div style={{ overflow: 'hidden', marginBottom: '2rem' }}>
          <h1 ref={heroLineRef3} className="font-display" style={{ fontSize: 'clamp(3.5rem, 8vw, 7rem)', fontWeight: 300, color: '#C8A96E', lineHeight: 1.0 }}>
            Buy It.
          </h1>
        </div>

        {/* Subtext */}
        <p ref={subtextRef} className="font-body" style={{ color: '#888', fontSize: '1.05rem', maxWidth: '420px', lineHeight: 1.6, marginBottom: '2.5rem' }}>
          Upload your photo. Choose any garment. See yourself wearing it — before you commit.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/tryon" data-cursor="try">
            <motion.div
              whileHover={{ scale: 1.03, boxShadow: '0 8px 40px rgba(200,169,110,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold"
              style={{ padding: '1rem 2.5rem', fontSize: '0.7rem' }}
            >
              Start Try-On <ArrowRight size={14} />
            </motion.div>
          </Link>
          <Link href="/catalog">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="btn-ghost"
              style={{ padding: '1rem 2.5rem', fontSize: '0.7rem' }}
            >
              View Catalog
            </motion.div>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollRef} style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <span className="label-sm" style={{ color: '#555' }}>SCROLL</span>
          <motion.div
            style={{ width: '1px', height: '36px', background: 'linear-gradient(to bottom, #C8A96E, transparent)' }}
            animate={{ opacity: [0.3, 1, 0.3], scaleY: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
      </section>

      {/* ── STATS TICKER ───────────────────────── */}
      <StatsTicker />

      {/* ── HOW IT WORKS ───────────────────────── */}
      <section style={{ padding: '120px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="mb-16">
            <p className="label-caps mb-3" style={{ color: '#C8A96E' }}>THE PROCESS</p>
            <h2 ref={featureTitleRef} className="font-display" style={{
              fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 300, color: '#F0EDE8',
              clipPath: 'inset(0 100% 0 0)'
            }}>
              How It Works
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <FeatureCard num="01" title="Upload Your Photo"
              body="Take a front-facing photo or choose one from your gallery. Our AI analyzes your body shape, skin tone, and posture for precise fitting." delay={0} />
            <FeatureCard num="02" title="Select a Garment"
              body="Browse 10,000+ pieces from 50+ premium brands. Drag and drop directly onto your photo or click to select from any category." delay={0.1} />
            <FeatureCard num="03" title="See Yourself in It"
              body="AI composites the garment onto your photo in real time. Download your look, share it, or add it to your wishlist." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ── PARALLAX SHOWCASE ───────────────────── */}
      <section style={{ height: '70vh', display: 'flex', overflow: 'hidden', position: 'relative' }}>
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden', background: '#0f0f0f' }}>
          <div ref={parallaxRef} style={{
            position: 'absolute', inset: '-20%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)',
          }}>
            <span style={{ fontSize: '8rem', opacity: 0.15 }}>👗</span>
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, #080808)' }} />
        </div>
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: '5%', background: '#0f0f0f',
        }}>
          <p className="label-caps mb-4" style={{ color: '#C8A96E' }}>OUR VISION</p>
          <blockquote className="font-display italic" style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300,
            color: '#F0EDE8', lineHeight: 1.3, maxWidth: '480px'
          }}>
            "Fashion is about dreaming — now you can try the dream."
          </blockquote>
          <div style={{ display: 'flex', gap: '8px', marginTop: '24px' }}>
            {[40, 70, 50].map((w, i) => (
              <div key={i} style={{ height: '1px', width: `${w}px`, background: '#C8A96E', opacity: 0.4 }} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED GARMENTS ───────────────────── */}
      <section style={{ padding: '100px 0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 5%' }}>
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="label-caps mb-2" style={{ color: '#C8A96E' }}>THE EDIT</p>
              <h2 className="font-display" style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 300, color: '#F0EDE8' }}>
                Featured Garments
              </h2>
            </div>
            <Link href="/catalog" className="btn-ghost" style={{ padding: '0.6rem 1.2rem', fontSize: '0.65rem' }}>
              VIEW ALL <ArrowRight size={12} />
            </Link>
          </div>
        </div>
        <div style={{ padding: '0 5%', display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
          {PREVIEW_PRODUCTS.map((p, i) => <ProductPreviewCard key={i} index={i} {...p} />)}
        </div>
      </section>

      {/* ── CTA SECTION ─────────────────────────── */}
      <section style={{ padding: '120px 5%', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Watermark */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none', overflow: 'hidden',
        }}>
          <span className="font-display" style={{ fontSize: 'clamp(5rem, 18vw, 14rem)', color: '#F0EDE8', opacity: 0.025, letterSpacing: '-0.04em', whiteSpace: 'nowrap', userSelect: 'none' }}>
            STYLESYNC
          </span>
        </div>
        <div style={{ position: 'relative', maxWidth: '700px', margin: '0 auto' }}>
          <p className="label-caps mb-4" style={{ color: '#C8A96E' }}>START TODAY</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 300, color: '#F0EDE8', marginBottom: '2.5rem', lineHeight: 1.1 }}>
            Your wardrobe,<br /><em>reimagined.</em>
          </h2>
          <Link href="/tryon" data-cursor="try">
            <motion.div
              whileHover={{ scale: 1.02, boxShadow: '0 12px 48px rgba(200,169,110,0.35)' }}
              whileTap={{ scale: 0.97 }}
              className="btn-gold"
              style={{ padding: '1.2rem 3rem', fontSize: '0.75rem', display: 'inline-flex' }}
            >
              Start Trying On <ArrowRight size={16} />
            </motion.div>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────── */}
      <footer style={{ borderTop: '1px solid #1c1c1c', padding: '24px 5%' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <span className="font-display italic" style={{ color: '#C8A96E', fontSize: '1rem' }}>StyleSync</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            {['Catalog', 'TryOn', 'Vendor'].map(l => (
              <Link key={l} href={`/${l.toLowerCase()}`} className="label-caps hover:text-gold transition-colors" style={{ color: '#555' }}>{l}</Link>
            ))}
          </div>
          <span className="label-sm" style={{ color: '#555' }}>Built with AI · 2025</span>
        </div>
      </footer>
    </div>
  );
}
