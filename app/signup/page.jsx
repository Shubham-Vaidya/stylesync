'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/Toast';

function FloatingInput({ id, label, type = 'text', value, onChange, autoComplete, suffix }) {
  const [focused, setFocused] = useState(false);
  const raised = focused || value.length > 0;
  return (
    <div style={{ position: 'relative', paddingTop: '20px', marginBottom: '8px' }}>
      <motion.label htmlFor={id}
        animate={{ y: raised ? -22 : 0, scale: raised ? 0.82 : 1, transformOrigin: 'left center' }}
        transition={{ duration: 0.2 }}
        style={{ position: 'absolute', left: 0, top: '22px', fontFamily: '"DM Mono", monospace',
          fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
          color: raised ? '#C8A96E' : '#888', pointerEvents: 'none' }}
      >{label}</motion.label>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <input id={id} type={type} value={value} onChange={onChange} autoComplete={autoComplete}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} className="input-base" style={{ flex: 1 }} />
        {suffix}
      </div>
      <div style={{ position: 'relative', height: '1px' }}>
        <div style={{ position: 'absolute', inset: 0, background: '#333' }} />
        <motion.div animate={{ scaleX: focused ? 1 : 0, transformOrigin: 'left center' }} transition={{ duration: 0.25 }}
          style={{ position: 'absolute', inset: 0, background: '#C8A96E' }} />
      </div>
    </div>
  );
}

function StrengthBar({ password }) {
  const strength = !password ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 :
    /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4 : 3;
  const colors = ['transparent', '#c0392b', '#e67e22', '#C8A96E', '#27ae60'];
  const labels = ['', 'WEAK', 'FAIR', 'GOOD', 'STRONG'];
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ height: '2px', background: '#1c1c1c', borderRadius: '1px', overflow: 'hidden' }}>
        <motion.div animate={{ width: `${(strength / 4) * 100}%`, background: colors[strength] }}
          transition={{ duration: 0.4 }} style={{ height: '100%' }} />
      </div>
      {strength > 0 && (
        <p className="label-sm mt-1" style={{ color: colors[strength] }}>{labels[strength]}</p>
      )}
    </div>
  );
}

function RolePill({ role, label, active, onClick }) {
  return (
    <motion.button onClick={() => onClick(role)} whileTap={{ scale: 0.97 }}
      style={{ padding: '0.5rem 1.4rem', fontFamily: '"DM Mono", monospace', fontSize: '0.6rem',
        letterSpacing: '0.15em', textTransform: 'uppercase',
        border: `1px solid ${active ? '#C8A96E' : '#333'}`,
        background: active ? 'rgba(200,169,110,0.10)' : 'transparent',
        color: active ? '#C8A96E' : '#888', borderRadius: '1px', transition: 'all 0.2s ease', flex: 1 }}>
      {label}
    </motion.button>
  );
}

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const toast  = useToast();
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [showPass, setShowPass] = useState(false);
  const [role,     setRole]     = useState('user');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name || !email || !password) { toast.error('Please fill in all fields'); return; }
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await signup(name, email, password, role);
    setLoading(false);
    if (result.ok) {
      toast.success('Account created!');
      router.push(role === 'vendor' ? '/vendor' : '/dashboard');
    } else {
      toast.error('Signup failed. Please try again.');
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '80px 20px 40px' }}>
      <motion.div
        initial={{ y: 40, opacity: 0, scale: 0.96 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ width: '100%', maxWidth: '420px',
          background: 'rgba(20,20,20,0.95)', border: '1px solid rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          borderRadius: '2px', padding: '3rem',
          boxShadow: '0 0 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.04)' }}
      >
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ width: '40px', height: '1px', background: '#C8A96E', margin: '0 auto 20px' }} />
          <h1 className="font-display italic" style={{ fontSize: '1.8rem', color: '#C8A96E', fontWeight: 400 }}>StyleSync</h1>
          <p className="label-caps mt-2" style={{ color: '#555' }}>Create your account</p>
        </motion.div>

        <form onSubmit={handleSubmit}>
          {[
            { id: 'name',  label: 'Full Name',  type: 'text',  value: name,  setValue: setName,  delay: 0.15, auto: 'name' },
            { id: 'email', label: 'Email',       type: 'email', value: email, setValue: setEmail, delay: 0.22, auto: 'email' },
          ].map(({ id, label, type, value, setValue, delay, auto }) => (
            <motion.div key={id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}>
              <FloatingInput id={id} label={label} type={type} value={value}
                onChange={e => setValue(e.target.value)} autoComplete={auto} />
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.29 }}>
            <FloatingInput id="password" label="Password" type={showPass ? 'text' : 'password'}
              value={password} onChange={e => setPassword(e.target.value)} autoComplete="new-password"
              suffix={
                <button type="button" onClick={() => setShowPass(p => !p)}
                  style={{ color: '#C8A96E', background: 'none', border: 'none', padding: '4px', marginLeft: '8px' }}>
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              } />
            <StrengthBar password={password} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
            <FloatingInput id="confirm" label="Confirm Password" type="password"
              value={confirm} onChange={e => setConfirm(e.target.value)} autoComplete="new-password" />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.43 }}
            style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>
            <p className="label-sm mb-3" style={{ color: '#555', textAlign: 'center' }}>account type:</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <RolePill role="user"   label="USER"   active={role === 'user'}   onClick={setRole} />
              <RolePill role="vendor" label="VENDOR" active={role === 'vendor'} onClick={setRole} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <motion.button type="submit" disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: loading ? 'none' : '0 8px 32px rgba(200,169,110,0.35)' }}
              whileTap={{ scale: 0.97 }} className="btn-gold w-full"
              style={{ padding: '1rem', fontSize: '0.7rem', marginBottom: '1.5rem' }}>
              {loading ? '···' : 'CREATE ACCOUNT →'}
            </motion.button>
          </motion.div>
        </form>

        <div style={{ textAlign: 'center' }}>
          <span className="font-body text-sm" style={{ color: '#555' }}>Already have an account?{' '}
            <Link href="/login" style={{ color: '#C8A96E' }}>Sign in</Link>
          </span>
        </div>
      </motion.div>
    </div>
  );
}
