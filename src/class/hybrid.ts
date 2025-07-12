// Here’s a concrete example of a hybrid OOP + FP + meta-programming pattern in TypeScript that demonstrates:

// Class-based structure (OOP)
// Functional composition for behaviors (FP)
// Decorators and proxies for meta-programming
// This pattern allows you to compose multiple behaviors, override/extend methods, and inject cross-cutting concerns (like logging or validation) dynamically.

import "reflect-metadata";

// --- Functional mixin for logging ---
type Constructor<T = {}> = new (...args: any[]) => T;

function WithLogger<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(message: string) {
      console.log(`[${this.constructor.name}] ${message}`);
    }
  };
}

// --- Functional mixin for validation ---
function WithValidation<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    validate(): boolean {
      const rules: ((self: any) => boolean)[] = Reflect.getMetadata("validation:rules", this) || [];
      return rules.every(rule => rule(this));
    }
  };
}

// --- Meta-programming: Decorator to add validation rules ---
function ValidateRule(rule: (self: any) => boolean): PropertyDecorator {
  return function (target, propertyKey) {
    const rules = Reflect.getMetadata("validation:rules", target) || [];
    rules.push((self: any) => rule(self[propertyKey]));
    Reflect.defineMetadata("validation:rules", rules, target);
  };
}

// --- Functional override: Compose methods at runtime ---
function override<T, K extends keyof T>(obj: T, method: K, fn: (original: T[K]) => T[K]) {
  obj[method] = fn(obj[method]);
}

// --- Compose a hybrid class ---
class UserBase {
  constructor(public name: string, public age: number) {}
}

class User extends WithValidation(WithLogger(UserBase)) {
  @ValidateRule((name: string) => typeof name === "string" && name.length > 0)
  name!: string;

  @ValidateRule((age: number) => typeof age === "number" && age >= 18)
  age!: number;

  greet() {
    this.log(`Hello, my name is ${this.name} and I am ${this.age}`);
  }
}

// --- Meta-programming: Proxy for access control ---
function withAccessControl<T extends object>(obj: T, allowed: (keyof T)[]) {
  return new Proxy(obj, {
    get(target, prop) {
      if (allowed.includes(prop as keyof T)) {
        return target[prop as keyof T];
      }
      throw new Error(`Access to property "${String(prop)}" is denied`);
    }
  });
}

// --- Advanced: Dynamic method injection (FP + Meta-programming) ---
function addMethod<T extends object, K extends string, F extends (...args: any[]) => any>(
  obj: T,
  name: K,
  fn: F
): asserts obj is T & Record<K, F> {
  Object.defineProperty(obj, name, {
    value: fn,
    writable: true,
    configurable: true,
    enumerable: false
  });
}

// Example: Add a dynamic "promote" method to User
addMethod(user, "promote", function (this: User) {
  this.log("Promoted!");
  // ...additional logic...
});
(user as any).promote(); // [User] Promoted!

// Example: Compose transformations for a user object
const anonymize = (u: User) => { u.name = "Anonymous"; return u; };
const makeMinor = (u: User) => { u.age = 17; return u; };

// --- Usage ---
const user = new User("Alice", 25);

const anonymizedMinor = pipe(anonymize, makeMinor)(user);
anonymizedMinor.greet(); // [User] Hello, my name is Anonymous and I am 17

user.greet(); // [User] Hello, my name is Alice and I am 25
console.log("Valid?", user.validate()); // true

// Override greet at runtime (FP style)
override(user, "greet", original => function(this: User) {
  this.log("Custom greeting!");
  (original as Function).apply(this);
  this.log("Greeted successfully.");
});

user.greet(); // [User] Custom greeting! ... [User] Greeted successfully.

// Add access control (meta-programming + FP)
const secureUser = withAccessControl(user, ["name", "greet"]);
console.log(secureUser.name); // Alice
secureUser.greet(); // works
// console.log(secureUser.age); // Throws error: Access to property "age" is denied

// --- Advanced: Type-level programming for branded types ---
type Brand<T, B> = T & { __brand: B };
type UserId = Brand<string, "UserId">;

function asUserId(id: string): UserId {
  return id as UserId;
}

const id: UserId = asUserId("abc123");
// id is now type-safe and cannot be mixed with plain strings

// --- Advanced: Compile-time schema validation (with zod) ---
import { z } from "zod";

const UserSchema = z.object({
  name: z.string().min(1),
  age: z.number().int().gte(18)
});
type UserFromSchema = z.infer<typeof UserSchema>;

function createUserFromSchema(data: unknown): UserFromSchema {
  return UserSchema.parse(data);
}

// --- Advanced: Async decorator (meta-programming + FP) ---
function AsyncLog(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = async function (...args: any[]) {
    console.log(`[AsyncLog] Calling ${propertyKey}...`);
    const result = await original.apply(this, args);
    console.log(`[AsyncLog] Done ${propertyKey}`);
    return result;
  };
  return descriptor;
}

class AsyncExample {
  @AsyncLog
  async fetchData() {
    return new Promise(resolve => setTimeout(() => resolve("data"), 100));
  }
}

// --- Usage ---
// const user = new User("Alice", 25);
user.greet(); // [User] Hello, my name is Alice and I am 25

console.log("Valid?", user.validate()); // true
user.greet(); // [User] Hello, my name is Alice and I am 25

console.log("Valid?", user.validate()); // true

// Override greet at runtime (FP style)
override(user, "greet", original => function(this: User) {
  this.log("Custom greeting!");
  (original as Function).apply(this);
  this.log("Greeted successfully.");
});

user.greet(); // [User] Custom greeting! ... [User] Greeted successfully.

// Add access control (meta-programming + FP)
const secureUser = withAccessControl(user, ["name", "greet"]);
console.log(secureUser.name); // Alice
secureUser.greet(); // works
// console.log(secureUser.age); // Throws error: Access to property "age" is denied

const asyncExample = new AsyncExample();
asyncExample.fetchData().then(console.log);

// --- Advanced: Plugin system (OOP + FP + meta-programming) ---
type Plugin<T> = (instance: T) => void;

class PluginHost {
  private plugins: Plugin<this>[] = [];
  use(plugin: Plugin<this>) {
    this.plugins.push(plugin);
    plugin(this);
  }
}

class ExtensibleUser extends PluginHost {
  name = "PluginUser";
}

const userWithPlugins = new ExtensibleUser();
userWithPlugins.use(u => {
  (u as any).sayHi = () => console.log("Hi from plugin!");
});
(userWithPlugins as any).sayHi(); // Hi from plugin!

// --- Summary ---
// These patterns show how to:
// - Dynamically add/override methods at runtime (FP + meta-programming)
// - Compose data transformations with pipelines (FP)
// - Use branded types for type-safe IDs (type-level programming)
// - Validate at compile-time and runtime with zod (FP + meta-programming)
// - Add async cross-cutting concerns with decorators (meta-programming)
// - Build plugin systems for extensibility (OOP + FP + meta-programming)