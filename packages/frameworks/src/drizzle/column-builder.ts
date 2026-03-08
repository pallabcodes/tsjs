/**
 * Deconstructing Drizzle's Column Builder & Branding System.
 * 
 * In Drizzle, every column method (.notNull(), .default(), etc.) 
 * doesn't just return a new object; it returns a new TYPE that encodes the state.
 */

// 1. Common "Brands" used for tracking state in the types system
// Drizzle uses these to differentiate between columns that are nullable or have defaults.
export type ColumnBuilderBaseConfig = {
    name: string;
    data: unknown;
    driverParam: unknown;
    notNull: boolean;
    hasDefault: boolean;
};

/**
 * 2. The ColumnBuilder Class (Simplified to the Core Type Pattern)
 * 
 * T is the "State" of the column.
 */
export abstract class ColumnBuilder<
    T extends ColumnBuilderBaseConfig = ColumnBuilderBaseConfig,
> {
    // The '_' property is Drizzle's convention for "Internal Type Metadata"
    // It's never used at runtime, only for TypeScript to "branch" on.
    declare _: {
        name: T['name'];
        data: T['data'];
        notNull: T['notNull'];
        hasDefault: T['hasDefault'];
    };

    constructor(name: string) {
        // Implementation would go here
    }

    /**
     * The Magic: .notNull()
     * It returns a NEW ColumnBuilder with the 'notNull' generic set to true.
     */
    notNull(): ColumnBuilder<{
        name: T['name'];
        data: T['data'];
        driverParam: T['driverParam'];
        notNull: true; // <-- State change in type system
        hasDefault: T['hasDefault'];
    }> {
        return this as any;
    }

    default(value: T['data']): ColumnBuilder<{
        name: T['name'];
        data: T['data'];
        driverParam: T['driverParam'];
        notNull: T['notNull'];
        hasDefault: true; // <-- State change in type system
    }> {
        return this as any;
    }
}

/**
 * 3. Specific Column Implementation (e.g., Integer)
 */
export class PgIntegerBuilder<TName extends string> extends ColumnBuilder<{
    name: TName;
    data: number;
    driverParam: number | string;
    notNull: false;
    hasDefault: false;
}> {
    constructor(name: TName) {
        super(name);
    }
}

/**
 * 4. Usage Example: How the types "Flow"
 */
const idBuilder = new PgIntegerBuilder('id').notNull().default(0);

// Deconstructing what TS sees:
type IdConfig = typeof idBuilder['_'];
// Result: { name: 'id', data: number, notNull: true, hasDefault: true }

/**
 * 5. Advanced: Why do this? (Inference)
 * Drizzle uses this refined state to decide if a field is REQUIRED in an Insert.
 */
export type InferInsertField<T extends ColumnBuilder> = 
    T['_']['notNull'] extends true 
        ? T['_']['hasDefault'] extends true 
            ? T['_']['data'] | undefined // Has default, so optional
            : T['_']['data']             // Required
        : T['_']['data'] | null | undefined; // Nullable

type InsertId = InferInsertField<typeof idBuilder>; // number | undefined
