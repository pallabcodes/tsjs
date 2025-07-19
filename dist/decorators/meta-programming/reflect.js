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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata"); // Required for Reflect API
// **Class Decorator**
// Adds metadata and modifies the constructor functionality.
function Entity(tableName) {
    return function (target) {
        // Specify constructor signature
        // Attach metadata
        Reflect.defineMetadata('tableName', tableName, target);
        // Wrap the original constructor with additional behavior
        const originalConstructor = target;
        const newConstructor = function (...args) {
            console.log(`Creating instance of ${tableName}`);
            return new originalConstructor(...args);
        };
        // Copy prototype so instanceof checks remain valid
        newConstructor.prototype = originalConstructor.prototype;
        return newConstructor;
    };
}
// **Property Decorator**
// Adds metadata or validation logic to a property.
function Column(type) {
    return function (target, propertyKey) {
        // Use 'object' instead of 'Object'
        // Attach metadata
        Reflect.defineMetadata(propertyKey, { type }, target);
        console.log(`Property '${propertyKey}' is of type '${type}'`);
    };
}
// **Method Decorator**
// Logs method calls and wraps the logic.
function LogExecutionTime() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            const start = performance.now();
            const result = originalMethod.apply(this, args);
            const end = performance.now();
            console.log(`Execution time for ${propertyKey}: ${(end - start).toFixed(2)}ms`);
            return result;
        };
    };
}
// **Accessor Decorator**
// Controls access or logging when getter or setter is invoked.
function LogAccess() {
    return function (target, propertyKey, descriptor) {
        const originalGetter = descriptor.get;
        descriptor.get = function () {
            console.log(`Accessing ${propertyKey}`);
            return originalGetter?.apply(this);
        };
    };
}
// **Parameter Decorator**
// Adds metadata for method parameters (e.g., validation, RBAC).
function ValidateRole(role) {
    return function (target, propertyKey, parameterIndex) {
        const existingRoles = Reflect.getMetadata('roles', target, propertyKey) || [];
        existingRoles.push({ role, parameterIndex });
        Reflect.defineMetadata('roles', existingRoles, target, propertyKey);
    };
}
// Using the decorators
let User = class User {
    constructor() {
        this._role = 'guest';
    }
    get role() {
        return this._role;
    }
    save(data) {
        console.log('Saving user data:', data);
    }
};
__decorate([
    Column('string'),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    Column('number'),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
__decorate([
    LogAccess(),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], User.prototype, "role", null);
__decorate([
    LogExecutionTime(),
    __param(0, ValidateRole('admin')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], User.prototype, "save", null);
User = __decorate([
    Entity('users')
], User);
// **Testing the Class**
const user = new User();
user.name = 'John Doe';
user.age = 30;
// Access property to trigger LogAccess
console.log(user.role);
// Call save method to see all decorators in action
user.save({ name: 'John Doe', age: 30 });
// Retrieve metadata for validation
const rolesMetadata = Reflect.getMetadata('roles', user, 'save');
console.log('Roles metadata:', rolesMetadata);
// Retrieve metadata for the class
const tableName = Reflect.getMetadata('tableName', User);
console.log('Table Name:', tableName);
//# sourceMappingURL=reflect.js.map