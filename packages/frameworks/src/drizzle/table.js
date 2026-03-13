"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.users = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
/**
 * 1. Table & Column Builder Deconstruction
 */
exports.users = (0, pg_core_1.pgTable)('users', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    age: (0, pg_core_1.integer)('age'),
});
//# sourceMappingURL=table.js.map