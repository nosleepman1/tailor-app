/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#f0f0ff',
          100: '#e0e0ff',
          200: '#c4c4ff',
          300: '#a3a3ff',
          400: '#8080ff',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#3730a3',
          800: '#2d2474',
          900: '#1a1a4e',
        },
        dark: {
          50:  '#f8f8fc',
          100: '#ededf5',
          200: '#d3d3e8',
          300: '#a9a9cc',
          400: '#7a7aaa',
          500: '#55558a',
          600: '#3a3a6e',
          700: '#252550',
          800: '#16163a',
          900: '#0a0a20',
          950: '#050510',
        },
        gold: {
          300: '#fcd97d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-pattern': `radial-gradient(at 40% 20%, hsla(240,100%,74%,0.15) 0px, transparent 50%),
                         radial-gradient(at 80% 0%, hsla(260,100%,60%,0.1) 0px, transparent 50%),
                         radial-gradient(at 0% 50%, hsla(220,100%,60%,0.1) 0px, transparent 50%)`,
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-up': 'slideUp 0.4s ease forwards',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.6 } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [],
}
