import React from 'react';

/**
 * Deconstructing MUI's Polymorphic Component pattern (OverridableComponent).
 * 
 * The goal is to understand how MUI allows the 'component' prop to 
 * dynamically change the available props of a component.
 */

// 1. Helper to extract props of an HTML element or Component
export type PropsOf<
    T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>
> = React.ComponentPropsWithRef<T>;

// 2. The "Base" props that our component always has
export type BoxOwnProps<E extends React.ElementType = React.ElementType> = {
    children?: React.ReactNode;
    component?: E; // The magic prop
    color?: 'primary' | 'secondary';
};

// 3. The "Combined" props
// We take everything from the 'component' prop (E) and combine it with our BoxOwnProps.
// But we must OMIT keys that collide to avoid type errors.
export type BoxProps<E extends React.ElementType> = BoxOwnProps<E> & 
    Omit<PropsOf<E>, keyof BoxOwnProps>;

/**
 * 4. The Polymorphic Component Definition
 * 
 * This is a simplified version of MUI's OverridableComponent.
 */
export interface MyOverridableBox {
    <E extends React.ElementType = 'div'>(
        props: BoxProps<E>
    ): React.ReactElement | null;
}

// Example usage of this pattern:
export const MyBox: MyOverridableBox = (props: any) => {
    const { component: Component = 'div', children, ...rest } = props;
    // Using React.createElement instead of JSX to avoid .tsx requirement
    return React.createElement(Component, rest, children);
};

/**
 * 5. Testing the Inference
 */

// A. Default: 'div' props are available
// <MyBox /> // Works, has div props

// B. Custom: 'button' props are now available
// <MyBox component="button" type="submit" /> // 'type' is valid because it's a button

// C. Error Case: This should fail if we typed it right
// <MyBox component="div" type="submit" /> // ERROR: 'type' does not exist on 'div'

/**
 * Advanced: Why use Omit?
 * If your Box has a 'color' prop (string) and the 'component' (e.g. <a>) 
 * also has a 'color' prop (HTML attribute), you must decide which one wins.
 * Usually, the "OwnProps" win.
 */
