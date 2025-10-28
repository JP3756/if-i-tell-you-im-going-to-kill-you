/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark, minimalist color palette
        'clandestine': {
          'darkest': '#0a0a0a',
          'darker': '#121212',
          'dark': '#1a1a1a',
          'medium': '#2a2a2a',
          'light': '#3a3a3a',
          'accent': '#4a5568',
          'blue': '#2563eb',
          'blue-light': '#3b82f6',
        }
      },
      fontFamily: {
        'mono': ['ui-monospace', 'SFMono-Regular', 'Monaco', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
}
