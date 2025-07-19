"use strict";
// use: complex object construction
class Car {
    constructor(engine, wheels, color, seats) {
        this.engine = engine;
        this.wheels = wheels;
        this.color = color;
        this.seats = seats;
    }
}
class LuxuryCarBuilder {
    constructor() {
        this.engine = 'V8';
        this.wheels = '18 inch Alloy';
        this.color = 'Black';
        this.seats = 5;
    }
    setEngine(engine) {
        this.engine = engine;
        return this;
    }
    setWheels(wheels) {
        this.wheels = wheels;
        return this;
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setSeats(seats) {
        this.seats = seats;
        return this;
    }
    build() {
        return new Car(this.engine, this.wheels, this.color, this.seats);
    }
}
// Usage
const luxuryCar = new LuxuryCarBuilder()
    .setEngine('V12')
    .setWheels('20 inch Alloy')
    .setColor('Silver')
    .setSeats(4)
    .build();
console.log(luxuryCar);
//# sourceMappingURL=05.js.map