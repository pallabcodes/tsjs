import { Theme } from "@mui/material";

/**
 * Deconstructing MUI's Responsive Style & Spacing objects.
 * 
 * The goal is to understand how MUI allows a prop to be a single value, 
 * an array, or an object keyed by breakpoints.
 */

// 1. Breakpoints definition
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// 2. Responsive Value Pattern
// This allows: 10, [10, 20], or { xs: 10, sm: 20 }
export type ResponsiveValue<T> = 
    | T 
    | Array<T | null> 
    | Partial<Record<Breakpoint, T | null>>;

/**
 * 3. Deconstructing the 'sx' prop (Simplified)
 * 
 * MUI's SxProps is a recursive type that can be an object, a function, 
 * or an array of these.
 */
export type MySxProps = 
    | Record<string, any> 
    | ((theme: Theme) => Record<string, any>)
    | Array<boolean | MySxProps | null | undefined>;

/**
 * 4. Spacing System Deconstruction
 * 
 * MUI's spacing can take a number (multiplied by 8px) or a string.
 */
export type SpacingValue = number | string;

export interface MarginProps {
    m?: ResponsiveValue<SpacingValue>;
    mt?: ResponsiveValue<SpacingValue>;
    mb?: ResponsiveValue<SpacingValue>;
    // ... etc
}

/**
 * 5. Usage Example: How the types resolve
 */
const marginDemo: MarginProps = {
    m: 2,               // Single value (16px)
    mt: [1, 2, 3],      // Array (responsive: xs=8, sm=16, md=24)
    mb: { xs: 1, md: 5 } // Object (responsive: xs=8, md=40)
};

/**
 * Advanced: Recursive Style Mapping
 * MUI uses this to map theme tokens (like colors.primary) to CSS values.
 */
export type ThemeMapping<TKey extends string, TValue> = {
    [K in TKey]?: TValue;
};

// Example: Primary color mapping
type ColorScheme = ThemeMapping<'primary' | 'secondary', string>;
const colors: ColorScheme = { primary: '#1976d2' };
