"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runTask = runTask;
const axios_1 = __importDefault(require("axios"));
const api_1 = require("../server/api");
const email_1 = require("./handlers/email");
const log_1 = require("./handlers/log");
async function runTask(task, scheduler) {
    try {
        switch (task.taskType) {
            case 'email':
                try {
                    await (0, email_1.handleEmail)(task);
                }
                catch (err) {
                    await notifyFailure(task, err);
                    if (task.retry && task.retry.retries > 0) {
                        task.retry.retries -= 1;
                        task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
                        scheduler.schedule(task);
                        return;
                    }
                }
                break;
            case 'log':
                try {
                    await (0, log_1.handleLog)(task);
                }
                catch (err) {
                    await notifyFailure(task, err);
                    if (task.retry && task.retry.retries > 0) {
                        task.retry.retries -= 1;
                        task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
                        scheduler.schedule(task);
                        return;
                    }
                }
                break;
            case 'api':
                try {
                    await (0, api_1.handleWebhook)(task);
                }
                catch (err) {
                    await notifyFailure(task, err);
                    if (task.retry && task.retry.retries > 0) {
                        task.retry.retries -= 1;
                        task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
                        scheduler.schedule(task);
                        return;
                    }
                }
                break;
            default:
                console.warn(`❓ Unknown taskType: ${task.taskType}`);
        }
    }
    catch (err) {
        // fallback for unexpected errors
        await notifyFailure(task, err);
        if (task.retry && task.retry.retries > 0) {
            task.retry.retries -= 1;
            task.runAt = Date.now() + (task.retry.backoffMs ?? 1000);
            scheduler.schedule(task);
            return;
        }
    }
    // Interval repeat logic (only if not retried above)
    if (task.scheduleMode === 'interval' && task.repeat !== 0) {
        if (typeof task.repeat === 'number')
            task.repeat -= 1;
        task.runAt = Date.now() + (task.intervalMs ?? 1000);
        scheduler.schedule(task);
    }
}
async function notifyFailure(task, err) {
    const hook = task.onFailure;
    if (!hook)
        return;
    const msg = hook.message || `❌ Task ${task.id} failed with error: ${err?.message ?? err}`;
    if (hook.type === 'slack' || hook.type === 'webhook') {
        await axios_1.default.post(hook.to, { text: msg, task });
    }
    else if (hook.type === 'email') {
        console.log(`📧 Email sent to ${hook.to}: ${msg}`); // Replace w/ nodemailer if needed
    }
}
//# sourceMappingURL=TaskRunner.js.map