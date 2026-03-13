"use strict";
/**
 * Deconstructing Drizzle ORM's Selection & Result Engine
 *
 * This is the heart of Drizzle's query typing. It handles how objects
 * like { id: users.id, name: users.name } are transformed into { id: number; name: string }.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Demo: Selection in Action
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
});
// Case A: Partial Selection
const selection = {
    myId: users.id,
    userName: users.name,
    constant: { _: { type: 123 } }
};
/**
 * Result: {
 *   id: number;
 *   name: string;
 * }
 */
//# sourceMappingURL=selection.js.map