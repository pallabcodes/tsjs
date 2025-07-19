"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const TaskScheduler_1 = require("./TaskScheduler");
// Lightweight API for scheduling tasks using a binary heap
const app = (0, express_1.default)();
const port = 3000;
const scheduler = new TaskScheduler_1.TaskScheduler();
app.use(express_1.default.json());
// @ts-expect-error type mismatch
app.post('/task', (req, res) => {
    const { id, runAt, priority, taskType, payload } = req.body;
    if (!id || !runAt || priority === undefined || !taskType) {
        return res.status(400).json({ error: 'Missing required fields: id, runAt, priority, taskType' });
    }
    const task = {
        id,
        runAt,
        priority,
        type: taskType,
        createdAt: Date.now(),
        payload,
    };
    scheduler.schedule(task);
    res.json({ message: 'Task scheduled', task });
});
app.get('/tasks', (_, res) => {
    res.json(scheduler.allTasks());
});
// @ts-expect-error type mismatch
app.post('/enqueue', (req, res) => {
    const { id, runAt, priority, type, payload } = req.body;
    if (!id || !runAt || priority === undefined || !type) {
        return res.status(400).json({ error: 'Missing required fields: id, runAt, priority, type' });
    }
    const task = {
        id,
        runAt,
        priority,
        type,
        createdAt: Date.now(),
        payload,
    };
    scheduler.schedule(task);
    res.status(200).send({ status: 'queued', id: task.id });
});
app.get('/queue', (req, res) => {
    res.send({ size: scheduler.size(), nextRunAt: scheduler.nextTaskEta() });
});
app.listen(port, () => {
    console.log(`Task Scheduler API running on http://localhost:${port}`);
});
// This function is called when a task is executed
function executeTask(task) {
    console.log(`Executing task ${task.id} of type ${task.type}`);
    // Add your task execution logic here
    if (task.type === 'email') {
        console.log(`[Email] Sending email to ${task.payload?.email ?? 'unknown'}`);
    }
}
//# sourceMappingURL=api.js.map