/**
 * Theme & Design Tokens
 * 
 * Provides centralized Google-grade visual tokens ensuring uniform 
 * brand compliance and simple visual scaling / theming logic.
 */
export const Theme = {
  Colors: {
    // Brand & Surafce
    Background: '#020617',     // Slate-950
    Panel: '#0f172a',          // Slate-900 (Inset panels)
    PanelActive: '#1e293b',    // Slate-800
    
    // Semantic Actions
    Primary: '#3b82f6',        // Blue-500
    Success: '#22c55e',        // Green-500
    Warning: '#fbbf24',        // Amber-400
    Danger: '#f87171',         // Red-400
    Highlight: '#a855f7',      // Purple-500

    // Typography
    TextStrong: '#f8fafc',     // Slate-50
    TextMain: '#e2e8f0',       // Slate-200
    TextMuted: '#94a3b8',      // Slate-400
    TextDim: '#64748b',        // Slate-500
    Border: '#475569',         // Slate-600
  },
  Spacing: {
    Small: 1,
    Medium: 2,
    Large: 4
  }
};
