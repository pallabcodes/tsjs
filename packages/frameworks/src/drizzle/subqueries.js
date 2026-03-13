"use strict";
/**
 * Deconstructing Drizzle ORM's Subqueries & Aliasing
 *
 * Subqueries in Drizzle use the `.as(alias)` method to turn a query
 * back into a "Table-like" object that can be selected from or joined.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubquery = createSubquery;
/**
 * 3. Deconstructing the .as() method behavior (Conceptual)
 */
function createSubquery(_query, alias) {
    return {
    // ... runtime implementation that creates proxies for columns
    };
}
/**
 * Demo: Subquery in Action
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
});
// Step A: Define a query
const innerQuery = {
    tableName: 'users',
    selection: { userId: users.id, userName: users.name },
};
// Step B: Turn it into a subquery ('sq')
const sq = createSubquery(innerQuery, 'sq');
// InferredFromSubquery correctly preserves the 'string' type and adds subquery context.
console.log('Drizzle Subqueries & Aliasing deconstructed');
//# sourceMappingURL=subqueries.js.map