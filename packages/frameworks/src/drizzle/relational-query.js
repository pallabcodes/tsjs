"use strict";
/**
 * Deconstructing Drizzle ORM's Relational Query API (db.query)
 *
 * This is the high-level API that allows for nested relationship
 * fetching like findMany({ with: { posts: true } }).
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Demo: Relational Queries in Action
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
});
const posts = (0, pg_core_1.pgTable)('posts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
});
/**
 * Inferred Result:
 * {
 *   id: number;
 *   name: string;
 *   posts: { id: number; title: string }[]
 * }
 */
console.log('Drizzle Relational Query API (db.query) deconstructed');
//# sourceMappingURL=relational-query.js.map