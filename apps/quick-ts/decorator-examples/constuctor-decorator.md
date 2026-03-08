[1 tool called]

Here's the advanced constructor manipulation techniques that demonstrate SDE-3 level expertise:

## File: `decorator-examples/constructor-manipulation.ts`

```typescript
import 'reflect-metadata';

// ============================================================================
// 1. CONSTRUCTOR REPLACEMENT - Complete constructor override
// ============================================================================

/**
 * Replaces the entire constructor with a custom implementation
 * Advanced pattern used in dependency injection frameworks
 */
export function ConstructorReplace<T extends Constructor>(replacement: (...args: any[]) => T) {
  return function <U extends T>(constructor: U) {
    const originalConstructor = constructor;
    
    // Create new constructor that calls replacement function
    const newConstructor = function (...args: any[]) {
      // Call the replacement function instead of original constructor
      const instance = replacement.apply(this, args);
      
      // Copy prototype chain
      Object.setPrototypeOf(instance, originalConstructor.prototype);
      
      return instance;
    };
    
    // Preserve static properties
    Object.setPrototypeOf(newConstructor, originalConstructor);
    
    // Copy static methods and properties
    for (const key of Object.getOwnPropertyNames(originalConstructor)) {
      if (key !== 'prototype' && key !== 'length' && key !== 'name') {
        (newConstructor as any)[key] = (originalConstructor as any)[key];
      }
    }
    
    return newConstructor as U;
  };
}

// ============================================================================
// 2. CONSTRUCTOR WRAPPING - Before/after hooks around constructor
// ============================================================================

interface ConstructorHooks {
  before?: (...args: any[]) => void | Promise<void>;
  after?: (instance: any, ...args: any[]) => void | Promise<void>;
  onError?: (error: Error, ...args: any[]) => void | Promise<void>;
}

/**
 * Wraps constructor with before/after hooks
 * Enables constructor-level AOP
 */
export function ConstructorWrap(hooks: ConstructorHooks) {
  return function <T extends Constructor>(constructor: T) {
    const { before, after, onError } = hooks;
    
    const wrappedConstructor = function (...args: any[]) {
      try {
        // Before hook
        if (before) {
          const beforeResult = before.apply(this, args);
          if (beforeResult instanceof Promise) {
            throw new Error('ConstructorWrap: before hook cannot be async');
          }
        }
        
        // Call original constructor
        const instance = new constructor(...args);
        
        // After hook
        if (after) {
          const afterResult = after.call(instance, instance, ...args);
          if (afterResult instanceof Promise) {
            throw new Error('ConstructorWrap: after hook cannot be async');
          }
        }
        
        return instance;
      } catch (error) {
        if (onError) {
          onError.call(this, error as Error, ...args);
        }
        throw error;
      }
    };
    
    // Preserve prototype chain and statics
    Object.setPrototypeOf(wrappedConstructor, constructor);
    wrappedConstructor.prototype = constructor.prototype;
    
    // Copy static properties
    for (const key of Object.getOwnPropertyNames(constructor)) {
      if (key !== 'prototype' && key !== 'length' && key !== 'name') {
        (wrappedConstructor as any)[key] = (constructor as any)[key];
      }
    }
    
    return wrappedConstructor as T;
  };
}

// ============================================================================
// 3. PARAMETER INJECTION - Inject dependencies into constructor
// ============================================================================

interface InjectionContext {
  get<T>(token: any): T;
  has(token: any): boolean;
}

/**
 * Injects dependencies into constructor parameters
 * Framework-level dependency injection
 */
export function InjectDependencies(context: InjectionContext) {
  return function <T extends Constructor>(constructor: T) {
    // Get injection metadata
    const injections = Reflect.getMetadata('inject', constructor) || [];
    
    const injectedConstructor = function (...args: any[]) {
      // Inject dependencies where specified
      const injectedArgs = args.map((arg, index) => {
        const injection = injections.find((inj: any) => inj.index === index);
        if (injection && context.has(injection.token)) {
          return context.get(injection.token);
        }
        return arg;
      });
      
      return new constructor(...injectedArgs);
    };
    
    // Preserve prototype and statics
    Object.setPrototypeOf(injectedConstructor, constructor);
    injectedConstructor.prototype = constructor.prototype;
    
    return injectedConstructor as T;
  };
}

// ============================================================================
// 4. CONSTRUCTOR OVERLOADING - Multiple constructor signatures
// ============================================================================

type ConstructorSignature = {
  params: any[];
  implementation: (...args: any[]) => any;
};

/**
 * Enables constructor overloading (TypeScript doesn't support this natively)
 * Advanced pattern for flexible object creation
 */
export function ConstructorOverload(...signatures: ConstructorSignature[]) {
  return function <T extends Constructor>(constructor: T) {
    const overloadedConstructor = function (...args: any[]) {
      // Find matching signature
      for (const signature of signatures) {
        if (matchesSignature(args, signature.params)) {
          // Call the specific implementation
          const instance = signature.implementation.apply(this, args);
          
          // Set prototype
          if (instance && typeof instance === 'object') {
            Object.setPrototypeOf(instance, constructor.prototype);
          }
          
          return instance;
        }
      }
      
      // No match found, use original constructor
      return new constructor(...args);
    };
    
    // Preserve prototype and statics
    Object.setPrototypeOf(overloadedConstructor, constructor);
    overloadedConstructor.prototype = constructor.prototype;
    
    return overloadedConstructor as T;
  };
}

function matchesSignature(args: any[], paramTypes: any[]): boolean {
  if (args.length !== paramTypes.length) return false;
  
  return args.every((arg, index) => {
    const paramType = paramTypes[index];
    if (paramType === String) return typeof arg === 'string';
    if (paramType === Number) return typeof arg === 'number';
    if (paramType === Boolean) return typeof arg === 'boolean';
    if (paramType === Object) return typeof arg === 'object';
    if (typeof paramType === 'function') return arg instanceof paramType;
    return true; // Any type
  });
}

// ============================================================================
// 5. FACTORY CONSTRUCTOR - Replace constructor with factory method
// ============================================================================

type FactoryFunction<T> = (...args: any[]) => T;

/**
 * Replaces constructor with a factory function
 * Enables complex instantiation logic
 */
export function FactoryConstructor<T extends Constructor>(factory: FactoryFunction<InstanceType<T>>) {
  return function <U extends T>(constructor: U) {
    const factoryConstructor = function (...args: any[]) {
      const instance = factory(...args);
      
      // Ensure proper prototype chain
      if (instance && typeof instance === 'object') {
        Object.setPrototypeOf(instance, constructor.prototype);
      }
      
      return instance;
    };
    
    // Preserve static properties
    Object.setPrototypeOf(factoryConstructor, constructor);
    
    return factoryConstructor as U;
  };
}

// ============================================================================
// 6. CONSTRUCTOR VALIDATION - Validate constructor arguments
// ============================================================================

interface ValidationRule {
  validate: (value: any, index: number) => boolean;
  message: string;
}

/**
 * Validates constructor arguments at instantiation time
 * Runtime type checking for constructor parameters
 */
export function ValidateConstructor(rules: ValidationRule[]) {
  return function <T extends Constructor>(constructor: T) {
    const validatedConstructor = function (...args: any[]) {
      // Validate each argument
      for (let i = 0; i < args.length; i++) {
        const rule = rules[i];
        if (rule && !rule.validate(args[i], i)) {
          throw new Error(`Constructor validation failed for parameter ${i}: ${rule.message}`);
        }
      }
      
      return new constructor(...args);
    };
    
    // Preserve prototype chain
    Object.setPrototypeOf(validatedConstructor, constructor);
    validatedConstructor.prototype = constructor.prototype;
    
    return validatedConstructor as T;
  };
}

// ============================================================================
// 7. ASYNC CONSTRUCTOR - Enable async constructor logic
// ============================================================================

/**
 * Enables async constructor operations
 * Pattern for async initialization (since constructors can't be async)
 */
export function AsyncConstructor<T extends Constructor>(initFn: (instance: InstanceType<T>, ...args: any[]) => Promise<void>) {
  return function <U extends T>(constructor: U) {
    const asyncConstructor = function (...args: any[]) {
      // Create instance synchronously
      const instance = new constructor(...args);
      
      // Add async initialization
      (instance as any)._initialized = false;
      (instance as any)._initPromise = initFn(instance, ...args).then(() => {
        (instance as any)._initialized = true;
      });
      
      // Add initialization check method
      (instance as any).isInitialized = () => (instance as any)._initialized;
      (instance as any).waitForInit = () => (instance as any)._initPromise;
      
      return instance;
    };
    
    // Preserve prototype and statics
    Object.setPrototypeOf(asyncConstructor, constructor);
    asyncConstructor.prototype = constructor.prototype;
    
    return asyncConstructor as U;
  };
}

// ============================================================================
// 8. CONSTRUCTOR CHAINING - Call parent constructors conditionally
// ============================================================================

interface ChainRule {
  condition: (...args: any[]) => boolean;
  parentArgs: (...args: any[]) => any[];
}

/**
 * Conditionally chains to different parent constructors
 * Advanced inheritance pattern
 */
export function ConstructorChain(rules: ChainRule[]) {
  return function <T extends Constructor>(constructor: T) {
    const chainedConstructor = function (...args: any[]) {
      // Find matching rule
      const rule = rules.find(rule => rule.condition(...args));
      
      if (rule) {
        // Create instance with parent args
        const parentArgs = rule.parentArgs(...args);
        return new constructor(...parentArgs);
      }
      
      // Default behavior
      return new constructor(...args);
    };
    
    // Preserve prototype chain
    Object.setPrototypeOf(chainedConstructor, constructor);
    chainedConstructor.prototype = constructor.prototype;
    
    return chainedConstructor as T;
  };
}

// ============================================================================
// 9. CONSTRUCTOR PROXY - Intercept constructor calls
// ============================================================================

interface ConstructorProxyHandler {
  construct?: (target: any, args: any[], newTarget: any) => any;
  apply?: (target: any, thisArg: any, args: any[]) => any;
}

/**
 * Uses ES6 Proxy to intercept constructor calls
 * Most powerful constructor manipulation technique
 */
export function ConstructorProxy(handler: ConstructorProxyHandler) {
  return function <T extends Constructor>(constructor: T) {
    const proxy = new Proxy(constructor, {
      construct(target, args, newTarget) {
        if (handler.construct) {
          return handler.construct(target, args, newTarget);
        }
        
        // Default: call original constructor
        return Reflect.construct(target, args, newTarget);
      },
      
      apply(target, thisArg, args) {
        if (handler.apply) {
          return handler.apply(target, thisArg, args);
        }
        
        // Default: call as function
        return Reflect.apply(target, thisArg, args);
      },
    });
    
    return proxy as T;
  };
}

// ============================================================================
// 10. CONSTRUCTOR METADATA - Store and retrieve constructor information
// ============================================================================

const CONSTRUCTOR_METADATA_KEY = Symbol('constructor-metadata');

/**
 * Stores metadata about constructor parameters and behavior
 * Enables runtime reflection on constructors
 */
export function ConstructorMetadata(metadata: Record<string, any>) {
  return function <T extends Constructor>(constructor: T) {
    Reflect.defineMetadata(CONSTRUCTOR_METADATA_KEY, metadata, constructor);
    return constructor;
  };
}

export function getConstructorMetadata<T = any>(constructor: Constructor): T | undefined {
  return Reflect.getMetadata(CONSTRUCTOR_METADATA_KEY, constructor);
}

// ============================================================================
// 11. CONSTRUCTOR CACHING - Cache constructor results
// ============================================================================

/**
 * Caches constructor results based on arguments
 * Singleton pattern with parameters
 */
export function ConstructorCache(keyFn?: (...args: any[]) => string) {
  const cache = new Map<string, any>();
  const defaultKeyFn = (...args: any[]) => JSON.stringify(args);
  const keyGenerator = keyFn || defaultKeyFn;
  
  return function <T extends Constructor>(constructor: T) {
    const cachedConstructor = function (...args: any[]) {
      const key = keyGenerator(...args);
      
      if (cache.has(key)) {
        return cache.get(key);
      }
      
      const instance = new constructor(...args);
      cache.set(key, instance);
      return instance;
    };
    
    // Preserve prototype
    Object.setPrototypeOf(cachedConstructor, constructor);
    cachedConstructor.prototype = constructor.prototype;
    
    return cachedConstructor as T;
  };
}

// ============================================================================
// 12. CONSTRUCTOR POLYMORPHISM - Multiple constructor implementations
// ============================================================================

type ConstructorVariant = {
  condition: (...args: any[]) => boolean;
  constructor: Constructor;
};

/**
 * Selects different constructor implementations based on arguments
 * Runtime polymorphism for constructors
 */
export function ConstructorPolymorphism(variants: ConstructorVariant[]) {
  return function <T extends Constructor>(baseConstructor: T) {
    const polymorphicConstructor = function (...args: any[]) {
      // Find matching variant
      const variant = variants.find(v => v.condition(...args));
      
      if (variant) {
        // Use variant constructor
        const instance = new variant.constructor(...args);
        
        // Ensure proper inheritance
        if (!(instance instanceof baseConstructor)) {
          Object.setPrototypeOf(instance, baseConstructor.prototype);
        }
        
        return instance;
      }
      
      // Default to base constructor
      return new baseConstructor(...args);
    };
    
    // Preserve prototype chain
    Object.setPrototypeOf(polymorphicConstructor, baseConstructor);
    polymorphicConstructor.prototype = baseConstructor.prototype;
    
    return polymorphicConstructor as T;
  };
}

// ============================================================================
// ADVANCED USAGE EXAMPLES
// ============================================================================

// Example 1: Constructor replacement for testing
@ConstructorReplace(function (name: string, age: number) {
  // Custom instantiation logic
  const instance = Object.create(User.prototype);
  instance._name = name.toUpperCase();
  instance._age = age;
  instance._createdWithReplacement = true;
  return instance;
})
class User {
  private _name: string;
  private _age: number;
  
  constructor(name: string, age: number) {
    this._name = name;
    this._age = age;
  }
  
  get name() { return this._name; }
  get age() { return this._age; }
}

// Example 2: Constructor wrapping with logging
@ConstructorWrap({
  before: (name: string, age: number) => {
    console.log(`Creating user: ${name}, ${age}`);
  },
  after: (instance: User) => {
    console.log(`User created successfully: ${instance.name}`);
  },
  onError: (error: Error, name: string) => {
    console.error(`Failed to create user ${name}:`, error.message);
  }
})
class LoggedUser {
  constructor(public name: string, public age: number) {}
}

// Example 3: Constructor overloading simulation
@ConstructorOverload(
  {
    params: [String, Number],
    implementation: function (name: string, age: number) {
      return { type: 'user', name, age };
    }
  },
  {
    params: [Object],
    implementation: function (config: { name: string; age: number; email: string }) {
      return { type: 'detailed-user', ...config };
    }
  }
)
class OverloadedUser {
  constructor(...args: any[]) {
    // This will be replaced by the decorator
  }
}

// Example 4: Factory constructor
@FactoryConstructor((name: string, age: number) => {
  if (age < 18) {
    return new MinorUser(name, age);
  } else {
    return new AdultUser(name, age);
  }
})
class FactoryUser {
  constructor(public name: string, public age: number) {}
}

class MinorUser extends FactoryUser {}
class AdultUser extends FactoryUser {}

// Example 5: Constructor validation
@ValidateConstructor([
  {
    validate: (value: any) => typeof value === 'string' && value.length > 0,
    message: 'Name must be a non-empty string'
  },
  {
    validate: (value: any) => typeof value === 'number' && value >= 0 && value <= 150,
    message: 'Age must be a number between 0 and 150'
  },
  {
    validate: (value: any) => typeof value === 'string' && value.includes('@'),
    message: 'Email must contain @ symbol'
  }
])
class ValidatedUser {
  constructor(public name: string, public age: number, public email: string) {}
}

// Example 6: Async constructor
@AsyncConstructor(async (instance: AsyncUser, name: string, age: number) => {
  // Simulate async initialization
  await new Promise(resolve => setTimeout(resolve, 100));
  instance.initializedData = `Initialized for ${name}`;
  console.log(`Async initialization complete for ${name}`);
})
class AsyncUser {
  initializedData: string = '';
  
  constructor(public name: string, public age: number) {}
}

// Example 7: Constructor proxy with full control
@ConstructorProxy({
  construct: (target, args, newTarget) => {
    console.log(`Intercepting constructor call with args:`, args);
    
    // Custom logic before construction
    const processedArgs = args.map(arg => 
      typeof arg === 'string' ? arg.toUpperCase() : arg
    );
    
    // Call original constructor
    const instance = Reflect.construct(target, processedArgs, newTarget);
    
    // Modify instance after construction
    instance.constructionTime = new Date();
    instance.constructionArgs = processedArgs;
    
    return instance;
  }
})
class ProxiedUser {
  constructionTime?: Date;
  constructionArgs?: any[];
  
  constructor(public name: string, public age: number) {}
}

// Example 8: Constructor caching
@ConstructorCache((name: string, age: number) => `${name}:${age}`)
class CachedUser {
  constructor(public name: string, public age: number) {
    console.log(`Creating new instance for ${name}`);
  }
}

// Example 9: Constructor polymorphism
@ConstructorPolymorphism([
  {
    condition: (name: string, age: number) => age < 18,
    constructor: MinorUser
  },
  {
    condition: (name: string, age: number) => age >= 18,
    constructor: AdultUser
  }
])
class PolymorphicUser {
  constructor(public name: string, public age: number) {}
}

// Example 10: Constructor metadata
@ConstructorMetadata({
  parameters: [
    { name: 'name', type: 'string', required: true },
    { name: 'age', type: 'number', min: 0, max: 150 }
  ],
  description: 'User entity with validation',
  version: '1.0'
})
class MetadataUser {
  constructor(public name: string, public age: number) {}
}

// ============================================================================
// USAGE DEMONSTRATION
// ============================================================================

/*
console.log('=== Constructor Manipulation Examples ===');

// Constructor replacement
const user1 = new User('john', 25);
console.log(user1.name); // 'JOHN' (uppercased by replacement)
console.log((user1 as any)._createdWithReplacement); // true

// Constructor wrapping
const user2 = new LoggedUser('jane', 30);
// Logs creation process

// Constructor overloading simulation
const user3 = new OverloadedUser('simple', 25); // { type: 'user', name: 'simple', age: 25 }
const user4 = new OverloadedUser({ name: 'detailed', age: 35, email: 'test@example.com' });
// { type: 'detailed-user', name: 'detailed', age: 35, email: 'test@example.com' }

// Factory constructor
const user5 = new FactoryUser('child', 15); // MinorUser instance
const user6 = new FactoryUser('adult', 25); // AdultUser instance

// Constructor validation
try {
  const user7 = new ValidatedUser('', 25, 'invalid'); // Throws validation error
} catch (error) {
  console.log(error.message);
}

// Async constructor
const user8 = new AsyncUser('async', 40);
user8.waitForInit().then(() => {
  console.log(user8.initializedData); // 'Initialized for async'
});

// Constructor proxy
const user9 = new ProxiedUser('proxy', 45);
console.log(user9.constructionTime); // Date when constructed
console.log(user9.constructionArgs); // ['PROXY', 45] (uppercased)

// Constructor caching
const user10 = new CachedUser('cached', 50); // Creates new
const user11 = new CachedUser('cached', 50); // Returns cached instance
console.log(user10 === user11); // true

// Constructor metadata
const metadata = getConstructorMetadata(MetadataUser);
console.log(metadata?.description); // 'User entity with validation'
*/
```

