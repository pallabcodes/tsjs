"use strict";
/**
 * Deconstructing Drizzle ORM's Fluent Query Builder
 *
 * The goal is to understand how the Query Builder maintains the "Type State"
 * (the selection and joins) through a chain of method calls.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgSelect = void 0;
/**
 * 2. The PgSelect Class (Deconstructed)
 *
 * Notice how every method returns a NEW instance of PgSelect with
 * updated generic parameters.
 */
class PgSelect {
    constructor(config) {
        this._ = config;
    }
    /**
     * .leftJoin()
     *
     * This is the heavy lifter. It updates the 'nullabilityMap'
     * to include the new table as 'nullable'.
     */
    leftJoin(table, on) {
        return this;
    }
    /**
     * .where()
     *
     * Filters don't change the RESULT type, just the query logic.
     * So we return the SAME generic state.
     */
    where(filter) {
        return this;
    }
    /**
     * .execute()
     *
     * The final step that uses the accumulated state to return
     * the inferred result type.
     */
    execute() {
        return [];
    }
}
exports.PgSelect = PgSelect;
/**
 * 3. Usage Example: The Pipeline in Action
 */
const pg_core_1 = require("drizzle-orm/pg-core");
const users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
});
const posts = (0, pg_core_1.pgTable)('posts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    title: (0, pg_core_1.text)('title').notNull(),
    authorId: (0, pg_core_1.integer)('author_id').notNull(),
});
// Create initial builder
const builder = new PgSelect({
    tableName: 'users',
    selection: { id: users.id, name: users.name },
    selectMode: 'partial',
    nullabilityMap: { users: 'not-null' }
});
// Chaining
const query = builder
    .leftJoin(posts, {}) // Posts are now 'nullable' in the map
    .where({});
// Result Inference
const results = query.execute();
// results[0].name -> string
// results[0].title -> string | null (Correctly inferred due to leftJoin!)
console.log('Drizzle Query Builder Chaining deconstructed');
//# sourceMappingURL=query-builder.js.map