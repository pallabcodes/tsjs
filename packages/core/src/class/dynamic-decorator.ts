/***
 * Q: I think this is stupit to think something based on decorator , the method should behave differently, rather based on runtime value the value itself should be modified within decorator which could be accessed and used within method
 * A: Absolutely right -> if you want the method to behave differently based on runtime values, it's often better to mutate or enhance the arguments inside the decorator before the method sees them, rather than trying to overload the method signature or stack decorators.
 */

/**
 * 🚀 Meta-Programming "God Mode" in TypeScript/JavaScript
 * 
 * This file is a knowledge base and playground for advanced, hacky, ingenious, and hybrid meta-programming patterns.
 * These are the kinds of techniques that power frameworks and platforms at the scale of Uber, Stripe, Airbnb, etc.
 * 
 * Each section includes:
 * - The pattern/technique
 * - Usage scenario
 * - Example code
 * 
 * ⚠️ Many of these are "sharp tools"—use with care and deep understanding!
 */

import Ajv from "ajv";

// Example roles
enum ROLE {
    USER = "USER",
    ADMIN = "ADMIN",
    GUEST = "GUEST"
}

// Example AJV schema and validator
const userSchema = {
    type: "object",
    properties: {
        name: { type: "string" },
        age: { type: "integer", minimum: 18 }
    },
    required: ["name", "age"]
};
const ajv = new Ajv();
const validateUser = ajv.compile(userSchema);

// Dynamic decorator factory
function DynamicRuntimeDecorator(
    action: string,
    allowedRoles: ROLE[]
): MethodDecorator {
    return function (target, propertyKey, descriptor: PropertyDescriptor) {
        const original = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            // Example: Assume first arg is payload, second is response, third is user context
            const [payload, res, context] = args;

            // 1. Role check (could be from context/session)
            if (!context || !allowedRoles.includes(context.role)) {
                res.status(403).send("Forbidden");
                return;
            }

            // 2. Validation (AJV)
            if (!validateUser(payload)) {
                res.status(400).send({ errors: validateUser.errors });
                return;
            }

            // 3. Call original method
            return await original.apply(this, args);
        };
        return descriptor;
    };
}

// --- 1. Dynamic Decorators (runtime behavior injection) ---
// Usage: RBAC, validation, logging, A/B testing, feature flags, etc.
function DynamicDecoratorFactory(
  handler: (args: any[], context: any) => any
): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const context = args[2]; // convention: 3rd arg is context
      const result = await handler.call(this, args, context);
      if (result !== undefined) return result;
      return await original.apply(this, args);
    };
    return descriptor;
  };
}

// --- 2. Proxy-based Object Virtualization ---
// Usage: Access control, lazy loading, API virtualization, logging, etc.
function withVirtualization<T extends object>(obj: T, handler: ProxyHandler<T>): T {
  return new Proxy(obj, handler);
}

// --- 3. Runtime Method Swapping / Hot Patching ---
// Usage: Feature toggles, A/B testing, live patching, canary releases, etc.
function hotPatch<T, K extends keyof T>(obj: T, method: K, fn: (original: T[K]) => T[K]) {
  obj[method] = fn(obj[method]);
}

// --- 4. Dynamic Pipeline/Aspect Composition ---
// Usage: Middleware, cross-cutting concerns, plugin systems, etc.
function compose(...fns: Function[]) {
  return (x: any) => fns.reduce((v, f) => f(v), x);
}

// --- 5. Metadata Reflection (Reflect-metadata) ---
// Usage: Dependency injection, validation, serialization, etc.
import "reflect-metadata";
const { metadata } = Reflect as any;
function setMeta(target: any, key: string, value: any) {
  (Reflect as any).defineMetadata(key, value, target);
}
function getMeta(target: any, key: string) {
  return (Reflect as any).getMetadata(key, target);
}

// --- 6. Dynamic Class Generation ---
// Usage: ORM models, API clients, dynamic DTOs, etc.
function createDynamicClass(name: string, props: Record<string, any>) {
  return new Function(`return class ${name} { constructor(args) { Object.assign(this, args); } }`)();
}

// --- 7. Monkey Patching Built-ins (⚠️) ---
// Usage: Polyfills, instrumentation, global logging, etc.
const originalLog = console.log;
console.log = function (...args) {
  originalLog.call(this, "[Patched]", ...args);
};

// --- 8. Parameter Decorators for Argument Injection ---
// Usage: Frameworks like NestJS, Express, etc.
function InjectParam(index: number, value: any): ParameterDecorator {
  return function (target, propertyKey, parameterIndex) {
    if (parameterIndex === index) {
      (Reflect as any).defineMetadata(`inject:${parameterIndex}`, value, target, propertyKey);
    }
  };
}

