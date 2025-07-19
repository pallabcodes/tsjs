"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const starvationScheduer_1 = require("./starvationScheduer");
const scheduler = new starvationScheduer_1.StarvationAwareScheduler();
scheduler.schedule({
    id: 'task-low',
    runAt: Date.now() + 1000,
    priority: 1,
    agingFactor: 0.001,
    createdAt: Date.now(),
    type: 'retry',
    payload: {}
});
scheduler.schedule({
    id: 'task-high',
    runAt: Date.now() + 1000,
    priority: 10,
    agingFactor: 0,
    createdAt: Date.now(),
    type: 'retry',
    payload: {}
});
//# sourceMappingURL=starvation-test.js.map