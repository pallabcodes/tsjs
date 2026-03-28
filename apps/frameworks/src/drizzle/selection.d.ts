/**
 * Deconstructing Drizzle ORM's Selection & Result Engine
 *
 * This is the heart of Drizzle's query typing. It handles how objects
 * like { id: users.id, name: users.name } are transformed into { id: number; name: string }.
 */
import { Table, Column } from "drizzle-orm";
import { SQL } from "./expressions";
import { Simplify } from "./utils";
/**
 * 1. SelectResultField
 *
 * Recursive logic to extract the actual data type from a "Selectable" item.
 * Items can be: Columns, Tables (all columns), SQL expressions, or nested Objects.
 */
export type SelectResultField<T> = T extends Column ? T['_']['data'] : T extends SQL ? T['_']['type'] : T extends Table ? SelectResultFields<T['_']['columns']> : T extends Record<string, any> ? SelectResultFields<T> : never;
/**
 * 2. SelectResultFields
 *
 * Maps over a selection object and applies SelectResultField to every key.
 */
export type SelectResultFields<TSelection> = Simplify<{
    [Key in keyof TSelection]: SelectResultField<TSelection[Key]>;
}>;
/**
 * 3. SelectMode
 *
 * Drizzle changes result shapes based on whether you're selecting
 * a partial set of fields, a single table, or multiple tables.
 */
export type SelectMode = 'partial' | 'single' | 'multiple';
/**
 * 4. SelectResult
 *
 * The final result type of a query.
 * Notice it doesn't just return the fields; it potentially wraps them
 * based on 'mode' and 'joins'.
 */
export type SelectResult<TResult, TMode extends SelectMode> = TMode extends 'partial' ? TResult : TMode extends 'single' ? TResult : TResult;
/**
 * Result: {
 *   id: number;
 *   name: string;
 * }
 */
