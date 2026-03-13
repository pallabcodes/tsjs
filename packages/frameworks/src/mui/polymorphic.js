"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyBox = void 0;
const react_1 = __importDefault(require("react"));
// Example usage of this pattern:
const MyBox = (props) => {
    const { component: Component = 'div', children, ...rest } = props;
    // Using React.createElement instead of JSX to avoid .tsx requirement
    return react_1.default.createElement(Component, rest, children);
};
exports.MyBox = MyBox;
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
//# sourceMappingURL=polymorphic.js.map