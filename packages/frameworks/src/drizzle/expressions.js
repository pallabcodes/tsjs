"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eq = void 0;
exports.and = and;
exports.like = like;
/**
 * 3. Implementation of 'eq' (Equal)
 *
 * Notice how it uses the metadata from the Column ('data') to constrain the value.
 */
const eq = (column, value) => {
    // At runtime, this builds an SQL string.
    // At compile-time, it ensures types match.
    return {
        _: { type: true }
    };
};
exports.eq = eq;
/**
 * 4. Implementation of 'and' / 'or' (Logical Operators)
 */
function and(...filters) {
    return {
        _: { type: true }
    };
}
/**
 * 5. Usage Example: Type-Safe Queries
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.integer)('id').notNull(),
    name: (0, pg_core_1.text)('name').notNull(),
});
// Correct Usage:
const filter1 = (0, exports.eq)(users.id, 1); // Works!
const filter2 = (0, exports.eq)(users.name, "Alice"); // Works!
// Error Cases (Type Safety in Action):
// eq(users.id, "1");       // ERROR: Argument of type 'string' is not assignable to 'number'
// eq(users.name, 123);   // ERROR: Argument of type 'number' is not assignable to 'string'
/**
 * Advanced: Template Literal Types in Filters
 * Drizzle uses these for things like 'ilike' or 'like'.
 */
function like(column, value) {
    return { _: { type: true } };
}
//# sourceMappingURL=expressions.js.map