// --- 9. Dynamic Proxy for API Stubbing/Mocking ---
// Usage: Testing, contract validation, API virtualization, etc.
function createApiStub<T extends object>(defaults: Partial<T>): T {
  return new Proxy(defaults as T, {
    get(target, prop) {
      if (!(prop in target)) throw new Error(`API method ${String(prop)} not implemented`);
      return target[prop as keyof T];
    }
  });
}

// --- 10. Self-Healing/Auto-Recovering Functions ---
// Usage: Resilience, circuit breakers, auto-retry, etc.
function withAutoRetry(fn: Function, retries = 3) {
  return async function (...args: any[]) {
    let lastErr;
    for (let i = 0; i < retries; i++) {
      try { return await fn(...args); }
      catch (err) { lastErr = err; }
    }
    throw lastErr;
  };
}

// --- 11. Dynamic DTO Validation/Transformation (AJV, class-transformer, etc.) ---
// Usage: API input validation, schema evolution, etc.
function validateWithSchema(schema: object, data: any) {
  const validate = ajv.compile(schema);
  if (!validate(data)) throw new Error(JSON.stringify(validate.errors));
  return data;
}

// --- 12. Dynamic RBAC Decorator Example ---
// Usage: Different logic for USER, ADMIN, GUEST, etc.
function RBACDecorator(action: string): MethodDecorator {
  return function (target, propertyKey, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      const [payload, res, context] = args;
      switch (context?.role) {
        case "ADMIN":
          // Admin: skip validation, log action
          console.log(`[ADMIN] ${action}`);
          return await original.apply(this, args);
        case "USER":
          // User: validate input
          try { validateWithSchema(userSchema, payload); }
          catch (e) { res.status(400).send({ error: (e as any).message }); return; }
          return await original.apply(this, args);
        case "GUEST":
          res.status(403).send("Guests not allowed");
          return;
        default:
          res.status(401).send("Unauthorized");
          return;
      }
    };
    return descriptor;
  };
}

// --- 13. Dynamic Method/Property Injection ---
// Usage: Plugins, feature flags, dynamic capabilities, etc.
function injectMethod<T>(obj: T, name: string, fn: Function) {
  (obj as any)[name] = fn;
}

// --- 14. Dynamic Event Emitter/Listener Injection ---
// Usage: Observability, analytics, hooks, etc.
function withEvents<T extends object>(obj: T) {
  const listeners: Record<string, Function[]> = {};
  (obj as any)["on"] = (event: string, fn: Function) => {
    listeners[event] = listeners[event] || [];
    listeners[event].push(fn);
  };
  (obj as any)["emit"] = (event: string, ...args: any[]) => {
    (listeners[event] || []).forEach(fn => fn(...args));
  };
  return obj;
}

// --- 15. Dynamic Proxy for Access Patterns (e.g., GraphQL, REST) ---
// Usage: Universal API clients, dynamic query builders, etc.
function createUniversalApiClient(baseUrl: string) {
  return new Proxy({}, {
    get(_, prop) {
      return async (params: any) => fetch(`${baseUrl}/${String(prop)}`, {
        method: "POST",
        body: JSON.stringify(params),
        headers: { "Content-Type": "application/json" }
      }).then(res => res.json());
    }
  });
}

// --- 16. Symbol-based APIs and Well-known Symbols ---
// Usage: Custom collections, async streams, logging, etc.
class CustomCollection<T> {
  private items: T[];
  constructor(items: T[]) { this.items = items; }
  [Symbol.iterator]() {
    let i = 0, arr = this.items;
    return {
      next: () => ({ value: arr[i++], done: i > arr.length })
    };
  }
  get [Symbol.toStringTag]() {
    return "CustomCollection";
  }
}
const cc = new CustomCollection([1, 2, 3]);
for (const x of cc) {} // Iterable
Object.prototype.toString.call(cc); // [object CustomCollection]

// --- 17. Tagged Template Literals ---
// Usage: DSLs, SQL/GraphQL query builders, i18n, etc.
function sql(strings: TemplateStringsArray, ...values: any[]) {
  return strings.reduce((acc, str, i) => acc + str + (values[i] !== undefined ? `[${values[i]}]` : ""), "");
}
const userId = 42;
const query = sql`SELECT * FROM users WHERE id = ${userId}`;

// --- 18. Dynamic Import and Code Splitting ---
// Usage: Plugin systems, lazy loading, micro-frontends.
async function loadPlugin(pluginName: string) {
  const plugin = await import(`./plugins/${pluginName}.js`);
  return plugin.default;
}

// --- 19. Reflect.construct / Reflect.apply ---
// Usage: Advanced proxying, dynamic class instantiation, DI frameworks.
function constructWithArgs<T>(Ctor: new (...args: any[]) => T, args: any[]): T {
  return Reflect.construct(Ctor, args);
}
function callWithContext(fn: Function, ctx: any, args: any[]) {
  return Reflect.apply(fn, ctx, args);
}

