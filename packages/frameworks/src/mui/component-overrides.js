"use strict";
/**
 * Deconstructing MUI's Global Component Overrides Pattern
 *
 * This module demonstrates the PATTERN used by MUI to allow
 * global customization, without attempting to perfectly extend
 * the massive internal @mui/material Theme interface (which causes conflicts).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.theme = void 0;
/**
 * 4. Usage Example: How a library consumes these overrides
 */
exports.theme = {
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
//# sourceMappingURL=component-overrides.js.map