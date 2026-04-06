'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

/* ─── Floating Label Input ──────────────────────── */
function FloatingInput({ id, label, type = 'text', value, onChange, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', paddingTop: '20px', marginBottom: '8px' }}>
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        animate={{ y: raised ? -22 : 0, scale: raised ? 0.82 : 1, transformOrigin: 'left center' }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          position: 'absolute',
          left: 0,
          top: '22px',
          fontFamily: '"DM Mono", monospace',
          fontSize: '0.65rem',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          color: raised ? '#C8A96E' : '#888',
          pointerEvents: 'none',
          transition: 'color 0.2s ease',
        }}
      >
        {label}
      </motion.label>

      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={autoComplete}
          className="input-base"
          style={{ flex: 1 }}
        />
        {suffix}
      </div>

      {/* Bottom border animation */}
      <div style={{ position: 'relative', height: '1px', marginTop: '0' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#333' }} />
        <motion.div
          animate={{ scaleX: focused ? 1 : 0, transformOrigin: 'left center' }}
          transition={{ duration: 0.25 }}
          style={{ position: 'absolute', inset: 0, background: '#C8A96E' }}
        />
      </div>
    </div>
  );
}

/* ─── Role Pill ─────────────────────────────────── */
function RolePill({ role, label, active, onClick }) {
  return (
    <motion.button
      onClick={() => onClick(role)}
      whileTap={{ scale: 0.97 }}
      style={{
        padding: '0.5rem 1.4rem',
        fontFamily: '"DM Mono", monospace',
        fontSize: '0.6rem',
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        border: `1px solid ${active ? '#C8A96E' : '#333'}`,
        background: active ? 'rgba(200,169,110,0.10)' : 'transparent',
        color: active ? '#C8A96E' : '#888',
        borderRadius: '1px',
        transition: 'all 0.2s ease',
        flex: 1,
      }}
    >
      {label}
    </motion.button>
  );
}

/* ─── Login Page ────────────────────────────────── */
export default function LoginPage() {
  const router        = useRouter();
  const { login, loginAs } = useAuth();
  const toast         = useToast();
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [role,        setRole]        = useState('user');
  const [loading,     setLoading]     = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      toast.success('Welcome back!');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'Login failed');
    }
  }

  function handleBypass(selectedRole) {
    setRole(selectedRole);
    loginAs(selectedRole);
    toast.success(`Signed in as ${selectedRole}`);
    router.push(selectedRole === 'vendor' ? '/vendor' : '/dashboard');
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080808',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px 40px',
    }}>
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(20,20,20,0.95)',
          border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '2px',
          padding: '3rem',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)',
        }}
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}
        >
          <div style={{ width: '40px', height: '1px', background: '#C8A96E', margin: '0 auto 20px' }} />
          <h1 className="font-display italic" style={{ fontSize: '1.8rem', color: '#C8A96E', fontWeight: 400, letterSpacing: '-0.01em' }}>
            StyleSync
          </h1>
          <p className="label-caps mt-2" style={{ color: '#555' }}>Sign in to continue</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {/* Inputs */}
          {[
            { id: 'email', label: 'Username / Email', type: 'email', value: email, setValue: setEmail },
          ].map(({ id, label, type, value, setValue }, i) => (
            <motion.div key={id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}>
              <FloatingInput id={id} label={label} type={type} value={value}
                onChange={e => setValue(e.target.value)} autoComplete={id} />
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.22 }}>
            <FloatingInput
              id="password" label="Password" type={showPass ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              suffix={
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ color: '#C8A96E', background: 'none', border: 'none', padding: '4px', marginLeft: '8px' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              }
            />
          </motion.div>

          {/* Role selector */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}
            style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
            <p className="label-sm mb-3" style={{ color: '#555', textAlign: 'center' }}>login as:</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <RolePill role="user"   label="USER"   active={role === 'user'}   onClick={() => setRole('user')} />
              <RolePill role="vendor" label="VENDOR" active={role === 'vendor'} onClick={() => setRole('vendor')} />
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 8px 32px rgba(200,169,110,0.35)' }}
              whileTap={{ scale: loading ? 1 : 0.97 }}
              className="btn-gold w-full"
              style={{ padding: '1rem', fontSize: '0.7rem', marginBottom: '1.5rem' }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
                  <span className="dot-1" style={{ width: 5, height: 5, borderRadius: '50%', background: '#080808', display: 'inline-block' }} />
                  <span className="dot-2" style={{ width: 5, height: 5, borderRadius: '50%', background: '#080808', display: 'inline-block' }} />
                  <span className="dot-3" style={{ width: 5, height: 5, borderRadius: '50%', background: '#080808', display: 'inline-block' }} />
                </span>
              ) : 'CONTINUE →'}
            </motion.button>
          </motion.div>
        </form>

        {/* Divider */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#1c1c1c' }} />
          <span className="label-sm" style={{ color: '#555' }}>or continue with</span>
          <div style={{ flex: 1, height: '1px', background: '#1c1c1c' }} />
        </motion.div>

        {/* Google */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.44 }}>
          <button className="btn-ghost w-full" style={{ padding: '0.9rem', gap: '10px', marginBottom: '1.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Sign in with Google
          </button>
        </motion.div>

        {/* Hackathon bypass */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ borderTop: '1px solid #1c1c1c', paddingTop: '1.5rem', textAlign: 'center' }}>
          <p className="label-sm mb-3" style={{ color: '#444' }}>— hackathon demo bypass —</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => handleBypass('user')} className="btn-ghost" style={{ flex: 1, padding: '0.6rem', fontSize: '0.6rem' }}>▶ USER</button>
            <button onClick={() => handleBypass('vendor')} className="btn-ghost" style={{ flex: 1, padding: '0.6rem', fontSize: '0.6rem' }}>▶ VENDOR</button>
          </div>
        </motion.div>

        {/* Sign up link */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
          style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <span className="font-body text-sm" style={{ color: '#555' }}>Don't have an account?{' '}
            <Link href="/signup" style={{ color: '#C8A96E', textDecoration: 'none' }}>Sign up</Link>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
}
