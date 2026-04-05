/**
 * ZenTUI: Design System & Visual Tokens
 * 
 * Normalized ANSI Palette optimized for high-performance terminal rendering.
 * All tokens map to the Sovereign 8-Color Bridge.
 */

const StaticTheme = {
  Colors: {
    // Surface (Mapping to ANSI-8)
    Background: 'black',        
    Panel: 'black',             
    PanelActive: 'blue',      
    Border: 'grey',          
    BorderActive: 'cyan',    

    // Brand & Actions
    Primary: 'blue',         
    PrimaryMuted: 'blue',    
    Highlight: 'cyan',       

    // Semantic
    Success: 'green',        
    Warning: 'yellow',       
    Danger: 'red',          
    Info: 'cyan',           

    // Typography
    TextStrong: 'white',      
    TextMain: 'white',        
    TextMuted: 'grey',       
    TextDim: 'grey',         
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
      industrial: { Background: 'black', Highlight: 'cyan', PanelActive: 'blue' },
      emerald: { Background: 'black', Highlight: 'green', PanelActive: 'green' },
      cobalt: { Background: 'black', Highlight: 'blue', PanelActive: 'blue' }
    };
    Object.assign(this.Colors, (templates as any)[mode]);
  }
};

export type ThemeColors = typeof Theme.Colors;
