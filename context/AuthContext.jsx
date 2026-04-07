'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/* ─── Auth Context ──────────────────────────────────── */
const AuthContext = createContext(null);

const MOCK_USERS = {
  user:   { id: 'usr_001', name: 'Shubham Vaidya', email: 'user@stylesync.ai',   role: 'user',   token: 'mock_user_token'   },
  vendor: { id: 'vnd_001', name: 'House of Style',  email: 'vendor@stylesync.ai', role: 'vendor', token: 'mock_vendor_token' },
};

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('ss_user');
      if (stored) setUser(JSON.parse(stored));
    } catch { localStorage.removeItem('ss_user'); }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user || { name: email, email, token: data.token, role: 'user', id: Date.now() };
        setUser(u);
        localStorage.setItem('ss_user', JSON.stringify(u));
        localStorage.setItem('ss_token', u.token || data.token);
        return { ok: true };
      }
    } catch {}
    return { ok: false, error: 'Invalid credentials' };
  }, []);

  // Hackathon bypass — set mock user directly
  const loginAs = useCallback((role) => {
    const u = MOCK_USERS[role] || MOCK_USERS.user;
    setUser(u);
    localStorage.setItem('ss_user', JSON.stringify(u));
    localStorage.setItem('ss_token', u.token);
  }, []);

  const signup = useCallback(async (name, email, password, role) => {
    try {
      const res = await fetch('http://localhost:3001/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (res.ok) {
        const data = await res.json();
        const u = data.user || { name, email, role, token: data.token, id: Date.now() };
        setUser(u);
        localStorage.setItem('ss_user', JSON.stringify(u));
        localStorage.setItem('ss_token', u.token || data.token);
        return { ok: true };
      }
    } catch {}
    // Fallback: create mock account
    const u = { id: Date.now(), name, email, role: role || 'user', token: 'new_' + Date.now() };
    setUser(u);
    localStorage.setItem('ss_user', JSON.stringify(u));
    localStorage.setItem('ss_token', u.token);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('ss_user');
    localStorage.removeItem('ss_token');
    router.push('/login');
  }, [router]);

  const isAuthenticated = useCallback(() => {
    return !!user || !!localStorage.getItem('ss_user');
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginAs, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

/* ─── TryOn Context ─────────────────────────────────── */
const TryOnContext = createContext(null);

export function TryOnProvider({ children }) {
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [personImage,     setPersonImage]     = useState(null); // base64 data URI
  const [resultImage,     setResultImage]     = useState(null); // base64 or URL
  const [isProcessing,    setIsProcessing]    = useState(false);
  const [error,           setError]           = useState(null);

  const reset = () => {
    setSelectedGarment(null);
    setPersonImage(null);
    setResultImage(null);
    setError(null);
  };

  const generateTryOn = useCallback(async () => {
    if (!personImage || !selectedGarment) return;
    
    setIsProcessing(true);
    setResultImage(null);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/tryon', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          person_image: personImage,
          garment: selectedGarment
        })
      });
      
      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Server error ${response.status}: ${errText}`);
      }
      
      const data = await response.json();
      
      console.log('API response keys:', Object.keys(data));
      
      if (data.result_image) {
        setResultImage(data.result_image);
      } else if (data.error) {
        throw new Error(data.error);
      } else {
        throw new Error('No result_image in response. Got: ' + JSON.stringify(data));
      }
      
    } catch (err) {
      console.error('TryOn error:', err);
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setError('Cannot reach Flask server. Make sure python app.py is running on port 5000.');
      } else {
        setError(err.message);
      }
    } finally {
      setIsProcessing(false);
    }
  }, [personImage, selectedGarment]);

  return (
    <TryOnContext.Provider value={{
      selectedGarment, setSelectedGarment,
      personImage,     setPersonImage,
      resultImage,     setResultImage,
      isProcessing,
      error, setError,
      reset, generateTryOn,
    }}>
      {children}
    </TryOnContext.Provider>
  );
}

export function useTryOn() {
  const ctx = useContext(TryOnContext);
  if (!ctx) throw new Error('useTryOn must be used inside TryOnProvider');
  return ctx;
}
