/**
 * Deconstructing MUI's Module Augmentation Pattern
 */
export interface CustomThemeExtensions {
    status: {
        danger: string;
    };
}
export interface BaseTheme {
    palette: {
        primary: string;
    };
    spacing: (val: number) => string;
}
export type AugmentedTheme = BaseTheme & CustomThemeExtensions;
export declare function createAugmentedTheme(options: Partial<AugmentedTheme>): AugmentedTheme;
