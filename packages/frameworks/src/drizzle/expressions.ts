import { Column } from "drizzle-orm";

/**
 * Deconstructing Drizzle's Expression & Filter System.
 * 
 * The goal is to understand how Drizzle ensures that in `eq(column, value)`, 
 * the 'value' type always matches the 'column' type.
 */

// 1. Base interface for an Expression (SQL fragment)
export interface SQL<T = unknown> {
    // This property doesn't exist at runtime, it's just for type tracking
    _: {
        type: T;
    };
}

// 2. The Binary Operator Pattern (e.g., eq, ne, gt)
// TColumn is the column we are comparing against.
export type BinaryOperator<TColumn extends Column> = (
    column: TColumn,
    value: TColumn['_']['data'] | SQL<TColumn['_']['data']>
) => SQL<boolean>;

/**
 * 3. Implementation of 'eq' (Equal)
 * 
 * Notice how it uses the metadata from the Column ('data') to constrain the value.
 */
export const eq: BinaryOperator<Column> = (column, value) => {
    // At runtime, this builds an SQL string.
    // At compile-time, it ensures types match.
    return {
        _: { type: true as boolean }
    } as any;
};

/**
 * 4. Implementation of 'and' / 'or' (Logical Operators)
 */
export function and(...filters: (SQL<boolean> | undefined)[]): SQL<boolean> | undefined {
    return {
        _: { type: true as boolean }
    } as any;
}

/**
 * 5. Usage Example: Type-Safe Queries
 */
import { pgTable, text, integer } from 'drizzle-orm/pg-core';

const users = pgTable('users', {
    id: integer('id').notNull(),
    name: text('name').notNull(),
});

// Correct Usage:
const filter1 = eq(users.id, 1); // Works!
const filter2 = eq(users.name, "Alice"); // Works!

// Error Cases (Type Safety in Action):
// eq(users.id, "1");       // ERROR: Argument of type 'string' is not assignable to 'number'
// eq(users.name, 123);   // ERROR: Argument of type 'number' is not assignable to 'string'

/**
 * Advanced: Template Literal Types in Filters
 * Drizzle uses these for things like 'ilike' or 'like'.
 */
export function like(column: Column<any, { data: string }>, value: string): SQL<boolean> {
    return { _: { type: true } } as any;
}
