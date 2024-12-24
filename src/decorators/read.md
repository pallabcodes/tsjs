### **Decorator Overview in TypeScript**

Decorators in TypeScript allow you to add metadata, modify behavior, or extend functionality for various constructs such as classes, methods, properties, accessors, and parameters. Here's a comprehensive table outlining the decorators, when they apply, what parameters they access, and what they can modify.

---

#### **1. Table of Decorators**

| **Decorator Type** | **Applies To**    | **Parameters**                                                            | **What It Can Modify**                                                                                                                                                             |
| ------------------ | ----------------- | ------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Class**          | Classes           | `target: Function` (constructor function of the class)                    | - Add/modify static properties.<br>- Extend functionality using `Proxy`.<br>- Add metadata via `Reflect`.<br>- Replace the class with a new one.<br>- Modify prototype methods.    |
| **Property**       | Properties        | `target: Object` (class prototype), `propertyKey: string` (property name) | - Add/modify metadata for the property.<br>- Cannot directly change the property value but can redefine with `Object.defineProperty`.                                              |
| **Method**         | Methods           | `target: Object`, `propertyKey: string`, `descriptor: PropertyDescriptor` | - Wrap, replace, or modify the method logic.<br>- Change the method's enumerable/configurable attributes.<br>- Inject metadata using `Reflect`.                                    |
| **Accessor**       | Getters/Setters   | `target: Object`, `propertyKey: string`, `descriptor: PropertyDescriptor` | - Modify getter or setter behavior.<br>- Replace the getter or setter implementation.<br>- Modify enumerable/configurable attributes.                                              |
| **Parameter**      | Method Parameters | `target: Object`, `propertyKey: string`, `parameterIndex: number`         | - Add metadata for the parameter.<br>- Cannot modify the parameter directly.<br>- Use `Reflect` for runtime inspection.<br>- Combine with other decorators for validation or RBAC. |

---

### **2. Detailed Code with Explanations**

Below is a TypeScript example demonstrating all decorator types with meaningful scenarios. It includes inline comments to explain each part.

```typescript
import 'reflect-metadata'; // Required for Reflect API

// **Class Decorator**
// Adds metadata and modifies the constructor functionality.
function Entity(tableName: string) {
  return function (target: Function) {
    // Attach metadata
    Reflect.defineMetadata('tableName', tableName, target);

    // Wrap the original constructor with additional behavior
    const originalConstructor = target;

    const newConstructor: any = function (...args: any[]) {
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
function Column(type: string) {
  return function (target: Object, propertyKey: string) {
    // Attach metadata
    Reflect.defineMetadata(propertyKey, { type }, target);
    console.log(`Property '${propertyKey}' is of type '${type}'`);
  };
}

// **Method Decorator**
// Logs method calls and wraps the logic.
function LogExecutionTime() {
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
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
  return function (target: Object, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalGetter = descriptor.get;
    descriptor.get = function () {
      console.log(`Accessing ${propertyKey}`);
      return originalGetter?.apply(this);
    };
  };
}

// **Parameter Decorator**
// Adds metadata for method parameters (e.g., validation, RBAC).
function ValidateRole(role: string) {
  return function (target: Object, propertyKey: string, parameterIndex: number) {
    const existingRoles: any[] = Reflect.getMetadata('roles', target, propertyKey) || [];
    existingRoles.push({ role, parameterIndex });
    Reflect.defineMetadata('roles', existingRoles, target, propertyKey);
  };
}

// Using the decorators
@Entity('users')
class User {
  @Column('string')
  name!: string;

  @Column('number')
  age!: number;

  private _role: string = 'guest';

  @LogAccess()
  get role() {
    return this._role;
  }

  @LogExecutionTime()
  save(@ValidateRole('admin') data: any) {
    console.log('Saving user data:', data);
  }
}

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
```

---

### **Explanation of the Code**

1. **Class Decorator (`Entity`)**:

   - Adds a `tableName` metadata to the class.
   - Modifies the class constructor to log messages when a new instance is created.
   - Ensures `instanceof` checks remain valid by preserving the original prototype.

2. **Property Decorator (`Column`)**:

   - Adds metadata to each property (`name` and `age`), such as the type of data expected.
   - Outputs logs whenever a property is decorated.

3. **Method Decorator (`LogExecutionTime`)**:

   - Wraps the original method to measure and log its execution time.

4. **Accessor Decorator (`LogAccess`)**:

   - Wraps the getter for `role` to log access attempts.

5. **Parameter Decorator (`ValidateRole`)**:

   - Attaches role-based metadata to the `save` method's parameters.
   - The metadata is later retrievable using `Reflect.getMetadata`.

6. **Metadata Storage**:
   - Uses `reflect-metadata` to attach and retrieve runtime metadata for properties, methods, and parameters.
   - Allows combining decorators for complex behaviors like validation and RBAC.

---

### **Best Practices Demonstrated**

- Meaningful examples with real-world use cases (e.g., ORM-like functionality, method timing, role validation).
- Inline comments for clarity.
- Use of `Reflect` API for runtime metadata management.
- Proxy-like behavior in the class decorator to enhance constructor functionality.

This code can be extended further to include more advanced use cases, such as dynamic validation or injecting dependencies. Let me know if you'd like to explore those!

## Decorators adds `metadata` and then using `Reflect/Proxy` to validate

Yes, by metadata, I mean everything that can be attached to a class—properties, methods, symbols, and other constructs like parameters or accessors—essentially any information you want to associate with a class or its members, which can be accessed at runtime using the `Reflect` API.
