import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'on-surface': 'var(--on-surface)',
        'surface-container': 'var(--surface-container)',
        'surface-container-high': 'var(--surface-container-high)',
        'surface-container-highest': 'var(--surface-container-highest)',
        primary: 'var(--primary)',
        tertiary: 'var(--tertiary)',
        'on-surface-variant': 'var(--on-surface-variant)',
        'border-muted': 'var(--border-muted)',
        outline: 'var(--outline)',
        accent: 'var(--accent)',
        error: 'var(--error)',
        // Language colors
        'js-gold': '#f1e05a',
        'python-blue': '#3572A5',
        'typescript-blue': '#3178c6',
        'css-purple': '#563d7c',
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      spacing: {
        'section-gap': '3rem',
        'component-padding-x': '0.5rem',
        'component-padding-y': '0.125rem',
        'stack-gap': '1.5rem',
        gutter: '1rem',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;
