/**
 * ZenTUI: Design System & Visual Tokens
 * 
 * High-performance Triple-Buffer TrueColor palette for bit-perfect rendering.
 * All tokens map to accurate Hex values for consistency in VSCode and iTerm2.
 */

const StaticTheme = {
  Colors: {
    // Surface (Industrial 'Blushing' Slate)
    Background: '#0F172A',      // Slate 900
    Panel: '#1E293B',           // Slate 800
    PanelActive: '#334155',     // Slate 700
    Border: '#475569',          // Slate 600
    BorderActive: '#22D3EE',    // Cyan 400

    // Brand & Actions
    Primary: '#3B82F6',         // Blue 500
    PrimaryMuted: '#1D4ED8',    // Blue 700
    Highlight: '#22D3EE',       // Cyan 400

    // Semantic
    Success: '#4ADE80',        // Green 400
    Warning: '#FACC15',        // Yellow 400
    Danger: '#F87171',         // Red 400
    Info: '#38BDF8',           // Sky 400

    // Typography
    TextStrong: '#F1F5F9',      // Slate 100
    TextMain: '#E2E8F0',        // Slate 200
    TextMuted: '#94A3B8',       // Slate 400
    TextDim: '#64748B',         // Slate 500
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
};

/**
 * 🧱 Sovereign Design System
 */
export const Theme = {
  ...StaticTheme,
  Colors: { ...StaticTheme.Colors },
  
  // Pivot the Design live
  setZenMode(mode: 'industrial' | 'emerald' | 'cobalt') {
    const templates = {
      industrial: { Background: '#0F172A', Highlight: '#22D3EE', PanelActive: '#334155' },
      emerald: { Background: '#064E3B', Highlight: '#10B981', PanelActive: '#065F46' },
      cobalt: { Background: '#1E3A8A', Highlight: '#60A5FA', PanelActive: '#1E40AF' }
    };
    Object.assign(this.Colors, (templates as any)[mode]);
  }
};

export type ThemeColors = typeof Theme.Colors;
