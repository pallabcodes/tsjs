"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isBodyElement = exports.isDivElement = void 0;
const isDivElement = (element) => {
    return element instanceof HTMLDivElement;
};
exports.isDivElement = isDivElement;
const isBodyElement = (element) => {
    return element instanceof HTMLBodyElement;
};
exports.isBodyElement = isBodyElement;
//# sourceMappingURL=typePredicates.js.map