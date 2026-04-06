/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './context/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        black:   '#080808',
        deep:    '#0f0f0f',
        surface: '#141414',
        surface2:'#1c1c1c',
        border:  '#252525',
        border2: '#333333',
        gold: {
          DEFAULT: '#C8A96E',
          light:   '#E8C99E',
          dim:     'rgba(200,169,110,0.18)',
        },
        white:  '#F0EDE8',
        muted:  '#888888',
        red:    '#c0392b',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:  ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono:  ['"DM Mono"', '"Fira Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.55rem', { letterSpacing: '0.12em' }],
        'xs':  ['0.6rem',  { letterSpacing: '0.08em' }],
      },
      borderRadius: {
        DEFAULT: '2px',
        none:    '0px',
        sm:      '2px',
        md:      '4px',
        lg:      '8px',
        xl:      '12px',
        '2xl':   '16px',
        full:    '9999px',
      },
      animation: {
        'marquee':     'marquee 28s linear infinite',
        'shimmer':     'shimmer 1.6s ease-in-out infinite',
        'scan':        'scan 3s linear infinite',
        'breathe':     'breathe 3s ease-in-out infinite',
        'dot-pulse':   'dotPulse 1.2s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        scan: {
          '0%':   { transform: 'translateY(-100%)', opacity: '0' },
          '10%':  { opacity: '1' },
          '90%':  { opacity: '1' },
          '100%': { transform: 'translateY(100vh)', opacity: '0' },
        },
        breathe: {
          '0%,100%': { transform: 'scale(1)' },
          '50%':     { transform: 'scale(1.006)' },
        },
        dotPulse: {
          '0%,80%,100%': { transform: 'scale(0)', opacity: '0' },
          '40%':          { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #C8A96E 0%, #E8C99E 100%)',
        'shimmer-gradient': 'linear-gradient(90deg, #141414 25%, #1c1c1c 50%, #141414 75%)',
      },
      boxShadow: {
        'gold-glow':   '0 0 24px rgba(200,169,110,0.25)',
        'gold-glow-lg':'0 8px 40px rgba(200,169,110,0.35)',
        'card':        '0 2px 40px rgba(0,0,0,0.5)',
        'inset-gold':  'inset 0 0 40px rgba(200,169,110,0.04)',
      },
    },
  },
  plugins: [],
};
