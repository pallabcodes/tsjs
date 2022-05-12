// Mixin/Transformable class::

export type ClassType = new (...args: any[]) => any | {};

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

