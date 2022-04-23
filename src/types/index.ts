interface Starship {
  name: string;
  enableHyperJump?: boolean;
}

const updateStarship = (id: number, starship: Starship) => {};
updateStarship(1, { name: "Explorer", enableHyperJump: true });

const startShips: Record<string, Starship> = {
  Explorer1: { name: "Explorer1", enableHyperJump: true },
  Explorer2: { name: "Explorer2", enableHyperJump: false },
};

type StarshipNameOnly = Pick<Starship, "name">;
type StarshipWithoutName = Omit<Starship, "name">;

type AvailableDrinks = "coffee" | "tea" | "orange juice" | "lemonade";
let johnsDrink: AvailableDrinks = "coffee";
type DrinksJaneDislikeIs = "tea" | "orange juice";
type DrinksJaneLikes = "coffee" | "lemonade" | "mohito" | "fruits";

// let janesDrink: Exclude<AvailableDrinks, "tea" | "orange juice"> = "lemonade";
let janesDrink: Exclude<AvailableDrinks, DrinksJaneDislikeIs> = "lemonade";
// let janesDrink_: Extract<AvailableDrinks, DrinksJaneLikes> = "mohito"; // wrong
let janesDrink_: Extract<AvailableDrinks, DrinksJaneLikes> = "coffee"; // wrong

interface StartShipProperties {
  color?: "blue" | "green" | "red" | "magenta";
}

function paintStarship(
  id: number,
  color: NonNullable<StartShipProperties["color"]>
) {
  return { id, color };
}

type PaintStarshipReturn = ReturnType<typeof paintStarship>;

// paintStarship(1, undefined);
paintStarship(1, "magenta");

type Constructable<ClassInstance> = new (...args: any[]) => ClassInstance;

function Deletable<BaseClass extends Constructable<{}>>(Base: BaseClass) {
  // this is the mixin :: class transformation
  return class extends Base {
    deleted!: boolean;
    delete() {}
  };
}
class Vehicle {
  constructor(public name: string) {}
}

class User {
  constructor(public name: string) {}
}

/* whichever class given as argument will be extended from type Constructable; then Deletable function return a new brand new class  by extedning this class */
const DeletableVehicle = Deletable(Vehicle);
const DeletableUser = Deletable(User);

type DeletableVehicleInstance = InstanceType<typeof DeletableVehicle>;
type DeletableUserInstance = InstanceType<typeof DeletableUser>;

class Profile {
  vehicle!: DeletableVehicleInstance;
  user!: DeletableUserInstance;
}

const profile = new Profile();
profile.user = new DeletableUser("john");
profile.vehicle = new DeletableVehicle("toyota");

interface MyObject {
  sayHello(): void;
}

interface MyObjectThis {
  helloWorld(): string;
}

const myObject: MyObject & ThisType<MyObjectThis> = {
  sayHello() {
    return this.helloWorld();
  },
};

myObject.sayHello = myObject.sayHello.bind({
  helloWorld() {
    return `Hello World`;
  },
});

console.log(myObject.sayHello());

type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of this within methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods = desc.methods || {};
  // to force type/shape on this object {...data, ...methods} used as D & M
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      // here, this will refer to D/data's values and M/methods value
      this.x += dx;
      this.y += dy;
    },
  },
});

obj.x = 10;
obj.y = 11;
obj.moveBy(4, 4);
