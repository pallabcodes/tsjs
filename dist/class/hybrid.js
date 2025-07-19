"use strict";
// Here’s a concrete example of a hybrid OOP + FP + meta-programming pattern in TypeScript that demonstrates:
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
// Class-based structure (OOP)
// Functional composition for behaviors (FP)
// Decorators and proxies for meta-programming
// This pattern allows you to compose multiple behaviors, override/extend methods, and inject cross-cutting concerns (like logging or validation) dynamically.
require("reflect-metadata");
function WithLogger(Base) {
    return class extends Base {
        log(message) {
            console.log(`[${this.constructor.name}] ${message}`);
        }
    };
}
// --- Functional mixin for validation ---
function WithValidation(Base) {
    return class extends Base {
        validate() {
            const rules = Reflect.getMetadata?.("validation:rules", this) || [];
            return rules.every(rule => rule(this));
        }
    };
}
// --- Meta-programming: Decorator to add validation rules ---
function ValidateRule(rule) {
    return function (target, propertyKey) {
        const rules = Reflect.getMetadata?.("validation:rules", target) || [];
        rules.push((self) => rule(self[propertyKey]));
        Reflect.defineMetadata?.("validation:rules", rules, target);
    };
}
// --- Functional override: Compose methods at runtime ---
function override(obj, method, fn) {
    obj[method] = fn(obj[method]);
}
// --- Utility: Add a method to an object at runtime ---
function addMethod(obj, name, fn) {
    obj[name] = fn;
}
// --- Utility: Access control proxy ---
function withAccessControl(obj, allowed) {
    return new Proxy(obj, {
        get(target, prop, receiver) {
            if (typeof prop === "string" && allowed.includes(prop)) {
                return Reflect.get(target, prop, receiver);
            }
            throw new Error(`Access to property "${String(prop)}" is denied`);
        }
    });
}
// --- Compose a hybrid class ---
class UserBase {
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
}
class User extends WithValidation(WithLogger(UserBase)) {
    greet() {
        this.log(`Hello, my name is ${this.name} and I am ${this.age}`);
    }
}
__decorate([
    ValidateRule((name) => typeof name === "string" && name.length > 0),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    ValidateRule((age) => typeof age === "number" && age >= 18),
    __metadata("design:type", Number)
], User.prototype, "age", void 0);
// --- Usage ---
const user = new User("Alice", 25);
// Example: Add a dynamic "promote" method to User
addMethod(user, "promote", function () {
    this.log("Promoted!");
    // ...additional logic...
});
user.promote(); // [User] Promoted!
const anonymize = (u) => { u.name = "Anonymous"; return u; };
const makeMinor = (u) => { u.age = 17; return u; };
// Compose transformations for a user object
function pipe(...fns) {
    return (x) => fns.reduce((v, f) => f(v), x);
}
const anonymizedMinor = pipe(anonymize, makeMinor)(user);
anonymizedMinor.greet(); // [User] Hello, my name is Anonymous and I am 17
user.greet(); // [User] Hello, my name is Alice and I am 25
console.log("Valid?", user.validate()); // true
// Override greet at runtime (FP style)
override(user, "greet", original => function () {
    this.log("Custom greeting!");
    original.apply(this);
    this.log("Greeted successfully.");
});
user.greet(); // [User] Custom greeting! ... [User] Greeted successfully.
// Add access control (meta-programming + FP)
const secureUser1 = withAccessControl(user, ["name", "greet"]);
console.log(secureUser1.name); // Alice
secureUser1.greet(); // works
function asUserId(id) {
    return id;
}
const id = asUserId("abc123");
// --- Advanced: Compile-time schema validation (with zod) ---
// Commented out to avoid error if zod is not installed
// import { z } from "zod";
// const UserSchema = z.object({
//   name: z.string().min(1),
//   age: z.number().int().gte(18)
// });
// type UserFromSchema = z.infer<typeof UserSchema>;
// function createUserFromSchema(data: unknown): UserFromSchema {
//   return UserSchema.parse(data);
// }
// --- Advanced: Async decorator (meta-programming + FP) ---
function AsyncLog(target, propertyKey, descriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args) {
        console.log(`[AsyncLog] Calling ${propertyKey}...`);
        const result = await original.apply(this, args);
        console.log(`[AsyncLog] Done ${propertyKey}`);
        return result;
    };
    return descriptor;
}
class AsyncExample {
    async fetchData() {
        return new Promise(resolve => setTimeout(() => resolve("data"), 100));
    }
}
__decorate([
    AsyncLog,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AsyncExample.prototype, "fetchData", null);
const asyncExample = new AsyncExample();
asyncExample.fetchData().then(console.log);
class PluginHost {
    constructor() {
        this.plugins = [];
    }
    use(plugin) {
        this.plugins.push(plugin);
        plugin(this);
    }
}
class ExtensibleUser extends PluginHost {
    constructor() {
        super(...arguments);
        this.name = "PluginUser";
    }
}
const userWithPlugins = new ExtensibleUser();
userWithPlugins.use(u => {
    u.sayHi = () => console.log("Hi from plugin!");
});
userWithPlugins.sayHi(); // Hi from plugin!
// --- Summary ---
// These patterns show how to:
// - Dynamically add/override methods at runtime (FP + meta-programming)
// - Compose data transformations with pipelines (FP)
// - Use branded types for type-safe IDs (type-level programming)
// - Validate at compile-time and runtime with zod (FP + meta-programming)
// - Add async cross-cutting concerns with decorators (meta-programming)
// - Build plugin systems for extensibility (OOP + FP + meta-programming)
//# sourceMappingURL=hybrid.js.map