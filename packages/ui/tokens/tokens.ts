/**
 * Diario de Autogoverno — TypeScript Design Tokens
 *
 * Single source of truth for all design token values.
 * Mirrors the token structure defined in tokens.yaml.
 *
 * Usage:
 *   import { tokens } from '@/ui/tokens/tokens';
 *   const bg = tokens.semantic.bg.primary;
 *   const red = tokens.color.red[500];
 */

export const tokens = {
  // ---------------------------------------------------------------------------
  // Core — Colors
  // ---------------------------------------------------------------------------
  color: {
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
  },

  // ---------------------------------------------------------------------------
  // Core — Spacing (4px base unit)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // Core — Typography
  // ---------------------------------------------------------------------------
  fontFamily: {
    sans: "'Inter', ui-sans-serif, system-ui, sans-serif",
  },

  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
  },

  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },

  lineHeight: {
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '1.75',
  },

  // ---------------------------------------------------------------------------
  // Core — Border Radius
  // ---------------------------------------------------------------------------
  radius: {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // ---------------------------------------------------------------------------
  // Core — Box Shadows
  // ---------------------------------------------------------------------------
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.3)',
    lg: '0 10px 15px rgba(0,0,0,0.3)',
  },

  // ---------------------------------------------------------------------------
  // Core — Transition Durations
  // ---------------------------------------------------------------------------
  transition: {
    fast: '150ms',
    normal: '250ms',
    slow: '350ms',
  },

  // ---------------------------------------------------------------------------
  // Core — Z-Index Scale
  // ---------------------------------------------------------------------------
  zIndex: {
    dropdown: '10',
    sticky: '20',
    modal: '30',
    toast: '40',
  },

  // ---------------------------------------------------------------------------
  // Semantic — Purpose-based aliases
  // ---------------------------------------------------------------------------
  semantic: {
    bg: {
      primary: '#000000',
      secondary: '#121212',
      surface: '#212121',
      surfaceHover: '#424242',
      accent: '#E53935',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#9E9E9E',
      muted: '#757575',
      accent: '#E53935',
      onAccent: '#FFFFFF',
    },
    border: {
      default: '#424242',
      focus: '#E53935',
      error: '#EF5350',
    },
    status: {
      active: '#4CAF50',
      warning: '#FFC107',
      danger: '#E53935',
    },
    intensity: {
      low: '#4CAF50',
      medium: '#FFC107',
      high: '#E53935',
    },
  },

  // ---------------------------------------------------------------------------
  // Component — Pre-composed token sets
  // ---------------------------------------------------------------------------
  component: {
    button: {
      primary: {
        bg: '#E53935',
        text: '#FFFFFF',
        radius: '8px',
        paddingX: '24px',
        paddingY: '12px',
      },
      secondary: {
        bg: '#212121',
        border: '#424242',
        text: '#FFFFFF',
        radius: '8px',
        paddingX: '24px',
        paddingY: '12px',
      },
      ghost: {
        bg: 'transparent',
        text: '#9E9E9E',
        radius: '8px',
        paddingX: '24px',
        paddingY: '12px',
      },
    },
    input: {
      bg: '#212121',
      border: '#424242',
      text: '#FFFFFF',
      radius: '8px',
      paddingX: '16px',
      paddingY: '12px',
      placeholder: '#757575',
      focusBorder: '#E53935',
    },
    chip: {
      default: {
        bg: '#212121',
        border: '#424242',
        text: '#9E9E9E',
        radius: '9999px',
        paddingX: '16px',
        paddingY: '4px',
      },
      selected: {
        bg: '#E53935',
        border: '#E53935',
        text: '#FFFFFF',
        radius: '9999px',
        paddingX: '16px',
        paddingY: '4px',
      },
    },
    slider: {
      trackBg: '#424242',
      trackFillLow: '#4CAF50',
      trackFillMedium: '#FFC107',
      trackFillHigh: '#E53935',
      thumbBg: '#FFFFFF',
      thumbSize: '20px',
    },
    card: {
      bg: '#212121',
      border: '#424242',
      radius: '12px',
      padding: '24px',
    },
    streak: {
      iconColor: '#FFC107',
      textColor: '#FFFFFF',
    },
  },
} as const;

/** TypeScript type derived from the tokens object for type-safe access. */
export type Tokens = typeof tokens;
