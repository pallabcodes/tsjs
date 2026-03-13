import React from 'react';
/**
 * Deconstructing MUI's Polymorphic Component pattern (OverridableComponent).
 *
 * The goal is to understand how MUI allows the 'component' prop to
 * dynamically change the available props of a component.
 */
export type PropsOf<T extends keyof JSX.IntrinsicElements | React.JSXElementConstructor<any>> = React.ComponentPropsWithRef<T>;
export type BoxOwnProps<E extends React.ElementType = React.ElementType> = {
    children?: React.ReactNode;
    component?: E;
    color?: 'primary' | 'secondary';
};
export type BoxProps<E extends React.ElementType> = BoxOwnProps<E> & Omit<PropsOf<E>, keyof BoxOwnProps>;
/**
 * 4. The Polymorphic Component Definition
 *
 * This is a simplified version of MUI's OverridableComponent.
 */
export interface MyOverridableBox {
    <E extends React.ElementType = 'div'>(props: BoxProps<E>): React.ReactElement | null;
}
export declare const MyBox: MyOverridableBox;
/**
 * 5. Testing the Inference
 */
/**
 * Advanced: Why use Omit?
 * If your Box has a 'color' prop (string) and the 'component' (e.g. <a>)
 * also has a 'color' prop (HTML attribute), you must decide which one wins.
 * Usually, the "OwnProps" win.
 */
