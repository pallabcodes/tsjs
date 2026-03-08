/**
 * Deconstructing MUI's Global Component Overrides Pattern
 * 
 * This module demonstrates the PATTERN used by MUI to allow 
 * global customization, without attempting to perfectly extend 
 * the massive internal @mui/material Theme interface (which causes conflicts).
 */

/**
 * 1. The Component-Specific Customization Interface
 */
export interface ComponentCustomization<TProps, TSlotNames extends string> {
    defaultProps?: Partial<TProps>;
    styleOverrides?: {
        [K in TSlotNames]?: 
            | Record<string, any> 
            | ((params: { ownerState: TProps; theme: any }) => Record<string, any>);
    };
    variants?: {
        props: Partial<TProps>;
        style: Record<string, any>;
    }[];
}

/**
 * 2. The Global Components Registry
 */
export interface GlobalComponentsRegistry {
    MuiButton?: ComponentCustomization<{ variant?: 'text' | 'contained'; size?: 'small' }, 'root' | 'label'>;
    MuiTypography?: ComponentCustomization<{ align?: 'left' | 'center' }, 'root'>;
    // ... and so on for every component
}

/**
 * 3. Theme Integration Pattern
 */
export interface DeconstructedTheme {
    palette: Record<string, string>;
    components?: GlobalComponentsRegistry;
}

/**
 * 4. Usage Example: How a library consumes these overrides
 */
export const theme: DeconstructedTheme = {
    palette: { primary: 'blue' },
    components: {
        MuiButton: {
            defaultProps: { size: 'small' },
            styleOverrides: {
                root: ({ ownerState, theme: _t }) => ({
                    padding: ownerState.size === 'small' ? '4px' : '8px',
                    backgroundColor: 'lightgray'
                })
            }
        }
    }
};

console.log('MUI Global Component Overrides pattern deconstructed (Simplified)');
