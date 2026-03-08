import React from 'react';
/**
 * Deconstructing MUI's OverridableComponent & TypeMap Architecture
 *
 * This is the refined, highly accurate version of MUI's polymorphism.
 * It uses a 'TypeMap' to separate the component's unique props from its
 * default element and common styles.
 */
export type DistributiveOmit<T, K extends keyof any> = T extends any ? Omit<T, K> : never;
export interface OverridableTypeMap {
    props: {};
    defaultComponent: React.ElementType;
}
/**
 * 3. Core Polymorphic Types
 */
export type DefaultComponentProps<T extends OverridableTypeMap> = T['props'] & DistributiveOmit<React.ComponentPropsWithRef<T['defaultComponent']>, keyof T['props']>;
export type OverrideProps<T extends OverridableTypeMap, C extends React.ElementType> = T['props'] & DistributiveOmit<React.ComponentPropsWithRef<C>, keyof T['props']>;
/**
 * 4. The OverridableComponent Interface
 */
export interface OverridableComponent<T extends OverridableTypeMap> {
    <C extends React.ElementType>(props: {
        component: C;
    } & OverrideProps<T, C>): React.JSX.Element | null;
    (props: DefaultComponentProps<T>): React.JSX.Element | null;
}
/**
 * 5. Real-world Demo: Deconstructing MUI's 'Typography'
 */
export interface TypographyTypeMap<P = {}, D extends React.ElementType = 'span'> {
    props: P & {
        align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
        variant?: 'h1' | 'h2' | 'body1' | 'caption';
    };
    defaultComponent: D;
}
export type TypographyComponent = OverridableComponent<TypographyTypeMap>;
export declare const MyTypography: TypographyComponent;
/**
 * Verification of the Accuracy:
 */
