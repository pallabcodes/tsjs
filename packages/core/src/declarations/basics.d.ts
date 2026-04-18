declare namespace mylib {
  function makeGreeting(s: string): string;
  let numberOfGreetings: number;
}

/* namespace usage

let result = mylib.makeGreeting("hello, typescript");
console.log("The computed greeting is " + result);

let count = myLib.numberOfGreetings

*/

declare function getWidget(n: number): string;
declare function getWidget(s: string): string[];

interface GreetingSettings {
  greeting: string;
  duration?: number;
  color?: string;
}

declare function greet(setting: GreetingSettings): void; // usage: greet({greeting: "Hello, TypeScript"})

// class MyGreeter extends Greeter {}

type GreetingLike = string | (() => string);

declare function greet(g: GreetingLike): void;

// # using namespace to organize types

declare namespace GreetingLab {
  interface LogOptions {
    verbose?: boolean;
  }
  interface AlertOptions {
    modal: boolean;
    title?: string;
    color?: string;
  }
}

declare namespace GreetingLib.Options {
  // Refer to via GreetingLib.Options.Log
  interface Log {
    verbose?: boolean;
  }
  interface Alert {
    modal: boolean;
    title?: string;
    color?: string;
  }
}

declare class Greeter {
  constructor(greeting: string);

  greeting: string;
  showGreeting(): void;
}

//  class SocialGreeter extends Greeter {
//     constructor() {
//         super("social greeting")
//     }
// }

declare var foo: number; // so here just declare a variable foo within global whose type is number
// so it's accessible just any other var variable (here globalThis.foo, window.foo)

declare function greeting(greeting: string): void;
