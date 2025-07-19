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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// Role-based access control decorator
function RoleGuard(requiredRole) {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        // Replace the original method with a wrapper
        descriptor.value = function (req, res, next) {
            const userRole = req.headers['role']; // Assume role is passed in the headers
            console.log(`Checking role: ${userRole}`);
            if (!userRole) {
                return res.status(400).json({ message: 'Role is required' }); // Handle missing role
            }
            if (userRole !== requiredRole) {
                return res.status(403).json({ message: 'Access Denied' }); // Handle unauthorized role
            }
            // Call the original method if role check passes
            return originalMethod.apply(this, [req, res, next]);
        };
        return descriptor;
    };
}
// Example usage in a controller
class UserController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAdminData(req, res, next) {
        res.json({ message: 'Welcome, Admin!' });
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getUserData(req, res, next) {
        res.json({ message: 'Welcome, User!' });
    }
}
__decorate([
    RoleGuard('admin')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAdminData", null);
__decorate([
    RoleGuard('user')
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getUserData", null);
// Setup Express and routes
const app = (0, express_1.default)();
const userController = new UserController();
// Routes
app.get('/admin', userController.getAdminData);
app.get('/user', userController.getUserData);
// Start the server
app.listen(3000, () => console.log('Server running on port 3000'));
// If the controller method doesn’t include `next`, the decorator’s wrapper function won’t have access to `next` either, as it relies on the same signature.
//# sourceMappingURL=role.guard.js.map