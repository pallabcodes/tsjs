"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApi = createApi;
exports.handleWebhook = handleWebhook;
const express_1 = __importDefault(require("express"));
const TaskRunner_1 = require("../scheduler/TaskRunner");
const axios_1 = __importDefault(require("axios"));
function createApi(scheduler) {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.post('/job', (req, res) => {
        scheduler.schedule({ ...req.body, createdAt: Date.now(), runAt: Date.now() });
        res.json({ ok: true });
    });
    app.get('/jobs', (req, res) => {
        res.json(scheduler.all());
    });
    setInterval(async () => {
        const due = scheduler.pollDue();
        for (const task of due)
            await (0, TaskRunner_1.runTask)(task, scheduler);
    }, 1000);
    return app;
}
async function handleWebhook(task) {
    const { url, headers, body } = task.payload;
    const res = await axios_1.default.post(url, body, { headers });
    console.log(`📡 Webhook sent to ${url} → status ${res.status}`);
}
//# sourceMappingURL=api.js.map