"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRelations = exports.posts = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const pg_core_1 = require("drizzle-orm/pg-core");
const table_1 = require("./table");
/**
 * 3. Relations Deconstruction
 */
exports.posts = (0, pg_core_1.pgTable)('posts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    authorId: (0, pg_core_1.integer)('author_id').notNull(),
});
exports.usersRelations = (0, drizzle_orm_1.relations)(table_1.users, ({ many }) => ({
    posts: many(exports.posts),
}));
//# sourceMappingURL=relations.js.map