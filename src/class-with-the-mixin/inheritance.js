function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

// Testing iteration on various objects
console.log(isIterable({})); // false, plain object is not iterable by default
console.log(isIterable([])); // true, arrays are iterable
console.log(isIterable('string')); // true, strings are iterable

// Creating a class `Game` with iterable functionality
class Game {
  // Define the [Symbol.iterator] method to make this class iterable
  [Symbol.iterator]() {
    const players = ['Player1', 'Player2']; // Use `const` because `players` is not reassigned
    let index = 0;
    return {
      next: () => {
        if (index < players.length) {
          return { value: players[index++], done: false };
        } else {
          return { value: '', done: true }; // Ensure value is a string (empty string) when done
        }
      },
    };
  }
}

// Accessing Game prototype
console.log(Game.prototype); // { constructor: [Function: Game] } and other inherited methods

// Accessing the constructor of the class Game
console.log(Game.prototype.constructor); // [Function: Game]

// Checking prototype chain to confirm inheritance
console.log(Object.getPrototypeOf(Game.prototype) === Object.prototype); // true

// Check two levels up the prototype chain to Object's parent (should be null)
console.log(
  Object.getPrototypeOf(Object.getPrototypeOf(Game.prototype)) === null
); // true, since Object.prototype's prototype is null

// Instantiating the Game class
const gameInstance = new Game(); // Instantiates a Game class object

// Logging out the instance to show the constructor
console.log(gameInstance.constructor); // Game

// Checking iteration on Game instance (Game is iterable by default now)
console.log(isIterable(gameInstance)); // true, Game is iterable now

// Iterating over the Game instance using for..of
for (const player of gameInstance) {
  console.log(player); // Logs: Player1, Player2
}
