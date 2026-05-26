/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: { DEFAULT: '#04080f' },
        blue: { DEFAULT: '#1a6bff', dim: '#0d4ff4', dark: '#0a3aab' },
        cyan: { brand: '#00d4ff' },
        brand: { green: '#00c77a', orange: '#ff8c00', red: '#ff3b3b' },
      },
      fontFamily: {
        head: ['Rajdhani', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      animation: {
        ticker: 'ticker 25s linear infinite',
        pulse: 'pulse 2s infinite',
      },
      keyframes: {
        ticker: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
