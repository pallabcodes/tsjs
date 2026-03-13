"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyTypography = void 0;
const react_1 = __importDefault(require("react"));
// Step C: Usage
const MyTypography = (props) => {
    const { component: Component = 'span', children, ...rest } = props;
    return react_1.default.createElement(Component, rest, children);
};
exports.MyTypography = MyTypography;
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
//# sourceMappingURL=type-map.js.map