## File: `decorator-examples/constructor-patterns.ts`

```typescript
import 'reflect-metadata';

// ============================================================================
// ADVANCED CONSTRUCTOR PATTERNS FROM PRODUCTION SYSTEMS
// ============================================================================

// ============================================================================
// 1. DEPENDENCY INJECTION CONSTRUCTOR - Framework-level DI
// ============================================================================

interface DIContainer {
  resolve<T>(token: string | symbol): T;
  register<T>(token: string | symbol, implementation: T): void;
}

export function DIConstructor(container: DIContainer) {
  return function <T extends Constructor>(constructor: T) {
    // Get injection metadata from parameters
    const paramTypes = Reflect.getMetadata('design:paramtypes', constructor) || [];
    
    const injectedConstructor = function (...args: any[]) {
      // Resolve dependencies for each parameter
      const resolvedArgs = paramTypes.map((paramType: any, index: number) => {
        // If explicit arg provided, use it
        if (args[index] !== undefined) {
          return args[index];
        }
        
        // Otherwise try to resolve from container
        try {
          return container.resolve(paramType);
        } catch {
          throw new Error(`Cannot resolve dependency for parameter ${index} of type ${paramType.name}`);
        }
      });
      
      return new constructor(...resolvedArgs);
    };
    
    Object.setPrototypeOf(injectedConstructor, constructor);
    injectedConstructor.prototype = constructor.prototype;
    
    return injectedConstructor as T;
  };
}

// ============================================================================
// 2. CONSTRUCTOR PARAMETER TRANSFORMATION - Preprocess arguments
// ============================================================================

type ParameterTransformer = (value: any, index: number, allArgs: any[]) => any;

export function TransformParameters(transformers: ParameterTransformer[]) {
  return function <T extends Constructor>(constructor: T) {
    const transformedConstructor = function (...args: any[]) {
      // Apply transformations
      const transformedArgs = args.map((arg, index) => {
        const transformer = transformers[index];
        return transformer ? transformer(arg, index, args) : arg;
      });
      
      return new constructor(...transformedArgs);
    };
    
    Object.setPrototypeOf(transformedConstructor, constructor);
    transformedConstructor.prototype = constructor.prototype;
    
    return transformedConstructor as T;
  };
}

// ============================================================================
// 3. CONSTRUCTOR SINGLETON WITH PARAMETERS - Parametric singleton
// ============================================================================

export function ParametricSingleton<T extends Constructor>(
  keyFn: (...args: ConstructorParameters<T>) => string = (...args) => JSON.stringify(args)
) {
  const instances = new Map<string, InstanceType<T>>();
  
  return function (constructor: T) {
    const singletonConstructor = function (...args: any[]) {
      const key = keyFn(...args);
      
      if (!instances.has(key)) {
        instances.set(key, new constructor(...args) as InstanceType<T>);
      }
      
      return instances.get(key);
    };
    
    Object.setPrototypeOf(singletonConstructor, constructor);
    singletonConstructor.prototype = constructor.prototype;
    
    return singletonConstructor as T;
  };
}

// ============================================================================
// 4. CONSTRUCTOR BUILDER PATTERN - Fluent constructor API
// ============================================================================

export function BuilderConstructor<T extends Constructor>() {
  return function (constructor: T) {
    const builderConstructor = function (...args: any[]) {
      const instance = new constructor(...args);
      
      // Add builder methods
      (instance as any).build = () => instance;
      
      return instance;
    };
    
    Object.setPrototypeOf(builderConstructor, constructor);
    builderConstructor.prototype = constructor.prototype;
    
    return builderConstructor as T;
  };
}

// ============================================================================
// 5. CONSTRUCTOR LAZY LOADING - Defer instantiation
// ============================================================================

export function LazyConstructor<T extends Constructor>() {
  let instance: InstanceType<T> | null = null;
  let instanceArgs: any[] | null = null;
  
  return function (constructor: T) {
    const lazyConstructor = function (...args: any[]) {
      if (!instance) {
        instanceArgs = args;
        // Don't create instance yet
        return new Proxy({}, {
          get(target, prop) {
            if (!instance) {
              instance = new constructor(...instanceArgs!) as InstanceType<T>;
            }
            return (instance as any)[prop];
          },
          set(target, prop, value) {
            if (!instance) {
              instance = new constructor(...instanceArgs!) as InstanceType<T>;
            }
            (instance as any)[prop] = value;
            return true;
          }
        });
      }
      
      return instance;
    };
    
    Object.setPrototypeOf(lazyConstructor, constructor);
    lazyConstructor.prototype = constructor.prototype;
    
    return lazyConstructor as T;
  };
}

// ============================================================================
// 6. CONSTRUCTOR POOLING - Object pooling pattern
// ============================================================================

export function PooledConstructor<T extends Constructor>(poolSize: number = 10) {
  const pool: InstanceType<T>[] = [];
  
  return function (constructor: T) {
    const pooledConstructor = function (...args: any[]) {
      // Try to get from pool
      if (pool.length > 0) {
        const instance = pool.pop()!;
        // Reset instance with new args if possible
        if (typeof (instance as any).reset === 'function') {
          (instance as any).reset(...args);
        }
        return instance;
      }
      
      // Create new instance
      return new constructor(...args);
    };
    
    // Add return method to instances
    const originalPrototype = constructor.prototype;
    pooledConstructor.prototype = {
      ...originalPrototype,
      returnToPool() {
        if (pool.length < poolSize) {
          pool.push(this as InstanceType<T>);
        }
      }
    };
    
    Object.setPrototypeOf(pooledConstructor, constructor);
    
    return pooledConstructor as T;
  };
}

// ============================================================================
// 7. CONSTRUCTOR DECORATOR COMPOSITION - Chain multiple constructor decorators
// ============================================================================

export function ComposeConstructors(...decorators: Array<(constructor: any) => any>) {
  return function <T extends Constructor>(constructor: T) {
    return decorators.reduce((acc, decorator) => decorator(acc), constructor);
  };
}

// ============================================================================
// 8. CONSTRUCTOR TIME TRAVEL - Record and replay constructor calls
// ============================================================================

interface ConstructorCall {
  args: any[];
  timestamp: Date;
  instance: any;
}

export function RecordConstructor() {
  const calls: ConstructorCall[] = [];
  
  return function <T extends Constructor>(constructor: T) {
    const recordedConstructor = function (...args: any[]) {
      const instance = new constructor(...args);
      
      calls.push({
        args: [...args],
        timestamp: new Date(),
        instance
      });
      
      // Add replay methods
      (instance as any).getConstructorCalls = () => [...calls];
      (instance as any).replayCall = (index: number) => {
        const call = calls[index];
        return call ? new constructor(...call.args) : null;
      };
      
      return instance;
    };
    
    Object.setPrototypeOf(recordedConstructor, constructor);
    recordedConstructor.prototype = constructor.prototype;
    
    return recordedConstructor as T;
  };
}

// ============================================================================
// 9. CONSTRUCTOR FREEZING - Immutable constructor arguments
// ============================================================================

export function FreezeConstructor() {
  return function <T extends Constructor>(constructor: T) {
    const frozenConstructor = function (...args: any[]) {
      const instance = new constructor(...args);
      
      // Freeze the instance
      Object.freeze(instance);
      
      return instance;
    };
    
    Object.setPrototypeOf(frozenConstructor, constructor);
    frozenConstructor.prototype = constructor.prototype;
    
    return frozenConstructor as T;
  };
}

// ============================================================================
// 10. CONSTRUCTOR SERIALIZATION - Serialize constructor calls
// ============================================================================

export function SerializableConstructor<T extends Constructor>() {
  return function (constructor: T) {
    const serializableConstructor = function (...args: any[]) {
      const instance = new constructor(...args);
      
      // Add serialization methods
      (instance as any).toConstructorCall = () => ({
        constructor: constructor.name,
        args: [...args],
        timestamp: new Date()
      });
      
      return instance;
    };
    
    Object.setPrototypeOf(serializableConstructor, constructor);
    serializableConstructor.prototype = constructor.prototype;
    
    return serializableConstructor as T;
  };
}

// ============================================================================
// PRODUCTION-GRADE EXAMPLES
// ============================================================================

// Example: DI Container
class SimpleDIContainer implements DIContainer {
  private services = new Map<string | symbol, any>();
  
  register<T>(token: string | symbol, implementation: T) {
    this.services.set(token, implementation);
  }
  
  resolve<T>(token: string | symbol): T {
    const service = this.services.get(token);
    if (!service) {
      throw new Error(`Service not found: ${String(token)}`);
    }
    return service;
  }
}

class LoggerService {
  log(message: string) {
    console.log(`[LOG] ${message}`);
  }
}

class ConfigService {
  get(key: string) {
    return process.env[key] || 'default';
  }
}

@DIConstructor(new SimpleDIContainer())
class AppService {
  constructor(
    private logger: LoggerService,
    private config: ConfigService
  ) {}
  
  doWork() {
    this.logger.log('Working...');
    return this.config.get('APP_NAME');
  }
}

// Example: Parameter transformation
@TransformParameters([
  (value: string) => value.trim().toLowerCase(), // Transform name
  (value: number) => Math.max(0, Math.min(150, value)), // Clamp age
  (value: string) => value.includes('@') ? value : `${value}@default.com` // Default email
])
class TransformedUser {
  constructor(public name: string, public age: number, public email: string) {}
}

// Example: Parametric singleton
@ParametricSingleton((name: string) => name.toLowerCase())
class NamedService {
  constructor(public name: string) {
    console.log(`Created service: ${name}`);
  }
}

// Example: Lazy constructor
@LazyConstructor()
class ExpensiveService {
  constructor() {
    console.log('Expensive initialization...');
    // Simulate expensive operation
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }
    console.log('Expensive initialization complete');
  }
  
  work() {
    return 'work done';
  }
}

// Example: Pooled constructor
@PooledConstructor(5)
class DatabaseConnection {
  constructor(public host: string, public port: number) {
    console.log(`Opening connection to ${host}:${port}`);
  }
  
  query(sql: string) {
    return `Result for: ${sql}`;
  }
  
  returnToPool() {
    console.log('Returning connection to pool');
    // Call the pooled return method
    super.returnToPool();
  }
}

// Example: Constructor composition
@ComposeConstructors(
  RecordConstructor(),
  SerializableConstructor(),
  FreezeConstructor()
)
class ComposedService {
  constructor(public name: string, public value: number) {}
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

/*
console.log('=== Advanced Constructor Patterns ===');

// DI Constructor
const diContainer = new SimpleDIContainer();
diContainer.register('LoggerService', new LoggerService());
diContainer.register('ConfigService', new ConfigService());

const service = new AppService(); // Dependencies injected automatically
console.log(service.doWork());

// Parameter transformation
const user = new TransformedUser('  JOHN DOE  ', 200, 'john'); // Age clamped, email fixed
console.log(user); // { name: 'john doe', age: 150, email: 'john@default.com' }

// Parametric singleton
const service1 = new NamedService('Database'); // Created
const service2 = new NamedService('database'); // Returns same instance (lowercased key)
console.log(service1 === service2); // true

// Lazy constructor
const lazy = new ExpensiveService(); // No initialization yet
console.log('Lazy instance created');
// ... do other work ...
console.log(lazy.work()); // Now initializes

// Pooled constructor
const conn1 = new DatabaseConnection('localhost', 5432);
const conn2 = new DatabaseConnection('localhost', 5432); // New connection
conn1.returnToPool(); // Return to pool
const conn3 = new DatabaseConnection('localhost', 5432); // Reuses conn1

// Composed constructor
const composed = new ComposedService('test', 42);
console.log(composed.getConstructorCalls()); // Array of constructor calls
console.log(composed.toConstructorCall()); // Serialized constructor call
// composed.newProperty = 'test'; // Error: frozen
*/
```

