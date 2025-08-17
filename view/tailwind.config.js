/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeInUp: {
          'from': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        slideInRight: {
          'from': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
      },
      fontFamily: {
        'inter': ['Inter', 'sans-serif'],
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
}
