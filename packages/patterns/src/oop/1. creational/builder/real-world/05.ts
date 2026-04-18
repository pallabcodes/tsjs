// use: complex object construction

class Car {
  constructor(
    public engine: string,
    public wheels: string,
    public color: string,
    public seats: number
  ) {}
}

interface CarBuilder {
  setEngine(engine: string): this;
  setWheels(wheels: string): this;
  setColor(color: string): this;
  setSeats(seats: number): this;
  build(): Car;
}

class LuxuryCarBuilder implements CarBuilder {
  private engine = 'V8';
  private wheels = '18 inch Alloy';
  private color = 'Black';
  private seats = 5;

  setEngine(engine: string): this {
    this.engine = engine;
    return this;
  }

  setWheels(wheels: string): this {
    this.wheels = wheels;
    return this;
  }

  setColor(color: string): this {
    this.color = color;
    return this;
  }

  setSeats(seats: number): this {
    this.seats = seats;
    return this;
  }

  build(): Car {
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
