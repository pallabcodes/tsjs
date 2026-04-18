/**
 * Deconstructing Drizzle ORM's Subqueries & Aliasing
 * 
 * Subqueries in Drizzle use the `.as(alias)` method to turn a query 
 * back into a "Table-like" object that can be selected from or joined.
 */

import { PgSelect } from "./query-builder";
import { Table, Column } from "drizzle-orm";
import { SelectResultFields } from "./selection";

/**
 * 1. The Subquery Type
 * 
 * A Subquery mimics a Table interface but its columns are derived 
 * from the SELECT clause of the inner query.
 */
export interface Subquery<
    TAlias extends string = string,
    TSelection = unknown
> {
    _: {
        name: TAlias;
        selection: TSelection;
        columns: SelectResultFields<TSelection>;
    };
}

/**
 * 2. The Aliased View / Proxy
 * 
 * When you call .as('name'), Drizzle creates a proxy that maps 
 * the subquery's selection back to "Column-like" accessors.
 */
export type SubqueryWithSelection<
    TSelection, 
    TAlias extends string
> = {
    [K in keyof TSelection]: TSelection[K] & { _subqueryAlias: TAlias };
};

/**
 * 3. Deconstructing the .as() method behavior (Conceptual)
 */
export function createSubquery<TSelection, TAlias extends string>(
    _query: PgSelect<any>, 
    alias: TAlias
): Subquery<TAlias, TSelection> & SubqueryWithSelection<TSelection, TAlias> {
    return {
        // ... runtime implementation that creates proxies for columns
    } as any;
}

/**
 * Demo: Subquery in Action
 */
import { pgTable, text, serial } from "drizzle-orm/pg-core";

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});

// Step A: Define a query
const innerQuery = {
    tableName: 'users',
    selection: { userId: users.id, userName: users.name },
} as any;

// Step B: Turn it into a subquery ('sq')
const sq = createSubquery<typeof innerQuery['selection'], 'sq'>(innerQuery, 'sq');

// Now 'sq.userId' is treated like a Column by Drizzle's selection engine!
type InferredFromSubquery = typeof sq.userName; 
// InferredFromSubquery correctly preserves the 'string' type and adds subquery context.

console.log('Drizzle Subqueries & Aliasing deconstructed');
