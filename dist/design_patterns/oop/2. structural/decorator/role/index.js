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
// Custom decorator types
function Role(role) {
    console.log('Role decorator factory called');
    return function (constructor) {
        console.log(`Role decorator execution for ${role}`);
        constructor.prototype.role = role; // Assign role to prototype explicitly
    };
}
function ValidateRole(requiredRole) {
    console.log('ValidateRole decorator factory called');
    return function (target, propertyKey, descriptor) {
        console.log(`ValidateRole decorator execution for ${propertyKey}`);
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            if (this.role !== requiredRole) {
                throw new Error(`Requires ${requiredRole} role`);
            }
            return originalMethod.apply(this, args);
        };
    };
}
function Log() {
    console.log('Log decorator factory called');
    return function (target, propertyKey, descriptor) {
        console.log(`Log decorator execution for ${propertyKey}`);
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            console.log(`Calling ${propertyKey}`);
            return originalMethod.apply(this, args);
        };
    };
}
function AsyncValidate() {
    console.log('AsyncValidate decorator factory called');
    return function (target, propertyKey, descriptor) {
        console.log(`AsyncValidate decorator execution for ${propertyKey}`);
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args) {
            await new Promise(resolve => setTimeout(resolve, 100)); // Simulate validation
            return originalMethod.apply(this, args);
        };
    };
}
// Base class with decorators
let BaseController = class BaseController {
    getData() {
        return 'Base data';
    }
    async processData() {
        return 'Processed data';
    }
};
__decorate([
    ValidateRole('default'),
    Log(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], BaseController.prototype, "getData", null);
__decorate([
    ValidateRole('default'),
    Log(),
    AsyncValidate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BaseController.prototype, "processData", null);
BaseController = __decorate([
    Role('default')
], BaseController);
// Subclass without explicit decorators - inherits base decorators
class UserController extends BaseController {
    getData() {
        return 'User data';
    }
    async processData() {
        return 'Processed user data';
    }
}
// Subclass with its own decorator - overrides base decorator
let AdminController = class AdminController extends BaseController {
    getData() {
        return 'Admin data';
    }
    async processData() {
        return 'Processed admin data';
    }
};
__decorate([
    ValidateRole('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AdminController.prototype, "getData", null);
__decorate([
    ValidateRole('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "processData", null);
AdminController = __decorate([
    Role('admin')
], AdminController);
// Usage demonstration
async function demo() {
    const user = new UserController();
    const admin = new AdminController();
    console.log('User Controller:');
    try {
        console.log(user.getData());
        console.log(await user.processData());
    }
    catch (e) {
        console.error(e);
    }
    console.log('\nAdmin Controller:');
    try {
        console.log(admin.getData());
        console.log(await admin.processData());
    }
    catch (e) {
        console.error(e);
    }
}
// Run the demonstration
demo().catch(console.error);
//# sourceMappingURL=index.js.map