/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="midnight-sangeet"]'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          card: 'var(--bg-card)',
          'card-hover': 'var(--bg-card-hover)',
          glass: 'var(--bg-glass)',
        },
        border: {
          primary: 'var(--border-primary)',
          subtle: 'var(--border-subtle)',
          highlight: 'var(--border-highlight)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          secondary: 'var(--accent-secondary)',
          glow: 'var(--accent-glow)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
        },
        status: {
          ok: '#10B981',
          risk: '#F59E0B',
          overdue: '#EF4444',
          info: '#3B82F6',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        glow: '0 0 25px -5px var(--accent-glow)',
        'glow-lg': '0 0 50px -10px var(--accent-glow)',
      },
      animation: {
        'mandala-spin': 'spin 60s linear infinite',
        'mandala-spin-slow': 'spin 120s linear infinite',
        shimmer: 'shimmer 2s infinite linear',
        pulseGlow: 'pulseGlow 4s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
};
