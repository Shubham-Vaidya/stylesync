'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll } from 'framer-motion';
import { Menu, X, User, ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const NAV_LINKS = [
  { href: '/catalog',    label: 'CATALOG'   },
  { href: '/tryon',      label: 'TRY ON'    },
  { href: '/dashboard',  label: 'DASHBOARD' },
  { href: '/profile',    label: 'PROFILE'   },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [userDropOpen, setUserDropOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase()
    : 'SS';

  return (
    <>
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-[1000] h-14 flex items-center px-6 lg:px-8"
        style={{
          background: scrolled ? 'rgba(8,8,8,0.92)' : 'transparent',
          borderBottom: scrolled ? '1px solid #1c1c1c' : '1px solid transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
          transition: 'background 0.4s ease, border-color 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <div style={{ width: '1px', height: '18px', background: '#C8A96E' }} />
          <span
            className="font-display italic"
            style={{ color: '#C8A96E', fontSize: '1.15rem', fontWeight: 400, letterSpacing: '-0.01em' }}
          >
            StyleSync
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-8 mx-auto">
          {NAV_LINKS.map(({ href, label }) => {
            const isActive = pathname === href || pathname?.startsWith(href + '/');
            return (
              <Link key={href} href={href} className="relative group">
                <span
                  className="label-caps transition-colors duration-300"
                  style={{ color: isActive ? '#C8A96E' : '#888' }}
                >
                  {label}
                </span>
                {/* Underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 h-px"
                  style={{ background: '#C8A96E' }}
                  initial={false}
                  animate={{ width: isActive ? '100%' : '0%' }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {/* Hover underline (not active) */}
                {!isActive && (
                  <div className="absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300"
                    style={{ background: 'rgba(200,169,110,0.4)' }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-4 flex-shrink-0 ml-auto">
          {/* PRO VENDOR badge */}
          <Link href="/vendor">
            <span
              className="label-caps px-2 py-1 rounded"
              style={{
                border: '1px solid rgba(200,169,110,0.4)',
                color: '#C8A96E',
                fontSize: '0.5rem',
                background: 'rgba(200,169,110,0.06)',
              }}
            >
              PRO VENDOR
            </span>
          </Link>

          {/* User avatar / dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropOpen(p => !p)}
              className="flex items-center gap-2 group"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono transition-all duration-300"
                style={{
                  background: 'rgba(200,169,110,0.12)',
                  border: '1px solid rgba(200,169,110,0.2)',
                  color: '#C8A96E',
                  boxShadow: userDropOpen ? '0 0 0 2px rgba(200,169,110,0.3)' : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 0 2px rgba(200,169,110,0.3)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = userDropOpen ? '0 0 0 2px rgba(200,169,110,0.3)' : 'none'}
              >
                {initials}
              </div>
              <motion.div animate={{ rotate: userDropOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={12} style={{ color: '#888' }} />
              </motion.div>
            </button>

            <AnimatePresence>
              {userDropOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-10 w-44 glass-card py-1 z-50"
                >
                  {user ? (
                    <>
                      <div className="px-4 py-2 border-b" style={{ borderColor: '#1c1c1c' }}>
                        <p className="text-xs font-sans" style={{ color: '#F0EDE8' }}>{user.name}</p>
                        <p className="label-sm mt-0.5" style={{ color: '#888' }}>{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setUserDropOpen(false)}
                        className="block px-4 py-2.5 label-sm hover:text-gold transition-colors" style={{ color: '#888' }}>
                        PROFILE
                      </Link>
                      <button onClick={() => { logout(); setUserDropOpen(false); }}
                        className="w-full text-left px-4 py-2.5 label-sm transition-colors"
                        style={{ color: '#888' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#c0392b'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888'}>
                        SIGN OUT
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setUserDropOpen(false)}
                        className="block px-4 py-2.5 label-sm hover:text-gold transition-colors" style={{ color: '#888' }}>
                        SIGN IN
                      </Link>
                      <Link href="/signup" onClick={() => setUserDropOpen(false)}
                        className="block px-4 py-2.5 label-sm transition-colors"
                        style={{ color: '#C8A96E' }}>
                        GET STARTED
                      </Link>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden ml-auto p-2"
          style={{ color: '#888' }}
          onClick={() => setMenuOpen(p => !p)}
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-14 left-0 right-0 z-[999] overflow-hidden"
            style={{ background: 'rgba(8,8,8,0.96)', borderBottom: '1px solid #1c1c1c', backdropFilter: 'blur(20px)' }}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {NAV_LINKS.map(({ href, label }) => (
                <Link key={href} href={href}
                  onClick={() => setMenuOpen(false)}
                  className="label-caps py-1 transition-colors"
                  style={{ color: pathname === href ? '#C8A96E' : '#888' }}>
                  {label}
                </Link>
              ))}
              {!user && (
                <div className="flex gap-3 pt-2 border-t" style={{ borderColor: '#1c1c1c' }}>
                  <Link href="/login" onClick={() => setMenuOpen(false)}
                    className="btn-ghost px-4 py-2 text-xs">SIGN IN</Link>
                  <Link href="/signup" onClick={() => setMenuOpen(false)}
                    className="btn-gold px-4 py-2 text-xs">GET STARTED</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
