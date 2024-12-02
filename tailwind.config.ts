import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00A3B4',
          dark: '#007A8A',
          light: '#33B5C4'
        },
        secondary: {
          DEFAULT: '#FFD700',
          dark: '#B39700',
          light: '#FFE033'
        },
        error: {
          DEFAULT: '#FF0000',
          dark: '#CC0000',
          light: '#FF3333'
        },
        background: {
          DEFAULT: '#1A1A1A',
          dark: '#000000',
          light: '#333333'
        },
        surface: {
          DEFAULT: '#2D2D2D',
          dark: '#1F1F1F',
          light: '#3D3D3D'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        heading: ['var(--font-poppins)']
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '1rem'
      }
    },
  },
  plugins: [],
}
export default config 