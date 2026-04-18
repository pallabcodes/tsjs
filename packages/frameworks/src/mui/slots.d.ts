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
import { Assume } from '../drizzle/utils';
export type SlotProps<TSlots extends Record<string, any>> = {
    [K in keyof TSlots]?: React.ComponentPropsWithRef<Assume<TSlots[K], React.ElementType>> & {
        component?: TSlots[K];
    };
};
/**
 * 3. The Main Component Props
 */
export interface MyAdvancedComponentProps {
    children?: React.ReactNode;
    slots?: MyComponentSlots;
    slotProps?: SlotProps<MyComponentSlots>;
}
/**
 * 4. Implementation Details (Mental Model)
 */
export declare const MyAdvancedComponent: (props: MyAdvancedComponentProps) => React.ReactElement<any, string | React.JSXElementConstructor<any>>;
/**
 * 5. Usage Example: The Power of Slots
 */
/**
 * Advanced Learning: Why not just use "labelProps"?
 * By using the Slot/SlotProps pattern, you gain:
 * 1. Consistency across all components in the library.
 * 2. Ability to override the internal COMPONENT and PROPS in one place.
 * 3. Better support for "OwnerState" (passing internal component state
 *    down to slots for dynamic styling).
 */
