/**
 * Diario de Autogoverno — Tailwind CSS Theme Extension
 *
 * Extends Tailwind's default theme with the project's design tokens.
 * Import this in tailwind.config.ts and spread into `theme.extend`.
 *
 * Usage in tailwind.config.ts:
 *   import { tailwindTokens } from './packages/ui/tokens/tokens.tailwind';
 *
 *   export default {
 *     theme: {
 *       extend: {
 *         ...tailwindTokens,
 *       },
 *     },
 *   } satisfies Config;
 */

import type { Config } from 'tailwindcss';

export const tailwindTokens: Partial<Config['theme']> = {
  colors: {
    black: '#000000',
    white: '#FFFFFF',
    red: {
      400: '#EF5350',
      500: '#E53935',
      600: '#C62828',
    },
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#EEEEEE',
      300: '#E0E0E0',
      400: '#BDBDBD',
      500: '#9E9E9E',
      600: '#757575',
      700: '#616161',
      800: '#424242',
      900: '#212121',
      950: '#121212',
    },
    green: {
      500: '#4CAF50',
      600: '#388E3C',
    },
    yellow: {
      500: '#FFC107',
      600: '#F9A825',
    },
    // Semantic aliases for convenient Tailwind class usage:
    //   bg-surface, bg-surface-hover, bg-accent, text-accent, text-muted, etc.
    surface: {
      DEFAULT: '#212121',
      hover: '#424242',
    },
    accent: {
      DEFAULT: '#E53935',
      light: '#EF5350',
      dark: '#C62828',
    },
    muted: '#757575',
  },

  fontFamily: {
    sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
  },

  borderRadius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    8: '32px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px',
  },

  boxShadow: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
  },

  transitionDuration: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  zIndex: {
    dropdown: '10',
    sticky: '20',
    modal: '30',
    toast: '40',
  },
};
