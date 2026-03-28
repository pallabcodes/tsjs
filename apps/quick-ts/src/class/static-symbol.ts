export class Symbolic {
  static staticMethod() { return 'I am static!'; }
  static [Symbol.hasInstance](instance: any) {
    return !!instance && instance.isSymbolic === true;
  }
  isSymbolic = true;
}

// Usage
console.log(Symbolic.staticMethod());
const s = new Symbolic();
console.log(s instanceof Symbolic); // true