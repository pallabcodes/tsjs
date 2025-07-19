"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelfHostedSignupProcess = exports.goToRoute = void 0;
const goToRoute = (route) => {
    console.log(route);
};
exports.goToRoute = goToRoute;
(0, exports.goToRoute)('/');
(0, exports.goToRoute)('/users');
(0, exports.goToRoute)('/users/register');
(0, exports.goToRoute)('/users/login');
(0, exports.goToRoute)('/users/1');
// Defining the SelfHostedSignupProcess object as a constant with literal values (as const).
// Using 'as const' makes sure the object values are treated as literal types.
exports.SelfHostedSignupProcess = {
    START: 'START',
    CREATED_CUSTOMER: 'CREATED_CUSTOMER',
    CREATED_INTENT: 'CREATED_INTENT',
    CONFIRMED_INTENT: 'CONFIRMED_INTENT',
    CREATED_SUBSCRIPTION: 'CREATED_SUBSCRIPTION',
    PAID: 'PAID',
    CREATED_LICENSE: 'CREATED_LICENSE',
}; // This ensures the values are treated as literal types
//# sourceMappingURL=index.js.map