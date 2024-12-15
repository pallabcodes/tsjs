// ==========================
// Prototype Interface
// ==========================

// Step 1: Define the Prototype Interface
// This interface will enforce that every object can be cloned, ensuring a uniform method for duplication.

interface GameObject {
  clone(): GameObject;
  getDetails(): string;
}

// Step 2: Define Concrete Prototypes

// define Character, Enemy, and Weapon as concrete prototypes that implement the GameObject interface.

// ==========================
// Concrete Prototypes
// ==========================
class Character implements GameObject {
  constructor(
    public name: string,
    public health: number,
    public attack: number,
    public speed: number
  ) {}

  clone(): GameObject {
    return new Character(this.name, this.health, this.attack, this.speed);
  }

  getDetails(): string {
    return `${this.name}: Health=${this.health}, Attack=${this.attack}, Speed=${this.speed}`;
  }
}

class Enemy implements GameObject {
  constructor(
    public type: string,
    public health: number,
    public attack: number,
    public armor: number
  ) {}

  clone(): GameObject {
    return new Enemy(this.type, this.health, this.attack, this.armor);
  }

  getDetails(): string {
    return `${this.type} Enemy: Health=${this.health}, Attack=${this.attack}, Armor=${this.armor}`;
  }
}

class Weapon implements GameObject {
  constructor(
    public name: string,
    public damage: number,
    public range: number
  ) {}

  clone(): GameObject {
    return new Weapon(this.name, this.damage, this.range);
  }

  getDetails(): string {
    return `${this.name}: Damage=${this.damage}, Range=${this.range}`;
  }
}

// Character has attributes like name, health, attack, and speed.

// Enemy has attributes like type, health, attack, and armor.
// Weapon has attributes like name, damage, and range.
// Each class implements the clone method to create a new instance of itself, duplicating the values of the current object.

// Step 3: The Prototype Manager (Optional)
// In more 04 advanced-generics cases, you might want a manager to hold and return prototypes. This is useful when you have a large number of objects and want to centralize their creation and cloning.

class PrototypeManager {
  private prototypes: { [key: string]: GameObject } = {};

  registerPrototype(name: string, prototype: GameObject): void {
    this.prototypes[name] = prototype;
  }

  clonePrototype(name: string): GameObject {
    const prototype = this.prototypes[name];
    if (!prototype) {
      throw new Error(`Prototype ${name} not found`);
    }
    return prototype.clone();
  }
}

// Here, the PrototypeManager helps to centralize the registration and cloning process, ensuring that any object in the system can be cloned with a single call.

// Step 4: Usage Example

// ==========================
// Usage Example
// ==========================
const characterPrototype = new Character('Warrior', 100, 25, 10);
const enemyPrototype = new Enemy('Goblin', 50, 10, 5);
const weaponPrototype = new Weapon('Sword', 15, 5);

// Register prototypes in the Prototype Manager
const prototypeManager = new PrototypeManager();

prototypeManager.registerPrototype('warrior', characterPrototype);
prototypeManager.registerPrototype('goblin', enemyPrototype);
prototypeManager.registerPrototype('sword', weaponPrototype);

// Clone and customize the game objects
const clonedWarrior = prototypeManager.clonePrototype('warrior') as Character;
clonedWarrior.attack = 30; // Modifying the clone's attributes

const clonedGoblin = prototypeManager.clonePrototype('goblin') as Enemy;
clonedGoblin.health = 60; // Customizing the clone's attributes

const clonedSword = prototypeManager.clonePrototype('sword') as Weapon;
clonedSword.damage = 20; // Modifying weapon damage

// Display the cloned objects
console.log(clonedWarrior.getDetails()); // Warrior: Health=100, Attack=30, Speed=10
console.log(clonedGoblin.getDetails()); // Goblin Enemy: Health=60, Attack=10, Armor=5
console.log(clonedSword.getDetails()); // Sword: Damage=20, Range=5

/*

Key Points of This Prototype Pattern Example:
# Complex Objects with Nested or Interdependent Properties:

Objects like Character, Enemy, and Weapon may contain nested properties. The cloning process ensures that these properties are duplicated with their exact values.

# Immutability / Multiple Stages of Construction:

The prototypes themselves are immutable, but you can modify the clones after they are created. This ensures that the prototype object remains unchanged, and any new clone can be customized.

# Fluent Interface:

In this scenario, we do not directly have a fluent interface, but the Prototype Manager allows easy cloning of objects with simple method calls (clonePrototype).

# Contextual Creation / Performance Optimization:

The prototype pattern allows you to avoid the overhead of re-creating objects from scratch. Instead, you clone existing ones, which can be particularly useful in performance-sensitive applications (like games) where object creation can be resource-intensive.

Does This Example Cover Everything for Real-World Product-Based Scenarios?
Yes, this example covers the core principles of the Prototype Pattern effectively for most product-based scenarios. Let's analyze it:

# Deeply Nested or Interdependent Properties:

The objects (Character, Enemy, Weapon) have attributes that can be deeply nested (like health, armor, attack, etc.) and interdependent. This is a real-world scenario where objects need to be cloned, and some properties may be modified in the clone.

# Object Cloning and Customization:

After cloning the prototype, we customize the clone’s properties (e.g., modifying the attack value of the warrior). This mirrors real-world scenarios where clones are adjusted for different contexts (e.g., different game levels, different characters with slight variations).

# Performance Optimization:

By cloning an object instead of re-creating it from scratch, we optimize performance. This is common in games or any system where object creation is costly (e.g., rendering complex UI components in a large-scale application).
Contextual Creation:

The prototype pattern allows for contextual creation. For example, the Weapon prototype can be cloned and customized for different players, and the Enemy prototype can be used for various levels or game stages with minor adjustments.
Real-World Applicability:

This pattern is widely applicable in games, UI components, data structures (where objects have many similar properties), and configurations (where settings may be cloned and adjusted).

# Conclusion:

This example demonstrates the full power of the Prototype Pattern in the context of real-world product development (like games, software configuration, etc.). It highlights:

# Cloning complex objects.
# Modifying clones for specific use cases.
# Centralized management of prototypes for scalability.

This example can be extended to handle more sophisticated scenarios in product-based systems. For example, you could integrate it into a UI component library, where components are prototypes and users can clone and customize components for their needs, or in configuration management where system settings are cloned and applied in different environments.

Overall, the example adequately covers the full potential of the Prototype Pattern in real-world, product-based applications.

*/
