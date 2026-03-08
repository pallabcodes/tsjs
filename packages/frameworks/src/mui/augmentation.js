"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAugmentedTheme = createAugmentedTheme;
function createAugmentedTheme(options) {
    return {
        palette: { primary: 'blue' },
        spacing: (n) => `${n * 8}px`,
        status: { danger: 'red' }, // Defaults
        ...options
    };
}
console.log('MUI Module Augmentation pattern deconstructed');
//# sourceMappingURL=augmentation.js.map