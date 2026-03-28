// Custom decorator types
function Role(role: string) {
  console.log('Role decorator factory called');
  return function <T extends new (...args: any[]) => object>(constructor: T) {
    console.log(`Role decorator execution for ${role}`);
    (constructor.prototype as any).role = role; // Assign role to prototype explicitly
  };
}

function ValidateRole(requiredRole: string) {
  console.log('ValidateRole decorator factory called');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(`ValidateRole decorator execution for ${propertyKey}`);
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      if ((this as BaseController).role !== requiredRole) {
        throw new Error(`Requires ${requiredRole} role`);
      }
      return originalMethod.apply(this, args);
    };
  };
}

function Log() {
  console.log('Log decorator factory called');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(`Log decorator execution for ${propertyKey}`);
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      console.log(`Calling ${propertyKey}`);
      return originalMethod.apply(this, args);
    };
  };
}

function AsyncValidate() {
  console.log('AsyncValidate decorator factory called');
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log(`AsyncValidate decorator execution for ${propertyKey}`);
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate validation
      return originalMethod.apply(this, args);
    };
  };
}

// Base class with decorators
@Role('default')
class BaseController {
  role!: string; // Explicitly define the 'role' property

  @ValidateRole('default')
  @Log()
  getData(): string {
    return 'Base data';
  }

  @ValidateRole('default')
  @Log()
  @AsyncValidate()
  async processData(): Promise<string> {
    return 'Processed data';
  }
}

// Subclass without explicit decorators - inherits base decorators
class UserController extends BaseController {
  override getData(): string {
    return 'User data';
  }

  override async processData(): Promise<string> {
    return 'Processed user data';
  }
}

// Subclass with its own decorator - overrides base decorator
@Role('admin')
class AdminController extends BaseController {
  @ValidateRole('admin')
  override getData(): string {
    return 'Admin data';
  }

  @ValidateRole('admin')
  override async processData(): Promise<string> {
    return 'Processed admin data';
  }
}

// Usage demonstration
async function demo() {
  const user = new UserController();
  const admin = new AdminController();

  console.log('User Controller:');
  try {
    console.log(user.getData());
    console.log(await user.processData());
  } catch (e) {
    console.error(e);
  }

  console.log('\nAdmin Controller:');
  try {
    console.log(admin.getData());
    console.log(await admin.processData());
  } catch (e) {
    console.error(e);
  }
}

// Run the demonstration
demo().catch(console.error);
