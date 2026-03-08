import { Theme } from "@mui/material";
/**
 * Deconstructing MUI's Responsive Style & Spacing objects.
 *
 * The goal is to understand how MUI allows a prop to be a single value,
 * an array, or an object keyed by breakpoints.
 */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ResponsiveValue<T> = T | Array<T | null> | Partial<Record<Breakpoint, T | null>>;
/**
 * 3. Deconstructing the 'sx' prop (Simplified)
 *
 * MUI's SxProps is a recursive type that can be an object, a function,
 * or an array of these.
 */
export type MySxProps = Record<string, any> | ((theme: Theme) => Record<string, any>) | Array<boolean | MySxProps | null | undefined>;
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
}
/**
 * Advanced: Recursive Style Mapping
 * MUI uses this to map theme tokens (like colors.primary) to CSS values.
 */
export type ThemeMapping<TKey extends string, TValue> = {
    [K in TKey]?: TValue;
};
