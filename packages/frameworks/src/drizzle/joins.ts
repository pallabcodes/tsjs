/**
 * Deconstructing Drizzle ORM's Join Nullability Engine
 * 
 * This is the logic that ensures that if you LEFT JOIN a table, 
 * all its fields are automatically inferred as nullable in the result.
 */

import { Column } from "drizzle-orm";
import { Assume } from "./utils";

// 1. The Join Types supported by SQL/Drizzle
export type JoinType = 'inner' | 'left' | 'right' | 'full' | 'cross';

// 2. Nullability States
export type JoinNullability = 'nullable' | 'not-null';

/**
 * 3. ApplyNullability
 * 
 * A utility that wraps a type in 'null' if the join is nullable.
 */
export type ApplyNullability<T, TNullability extends JoinNullability> = 
    TNullability extends 'nullable' 
        ? T | null 
        : T;

/**
 * 4. ApplyNotNullMapToJoins
 * 
 * This iterates over a result object (TResult) and applies nullability 
 * based on a map of table names (TNullabilityMap).
 */
export type ApplyNotNullMapToJoins<
    TResult, 
    TNullabilityMap extends Record<string, JoinNullability>
> = {
    [TTableName in keyof TResult & keyof TNullabilityMap & string]: 
        ApplyNullability<TResult[TTableName], TNullabilityMap[TTableName]>;
} & {};

/**
 * 5. AppendToNullabilityMap
 * 
 * This is the logic triggered when you call .leftJoin(), .rightJoin(), etc.
 * It calculates the new state of the entire query's nullability map.
 */
export type AppendToNullabilityMap<
    TNotNullMap extends Record<string, JoinNullability>,
    TJoinedName extends string,
    TJoinType extends JoinType
> = 
    TJoinType extends 'left' 
        ? TNotNullMap & { [name in TJoinedName]: 'nullable' }
    : TJoinType extends 'right'
        ? { [Key in keyof TNotNullMap]: 'nullable' } & { [name in TJoinedName]: 'not-null' }
    : TJoinType extends 'inner' | 'cross'
        ? TNotNullMap & { [name in TJoinedName]: 'not-null' }
    : TJoinType extends 'full'
        ? { [Key in keyof TNotNullMap]: 'nullable' } & { [name in TJoinedName]: 'nullable' }
    : never;

/**
 * Demo: How Join Inference works
 */

type User = { id: number; name: string };
type Post = { id: number; title: string };

// Initial State (Select from Users)
type InitialMap = { users: 'not-null' };

// Action: .leftJoin('posts')
type NewMap = AppendToNullabilityMap<InitialMap, 'posts', 'left'>;
// Result: { users: 'not-null', posts: 'nullable' }

// Action: .rightJoin('comments')
type MapAfterRightJoin = AppendToNullabilityMap<NewMap, 'comments', 'right'>;
/**
 * Result: { 
 *   users: 'nullable',    <-- Existing tables become nullable in a RIGHT join
 *   posts: 'nullable',
 *   comments: 'not-null' 
 * }
 */

// Final Inference:
type CombinedResult = { users: User; posts: Post };
type InferredResult = ApplyNotNullMapToJoins<CombinedResult, NewMap>;
/**
 * Result: {
 *   users: User;          <-- Stays non-null
 *   posts: Post | null;   <-- Becomes nullable!
 * }
 */
