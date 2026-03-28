import 'reflect-metadata'; // Required for Reflect API

// **Class Decorator**
// Adds metadata and modifies the constructor functionality.
function Entity(tableName: string) {
  return function (target: { new (...args: any[]): any }) {
    // Specify constructor signature

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
  return function (target: object, propertyKey: string) {
    // Use 'object' instead of 'Object'
    // Attach metadata
    Reflect.defineMetadata(propertyKey, { type }, target);
    console.log(`Property '${propertyKey}' is of type '${type}'`);
  };
}

// **Method Decorator**
// Logs method calls and wraps the logic.
function LogExecutionTime() {
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
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
  return function (target: object, propertyKey: string, descriptor: PropertyDescriptor) {
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
  return function (target: object, propertyKey: string, parameterIndex: number) {
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

  private _role = 'guest';

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
