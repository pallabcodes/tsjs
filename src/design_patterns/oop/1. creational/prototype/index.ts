// Scenario: Game Development

// Imagine you're developing a game where you need to spawn multiple enemies of the same type but with slight variations (e.g., health, speed). Instead of creating each enemy from scratch, you could use a prototype pattern.

// Enemy interface defines a contract for game enemies
interface Enemy {
  clone(): Enemy; // Method to clone the enemy
  attack(): void; // Method for the enemy to perform an attack
}

// Concrete implementation of a Zombie enemy
class Zombie implements Enemy {
  // constructor (private health: number, private speed: number) {}
  constructor(public health: number, public speed: number) {}

  clone(): Enemy {
    // Return a new Zombie instance with the same attributes
    return new Zombie(this.health, this.speed);
  }

  attack(): void {
    console.log(
      `Zombie attacks with health: ${this.health} and speed: ${this.speed}`
    );
  }
}

// EnemyFactory to manage enemy prototypes
class EnemyFactory {
  private enemyPrototype: Enemy;

  constructor() {
    // Initialize a prototype enemy
    this.enemyPrototype = new Zombie(100, 2); // Default attributes
  }

  // Create an enemy clone with modified attributes
  public createZombie(speed?: number): Enemy {
    const zombie = this.enemyPrototype.clone(); // Clone the prototype
    if (speed) {
      // Modify the cloned zombie's speed if provided
      (zombie as Zombie).speed = speed;
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
