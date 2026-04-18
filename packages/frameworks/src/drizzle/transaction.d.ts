import { PgTransaction } from 'drizzle-orm/pg-core';
import { PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js';
/**
 * 2. Transaction Type Deconstruction
 * Drizzle transactions are generically typed based on the database driver
 * and the schema.
 */
export type DrizzleTransaction = PgTransaction<PostgresJsQueryResultHKT, any, // TFullSchema
any>;
/**
 * Understanding how to wrap transactions in your own "Mini-Drizzle"
 */
export declare function dbTransaction<T>(callback: (tx: DrizzleTransaction) => Promise<T>): Promise<T>;
