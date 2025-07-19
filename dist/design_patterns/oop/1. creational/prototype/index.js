"use strict";
// Scenario: Game Development
// Concrete implementation of a Zombie enemy
class Zombie {
    // constructor (private health: number, private speed: number) {}
    constructor(health, speed) {
        this.health = health;
        this.speed = speed;
    }
    clone() {
        // Return a new Zombie instance with the same attributes
        return new Zombie(this.health, this.speed);
    }
    attack() {
        console.log(`Zombie attacks with health: ${this.health} and speed: ${this.speed}`);
    }
}
// EnemyFactory to manage enemy prototypes
class EnemyFactory {
    constructor() {
        // Initialize a prototype enemy
        this.enemyPrototype = new Zombie(100, 2); // Default attributes
    }
    // Create an enemy clone with modified attributes
    createZombie(speed) {
        const zombie = this.enemyPrototype.clone(); // Clone the prototype
        if (speed) {
            // Modify the cloned zombie's speed if provided
            zombie.speed = speed;
        }
        return zombie;
    }
}
// Usage example
const enemyFactory = new EnemyFactory();
// Create a zombie with default attributes
const defaultZombie = enemyFactory.createZombie();
defaultZombie.attack(); // Output: Zombie attacks with health: 100 and speed: 2
// Create a faster zombie
const fastZombie = enemyFactory.createZombie(5);
fastZombie.attack(); // Output: Zombie attacks with health: 100 and speed: 5
//# sourceMappingURL=index.js.map