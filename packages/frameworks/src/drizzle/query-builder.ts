/**
 * Deconstructing Drizzle ORM's Fluent Query Builder
 * 
 * The goal is to understand how the Query Builder maintains the "Type State" 
 * (the selection and joins) through a chain of method calls.
 */

import { Table } from "drizzle-orm";
import { SelectResultFields } from "./selection";
import { JoinType, JoinNullability, AppendToNullabilityMap } from "./joins";
import { SQL } from "./expressions";

/**
 * 1. The Query Builder State
 * 
 * This interface holds all the context of the query at any given point 
 * in the chain.
 */
export interface PgSelectConfig<
    TTableName extends string = string,
    TSelection = unknown,
    TSelectMode extends 'partial' | 'single' = 'partial',
    TNullabilityMap extends Record<string, JoinNullability> = {}
> {
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
export class PgSelect<T extends PgSelectConfig> {
    // Internal config (simplified)
    declare _: T;

    constructor(config: T) {
        this._ = config;
    }

    /**
     * .leftJoin()
     * 
     * This is the heavy lifter. It updates the 'nullabilityMap' 
     * to include the new table as 'nullable'.
     */
    leftJoin<
        TJoinedTable extends Table, 
        TJoinedName extends string = TJoinedTable['_']['name']
    >(
        table: TJoinedTable,
        on: SQL
    ): PgSelect<{
        tableName: T['tableName'];
        selection: T['selection'];
        selectMode: T['selectMode'];
        nullabilityMap: AppendToNullabilityMap<T['nullabilityMap'], TJoinedName, 'left'>;
    }> {
        return this as any;
    }

    /**
     * .where()
     * 
     * Filters don't change the RESULT type, just the query logic.
     * So we return the SAME generic state.
     */
    where(filter: SQL): PgSelect<T> {
        return this as any;
    }

    /**
     * .execute()
     * 
     * The final step that uses the accumulated state to return 
     * the inferred result type.
     */
    execute(): SelectResultFields<T['selection']>[] {
        return [] as any;
    }
}

/**
 * 3. Usage Example: The Pipeline in Action
 */
import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";

const users = pgTable('users', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
});

const posts = pgTable('posts', {
    id: serial('id').primaryKey(),
    title: text('title').notNull(),
    authorId: integer('author_id').notNull(),
});

// Create initial builder
const builder = new PgSelect({
    tableName: 'users',
    selection: { id: users.id, name: users.name },
    selectMode: 'partial' as const,
    nullabilityMap: { users: 'not-null' as const }
});

// Chaining
const query = builder
    .leftJoin(posts, {} as any) // Posts are now 'nullable' in the map
    .where({} as any);

// Result Inference
const results = query.execute();
// results[0].name -> string
// results[0].title -> string | null (Correctly inferred due to leftJoin!)

console.log('Drizzle Query Builder Chaining deconstructed');
