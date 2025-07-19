"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEmail = handleEmail;
exports.handleLog = handleLog;
async function handleEmail(task) {
    console.log(`📧 Sending email to ${task.payload.to} with subject "${task.payload.subject}"`);
}
async function handleLog(task) {
    console.log(`📝 Log entry: ${task.payload.message}`);
}
//# sourceMappingURL=email.js.map