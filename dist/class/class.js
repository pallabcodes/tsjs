"use strict";
class Visibility {
    static { this.digit = 0; }
    constructor() {
        this.visible = true;
        Visibility.digit++;
    }
    setVisible(visible) {
        this.visible = visible;
    }
    static getDigit() {
        return Visibility.digit;
    }
}
class MockVisibility extends Visibility {
    setVisible(visible) {
        console.log(visible ? 'show' : 'hide');
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
class BoxExample {
    // the final implementation must have a signature that's completable with all overloads
    constructor(obj) {
        this.x = obj?.x ?? 0;
        this.y = obj?.y ?? 0;
        this.height = obj?.height ?? 0;
        this.width = obj?.width ?? 0;
    }
}
class BoxExample2 {
    constructor(b = {}) {
        Object.assign(this, b);
    }
}
// now with partial every property are optional thus
// Example use
const a = new BoxExample2();
const b = new BoxExample2({ x: 10, height: 99 });
class Foo {
    constructor({ bar }) {
        this.bar = bar;
    }
}
class FooBar extends Foo {
    constructor(args) {
        super(args);
        const { baz } = args;
        this.baz = baz;
    }
    static { this.baz = 3; }
}
// quxMixin accepts a constructor base and returns another constructor
const quxMixin = (base) => {
    return class Baz extends base {
        constructor(...args) {
            super(...args);
            const { qux } = args[0];
            this.qux = qux;
        }
    };
};
const FooBaz = quxMixin(Foo);
const q = new FooBaz({ bar: '1', qux: '2' });
q.qux; // string
console.log(q);
const FooBarBaz = quxMixin(FooBar);
const fbb = new FooBarBaz({ bar: 'a', baz: 'a', qux: 'a' });
console.log(fbb);
class DateHour {
    constructor(dateOrYear, monthOrRelativeHour, day, relativeHour) {
        if (typeof dateOrYear === 'number') {
            this.date = new Date(dateOrYear, monthOrRelativeHour, day);
            if (relativeHour) {
                this.relativeHour = relativeHour;
            }
        }
        else {
            const date = dateOrYear;
            this.date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            this.relativeHour = monthOrRelativeHour;
        }
    }
}
//# sourceMappingURL=class.js.map