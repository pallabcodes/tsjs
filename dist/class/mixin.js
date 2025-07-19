"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usecode = exports.movies = void 0;
exports.DisposableMixin = DisposableMixin;
exports.ActivatableMixin = ActivatableMixin;
// Mixin for Disposable functionality
function DisposableMixin(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.isDisposed = false;
        }
        dispose() {
            this.isDisposed = true;
        }
    };
}
// Mixin for Activatable functionality
function ActivatableMixin(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.isActive = false;
        }
        activate() {
            this.isActive = true;
        }
        deactivate() {
            this.isActive = false;
        }
    };
}
exports.movies = {
    cast: ['Actor 1', 'Actor 2'],
    destination: 'Hollywood',
};
// Fixing unsafe casting with `unknown`
const accountcode = '12';
// Safely converting the string to a number using parseInt
exports.usecode = parseInt(accountcode, 10); // Safer conversion
// Type Assertion for DOM elements - Handling null check
const selectButtonElementById1 = document.getElementById('main_button');
if (selectButtonElementById1) {
    // Safe to access as a HTMLButtonElement
    selectButtonElementById1.addEventListener('click', () => console.log('Button clicked'));
}
// Another way to assert the type with proper null check
const selectButtonElementById2 = document.getElementById('main_button');
if (selectButtonElementById2 instanceof HTMLButtonElement) {
    // Now TypeScript knows it's an HTMLButtonElement
    selectButtonElementById2.addEventListener('click', () => console.log('Button clicked'));
}
else {
    console.error('Button element not found or not of type HTMLButtonElement');
}
//# sourceMappingURL=mixin.js.map