// noinspection BadExpressionStatementJS

// check whether an object is iterable or not

// any js object is non-iterable by default, but it could be made to iterable with [Symbol.iterator] manually

// Symbol.iterator in Object(Game); // false
// Symbol.iterator in Object({}); // false

class Game {}
// function Game() {}

// const Players = Game;

// every class has a default constructor & that's available within its prototype
Game.prototype; // {constructor: f} & rest properties and methods that's shown Game.prototype are inherited

// however, this access the class itself i.e. Game so new Game.prototype.constructor() / new Game()
Game.prototype.constructor; // Game

// to access Game's parent or go back one level by prototype chain use "__proto__"
// @ts-ignore
Game.prototype.__proto__ === Object.prototype;

// to access Games's parent's parent

// @ts-ignore
Game.prototype.__proto__.__proto__ == null; // as Object.prototype.__proto__ = null

// instating the Game class
new Game(); // same as new Game() / new Game.prototype.constructor(): for both "new" keyword required
