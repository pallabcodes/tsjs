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

function sealed(constructor: new (...args: any[]) => any) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}

// @logConstructor
@sealed
class ClassDecoratorExample {
  constructor(x: number, y: number) {
    console.log(`ClassDecoratorExample(${x}, ${y})`);
  }

  method() {
    console.log(`method called`);
  }
}

new ClassDecoratorExample(3, 4).method();

function withParam(path: string) {
  console.log(`outer withParam ${path}`);
  return (_target: new (...args: any[]) => any) => {
    console.log(`inner withParam ${path}`);
  };
}

@withParam('first')
@withParam('middle')
@withParam('last')
export class Example {}

const registeredClasses: unknown[] = [];

function Router(path: string, options?: object) {
  return (constructor: new (...args: any[]) => any) => {
    registeredClasses.push({
      constructor,
      path,
      options,
    });
  };
}

@Router('/')
export class HomePageRouter {
  // routing functions
}

@Router('/blog', {
  rss: '/blog/rss.xml',
})
export class BlogRouter {
  // routing functions
}

console.log(registeredClasses);

// # Modifying a class using a Class Decorator in TypeScript
