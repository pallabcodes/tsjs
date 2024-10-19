// Define a logging mixin
type Constructor<T = {}> = new (...args: any[]) => T;

function LoggerMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    log(message: string) {
      console.log(`[LOG]: ${message}`);
    }
  };
}

// Define a vehicle mixin
function VehicleMixin<T extends Constructor>(Base: T) {
  return class extends Base {
    drive() {
      console.log('Driving the vehicle...');
    }
  };
}

// Base class
class Base {}

const MixedVehicle = LoggerMixin(VehicleMixin(Base));

class Car extends MixedVehicle {
  start() {
    this.log('Car is starting...');
    this.drive();
  }
}

const myCar = new Car();
myCar.start(); // Output: [LOG]: Car is starting... Driving the vehicle...
