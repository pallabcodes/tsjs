// # 1. Complex Object Construction (Nested Builders)

// Imagine a Vehicle Configuration Builder for a car dealership. The builder constructs complex objects like a car, which has multiple parts (engine, wheels, seats, etc.). Each part might have its own builder.


// Define parts of the vehicle
class Engine {
  constructor(public model: string, public horsepower: number) {}
}

class Wheels {
  constructor(public size: number, public type: string) {}
}

class Seats {
  constructor(public material: string, public count: number) {}
}

// Vehicle class with parts
class Vehicle {
  constructor(
    public engine: Engine,
    public wheels: Wheels,
    public seats: Seats
  ) {}
}

// Define the VehicleBuilder interface
interface VehicleBuilder {
  setEngine(model: string, horsepower: number): this;
  setWheels(size: number, type: string): this;
  setSeats(material: string, count: number): this;
  build(): Vehicle;
}

// Concrete VehicleBuilder
class CarBuilder implements VehicleBuilder {
  private engine!: Engine;
  private wheels!: Wheels;
  private seats!: Seats;

  setEngine(model: string, horsepower: number): this {
    this.engine = new Engine(model, horsepower);
    return this;
  }

  setWheels(size: number, type: string): this {
    this.wheels = new Wheels(size, type);
    return this;
  }

  setSeats(material: string, count: number): this {
    this.seats = new Seats(material, count);
    return this;
  }

  build(): Vehicle {
    return new Vehicle(this.engine, this.wheels, this.seats);
  }
}

// Director to construct the vehicle
class VehicleDirector {
  constructLuxuryCar(builder: VehicleBuilder): Vehicle {
    return builder
      .setEngine('V8', 500)
      .setWheels(20, 'Alloy')
      .setSeats('Leather', 5)
      .build();
  }

  constructSportsCar(builder: VehicleBuilder): Vehicle {
    return builder
      .setEngine('V12', 800)
      .setWheels(19, 'Sport')
      .setSeats('Fabric', 2)
      .build();
  }
}

// Usage Example
const director = new VehicleDirector();
const luxuryCar = director.constructLuxuryCar(new CarBuilder());
const sportsCar = director.constructSportsCar(new CarBuilder());

console.log(luxuryCar);
console.log(sportsCar);


// What's Improved:
// 1. Nested Object Construction: The car consists of parts (engine, wheels, seats), and each part is created using its own builder.
// 2. More Realistic Construction Flow: The builder pattern is used for building a complex object step by step. Different configurations are handled via the VehicleDirector, which can direct the creation of different types of cars.
// 3. More Flexibility and Scalability: You can easily extend this by adding more parts to the vehicle (e.g., transmission, GPS, audio system).