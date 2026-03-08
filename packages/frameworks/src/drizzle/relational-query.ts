/**
 * Deconstructing Drizzle ORM's Relational Query API (db.query)
 * 
 * This is the high-level API that allows for nested relationship 
 * fetching like findMany({ with: { posts: true } }).
 */

import { Table, Column, InferSelectModel } from "drizzle-orm";
import { Simplify } from "./utils";

/**
 * 1. The BuildQueryResult Interface
 * 
 * This is the magic engine that calculates the shape of the result 
 * based on the 'with' configuration.
 */
export type BuildQueryResult<
    TTable extends Table, 
    TConfig, 
    TRelations extends Record<string, any>
> = Simplify<
    InferSelectModel<TTable> & {
        [K in keyof TConfig & keyof TRelations & string]: 
            TConfig[K] extends true 
                ? TRelations[K] extends { _: { table: infer TRelatedTable extends Table } }
                    ? TRelations[K]['_']['isMany'] extends true 
                        ? BuildQueryResult<TRelatedTable, {}, any>[] // Simplified recursion
                        : BuildQueryResult<TRelatedTable, {}, any> | null
                    : never
                : TConfig[K] extends Record<string, any>
                    ? TRelations[K] extends { _: { table: infer TRelatedTable extends Table } }
                        ? TRelations[K]['_']['isMany'] extends true 
                            ? BuildQueryResult<TRelatedTable, TConfig[K], any>[]
                            : BuildQueryResult<TRelatedTable, TConfig[K], any> | null
                        : never
                : never;
    }
>;

/**
 * 2. Defining Relationship Metadata (Mock)
 */
export interface MyRelation<
    TTable extends Table = Table, 
    TIsMany extends boolean = boolean
> {
    _: {
        table: TTable;
        isMany: TIsMany;
    };
}

/**
 * Demo: Relational Queries in Action
 */

import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});

const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
});

// Mocking the 'users' relations
type UsersRelations = {
    posts: MyRelation<typeof posts, true>; // One-to-Many
};

// Action: db.query.users.findMany({ with: { posts: true } })
type QueryConfig = { with: { posts: true } };

type UserWithPosts = BuildQueryResult<
    typeof users, 
    QueryConfig['with'], 
    UsersRelations
>;

/**
 * Inferred Result: 
 * { 
 *   id: number; 
 *   name: string; 
 *   posts: { id: number; title: string }[] 
 * }
 */

console.log('Drizzle Relational Query API (db.query) deconstructed');
