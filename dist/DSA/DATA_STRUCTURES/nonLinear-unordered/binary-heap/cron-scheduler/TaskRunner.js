"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRunner = void 0;
class TaskRunner {
    static async run(task) {
        switch (task.type) {
            case 'email':
                console.log(`📧 [Email] Sending email to ${task.payload.to}`);
                break;
            case 'retry':
                console.log(`🔁 [Retry] Retrying task: ${task.payload.jobId}`);
                break;
            case 'sync':
                console.log(`🔄 [Sync] Syncing ${task.payload.entity}`);
                break;
            default:
                console.warn(`❓ [Unknown] ${task.id}`);
        }
    }
}
exports.TaskRunner = TaskRunner;
//# sourceMappingURL=TaskRunner.js.map