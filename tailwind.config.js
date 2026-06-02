/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070d1c',
          900: '#0f172a',
          800: '#1e293b',
          700: '#283448',
          600: '#334155',
        },
        accent: {
          blue: '#3b82f6',
          teal: '#14b8a6',
          purple: '#8b5cf6',
          amber: '#f59e0b',
          rose: '#f43f5e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.25s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: 0, transform: 'translateX(-12px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      boxShadow: {
        'glow-blue': '0 0 24px rgba(59, 130, 246, 0.25)',
        'glow-teal': '0 0 24px rgba(20, 184, 166, 0.25)',
      },
    },
  },
  plugins: [],
}
