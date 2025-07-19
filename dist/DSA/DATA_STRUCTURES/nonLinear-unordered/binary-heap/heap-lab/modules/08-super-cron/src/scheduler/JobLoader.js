"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadJobs = loadJobs;
const cron_parser_1 = require("cron-parser");
const fs_1 = __importDefault(require("fs"));
function loadJobs(file = 'cron.json') {
    const raw = fs_1.default.readFileSync(file, 'utf-8');
    const parsed = JSON.parse(raw);
    return parsed.map((job) => {
        const now = Date.now();
        let runAt = now;
        if (job.scheduleMode === 'cron' && job.cronExpr) {
            const interval = cron_parser_1.CronExpressionParser.parse(job.cronExpr);
            runAt = interval.next().getTime();
        }
        else if (job.scheduleMode === 'interval') {
            runAt = now + (job.intervalMs ?? 1000);
        }
        return {
            ...job,
            runAt,
            createdAt: now
        };
    });
}
//# sourceMappingURL=JobLoader.js.map