// --- 20. Custom Error Types and Error Augmentation ---
// Usage: Enhanced debugging, error tracing, error boundaries.
class CustomError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = "CustomError";
  }
}
function augmentError(err: Error, info: object) {
  Object.assign(err, info);
  return err;
}

// --- 21. Function Serialization/Deserialization (⚠️) ---
// Usage: Distributed systems, serverless, remote code execution (with caution!).
function serializeFn(fn: Function): string {
  return fn.toString();
}
function deserializeFn(str: string): Function {
  // ⚠️ Dangerous! Only for trusted code!
  return eval(`(${str})`);
}

// --- 22. Eval and new Function (with Security Caveats) ---
// Usage: Dynamic code generation, sandboxes, REPLs.
function runDynamicCode(code: string, context: object = {}) {
  return Function(...Object.keys(context), `"use strict"; return (${code})`)(...Object.values(context));
}

// --- 23. Advanced TypeScript Type-level Meta-programming ---
// Usage: Conditional types, mapped types, recursive types, type inference tricks.
// (Type-level only, for reference)
type DeepReadonly<T> = { readonly [K in keyof T]: DeepReadonly<T[K]> };
type Flatten<T> = T extends (infer U)[] ? U : T;

// --- 24. AST Manipulation and Code Generation ---
// Usage: Custom compilers, code mods, static analysis, Babel/TS transformers.
// (Pseudo-code, as real AST work is done with Babel/TS APIs)
function pseudoAstTransform(code: string) {
  // Use @babel/parser, @babel/traverse, @babel/generator in real code
  // Example: Replace all console.log with customLogger.log
  return code.replace(/console\.log/g, "customLogger.log");
}

// --- 25. Self-modifying Classes/Functions ---
// Usage: Dynamic feature toggling, live patching, A/B testing at runtime.
function selfModify(obj: any, method: string, newImpl: Function) {
  obj[method] = newImpl;
}

// --- 26. Proxy Traps for Revocable Proxies ---
// Usage: Secure sandboxes, resource cleanup, plugin unloading.
function createRevocableSandbox<T extends object>(obj: T) {
  return Proxy.revocable(obj, {
    get(target, prop, receiver) {
      if (prop === "secret") throw new Error("Access denied");
      return Reflect.get(target, prop, receiver);
    }
  });
}
const { proxy: sandbox, revoke } = createRevocableSandbox({ foo: 1, secret: 2 });
// revoke(); // disables the proxy

// --- 27. Custom Serialization/Deserialization (toJSON, fromJSON, etc.) ---
// Usage: Data transport, API clients, persistence.
class SerializableUser {
  constructor(public name: string, public age: number) {}
  toJSON() { return { n: this.name, a: this.age }; }
  static fromJSON(json: any) { return new SerializableUser(json.n, json.a); }
}
const su = new SerializableUser("Alice", 30);
const json = JSON.stringify(su);
const su2 = SerializableUser.fromJSON(JSON.parse(json));

// --- 28. Hybrid Patterns ---
// Usage: Combining decorators, proxies, and reflection for DI, ORMs, validation, etc.
function HybridDI<T extends { new (...args: any[]): {} }>(Base: T) {
  return new Proxy(Base, {
    construct(target, args, newTarget) {
      const instance = Reflect.construct(target, args, newTarget);
      // Inject dependencies, apply decorators, etc.
      setMeta(instance, "hybrid", true);
      return instance;
    }
  });
}
@Reflect.metadata("service", true)
class Service {}
const HybridService = HybridDI(Service);

/**
 * --- Usage Scenarios ---
 * - RBACDecorator: Secure endpoints with role-based logic (Uber, Stripe, Airbnb scale)
 * - DynamicDecoratorFactory: Feature flags, A/B testing, dynamic validation
 * - withVirtualization: Secure or virtualize objects (e.g., Stripe's API objects)
 * - hotPatch: Canary releases, live bug fixes (Uber's live patching)
 * - compose: Middleware, plugin chains (Express, Koa, Next.js)
 * - setMeta/getMeta: Dependency injection, serialization (NestJS, Angular)
 * - createDynamicClass: Dynamic models, DTOs (ORMs, API clients)
 * - Monkey patching: Polyfills, global logging (Node.js, browser)
 * - InjectParam: Argument injection (NestJS, Express)
 * - createApiStub: Testing, contract validation (Stripe, Uber)
 * - withAutoRetry: Resilience, circuit breakers (Stripe, Uber)
 * - validateWithSchema: API validation (Stripe, Airbnb)
 * - injectMethod: Plugins, dynamic features (Airbnb, Uber)
 * - withEvents: Analytics, hooks (Uber, Stripe)
 * - createUniversalApiClient: Dynamic API clients (Stripe, Uber)
 * 
 * --- Note ---
 * These patterns are the "iceberg" of meta-programming. Mastery of these unlocks the ability to build frameworks, libraries, and systems at the scale of the world's top tech
 */