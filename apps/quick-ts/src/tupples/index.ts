// Tuple is type of array that knows how many it will have & what their type should be

type Pair = [string, number];

function doSomething (pair: Pair) {
  console.log(pair["0"], pair["1"]);
}

type Eiter2dOr3d = [number, number, number];
function getLatLong(coordinates: Eiter2dOr3d) {
  const [x, y, z] = coordinates;
}

// readonly tuples
type StringNumberBooleans = [string, number, ...boolean[]]; // string, number, then n no. of booleans
type StringBooleansNumber = [string, ...boolean[], number];
type BooleansStringNumber = [...boolean[], string, number];

function readonlyTuple(pair: readonly [string, number]) {}

// this will be referred as a tuple
let point  = [1, 2] as const;