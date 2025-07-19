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
// Dummy User Data
const users = [
    { userId: '1', name: 'Alice', role: 'user' },
    { userId: '2', name: 'Bob', role: 'admin' },
];
// 1. Role Decorator
function Role(requiredRole) {
    return function (target, propertyKey, descriptor) {
        // Step 1: Get the original method
        const originalMethod = descriptor.value;
        console.info('Original method: ', originalMethod.toString());
        // Step 2: Override the method with our new function
        descriptor.value = function (req, res, next) {
            // Simulate fetching the user from the database using userId from headers
            const userId = req.headers['user-id'];
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }
            // Simulate a user lookup
            const user = users.find(u => u.userId === userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Step 3: Check if the user has the required role
            if (user.role !== requiredRole) {
                return res.status(403).json({ message: 'Access denied: insufficient role' });
            }
            // Step 4: Attach the user to the request object
            req.user = user;
            console.log('User found and role validated:', user);
            // Step 5: Call the original method
            return originalMethod.apply(this, [req, res, next]);
        };
        // Step 6: Return the modified descriptor
        return descriptor;
    };
}
// 2. UserController Class
class UserController {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getAdminPage(req, res, next) {
        // @ts-expect-error  whatever
        res.json({ message: `Welcome, ${req.user.name}`, role: req.user.role });
    }
}
__decorate([
    Role('admin') // Requires the user to have the 'admin' role
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Function]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getAdminPage", null);
// 1. Get the method descriptor
// const descriptor = Object.getOwnPropertyDescriptor(UserController.prototype, 'getAdminPage');
// 2. Apply the decorator manually
// Object.defineProperty(UserController.prototype, 'getAdminPage', Role('admin')(UserController.prototype, 'getAdminPage', descriptor));
// 3. Express Server Setup
const app = (0, express_1.default)();
const userController = new UserController();
app.get('/admin', (req, res, next) => userController.getAdminPage(req, res, next));
const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
//# sourceMappingURL=RoleGuard.js.map