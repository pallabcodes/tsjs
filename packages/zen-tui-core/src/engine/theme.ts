/**
 * ZenTUI: Design System & Visual Tokens
 *
 * Google-grade palette optimized for terminal rendering.
 * Blue primary, high-contrast slate surface, clear semantic colors.
 */

export const Theme = {
  Colors: {
    // Surface
    Background: '#020617',      // Slate-950
    Panel: '#0f172a',           // Slate-900
    PanelActive: '#1e293b',     // Slate-800
    Border: '#475569',          // Slate-600
    BorderActive: '#3b82f6',    // Blue-500

    // Brand & Actions
    Primary: '#3b82f6',         // Blue-500
    PrimaryMuted: '#1d4ed8',    // Blue-700
    Highlight: '#3b82f6',       // Blue-500

    // Semantic
    Success: '#22c55e',         // Green-500
    Warning: '#fbbf24',         // Amber-400
    Danger: '#ef4444',          // Red-500
    Info: '#06b6d4',            // Cyan-500

    // Typography
    TextStrong: '#f8fafc',      // Slate-50
    TextMain: '#e2e8f0',        // Slate-200
    TextMuted: '#94a3b8',       // Slate-400
    TextDim: '#64748b',         // Slate-500
  },

  Spacing: {
    Small: 1,
    Medium: 2,
    Large: 4,
  },

  Border: {
    Solid: '─│┌┐└┘',
    Rounded: '─│╭╮╰╯',
    Double: '═║╔╗╚╝',
    Thick: '━┃┏┓┗┛',
  },

  Spinner: {
    Dots: ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'],
    Line: ['|', '/', '-', '\\'],
  },
} as const;

export type ThemeColors = typeof Theme.Colors;
