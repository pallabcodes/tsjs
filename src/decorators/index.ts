// class decorator
@sealed
class Person {}

// The value returned from this "sealed function" will become the new constructor function for this class & so
// this is very useful to completely overwrite the constructor of this class i.e. Person
function sealed(target: Function) {
  Object.seal(target);
  Object.seal(target.prototype);
}

const person = new Person();
// with seal applied the no new property can be added
// Person's constructor can't be modified i.e. no extending this class to make sub/derived class
// person.name = "John";

// decorator factories: wrapper function to take additional parameters then inner function implements decorator and returns it
// first decorator factories will run then it will run its decorator implementation by itself thereafter by default thus no need to decoratorA(true)()

function decoratorA(someBooleanFlag: boolean) {
  return (target: Function) => {
    // decorator implementation
  };
}

@decoratorA(true)
class Person1 {}

// property decorator

// Any property decorator receives the following parameters:

// For static properties, the constructor function of the class. For all the other properties, the prototype of the class.
// The name of the member.

function printMemberName(target: any, memberName: string) {
  console.log(memberName);
  // to override property here, use Object.defineProperty along with a setter and getter
}

// const allowList = ["John", "Jones"];
function allowListOnly(allowList: string[]) {
  return (target: any, memberName: string) => {
    //   as said here target's type could be constructor of prototype of the class so if unknown use any as type

    let currentValue = target[memberName]; // getting the current value

    Object.defineProperty(target, memberName, {
      set: (newValue: any) => {
        if (!allowList.includes(newValue)) return;
        currentValue = newValue;
      },
      get: () => currentValue,
    });
  };
}

class Person2 {
  @printMemberName
  @allowListOnly(["John", "Jones"])
  name: string = "John";
}

const person2 = new Person2();
console.log(person2.name);

person2.name = "Johnson";
console.log(person2.name);

// accessor decorators: it receives the same properties just like property decorator along with Property descriptor of the accessor member
// any value returned from "accessor decorator" will become new Property descriptor for both getter & setter members

const enumerable = (value: boolean) => {
  return (
    target: any,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    propertyDescriptor.enumerable = value;
  };
};

class Person4 {
  firstName: string = "Jon";
  lastName: string = "Doe";

  @enumerable(true)
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// method decorators: similar to the accessor decorator

// If returned a value from the method decorator, this value will become the new Property Descriptor of the method.
const enumerableMethod = (value: boolean) => {
  return (
    target: any,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    propertyDescriptor.enumerable = value;
  };
};

class Person6 {
  firstName: string = "Jon";
  lastName: string = "Doe";

  @enumerableMethod(true)
  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }
}

// as this method decorator returns a value, thus it'll overwrite this given member's "property descriptor"
const deprecated = (deprecationReason: string) => {
  return (
    target: any,
    memberName: string,
    propertyDescriptor: PropertyDescriptor
  ) => {
    return {
      get() {
        const wrapperFn = (...args: any[]) => {
          console.warn(
            `Method ${memberName} is deprecated with reason: ${deprecationReason}`
          );
          // now call the original method on which this decorator applied,
          // by this way the original method is called with their "this" value correctly bound to the class instance in case if it is a non-static method
          propertyDescriptor.value.apply(this, args);
        };

        // getter itself has this which bound to its given target, this === target

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

class TestClass {
  static staticMember = true;

  instanceMember: string = "hello";

  @deprecated("Use another static method")
  static deprecatedMethodStatic() {
    console.log(
      "inside deprecated static method - staticMember =",
      this.staticMember
    );
  }

  @deprecated("Use another instance method")
  deprecatedMethod() {
    console.log(
      "inside deprecated instance method - instanceMember =",
      this.instanceMember
    );
  }
}

TestClass.deprecatedMethodStatic();

const instance = new TestClass();
instance.deprecatedMethod();

// parameter decorators

// The decorator function used with parameters receives the following parameters:

// For static properties, the constructor function of the class. For all other properties, the prototype of the class.
// The name of the member.
// The index of the parameter in the method’s parameter list.

function print(target: Object, propertyKey: string, parameterIndex: number) {
  console.log(`Decorating param ${parameterIndex} from ${propertyKey}`);
}

class TestClass1 {
  testMethod(param0: any, @print param1: any) {}
}
