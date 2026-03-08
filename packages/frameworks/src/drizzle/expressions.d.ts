import { Column } from "drizzle-orm";
/**
 * Deconstructing Drizzle's Expression & Filter System.
 *
 * The goal is to understand how Drizzle ensures that in `eq(column, value)`,
 * the 'value' type always matches the 'column' type.
 */
export interface SQL<T = unknown> {
    _: {
        type: T;
    };
}
export type BinaryOperator<TColumn extends Column> = (column: TColumn, value: TColumn['_']['data'] | SQL<TColumn['_']['data']>) => SQL<boolean>;
/**
 * 3. Implementation of 'eq' (Equal)
 *
 * Notice how it uses the metadata from the Column ('data') to constrain the value.
 */
export declare const eq: BinaryOperator<Column>;
/**
 * 4. Implementation of 'and' / 'or' (Logical Operators)
 */
export declare function and(...filters: (SQL<boolean> | undefined)[]): SQL<boolean> | undefined;
/**
 * Advanced: Template Literal Types in Filters
 * Drizzle uses these for things like 'ilike' or 'like'.
 */
export declare function like(column: Column<any, {
    data: string;
}>, value: string): SQL<boolean>;