## File: `decorator-examples/constructor-internals.ts`

```typescript
import 'reflect-metadata';

// ============================================================================
// CONSTRUCTOR INTERNALS MANIPULATION - EXPERT LEVEL
// ============================================================================

// ============================================================================
// 1. CONSTRUCTOR FUNCTION REPLACEMENT - Direct function manipulation
// ============================================================================

export function ReplaceConstructorFunction<T extends Constructor>(
  replacement: (...args: any[]) => InstanceType<T>
) {
  return function (constructor: T) {
    // Store original for reference
    const original = constructor;
    
    // Create new function with same name and length
    const newConstructor = {
      [constructor.name]: function (...args: any[]) {
        const instance = replacement.apply(this, args);
        
        // Ensure prototype chain
        if (instance && typeof instance === 'object') {
          Object.setPrototypeOf(instance, original.prototype);
        }
        
        return instance;
      }
    }[constructor.name];
    
    // Copy prototype
    newConstructor.prototype = original.prototype;
    
    // Copy static properties
    Object.setPrototypeOf(newConstructor, original);
    
    // Copy all static members
    for (const key of Object.getOwnPropertyNames(original)) {
      if (!['prototype', 'length', 'name'].includes(key)) {
        Object.defineProperty(newConstructor, key, 
          Object.getOwnPropertyDescriptor(original, key)!);
      }
    }
    
    return newConstructor as T;
  };
}

// ============================================================================
// 2. CONSTRUCTOR DESCRIPTOR MANIPULATION - Property descriptor level
// ============================================================================

export function ManipulateConstructorDescriptor<T extends Constructor>(
  manipulator: (descriptor: PropertyDescriptor, key: string) => PropertyDescriptor | undefined
) {
  return function (constructor: T) {
    // Get all property descriptors
    const descriptors = Object.getOwnPropertyDescriptors(constructor);
    
    // Apply manipulator to each descriptor
    for (const [key, descriptor] of Object.entries(descriptors)) {
      const newDescriptor = manipulator(descriptor, key);
      if (newDescriptor) {
        Object.defineProperty(constructor, key, newDescriptor);
      }
    }
    
    return constructor;
  };
}

// ============================================================================
// 3. CONSTRUCTOR PROTOTYPE CHAIN MODIFICATION - Inheritance manipulation
// ============================================================================

export function ModifyPrototypeChain<T extends Constructor>(
  prototypeModifier: (proto: any) => any
) {
  return function (constructor: T) {
    const originalPrototype = constructor.prototype;
    const modifiedPrototype = prototypeModifier(originalPrototype);
    
    if (modifiedPrototype !== originalPrototype) {
      constructor.prototype = modifiedPrototype;
      
      // Update constructor reference
      if (modifiedPrototype.constructor !== constructor) {
        modifiedPrototype.constructor = constructor;
      }
    }
    
    return constructor;
  };
}

// ============================================================================
// 4. CONSTRUCTOR CALL TRACING - Stack trace manipulation
// ============================================================================

export function TraceConstructorCalls() {
  return function <T extends Constructor>(constructor: T) {
    const tracedConstructor = function (...args: any[]) {
      const stackTrace = new Error().stack;
      const callSite = stackTrace?.split('\n')[2]?.trim();
      
      console.log(`Constructor ${constructor.name} called from: ${callSite}`);
      console.log(`Arguments:`, args);
      
      const instance = new constructor(...args);
      
      // Add tracing info to instance
      (instance as any)._constructorTrace = {
        callSite,
        args: [...args],
        timestamp: new Date(),
        stack: stackTrace
      };
      
      return instance;
    };
    
    Object.setPrototypeOf(tracedConstructor, constructor);
    tracedConstructor.prototype = constructor.prototype;
    
    return tracedConstructor as T;
  };
}

// ============================================================================
// 5. CONSTRUCTOR MEMORY MANAGEMENT - Custom allocation
// ============================================================================

export function CustomAllocator<T extends Constructor>(
  allocator: (size: number) => any,
  deallocator?: (instance: any) => void
) {
  return function (constructor: T) {
    const allocatedConstructor = function (...args: any[]) {
      // Allocate memory using custom allocator
      const instance = allocator(args.length);
      
      // Call constructor on allocated memory
      const result = constructor.apply(instance, args);
      
      // Add deallocator if provided
      if (deallocator) {
        (result as any)._deallocate = () => deallocator(result);
      }
      
      return result;
    };
    
    Object.setPrototypeOf(allocatedConstructor, constructor);
    allocatedConstructor.prototype = constructor.prototype;
    
    return allocatedConstructor as T;
  };
}

// ============================================================================
// 6. CONSTRUCTOR TYPE GUARDS - Runtime type checking
// ============================================================================

export function ConstructorTypeGuard<T extends Constructor>(
  typeGuards: Array<(value: any, index: number) => boolean>
) {
  return function (constructor: T) {
    const guardedConstructor = function (...args: any[]) {
      // Apply type guards
      for (let i = 0; i < args.length && i < typeGuards.length; i++) {
        if (!typeGuards[i](args[i], i)) {
          throw new TypeError(`Argument ${i} failed type guard`);
        }
      }
      
      return new constructor(...args);
    };
    
    Object.setPrototypeOf(guardedConstructor, constructor);
    guardedConstructor.prototype = constructor.prototype;
    
    return guardedConstructor as T;
  };
}

// ============================================================================
// 7. CONSTRUCTOR CURRYING - Partial application
// ============================================================================

export function CurryConstructor<T extends Constructor>(arity: number) {
  return function (constructor: T) {
    const curriedConstructor = function (...args: any[]) {
      if (args.length >= arity) {
        return new constructor(...args);
      }
      
      // Return curried function
      return function (...moreArgs: any[]) {
        return new constructor(...args, ...moreArgs);
      };
    };
    
    Object.setPrototypeOf(curriedConstructor, constructor);
    curriedConstructor.prototype = constructor.prototype;
    
    return curriedConstructor as T;
  };
}

// ============================================================================
// 8. CONSTRUCTOR MEMOIZATION WITH EVICTION - Advanced caching
// ============================================================================

export function MemoizedConstructor<T extends Constructor>(
  options: {
    keyFn?: (...args: any[]) => string;
    ttl?: number;
    maxSize?: number;
    evictionPolicy?: 'lru' | 'fifo' | 'lfu';
  } = {}
) {
  const {
    keyFn = (...args) => JSON.stringify(args),
    ttl = 300000, // 5 minutes
    maxSize = 100,
    evictionPolicy = 'lru'
  } = options;
  
  const cache = new Map<string, {
    instance: InstanceType<T>;
    created: number;
    accessCount: number;
    lastAccessed: number;
  }>();
  
  const evict = () => {
    if (cache.size <= maxSize) return;
    
    let keyToEvict: string;
    
    switch (evictionPolicy) {
      case 'lru':
        keyToEvict = Array.from(cache.entries())
          .sort(([,a], [,b]) => a.lastAccessed - b.lastAccessed)[0][0];
        break;
      case 'fifo':
        keyToEvict = cache.keys().next().value;
        break;
      case 'lfu':
        keyToEvict = Array.from(cache.entries())
          .sort(([,a], [,b]) => a.accessCount - b.accessCount)[0][0];
        break;
    }
    
    cache.delete(keyToEvict!);
  };
  
  return function (constructor: T) {
    const memoizedConstructor = function (...args: any[]) {
      const key = keyFn(...args);
      const now = Date.now();
      
      // Check cache
      const cached = cache.get(key);
      if (cached && (now - cached.created) < ttl) {
        cached.accessCount++;
        cached.lastAccessed = now;
        return cached.instance;
      }
      
      // Create new instance
      const instance = new constructor(...args) as InstanceType<T>;
      
      // Cache it
      cache.set(key, {
        instance,
        created: now,
        accessCount: 1,
        lastAccessed: now
      });
      
      // Evict if necessary
      evict();
      
      return instance;
    };
    
    Object.setPrototypeOf(memoizedConstructor, constructor);
    memoizedConstructor.prototype = constructor.prototype;
    
    return memoizedConstructor as T;
  };
}

// ============================================================================
// 9. CONSTRUCTOR ASPECT ORIENTED PROGRAMMING - AOP integration
// ============================================================================

interface Aspect {
  before?: (...args: any[]) => void;
  after?: (result: any, ...args: any[]) => void;
  around?: (original: Function, ...args: any[]) => any;
  onThrow?: (error: Error, ...args: any[]) => void;
}

export function ConstructorAOP<T extends Constructor>(aspect: Aspect) {
  return function (constructor: T) {
    const aopConstructor = function (...args: any[]) {
      try {
        // Before advice
        aspect.before?.(...args);
        
        // Around advice
        if (aspect.around) {
          return aspect.around(() => new constructor(...args), ...args);
        }
        
        // Normal execution
        const instance = new constructor(...args);
        
        // After advice
        aspect.after?.(instance, ...args);
        
        return instance;
      } catch (error) {
        // Exception advice
        aspect.onThrow?.(error as Error, ...args);
        throw error;
      }
    };
    
    Object.setPrototypeOf(aopConstructor, constructor);
    aopConstructor.prototype = constructor.prototype;
    
    return aopConstructor as T;
  };
}

// ============================================================================
// 10. CONSTRUCTOR METACLASS - Runtime class generation
// ============================================================================

export function Metaclass<T extends Constructor>(
  metaclassFactory: (originalConstructor: T) => T
) {
  return function (constructor: T) {
    // Apply metaclass transformation
    const metaclassInstance = metaclassFactory(constructor);
    
    // The metaclass factory can return a completely different constructor
    return metaclassInstance;
  };
}

// ============================================================================
// EXPERT LEVEL EXAMPLES
// ============================================================================

// Example 1: Constructor function replacement
@ReplaceConstructorFunction(function (name: string, age: number) {
  // Custom object creation
  return {
    _name: name,
    _age: age,
    get name() { return this._name; },
    get age() { return this._age; },
    toString() { return `${this._name} (${this._age})`; }
  };
})
class PlainObjectUser {
  constructor(public name: string, public age: number) {}
}

// Example 2: Constructor descriptor manipulation
@ManipulateConstructorDescriptor((descriptor, key) => {
  // Make all static methods enumerable and configurable
  if (typeof descriptor.value === 'function' && key !== 'prototype') {
    return {
      ...descriptor,
      enumerable: true,
      configurable: true
    };
  }
  return descriptor;
})
class ManipulatedUser {
  static create(name: string, age: number) {
    return new ManipulatedUser(name, age);
  }
  
  constructor(public name: string, public age: number) {}
}

// Example 3: Prototype chain modification
@ModifyPrototypeChain((proto) => {
  // Add logging to all methods
  const newProto = Object.create(proto);
  
  for (const key of Object.getOwnPropertyNames(proto)) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (descriptor && typeof descriptor.value === 'function') {
      newProto[key] = function (...args: any[]) {
        console.log(`Calling ${key} on ${this.constructor.name}`);
        return descriptor.value.apply(this, args);
      };
    }
  }
  
  return newProto;
})
class LoggedPrototypeUser {
  constructor(public name: string, public age: number) {}
  
  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

// Example 4: Constructor tracing
@TraceConstructorCalls()
class TracedUser {
  constructor(public name: string, public age: number) {}
}

// Example 5: Custom memory allocation
@CustomAllocator(
  (size) => new Array(size), // Allocate array as backing store
  (instance) => console.log('Deallocating:', instance)
)
class CustomAllocatedUser {
  constructor(public name: string, public age: number) {}
}

// Example 6: Type guard constructor
@ConstructorTypeGuard([
  (value) => typeof value === 'string' && value.length > 0, // name
  (value) => typeof value === 'number' && value >= 0 // age
])
class TypeGuardedUser {
  constructor(public name: string, public age: number) {}
}

// Example 7: Curried constructor
@CurryConstructor(3)
class CurriedUser {
  constructor(public name: string, public age: number, public email: string) {}
}

// Example 8: Advanced memoization
@MemoizedConstructor({
  ttl: 60000,
  maxSize: 50,
  evictionPolicy: 'lru'
})
class MemoizedUser {
  constructor(public name: string, public age: number) {
    console.log(`Creating user: ${name}`);
  }
}

// Example 9: AOP constructor
@ConstructorAOP({
  before: (...args) => console.log('Before constructor:', args),
  after: (result) => console.log('After constructor:', result),
  around: (original, ...args) => {
    console.log('Around - before');
    const result = original();
    console.log('Around - after');
    return result;
  }
})
class AOPUser {
  constructor(public name: string, public age: number) {}
}

// Example 10: Metaclass
@Metaclass((original) => {
  // Create a class that logs all method calls
  const LoggedClass = class extends original {
    constructor(...args: any[]) {
      super(...args);
      return new Proxy(this, {
        get: (target, prop) => {
          const value = (target as any)[prop];
          if (typeof value === 'function') {
            return function (...args: any[]) {
              console.log(`Calling ${String(prop)} with`, args);
              return value.apply(target, args);
            };
          }
          return value;
        }
      });
    }
  };
  
  return LoggedClass as typeof original;
})
class MetaclassUser {
  constructor(public name: string, public age: number) {}
  
  greet() {
    return `Hello, ${this.name}`;
  }
}

// ============================================================================
// DEMONSTRATION
// ============================================================================

/*
console.log('=== Constructor Internals Manipulation ===');

// Constructor function replacement
const user1 = new PlainObjectUser('plain', 25);
console.log(user1.toString()); // plain (25)
console.log(typeof user1); // object (not instance of PlainObjectUser)

// Constructor tracing
const user2 = new TracedUser('traced', 30);
// Logs constructor call stack

// Type guarded constructor
try {
  const user3 = new TypeGuardedUser('', -5); // Throws TypeError
} catch (error) {
  console.log('Type guard caught:', error.message);
}

// Curried constructor
const createUser = new CurriedUser('curry', 35); // Partially applied
const user4 = createUser('curry@example.com'); // Complete application

// Advanced memoization
const user5 = new MemoizedUser('memo', 40); // Created
const user6 = new MemoizedUser('memo', 40); // Cached
console.log(user5 === user6); // true

// Metaclass with method logging
const user7 = new MetaclassUser('meta', 45);
user7.greet(); // Logs method call
*/
```

These examples demonstrate the most advanced constructor manipulation techniques used in production frameworks like Angular, NestJS, and TypeORM. They show:

1. **Constructor replacement** - Complete function replacement
2. **Prototype manipulation** - Inheritance chain modification  
3. **Memory management** - Custom allocation/deallocation
4. **Type systems** - Runtime type checking and guards
5. **Functional patterns** - Currying, memoization
6. **AOP integration** - Aspect-oriented programming
7. **Metaprogramming** - Runtime class generation

These patterns are used in:
- Dependency injection frameworks (Angular)
- ORM libraries (TypeORM, Sequelize)
- Testing frameworks (Jest)
- Web frameworks (NestJS, Express)
- Build tools (Webpack, Rollup)

The techniques demonstrate SDE-3 level expertise with deep understanding of JavaScript/TypeScript internals, reflection, and metaprogramming.