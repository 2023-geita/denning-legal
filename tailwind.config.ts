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
          DEFAULT: 'var(--accent-blue)',
          hover: 'var(--accent-blue-hover)',
        },
        secondary: {
          DEFAULT: 'var(--accent-yellow)',
          hover: 'var(--accent-yellow-hover)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          hover: 'var(--danger-hover)',
        },
        surface: {
          DEFAULT: 'var(--surface-dark)',
          darker: 'var(--surface-darker)',
          hover: 'var(--surface-hover)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
        }
      },
      fontFamily: {
        sans: ['var(--font-outfit)', 'sans-serif'],
        heading: ['var(--font-poppins)']
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'lg': '1rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
        'chat': '800px',
      },
      minHeight: {
        'screen-without-header': 'calc(100vh - 4rem)',
      }
    },
  },
  plugins: [],
}
export default config 