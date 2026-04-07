'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Zap, Shirt, Bookmark, Ruler, ChevronRight, Camera, Sparkles, User, BarChart2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const GREETING = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};

function StatCard({ icon: Icon, label, value, delay, color = '#C8A96E' }) {
  return (
    <motion.div
      initial={{ x: -30, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ delay, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -6, boxShadow: '0 0 28px rgba(200,169,110,0.12)', borderColor: 'rgba(200,169,110,0.3)' }}
      className="glass-card"
      style={{ padding: '28px', flex: 1, minWidth: '160px', transition: 'all 0.3s ease', borderColor: 'rgba(255,255,255,0.07)' }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: `${color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={15} style={{ color }} />
        </div>
        <span className="label-sm" style={{ color: '#888' }}>{label}</span>
      </div>
      <p className="font-display" style={{ fontSize: '2.5rem', color: '#F0EDE8', fontWeight: 300, lineHeight: 1 }}>{value}</p>
    </motion.div>
  );
}

function QuickAction({ href, icon: Icon, title, subtitle, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Link href={href} data-cursor="view">
        <motion.div
          whileHover={{ y: -4, borderColor: 'rgba(200,169,110,0.3)' }}
          className="glass-card flex items-center gap-4"
          style={{ padding: '20px 24px', transition: 'all 0.3s ease', borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: 'rgba(200,169,110,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={18} style={{ color: '#C8A96E' }} />
          </div>
          <div style={{ flex: 1 }}>
            <p className="font-sans text-sm font-medium" style={{ color: '#F0EDE8' }}>{title}</p>
            <p className="label-sm mt-0.5" style={{ color: '#888' }}>{subtitle}</p>
          </div>
          <motion.div whileHover={{ x: 4 }} transition={{ type: 'spring', stiffness: 400 }}>
            <ChevronRight size={16} style={{ color: '#555' }} />
          </motion.div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

const RECENT_TRYONS = [
  { name: 'Silk Blouse', brand: 'THE ROW', emoji: '🥻', price: '$340' },
  { name: 'Cashmere Coat', brand: 'LORO PIANA', emoji: '🧥', price: '$2,800' },
  { name: 'Wide Trousers', brand: 'LEMAIRE', emoji: '👖', price: '$680' },
  { name: 'Midi Dress', brand: 'TOTEME', emoji: '👗', price: '$560' },
];

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Allow hackathon bypass
    const localUser = typeof window !== 'undefined' && localStorage.getItem('ss_user');
    if (!user && !localUser) {
      router.push('/login');
    }
  }, [user, router]);

  const name = user?.name?.split(' ')[0] || 'Guest';

  return (
    <div style={{ minHeight: '100vh', background: '#080808', paddingTop: '56px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>

        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ marginBottom: '48px' }}
        >
          <p className="label-caps mb-2" style={{ color: '#C8A96E' }}>DASHBOARD</p>
          <h1 className="font-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 300, color: '#F0EDE8', marginBottom: '8px' }}>
            {GREETING()}, <em style={{ color: '#C8A96E' }}>{name}.</em>
          </h1>
          <p className="font-body" style={{ color: '#888', fontSize: '1rem' }}>
            What would you like to try on today?
          </p>
        </motion.div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '40px' }}>
          <StatCard icon={Zap}      label="Items Tried On" value="24"  delay={0.1} />
          <StatCard icon={Bookmark} label="Outfits Saved"  value="8"   delay={0.2} />
          <StatCard icon={Ruler}    label="Your Size"      value="M"   delay={0.3} />
          <StatCard icon={BarChart2} label="Match Score"   value="94%" delay={0.4} color="#27ae60" />
        </div>

        {/* Quick actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          style={{ marginBottom: '40px' }}>
          <p className="label-caps mb-4" style={{ color: '#888' }}>QUICK ACTIONS</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
            <QuickAction href="/catalog"         icon={Shirt}    title="Browse Catalog"       subtitle="10,000+ pieces from 50+ brands" delay={0.35} />
            <QuickAction href="/tryon"           icon={Camera}   title="Virtual Try-On"       subtitle="Upload photo & try any garment" delay={0.4}  />
            <QuickAction href="/recommendations" icon={Sparkles} title="AI Recommendations"   subtitle="Styled for your taste"         delay={0.45} />
            <QuickAction href="/profile"         icon={User}     title="My Profile"           subtitle="Measurements & preferences"    delay={0.5}  />
          </div>
        </motion.div>

        {/* Recent try-ons */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <p className="label-caps" style={{ color: '#888' }}>RECENT TRY-ONS</p>
            <Link href="/catalog" className="label-sm" style={{ color: '#C8A96E' }}>View All</Link>
          </div>
          <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '8px' }}>
            {RECENT_TRYONS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.55 + i * 0.07 }}
                whileHover={{ y: -4, borderColor: 'rgba(200,169,110,0.25)' }}
                className="glass-card flex-shrink-0"
                style={{ width: '140px', overflow: 'hidden', transition: 'all 0.3s ease', borderColor: 'rgba(255,255,255,0.07)' }}
              >
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(255,255,255,0.02)', fontSize: '2.5rem' }}>
                  {item.emoji}
                </div>
                <div style={{ padding: '10px' }}>
                  <p className="label-sm" style={{ color: '#888' }}>{item.brand}</p>
                  <p className="font-sans text-sm mt-0.5" style={{ color: '#F0EDE8' }}>{item.name}</p>
                  <p className="label-caps mt-1" style={{ color: '#C8A96E' }}>{item.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
