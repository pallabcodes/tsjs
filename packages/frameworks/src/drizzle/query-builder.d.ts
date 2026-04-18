/**
 * Deconstructing Drizzle ORM's Fluent Query Builder
 *
 * The goal is to understand how the Query Builder maintains the "Type State"
 * (the selection and joins) through a chain of method calls.
 */
import { Table } from "drizzle-orm";
import { SelectResultFields } from "./selection";
import { JoinNullability, AppendToNullabilityMap } from "./joins";
import { SQL } from "./expressions";
/**
 * 1. The Query Builder State
 *
 * This interface holds all the context of the query at any given point
 * in the chain.
 */
export interface PgSelectConfig<TTableName extends string = string, TSelection = unknown, TSelectMode extends 'partial' | 'single' = 'partial', TNullabilityMap extends Record<string, JoinNullability> = {}> {
    tableName: TTableName;
    selection: TSelection;
    selectMode: TSelectMode;
    nullabilityMap: TNullabilityMap;
}
/**
 * 2. The PgSelect Class (Deconstructed)
 *
 * Notice how every method returns a NEW instance of PgSelect with
 * updated generic parameters.
 */
export declare class PgSelect<T extends PgSelectConfig> {
    _: T;
    constructor(config: T);
    /**
     * .leftJoin()
     *
     * This is the heavy lifter. It updates the 'nullabilityMap'
     * to include the new table as 'nullable'.
     */
    leftJoin<TJoinedTable extends Table, TJoinedName extends string = TJoinedTable['_']['name']>(table: TJoinedTable, on: SQL): PgSelect<{
        tableName: T['tableName'];
        selection: T['selection'];
        selectMode: T['selectMode'];
        nullabilityMap: AppendToNullabilityMap<T['nullabilityMap'], TJoinedName, 'left'>;
    }>;
    /**
     * .where()
     *
     * Filters don't change the RESULT type, just the query logic.
     * So we return the SAME generic state.
     */
    where(filter: SQL): PgSelect<T>;
    /**
     * .execute()
     *
     * The final step that uses the accumulated state to return
     * the inferred result type.
     */
    execute(): SelectResultFields<T['selection']>[];
}
