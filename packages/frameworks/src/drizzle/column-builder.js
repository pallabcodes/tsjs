"use strict";
/**
 * Deconstructing Drizzle's Column Builder & Branding System.
 *
 * In Drizzle, every column method (.notNull(), .default(), etc.)
 * doesn't just return a new object; it returns a new TYPE that encodes the state.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PgIntegerBuilder = exports.ColumnBuilder = void 0;
/**
 * 2. The ColumnBuilder Class (Simplified to the Core Type Pattern)
 *
 * T is the "State" of the column.
 */
class ColumnBuilder {
    constructor(name) {
        // Implementation would go here
    }
    /**
     * The Magic: .notNull()
     * It returns a NEW ColumnBuilder with the 'notNull' generic set to true.
     */
    notNull() {
        return this;
    }
    default(value) {
        return this;
    }
}
exports.ColumnBuilder = ColumnBuilder;
/**
 * 3. Specific Column Implementation (e.g., Integer)
 */
class PgIntegerBuilder extends ColumnBuilder {
    constructor(name) {
        super(name);
    }
}
exports.PgIntegerBuilder = PgIntegerBuilder;
/**
 * 4. Usage Example: How the types "Flow"
 */
const idBuilder = new PgIntegerBuilder('id').notNull().default(0);
//# sourceMappingURL=column-builder.js.map