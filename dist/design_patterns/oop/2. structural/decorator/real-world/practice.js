"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// Corrected simple decorator definition
function SimpleDecorator() {
    return function (target, propertyKey, descriptor) {
        // Save the original method
        const originalMethod = descriptor.value;
        // Overwrite the method with new behavior
        descriptor.value = async function (...args) {
            try {
                console.log('Before method execution');
                // Simulate some logic that might fail
                throw new Error('Something went wrong!');
            }
            catch (err) {
                console.error('Error in decorator:', err);
                throw err; // Re-throw the error
            }
        };
        // Return the modified descriptor
        return descriptor;
    };
}
class UserController {
    async me() {
        // This will not be executed due to the error in the decorator
        console.info('This will not log because the decorator throws an error');
    }
}
__decorate([
    SimpleDecorator() // Applying the simple decorator
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "me", null);
async function runDemo() {
    const userController = new UserController();
    try {
        await userController.me(); // Trigger the method decorated with SimpleDecorator
    }
    catch (error) {
        console.error('Caught error in runDemo:', error); // Catch and log the error
    }
}
runDemo();
//# sourceMappingURL=practice.js.map