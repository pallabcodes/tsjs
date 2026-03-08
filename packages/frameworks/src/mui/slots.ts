import React from 'react';

/**
 * Deconstructing the MUI "Slots" & "SlotProps" Pattern
 * 
 * This pattern allows a single component (e.g., Select) to expose 
 * its internal parts (e.g., the Root, the Listbox, the Popper) 
 * for customization.
 */

/**
 * 1. Defining the Slots
 * 
 * Each key is a "slot" name, and the value is the expected 
 * ElementType for that slot.
 */
export interface MyComponentSlots extends Record<string, any> {
    root?: React.ElementType;
    label?: React.ElementType;
    icon?: React.ElementType;
}

// This is the magic. For every slot defined in 'MyComponentSlots', 
// we provide a way to pass props to that specific internal element.
import { Assume } from '../drizzle/utils';

export type SlotProps<TSlots extends Record<string, any>> = {
    [K in keyof TSlots]?: React.ComponentPropsWithRef<Assume<TSlots[K], React.ElementType>> & {
        component?: TSlots[K]; // Allow overriding the component JUST for this slot
    };
};

/**
 * 3. The Main Component Props
 */
export interface MyAdvancedComponentProps {
    children?: React.ReactNode;
    // The pattern: 'slots' for components, 'slotProps' for their props
    slots?: MyComponentSlots;
    slotProps?: SlotProps<MyComponentSlots>;
}

/**
 * 4. Implementation Details (Mental Model)
 */
export const MyAdvancedComponent = (props: MyAdvancedComponentProps) => {
    const { slots = {}, slotProps = {}, children } = props;

    // Use the provided slot component or default to a <div>
    const Root = slots.root ?? 'div';
    const Label = slots.label ?? 'span';

    return React.createElement(
        Root,
        slotProps.root, // Injecting the specific root props
        React.createElement(Label, slotProps.label, children)
    );
};

/**
 * 5. Usage Example: The Power of Slots
 */

// <MyAdvancedComponent 
//    slots={{ label: 'button' }}          <-- Change the internal 'label' slot to a button
//    slotProps={{ 
//        label: { onClick: () => {} },    <-- Now TS knows label has 'onClick'!
//        root: { className: 'my-root' }   <-- Safe root props
//    }} 
// />

/**
 * Advanced Learning: Why not just use "labelProps"?
 * By using the Slot/SlotProps pattern, you gain:
 * 1. Consistency across all components in the library.
 * 2. Ability to override the internal COMPONENT and PROPS in one place.
 * 3. Better support for "OwnerState" (passing internal component state 
 *    down to slots for dynamic styling).
 */
