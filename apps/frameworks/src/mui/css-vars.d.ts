/**
 * Deconstructing MUI's CSS Variables Architecture (v6 / Joy UI)
 *
 * This architecture maps theme tokens (palette, spacing, etc.)
 * to CSS variables prefixed with `--mui-` or `--joy-`.
 */
import { Theme } from "@mui/material";
/**
 * 1. Transform Theme to CSS Variables
 *
 * Logic to turn nested theme objects into a flat map of variables.
 * e.g. palette.primary.main -> --mui-palette-primary-main
 */
export type ThemeVars<T = Theme> = {
    [K in keyof T]: T[K] extends Record<string, any> ? ThemeVars<T[K]> : string;
};
/**
 * 2. The CssVarsProvider Logic
 *
 * This is how MUI injects these variables into the :root or a specific element.
 */
export interface CssVarsConfig {
    prefix?: string;
    shouldSkipGeneratingVar?: (keys: string[], value: any) => boolean;
}
/**
 * 3. Token Generation (Conceptual)
 */
export declare function generateCssVars<T extends Record<string, any>>(theme: T, options?: CssVarsConfig): {
    vars: ThemeVars<T>;
    css: string;
};
/**
 * Advanced: Color Schemes (Light/Dark)
 */
export interface ColorSchemeConfig {
    light: Record<string, string>;
    dark: Record<string, string>;
}
