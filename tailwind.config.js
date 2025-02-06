/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans Pro"', 'system-ui', 'sans-serif', 'emoji'],
        mono: ['"Ubuntu Mono"', 'ui-monospace', 'monospace', 'emoji'],
      },
      colors: {
        primary: {
          50: '#f5f7ff',
          100: '#ebf0fe',
          200: '#dce3fd',
          300: '#c2cefb',
          400: '#a3b4f8',
          500: '#8194f4',
          600: '#4a5cd8',
          700: '#3a47b3',
          800: '#2c3689',
          900: '#1e2557',
          950: '#0f1331',
        },
        dark: {
          50: '#f6f6f7',
          100: '#e1e3e7',
          200: '#c2c6ce',
          300: '#9ba1ad',
          400: '#757b8c',
          500: '#5b6275',
          600: '#484d5d',
          700: '#3b3f4d',
          800: '#2e313c',
          900: '#1f2028',
          950: '#15161b',
        },
      },
    },
  },
  plugins: [],
}