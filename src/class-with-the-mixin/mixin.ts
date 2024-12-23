export type ClassType<T = any> = new (...args: any[]) => T;

interface Disposable {
  isDisposed: boolean;
  dispose(): void;
}

interface Activatable {
  isActive: boolean;
  activate(): void;
  deactivate(): void;
}

// Mixin for Disposable functionality
export function DisposableMixin<Base extends ClassType>(Base: Base) {
  return class extends Base implements Disposable {
    isDisposed = false;

    dispose() {
      this.isDisposed = true;
    }
  };
}

// Mixin for Activatable functionality
export function ActivatableMixin<Base extends ClassType>(Base: Base) {
  return class extends Base implements Activatable {
    isActive = false;

    activate() {
      this.isActive = true;
    }

    deactivate() {
      this.isActive = false;
    }
  };
}

interface Movies {
  cast: string[]; // Type-safe array of strings
  destination: 'Hollywood';
}

export const movies: Movies = {
  cast: ['Actor 1', 'Actor 2'],
  destination: 'Hollywood',
};

// Fixing unsafe casting with `unknown`
const accountcode = '12';

// Safely converting the string to a number using parseInt
export const usecode: number = parseInt(accountcode, 10); // Safer conversion

// Type Assertion for DOM elements - Handling null check
const selectButtonElementById1 = document.getElementById(
  'main_button'
) as HTMLButtonElement | null;
if (selectButtonElementById1) {
  // Safe to access as a HTMLButtonElement
  selectButtonElementById1.addEventListener('click', () =>
    console.log('Button clicked')
  );
}

// Another way to assert the type with proper null check
const selectButtonElementById2 = document.getElementById('main_button');
if (selectButtonElementById2 instanceof HTMLButtonElement) {
  // Now TypeScript knows it's an HTMLButtonElement
  selectButtonElementById2.addEventListener('click', () =>
    console.log('Button clicked')
  );
} else {
  console.error('Button element not found or not of type HTMLButtonElement');
}
