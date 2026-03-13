"use strict";
/**
 * Deconstructing MUI's CSS Variables Architecture (v6 / Joy UI)
 *
 * This architecture maps theme tokens (palette, spacing, etc.)
 * to CSS variables prefixed with `--mui-` or `--joy-`.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCssVars = generateCssVars;
/**
 * 3. Token Generation (Conceptual)
 */
function generateCssVars(theme, options = { prefix: 'mui' }) {
    // runtime logic to flatten objects and create --prefix-key-key
    return {
        vars: {},
        css: ":root { --mui-palette-primary-main: #1976d2; }"
    };
}
/**
 * 4. Usage Example: Zero-runtime styling
 */
// Initial Theme
const theme = {
    palette: { primary: { main: '#1976d2' } },
    spacing: (v) => `${v * 8}px`
};
// Generated Vars
const { vars } = generateCssVars(theme);
// Now instead of injecting the actual HEX value into the CSS, 
// we inject the variable reference:
const style = {
    color: vars.palette.primary.main, // Result: "var(--mui-palette-primary-main)"
    // This allows for dynamic theme switching without re-rendering components!
};
// How MUI handles dark mode with CSS variables:
// :root[data-mui-color-scheme='dark'] { --mui-palette-primary-main: #90caf9; }
console.log('MUI CSS Variables architecture deconstructed');
//# sourceMappingURL=css-vars.js.map