import { relations } from 'drizzle-orm';
import { pgTable, serial, integer } from 'drizzle-orm/pg-core';
import { users } from './table';

/**
 * 3. Relations Deconstruction
 */
export const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    authorId: integer('author_id').notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
    posts: many(posts),
}));

// Technique to extract relationship types
export type PostRelation = ReturnType<typeof usersRelations['config']>['posts'];
