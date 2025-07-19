"use strict";
// use: Car rental
class RentalCar {
    constructor(make, model, color, rentPricePerDay) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.rentPricePerDay = rentPricePerDay;
    }
}
class RentalCarBuilderImpl {
    constructor() {
        this.make = 'Toyota';
        this.model = 'Camry';
        this.color = 'White';
        this.rentPricePerDay = 50;
    }
    setMake(make) {
        this.make = make;
        return this;
    }
    setModel(model) {
        this.model = model;
        return this;
    }
    setColor(color) {
        this.color = color;
        return this;
    }
    setRentPricePerDay(price) {
        this.rentPricePerDay = price;
        return this;
    }
    build() {
        return new RentalCar(this.make, this.model, this.color, this.rentPricePerDay);
    }
}
// Usage
const rentalCar = new RentalCarBuilderImpl()
    .setMake('Honda')
    .setModel('Civic')
    .setColor('Black')
    .setRentPricePerDay(40)
    .build();
console.log(rentalCar);
//# sourceMappingURL=17.js.map