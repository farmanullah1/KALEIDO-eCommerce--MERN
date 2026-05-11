/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0A0A0A',
        surface: '#1A1A1A',
        'surface-light': '#2D2D2D',
        primary: {
          DEFAULT: '#00F5FF', // Cyan
          dark: '#00B2BA',
        },
        secondary: {
          DEFAULT: '#FF00F5', // Magenta
          dark: '#BA00B2',
        },
        accent: '#1A0B2E', // Deep Purple
      },
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'ripple': 'ripple 0.6s linear',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '0.5' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        }
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
        'glow-cyan': 'radial-gradient(circle, rgba(0, 245, 255, 0.15) 0%, transparent 70%)',
        'glow-magenta': 'radial-gradient(circle, rgba(255, 0, 245, 0.15) 0%, transparent 70%)',
      }
    },
  },
  plugins: [],
}
