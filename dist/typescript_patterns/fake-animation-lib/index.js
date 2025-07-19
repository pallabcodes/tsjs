"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnimatingState = void 0;
const getAnimatingState = () => {
    if (Math.random() > 0.5) {
        return "before-animation";
    }
    if (Math.random() > 0.5) {
        return "animating";
    }
    return "after-animation";
};
exports.getAnimatingState = getAnimatingState;
//# sourceMappingURL=index.js.map