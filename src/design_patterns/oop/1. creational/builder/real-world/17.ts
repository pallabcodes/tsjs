// use: Car rental

class RentalCar {
    constructor(
        public make: string,
        public model: string,
        public color: string,
        public rentPricePerDay: number
    ) {}
}

interface RentalCarBuilder {
    setMake(make: string): this;
    setModel(model: string): this;
    setColor(color: string): this;
    setRentPricePerDay(price: number): this;
    build(): RentalCar;
}

class RentalCarBuilderImpl implements RentalCarBuilder {
    private make: string = "Toyota";
    private model: string = "Camry";
    private color: string = "White";
    private rentPricePerDay: number = 50;

    setMake(make: string): this {
        this.make = make;
        return this;
    }
    setModel(model: string): this {
        this.model = model;
        return this;
    }
    setColor(color: string): this {
        this.color = color;
        return this;
    }
    setRentPricePerDay(price: number): this {
        this.rentPricePerDay = price;
        return this;
    }
    build(): RentalCar {
        return new RentalCar(this.make, this.model, this.color, this.rentPricePerDay);
    }
}

// Usage
const rentalCar = new RentalCarBuilderImpl()
    .setMake("Honda")
    .setModel("Civic")
    .setColor("Black")
    .setRentPricePerDay(40)
    .build();

console.log(rentalCar);
