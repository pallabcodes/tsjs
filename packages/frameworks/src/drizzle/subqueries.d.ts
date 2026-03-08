/**
 * Deconstructing Drizzle ORM's Subqueries & Aliasing
 *
 * Subqueries in Drizzle use the `.as(alias)` method to turn a query
 * back into a "Table-like" object that can be selected from or joined.
 */
import { PgSelect } from "./query-builder";
import { SelectResultFields } from "./selection";
/**
 * 1. The Subquery Type
 *
 * A Subquery mimics a Table interface but its columns are derived
 * from the SELECT clause of the inner query.
 */
export interface Subquery<TAlias extends string = string, TSelection = unknown> {
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
export type SubqueryWithSelection<TSelection, TAlias extends string> = {
    [K in keyof TSelection]: TSelection[K] & {
        _subqueryAlias: TAlias;
    };
};
/**
 * 3. Deconstructing the .as() method behavior (Conceptual)
 */
export declare function createSubquery<TSelection, TAlias extends string>(_query: PgSelect<any>, alias: TAlias): Subquery<TAlias, TSelection> & SubqueryWithSelection<TSelection, TAlias>;
