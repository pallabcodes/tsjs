"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbTransaction = dbTransaction;
/**
 * Understanding how to wrap transactions in your own "Mini-Drizzle"
 */
async function dbTransaction(callback) {
    // This is where you'd actually execute the DB logic
    console.log('Transaction started');
    const result = await callback({});
    console.log('Transaction commited');
    return result;
}
//# sourceMappingURL=transaction.js.map