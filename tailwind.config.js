/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors')

export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/**/*.{vue,js,ts,jsx,tsx}",
    "./src/components/stories/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // FONTS
    fontFamily: {
      sans: ['Urbanist', 'sans-serif'],
      serif: ['Urbanist', 'serif'],
    },
    fontSize: {
      '2sm': '0.6rem',
      sm: '0.8rem',
      base: '0.875rem',
      xl: '1rem',
      '2xl': '1.25rem',
      '3xl': '1.5rem',
      '4xl': '1.75rem',
      '5xl': '2rem',
      '6xl': '2.5rem',
      '7xl': '4.25rem',
    },
    // COLORS
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.neutral,
      red: colors.red,
      blue: colors.blue,
      primary: {
        50: '#FDDACF',
        100: '#FDDACF',
        200: '#FBB59E',
        300: '#F98F6E',
        400: '#F76A3E',
        500: '#F5450D',
        600: '#C4370B',
        700: '#932908',
        800: '#621C05',
        900: '#310E03',
        950: '#310E03',
      },
      yellow: {
        50: '#FFF4CC',
        100: '#FFF4CC',
        200: '#FFE999',
        300: '#FFDE66',
        400: '#FFD333',
        500: '#FFC800',
        600: '#CCA000',
        700: '#997800',
        800: '#665000',
        900: '#332800',
        950: '#332800',
      },
      green: {
        50: '#E9FDCF',
        100: '#E9FDCF',
        200: '#D2FB9E',
        300: '#BCF96E',
        400: '#A6F73E',
        500: '#8FF50D',
        600: '#73C40B',
        700: '#569308',
        800: '#396205',
        900: '#1D3103',
        950: '#1D3103',
      },
    },
    extend: {
    },
  },
  plugins: [],
}