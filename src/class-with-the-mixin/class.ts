class Visibility {
  private static digit: number = 0;
  private visible: boolean = true;

  constructor() {
    Visibility.digit++;
  }

  setVisible(visible: boolean): void {
    this.visible = visible;
  }

  public static getDigit() {
    return Visibility.digit;
  }
}

class MockVisibility extends Visibility {
  override setVisible(visible: boolean): void {
    console.log(visible ? "show" : "hide");
  }
}

// for app
const real = new Visibility();
real.setVisible(true);
real.setVisible(false);

// for test
const mock = new MockVisibility();

mock.setVisible(true);
mock.setVisible(false);

// constructor overloading
interface IBox {
  x: number;
  y: number;
  height: number;
  width: number;
}

class BoxExample {
  public x: number;
  public y: number;
  public height: number;
  public width: number;

  constructor();
  constructor(obj: IBox);

  // the final implementation must have a signature that's completable with all overloads
  constructor(obj?: IBox) {
    this.x = obj?.x ?? 0
    this.y = obj?.y ?? 0
    this.height = obj?.height ?? 0
    this.width = obj?.width ?? 0;
  }
}

class BoxExample2 {
  public x!: number;
  public y!: number;
  public height!: number;
  public width!: number;

  constructor(b: Partial<IBox> = {}) {
    Object.assign(this, b);
  }
}

// now with partial every property are optional thus
// Example use
const a = new BoxExample2();
const b = new BoxExample2({x: 10, height: 99});
// const c = new BoxExample2({foo: 10});


// overriding constructor with mixin
interface ConstructorFoo {
  bar: string,
}

class Foo {
  public bar: string
  constructor({ bar }: ConstructorFoo) {
    this.bar = bar
  }
}

// The goal of QuxMixin is to create both a FooQux class as well as a FooBarBaz class
interface ConstructorBar extends ConstructorFoo {
  baz: string,
}

class FooBar extends Foo {
  public baz: string
  constructor (args: ConstructorBar) {
    super(args)
    const { baz } = args
    this.baz = baz
  }
  static baz = 3
}

/** A constructor that constructs a T using the arguments A */
type Constructor<T = any, A extends any[] = any[]> = new (...args: A) => T
/** Exclude the first element of an array */
type Tail<T extends any[]> = T extends [any, ...infer U] ? U : never

interface Qux {
  qux: string
}

/** Add the Qux type to the first item in an array */
type AddQux<T extends any[]> = T extends [] ? [Qux] : [T[0] & Qux, ...Tail<T>]

// quxMixin accepts a constructor base and returns another constructor
const quxMixin = <T extends Constructor>(base: T): Constructor<
  // that constructs the original class with the qux property
  InstanceType<T> & Qux,
  // using the same arguments as the original constructor except that the first
  // parameter includes the qux property
  AddQux<ConstructorParameters<T>>
> => {
  return class Baz extends base {
    public qux: string
    constructor (...args: any[]) {
      super(...args)
      const { qux } = args[0] as Qux
      this.qux = qux
    }
  }
}

const FooBaz = quxMixin(Foo)

const q = new FooBaz({ bar: '1', qux: '2' })
q.qux // string
console.log(q)

const FooBarBaz = quxMixin(FooBar)
const fbb = new FooBarBaz({ bar: 'a', baz: 'a', qux: 'a' })
console.log(fbb)



class DateHour {
  private date!: Date;
  private relativeHour!: number;

  constructor(year: number, month: number, day: number, relativeHour: number);
  constructor(date: Date, relativeHour: number);
  constructor(dateOrYear: any, monthOrRelativeHour: number, day?: number, relativeHour?: number) {
    if (typeof dateOrYear === "number") {
      this.date = new Date(dateOrYear, monthOrRelativeHour, day);
      if(relativeHour) {
      this.relativeHour = relativeHour;
      }
    } else {
      let date = <Date>dateOrYear;
      this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      this.relativeHour = monthOrRelativeHour;
    }
  }
}