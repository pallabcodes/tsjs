// Mixin/Transformable class::


export type ClassType = new (...args: any[]) =>  {};

export function DisposableMixin<Base extends ClassType>(base: Base) {
  // return a new class than extends base
  // basically make a new class based on given class to this function's argument
  return class extends base {
    isDisposed: boolean = false;
    dispose() {
      this.isDisposed = true;
    }
  };
}

export function ActivatableMixin<Base extends ClassType>(base: Base) {
  return class extends base {
    isActive: boolean = false;
    activate() {
      this.isActive = true;
    }
    deactivate() {
      this.isActive = false;
    }
  };
}

interface Movies {
  cast: Array<string>;
  destination: "Hollywood";
}
const movies = <Movies>{};

// Explanation: Not allowed to cast from a custom to a primitive without erasing the type first. unknown erases the type checking
let accountcode = "12";
let usecode = accountcode as unknown as number;

// Type Assertion
const selectButtonElementById1 = document.getElementById(
  "main_button"
) as HTMLButtonElement;
const selectButtonElementById2 = <HTMLButtonElement>(
  document.getElementById("main_button")
);
