"use strict";
function LoggerMixin(Base) {
    return class extends Base {
        log(message) {
            console.log(`[LOG]: ${message}`);
        }
    };
}
// Define a vehicle mixin
function VehicleMixin(Base) {
    return class extends Base {
        drive() {
            console.log('Driving the vehicle...');
        }
    };
}
// Base class
class Base {
}
const MixedVehicle = LoggerMixin(VehicleMixin(Base));
class Car extends MixedVehicle {
    start() {
        this.log('Car is starting...');
        this.drive();
    }
}
const myCar = new Car();
myCar.start(); // Output: [LOG]: Car is starting... Driving the vehicle...
//# sourceMappingURL=mixin.js.map