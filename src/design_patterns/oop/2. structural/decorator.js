// class Beverage {
//   constructor() {
//     if (new.target === Beverage) {
//       throw new TypeError('Cannot construct Beverage instances directly');
//     }
//   }

//   cost() {
//     throw new Error('This method should be overwritten!');
//   }

//   description() {
//     throw new Error('This method should be overwritten!');
//   }
// }

// class DarkRoast extends Beverage {
//   cost() {
//     return 3.45;
//   }

//   description() {
//     return 'Dark Roast';
//   }
// }

// class LightRoast extends Beverage {
//   cost() {
//     return 3.45;
//   }

//   description() {
//     return 'Light Roast';
//   }
// }

// class BeverageDecorator extends Beverage {
//   constructor(beverage) {
//     super();
//     this.beverage = beverage;
//   }
// }

// class EspressoDecorator extends BeverageDecorator {
//   constructor(beverage) {
//     super(beverage); // Call the parent constructor with the beverage argument
//   }

//   cost() {
//     return 0.5 + this.beverage.cost();
//   }

//   description() {
//     return this.beverage.description() + ', Espresso';
//   }
// }

// class CreamDecorator extends BeverageDecorator {
//   constructor(beverage) {
//     super(beverage);
//   }

//   cost() {
//     return 0.3 + this.beverage.cost();
//   }

//   description() {
//     return this.beverage.description() + ', Cream';
//   }
// }

// class FoamDecorator extends BeverageDecorator {
//   constructor(beverage) {
//     super(beverage);
//   }

//   cost() {
//     return 0.2 + this.beverage.cost();
//   }

//   description() {
//     return this.beverage.description() + ', Foam';
//   }
// }

// // Client Code
// let beverage = new FoamDecorator(
//   new CreamDecorator(new EspressoDecorator(new LightRoast()))
// );

// console.log(beverage.description()); // Output: Light Roast, Espresso, Cream, Foam
// console.log(beverage.cost()); // Output: 4.45
