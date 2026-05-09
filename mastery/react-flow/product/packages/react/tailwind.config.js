/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vms: {
          bg: '#030303',
          surface: '#0a0c0e',
          'surface-elevated': '#16191d',
          border: '#4b5563',
          'border-dim': 'rgba(255, 255, 255, 0.05)',
          'emerald-600': '#059669',
          'emerald-400': '#34d399',
          'blue-500': '#3b82f6',
          'red-500': '#ef4444',
          'text-primary': '#f9fafb',
          'text-secondary': '#9ca3af',
          'text-tertiary': '#4b5563',
        }
      }
    },
  },
  plugins: [],
}
