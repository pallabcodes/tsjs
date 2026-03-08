"use strict";
/**
 * Deconstructing Drizzle ORM's Join Nullability Engine
 *
 * This is the logic that ensures that if you LEFT JOIN a table,
 * all its fields are automatically inferred as nullable in the result.
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Result: {
 *   users: User;          <-- Stays non-null
 *   posts: Post | null;   <-- Becomes nullable!
 * }
 */
//# sourceMappingURL=joins.js.map