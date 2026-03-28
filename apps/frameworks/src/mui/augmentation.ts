import React from 'react';

/**
 * Deconstructing MUI's Module Augmentation Pattern
 */

export interface CustomThemeExtensions {
    status: {
        danger: string;
    };
}

export interface BaseTheme {
    palette: { primary: string };
    spacing: (val: number) => string;
}

export type AugmentedTheme = BaseTheme & CustomThemeExtensions;

export function createAugmentedTheme(options: Partial<AugmentedTheme>): AugmentedTheme {
    return {
        palette: { primary: 'blue' },
        spacing: (n) => `${n * 8}px`,
        status: { danger: 'red' }, // Defaults
        ...options
    } as AugmentedTheme;
}

console.log('MUI Module Augmentation pattern deconstructed');
