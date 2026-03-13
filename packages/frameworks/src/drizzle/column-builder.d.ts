/**
 * Deconstructing Drizzle's Column Builder & Branding System.
 *
 * In Drizzle, every column method (.notNull(), .default(), etc.)
 * doesn't just return a new object; it returns a new TYPE that encodes the state.
 */
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
export declare abstract class ColumnBuilder<T extends ColumnBuilderBaseConfig = ColumnBuilderBaseConfig> {
    _: {
        name: T['name'];
        data: T['data'];
        notNull: T['notNull'];
        hasDefault: T['hasDefault'];
    };
    constructor(name: string);
    /**
     * The Magic: .notNull()
     * It returns a NEW ColumnBuilder with the 'notNull' generic set to true.
     */
    notNull(): ColumnBuilder<{
        name: T['name'];
        data: T['data'];
        driverParam: T['driverParam'];
        notNull: true;
        hasDefault: T['hasDefault'];
    }>;
    default(value: T['data']): ColumnBuilder<{
        name: T['name'];
        data: T['data'];
        driverParam: T['driverParam'];
        notNull: T['notNull'];
        hasDefault: true;
    }>;
}
/**
 * 3. Specific Column Implementation (e.g., Integer)
 */
export declare class PgIntegerBuilder<TName extends string> extends ColumnBuilder<{
    name: TName;
    data: number;
    driverParam: number | string;
    notNull: false;
    hasDefault: false;
}> {
    constructor(name: TName);
}
/**
 * 5. Advanced: Why do this? (Inference)
 * Drizzle uses this refined state to decide if a field is REQUIRED in an Insert.
 */
export type InferInsertField<T extends ColumnBuilder> = T['_']['notNull'] extends true ? T['_']['hasDefault'] extends true ? T['_']['data'] | undefined : T['_']['data'] : T['_']['data'] | null | undefined;
