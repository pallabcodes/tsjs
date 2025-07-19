"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParameterDecoratorExample = exports.FullNameMethod = exports.FullNameAccessor = exports.UserFactory = void 0;
// Class decorator
let User = class User {
};
User = __decorate([
    sealed
], User);
// The value returned from this "sealed function" will become the new constructor function for this class & so
// this is very useful to completely overwrite the constructor of this class i.e. User
function sealed(target) {
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
function decoratorA(_someBooleanFlag) {
    return (_target) => {
        // decorator implementation
    };
}
let UserFactory = class UserFactory {
};
exports.UserFactory = UserFactory;
exports.UserFactory = UserFactory = __decorate([
    decoratorA(true)
], UserFactory);
// Property decorator
// Any property decorator receives the following parameters:
// For static properties, the constructor function of the class. For all the other properties, the prototype of the class.
// The name of the member.
function printMemberName(target, memberName) {
    console.log(memberName);
    // to override property here, use Object.defineProperty along with a setter and getter
}
function allowListOnly(allowList) {
    return (target, memberName) => {
        let currentValue = Reflect.get(target, memberName);
        Object.defineProperty(target, memberName, {
            set: (newValue) => {
                if (!allowList.includes(newValue))
                    return;
                currentValue = newValue;
            },
            get: () => currentValue,
        });
    };
}
class UserWithRestrictedName {
    constructor() {
        this.name = 'John';
    }
}
__decorate([
    printMemberName,
    allowListOnly(['John', 'Jones']),
    __metadata("design:type", Object)
], UserWithRestrictedName.prototype, "name", void 0);
const user2 = new UserWithRestrictedName();
console.log(user2.name);
user2.name = 'Johnson';
console.log(user2.name);
// Accessor decorators: It receives the same properties just like property decorator along with Property descriptor of the accessor member
// Any value returned from "accessor decorator" will become the new Property descriptor for both getter & setter members
const enumerable = (value) => {
    return (target, memberName, propertyDescriptor) => {
        propertyDescriptor.enumerable = value;
    };
};
class FullNameAccessor {
    constructor() {
        this.firstName = 'Jon';
        this.lastName = 'Doe';
    }
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
exports.FullNameAccessor = FullNameAccessor;
__decorate([
    enumerable(true),
    __metadata("design:type", Object),
    __metadata("design:paramtypes", [])
], FullNameAccessor.prototype, "fullName", null);
// Method decorators: Similar to the accessor decorator
// If returned a value from the method decorator, this value will become the new Property Descriptor of the method.
const enumerableMethod = (value) => {
    return (target, memberName, propertyDescriptor) => {
        propertyDescriptor.enumerable = value;
    };
};
class FullNameMethod {
    constructor() {
        this.firstName = 'Jon';
        this.lastName = 'Doe';
    }
    getFullName() {
        return `${this.firstName} ${this.lastName}`;
    }
}
exports.FullNameMethod = FullNameMethod;
__decorate([
    enumerableMethod(true),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], FullNameMethod.prototype, "getFullName", null);
// As this method decorator returns a value, thus it'll overwrite this given member's "property descriptor"
const deprecated = (deprecationReason) => {
    return (target, memberName, propertyDescriptor) => {
        return {
            get() {
                const wrapperFn = (...args) => {
                    console.warn(`Method ${memberName} is deprecated with reason: ${deprecationReason}`);
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
    constructor() {
        this.instanceMember = 'hello';
    }
    static { this.staticMember = true; }
    static deprecatedMethodStatic() {
        console.log('inside deprecated static method - staticMember =', this.staticMember);
    }
    deprecatedMethod() {
        console.log('inside deprecated instance method - instanceMember =', this.instanceMember);
    }
}
__decorate([
    deprecated('Use another instance method'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestWithDeprecation.prototype, "deprecatedMethod", null);
__decorate([
    deprecated('Use another static method'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TestWithDeprecation, "deprecatedMethodStatic", null);
TestWithDeprecation.deprecatedMethodStatic();
const instance = new TestWithDeprecation();
instance.deprecatedMethod();
// Parameter decorators
// The decorator function used with parameters receives the following parameters:
// For static properties, the constructor function of the class. For all other properties, the prototype of the class.
// The name of the member.
// The index of the parameter in the method’s parameter list.
function print(target, propertyKey, parameterIndex) {
    console.log(`Decorating param ${parameterIndex} from ${propertyKey}`);
}
class ParameterDecoratorExample {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    testMethod(_param0, _param1) { }
}
exports.ParameterDecoratorExample = ParameterDecoratorExample;
__decorate([
    __param(1, print),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ParameterDecoratorExample.prototype, "testMethod", null);
//# sourceMappingURL=index.js.map