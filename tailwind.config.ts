import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        caldim: {
          dark: 'rgb(var(--caldim-dark) / <alpha-value>)',
          panel: 'rgb(var(--caldim-panel) / <alpha-value>)',
          border: 'rgb(var(--caldim-border) / <alpha-value>)',
          primary: 'rgb(var(--caldim-primary) / <alpha-value>)',
          accent: 'rgb(var(--caldim-accent) / <alpha-value>)',
          text: 'rgb(var(--caldim-text) / <alpha-value>)',
          'text-muted': 'rgb(var(--caldim-text-muted) / <alpha-value>)',
          surface: 'rgb(var(--caldim-surface) / <alpha-value>)',
          highlight: 'rgb(var(--caldim-highlight) / <alpha-value>)',
        },
        confidence: {
          high: 'rgb(var(--confidence-high) / <alpha-value>)',
          moderate: 'rgb(var(--confidence-moderate) / <alpha-value>)',
          low: 'rgb(var(--confidence-low) / <alpha-value>)',
        },
        priority: {
          high: 'rgb(var(--priority-high) / <alpha-value>)',
          medium: 'rgb(var(--priority-medium) / <alpha-value>)',
          low: 'rgb(var(--priority-low) / <alpha-value>)',
        },
        slate: {
          100: 'rgb(var(--caldim-text) / <alpha-value>)',
          200: 'rgb(var(--caldim-text) / <alpha-value>)',
          300: 'rgb(var(--caldim-text) / <alpha-value>)',
          400: 'rgb(var(--caldim-text-muted) / <alpha-value>)',
          500: 'rgb(var(--caldim-text-muted) / <alpha-value>)',
          600: 'rgb(var(--caldim-text-muted) / <alpha-value>)',
          700: 'rgb(var(--caldim-highlight) / <alpha-value>)',
          800: 'rgb(var(--caldim-highlight) / <alpha-value>)',
          900: 'rgb(var(--caldim-surface) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['"Google Sans"', '"Open Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'Consolas', 'Monaco', 'monospace'],
      },
      fontSize: {
        xxs: '0.7rem',
      },
      spacing: {
        4.5: '1.125rem',
        18: '4.5rem',
      },
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.625rem',
      },
      boxShadow: {
        panel: '0 1px 0 0 rgba(35, 48, 78, 0.8), 0 4px 24px -4px rgba(0, 0, 0, 0.45)',
        inset: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.04)',
      },
      animation: {
        'pulse-soft': 'pulse-soft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.2s ease-out',
      },
      keyframes: {
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.65' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      gridTemplateColumns: {
        'category-grid': 'repeat(4, minmax(0, 1fr))',
        'inbox-dense': 'minmax(140px, 1.2fr) minmax(180px, 2fr) minmax(100px, 0.8fr) minmax(72px, 0.5fr) minmax(64px, 0.4fr)',
      },
    },
  },
  plugins: [],
};

export default config;
