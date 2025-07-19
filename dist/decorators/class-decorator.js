"use strict";
// function logConstructor(constructor: Function) {
//   const ret = {
//     constructor,
//     extensible: Object.isExtensible(constructor),
//     frozen: Object.isFrozen(constructor),
//     sealed: Object.isSealed(constructor),
//     values: Object.values(constructor),
//     properties: Object.getOwnPropertyDescriptors(constructor),
//     members: {}
//   };
//   for (const key of Object.getOwnPropertyNames(constructor.prototype)) {
//     ret.members[key] = constructor.prototype[key];
//   }
//
//   console.log(`ClassDecoratorExample `, ret);
// }
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
exports.BlogRouter = exports.HomePageRouter = exports.Example = void 0;
function sealed(constructor) {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}
// @logConstructor
let ClassDecoratorExample = class ClassDecoratorExample {
    constructor(x, y) {
        console.log(`ClassDecoratorExample(${x}, ${y})`);
    }
    method() {
        console.log(`method called`);
    }
};
ClassDecoratorExample = __decorate([
    sealed,
    __metadata("design:paramtypes", [Number, Number])
], ClassDecoratorExample);
new ClassDecoratorExample(3, 4).method();
function withParam(path) {
    console.log(`outer withParam ${path}`);
    return (_target) => {
        console.log(`inner withParam ${path}`);
    };
}
let Example = class Example {
};
exports.Example = Example;
exports.Example = Example = __decorate([
    withParam('first'),
    withParam('middle'),
    withParam('last')
], Example);
const registeredClasses = [];
function Router(path, options) {
    return (constructor) => {
        registeredClasses.push({
            constructor,
            path,
            options,
        });
    };
}
let HomePageRouter = class HomePageRouter {
};
exports.HomePageRouter = HomePageRouter;
exports.HomePageRouter = HomePageRouter = __decorate([
    Router('/')
], HomePageRouter);
let BlogRouter = class BlogRouter {
};
exports.BlogRouter = BlogRouter;
exports.BlogRouter = BlogRouter = __decorate([
    Router('/blog', {
        rss: '/blog/rss.xml',
    })
], BlogRouter);
console.log(registeredClasses);
// # Modifying a class using a Class Decorator in TypeScript
//# sourceMappingURL=class-decorator.js.map