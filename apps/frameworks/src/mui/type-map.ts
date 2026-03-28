import React from 'react';

/**
 * Deconstructing MUI's OverridableComponent & TypeMap Architecture
 * 
 * This is the refined, highly accurate version of MUI's polymorphism.
 * It uses a 'TypeMap' to separate the component's unique props from its 
 * default element and common styles.
 */

// 1. Common Utility (Mimicking @mui/types)
export type DistributiveOmit<T, K extends keyof any> = 
    T extends any ? Omit<T, K> : never;

// 2. The OverridableTypeMap Interface
// Every component defines its own version of this.
export interface OverridableTypeMap {
    props: {};
    defaultComponent: React.ElementType;
}

/**
 * 3. Core Polymorphic Types
 */

// Props of the component if 'component' prop is NOT used (use defaultComponent)
export type DefaultComponentProps<T extends OverridableTypeMap> = 
    T['props'] & DistributiveOmit<
        React.ComponentPropsWithRef<T['defaultComponent']>, 
        keyof T['props']
    >;

// Props when 'component={Element}' is used
export type OverrideProps<
    T extends OverridableTypeMap, 
    C extends React.ElementType
> = T['props'] & DistributiveOmit<
    React.ComponentPropsWithRef<C>, 
    keyof T['props']
>;

/**
 * 4. The OverridableComponent Interface
 */
export interface OverridableComponent<T extends OverridableTypeMap> {
    // Overload for when 'component' is provided
    <C extends React.ElementType>(
        props: { component: C } & OverrideProps<T, C>
    ): React.JSX.Element | null;
    
    // Overload for when NO 'component' is provided (defaults to T['defaultComponent'])
    (props: DefaultComponentProps<T>): React.JSX.Element | null;
}

/**
 * 5. Real-world Demo: Deconstructing MUI's 'Typography'
 */

// Step A: Define the TypeMap
export interface TypographyTypeMap<
    P = {}, 
    D extends React.ElementType = 'span'
> {
    props: P & {
        align?: 'inherit' | 'left' | 'center' | 'right' | 'justify';
        variant?: 'h1' | 'h2' | 'body1' | 'caption';
        // ... more typography specific props
    };
    defaultComponent: D;
}

// Step B: Define the component using the OverridableComponent interface
export type TypographyComponent = OverridableComponent<TypographyTypeMap>;

// Step C: Usage
export const MyTypography: TypographyComponent = (props: any) => {
    const { component: Component = 'span', children, ...rest } = props;
    return React.createElement(Component, rest, children);
};

/**
 * Verification of the Accuracy:
 */

// 1. Valid: Default usage (as span)
// <MyTypography variant="h1">Hello</MyTypography>

// 2. Valid: Overridden usage (as h1)
// <MyTypography component="h1" id="foo">Hello</MyTypography>

// 3. Error Case Check:
// <MyTypography component="button" href="foo" /> 
// ERROR: 'href' does not exist on 'button'. Matches the real MUI behavior!
