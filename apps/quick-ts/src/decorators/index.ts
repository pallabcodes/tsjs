// Class decorator
@sealed
class User {}

// The value returned from this "sealed function" will become the new constructor function for this class & so
// this is very useful to completely overwrite the constructor of this class i.e. User
function sealed(target: new (...args: any[]) => any): void {
  Object.seal(target);
  Object.seal(target.prototype);
}

const user = new User();
console.log('user: ', user);
// with seal applied no new property can be added
// User's constructor can't be modified i.e. no extending this class to make sub/derived class
// user.name = "John";

// Decorator factories: wrapper function to take additional parameters then inner function implements decorator and returns it
// First decorator factories will run, then it will run its decorator implementation by itself thereafter by default
// thus no need to call decoratorA(true)()

function decoratorA(_someBooleanFlag: boolean) {
  return (_target: new (...args: any[]) => any): void => {
    // decorator implementation
  };
}

@decoratorA(true)
export class UserFactory {}

// Property decorator

// Any property decorator receives the following parameters:
// For static properties, the constructor function of the class. For all the other properties, the prototype of the class.
// The name of the member.

function printMemberName(target: object, memberName: string): void {
  console.log(memberName);
  // to override property here, use Object.defineProperty along with a setter and getter
}

function allowListOnly(allowList: string[]) {
  return (target: object, memberName: string): void => {
    let currentValue = Reflect.get(target, memberName);

    Object.defineProperty(target, memberName, {
      set: (newValue: string) => {
        if (!allowList.includes(newValue)) return;
        currentValue = newValue;
      },
      get: () => currentValue,
    });
  };
}

class UserWithRestrictedName {
  @printMemberName
  @allowListOnly(['John', 'Jones'])
  name = 'John';
}

const user2 = new UserWithRestrictedName();
console.log(user2.name);

user2.name = 'Johnson';
console.log(user2.name);

// Accessor decorators: It receives the same properties just like property decorator along with Property descriptor of the accessor member
// Any value returned from "accessor decorator" will become the new Property descriptor for both getter & setter members

const enumerable = (value: boolean) => {
  return (
    target: object,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ): void => {
    propertyDescriptor.enumerable = value;
  };
};

export class FullNameAccessor {
  firstName = 'Jon';
  lastName = 'Doe';

  @enumerable(true)
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// Method decorators: Similar to the accessor decorator

// If returned a value from the method decorator, this value will become the new Property Descriptor of the method.
const enumerableMethod = (value: boolean) => {
  return (
    target: object,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ): void => {
    propertyDescriptor.enumerable = value;
  };
};

export class FullNameMethod {
  firstName = 'Jon';
  lastName = 'Doe';

  @enumerableMethod(true)
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// As this method decorator returns a value, thus it'll overwrite this given member's "property descriptor"
const deprecated = (deprecationReason: string) => {
  return (
    target: object,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ): PropertyDescriptor => {
    return {
      get() {
        const wrapperFn = (...args: unknown[]) => {
          console.warn(
            `Method ${memberName} is deprecated with reason: ${deprecationReason}`
          );
          // now call the original method on which this decorator applied,
          // by this way the original method is called with their "this" value correctly bound to the class instance in case if it is a non-static method
          propertyDescriptor.value?.apply(this, args);
        };

        Object.defineProperty(this, memberName, {
          value: wrapperFn,
          configurable: true,
          writable: true,
        });
        return wrapperFn;
      },
    };
  };
};

class TestWithDeprecation {
  static staticMember = true;

  instanceMember = 'hello';

  @deprecated('Use another static method')
  static deprecatedMethodStatic(): void {
    console.log(
      'inside deprecated static method - staticMember =',
      this.staticMember
    );
  }

  @deprecated('Use another instance method')
  deprecatedMethod(): void {
    console.log(
      'inside deprecated instance method - instanceMember =',
      this.instanceMember
    );
  }
}

TestWithDeprecation.deprecatedMethodStatic();

const instance = new TestWithDeprecation();
instance.deprecatedMethod();

// Parameter decorators

// The decorator function used with parameters receives the following parameters:
// For static properties, the constructor function of the class. For all other properties, the prototype of the class.
// The name of the member.
// The index of the parameter in the method’s parameter list.

function print(
  target: object,
  propertyKey: string,
  parameterIndex: number
): void {
  console.log(`Decorating param ${parameterIndex} from ${propertyKey}`);
}

export class ParameterDecoratorExample {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  testMethod(_param0: unknown, @print _param1: unknown): void {}
}
