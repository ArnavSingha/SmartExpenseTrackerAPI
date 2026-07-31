/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        background: '#090a0f',
        surface: '#12141d',
        surfaceLight: '#1b1f2e',
        primary: '#6366f1',
        primaryGradiantStart: '#8b5cf6',
        primaryGradiantEnd: '#3b82f6',
        accent: '#06b6d4',
        success: '#10b981',
        danger: '#ef4444',
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(139, 92, 246, 0.35)',
        'glow-accent': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }
    },
  },
  plugins: [],
}
