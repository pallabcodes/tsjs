"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SchedulerService_1 = require("./scheduler/SchedulerService");
const JobLoader_1 = require("./scheduler/JobLoader");
const api_1 = require("./server/api");
const tui_1 = require("./server/tui");
const scheduler = new SchedulerService_1.SchedulerService();
const tasks = (0, JobLoader_1.loadJobs)();
(0, tui_1.startTUI)(scheduler);
for (const task of tasks) {
    scheduler.schedule(task);
}
const app = (0, api_1.createApi)(scheduler);
app.listen(3000, () => console.log('✅ super-cron running on http://localhost:3000'));
//# sourceMappingURL=index.js.map