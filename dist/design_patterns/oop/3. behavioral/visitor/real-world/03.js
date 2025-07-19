"use strict";
// ### Real-World Example: Visitor Pattern in a Gaming Engine
// In this example, we will implement a **Visitor Pattern** to manage operations in a gaming engine. The operations will include applying **power-ups**, calculating **damage**, and managing **score updates** for various character types (e.g., **Warrior**, **Mage**, and **Archer**).
//
// #### 1. **Object Structure**: Characters as Visitable Elements
//
// Each character implements the `Visitable` interface and provides attributes for specific operations.
class Warrior {
    constructor(health, strength) {
        this.health = health;
        this.strength = strength;
    }
    accept(visitor) {
        visitor.visitWarrior(this);
    }
}
class Mage {
    constructor(health, mana) {
        this.health = health;
        this.mana = mana;
    }
    accept(visitor) {
        visitor.visitMage(this);
    }
}
class Archer {
    constructor(health, agility) {
        this.health = health;
        this.agility = agility;
    }
    accept(visitor) {
        visitor.visitArcher(this);
    }
}
// Concrete Visitor: Power-Up Application
class PowerUpVisitor {
    visitWarrior(warrior) {
        warrior.strength += 10;
        console.log(`Warrior power-up: Strength increased to ${warrior.strength}`);
    }
    visitMage(mage) {
        mage.mana += 20;
        console.log(`Mage power-up: Mana increased to ${mage.mana}`);
    }
    visitArcher(archer) {
        archer.agility += 15;
        console.log(`Archer power-up: Agility increased to ${archer.agility}`);
    }
}
// Concrete Visitor: Damage Calculation
class DamageVisitor {
    visitWarrior(warrior) {
        warrior.health -= 15;
        console.log(`Warrior damaged: Health reduced to ${warrior.health}`);
    }
    visitMage(mage) {
        mage.health -= 20;
        console.log(`Mage damaged: Health reduced to ${mage.health}`);
    }
    visitArcher(archer) {
        archer.health -= 10;
        console.log(`Archer damaged: Health reduced to ${archer.health}`);
    }
}
// Concrete Visitor: Score Update
class ScoreVisitor {
    visitWarrior(warrior) {
        console.log(`Warrior: Score updated based on strength ${warrior.strength}`);
    }
    visitMage(mage) {
        console.log(`Mage: Score updated based on mana ${mage.mana}`);
    }
    visitArcher(archer) {
        console.log(`Archer: Score updated based on agility ${archer.agility}`);
    }
}
// #### 3. **Client Code**
// Create a collection of characters and apply visitors dynamically.
// Create a team of characters
const characters = [
    new Warrior(100, 50),
    new Mage(80, 100),
    new Archer(90, 70),
];
// Apply Power-Ups
console.log('Applying Power-Ups:');
const powerUpVisitor = new PowerUpVisitor();
characters.forEach(character => character.accept(powerUpVisitor));
// Calculate Damage
console.log('\nCalculating Damage:');
const damageVisitor = new DamageVisitor();
characters.forEach(character => character.accept(damageVisitor));
// Update Scores
console.log('\nUpdating Scores:');
const scoreVisitor = new ScoreVisitor();
characters.forEach(character => character.accept(scoreVisitor));
// #### Example Output
// Applying Power-Ups:
// Warrior power-up: Strength increased to 60
// Mage power-up: Mana increased to 120
// Archer power-up: Agility increased to 85
// Calculating Damage:
// Warrior damaged: Health reduced to 85
// Mage damaged: Health reduced to 60
// Archer damaged: Health reduced to 80
// Updating Scores:
// Warrior: Score updated based on strength 60
// Mage: Score updated based on mana 120
// Archer: Score updated based on agility 85
// ### Breakdown of Features
// 1. **Complex Object Structures**:
// - Characters have different attributes (`strength`, `mana`, `agility`) and behaviors.
// - The `Visitable` interface provides a uniform way to apply operations.
//
// 2. **Extensibility**:
// - Adding a new visitor (e.g., `HealthCheckVisitor`) doesn't require modifying the character classes.
//
// 3. **Multiple Visitors**:
// - Each visitor focuses on a distinct operation: power-ups, damage, and scoring.
//
// 4. **Open/Closed Principle**:
// - The system allows adding new visitors while keeping character classes unchanged.
//
// ---
//
// ### Is This Example Comprehensive?
//
//   Yes, this example demonstrates the **full power** of the **Visitor Pattern**:
// - It manages **complex hierarchies** of characters with unique attributes.
// - It highlights **real-world gaming operations** like damage, power-ups, and scoring.
// - It ensures **extensibility** by supporting new operations without altering existing classes.
//
//   This example is sufficient for understanding the **Visitor Pattern** in product-based real-world scenarios, particularly in gaming engines. For further exploration, you can extend it to include team-based bonuses, equipment effects, or environment-based interactions.
//# sourceMappingURL=03.js.map