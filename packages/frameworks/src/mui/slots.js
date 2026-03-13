"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyAdvancedComponent = void 0;
const react_1 = __importDefault(require("react"));
/**
 * 4. Implementation Details (Mental Model)
 */
const MyAdvancedComponent = (props) => {
    const { slots = {}, slotProps = {}, children } = props;
    // Use the provided slot component or default to a <div>
    const Root = slots.root ?? 'div';
    const Label = slots.label ?? 'span';
    return react_1.default.createElement(Root, slotProps.root, // Injecting the specific root props
    react_1.default.createElement(Label, slotProps.label, children));
};
exports.MyAdvancedComponent = MyAdvancedComponent;
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
//# sourceMappingURL=slots.js.map