import React from 'react';
import { AugmentedTheme } from './augmentation';
/**
 * Deconstructing MUI's Styled Engine (the 'styled()' utility)
 */
export type Interpolation<TProps extends Record<string, any>> = React.CSSProperties | ((params: {
    theme: AugmentedTheme;
} & TProps) => React.CSSProperties);
export declare function myStyled<C extends React.ElementType, T extends Record<string, any> = {}>(Component: C): (...styles: Interpolation<T>[]) => React.FC<React.ComponentProps<C> & T>;
export interface StyledOptions {
    name?: string;
    slot?: string;
    shouldForwardProp?: (prop: string) => boolean;
}
export declare function styled<T extends Record<string, any>>(tag: keyof JSX.IntrinsicElements, _options?: StyledOptions): (_styles: (params: {
    theme: AugmentedTheme;
    ownerState: T;
}) => React.CSSProperties) => void;
