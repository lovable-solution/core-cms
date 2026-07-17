import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{mdx,md}',
  ],
  darkMode: 'class',
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        sm: '1.5rem',
        lg: '2rem',
        xl: '2.5rem',
      },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Semantic tokens — map to CSS variables, respond to theme
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        'surface-alt': 'rgb(var(--surface-alt) / <alpha-value>)',
        fg: 'rgb(var(--fg) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
        subtle: 'rgb(var(--subtle) / <alpha-value>)',
        faint: 'rgb(var(--faint) / <alpha-value>)',
        line: 'rgb(var(--line) / <alpha-value>)',
        'line-soft': 'rgb(var(--line-soft) / <alpha-value>)',
        signal: {
          DEFAULT: 'rgb(var(--signal) / <alpha-value>)',
          soft: 'rgb(var(--signal-soft) / <alpha-value>)',
          muted: 'rgb(var(--signal-muted) / <alpha-value>)',
        },
        // Raw scales for occasional explicit use
        ink: {
          50: '#f6f6f5',
          100: '#e7e7e5',
          200: '#cfcfcc',
          300: '#aaaaa6',
          400: '#7a7a76',
          500: '#56564f',
          600: '#3d3d36',
          700: '#2a2a24',
          800: '#19191a',
          900: '#0f0f10',
          950: '#08080a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
        arabic: ['var(--font-arabic)', 'var(--font-inter)', 'sans-serif'],
        'arabic-display': ['var(--font-arabic-display)', 'var(--font-display)', 'sans-serif'],
      },
      fontSize: {
        'display-xs': ['clamp(2rem, 4vw + 1rem, 3rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-sm': ['clamp(2.5rem, 5vw + 1rem, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display': ['clamp(3rem, 6.5vw + 1rem, 5.5rem)', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-lg': ['clamp(3.5rem, 8vw + 1rem, 7.5rem)', { lineHeight: '0.96', letterSpacing: '-0.04em' }],
      },
      letterSpacing: {
        tightest: '-0.045em',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee 40s linear infinite reverse',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
