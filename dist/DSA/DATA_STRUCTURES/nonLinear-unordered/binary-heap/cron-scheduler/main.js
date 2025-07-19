"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TaskScheduler_1 = require("./TaskScheduler");
const TaskRunner_1 = require("./TaskRunner");
const scheduler = new TaskScheduler_1.TaskScheduler();
for (let i = 0; i < 5; i++) {
    const delay = i * 2000;
    const task = {
        id: `task-${i}`,
        runAt: Date.now() + delay,
        createdAt: Date.now(),
        priority: Math.floor(Math.random() * 10),
        type: ['email', 'retry', 'sync'][i % 3],
        payload: { index: i }
    };
    scheduler.schedule(task);
}
setInterval(async () => {
    const due = scheduler.pollDueTasks();
    for (const task of due) {
        await TaskRunner_1.TaskRunner.run(task); // This is where the task is executed
    }
}, 1000);
//# sourceMappingURL=main.js.map