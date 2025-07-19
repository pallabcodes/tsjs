"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WeightedFairQueueManager_1 = require("./WeightedFairQueueManager");
const manager = new WeightedFairQueueManager_1.WeightedFairQueueManager();
manager.registerSource('free', 1);
manager.registerSource('premium', 3);
const now = Date.now();
for (let i = 0; i < 10; i++) {
    manager.enqueue({
        id: `free-${i}`,
        sourceId: 'free',
        runAt: now,
        priority: i,
        createdAt: now,
        payload: { tier: 'free' }
    });
}
for (let i = 0; i < 10; i++) {
    manager.enqueue({
        id: `premium-${i}`,
        sourceId: 'premium',
        runAt: now,
        priority: i,
        createdAt: now,
        payload: { tier: 'premium' }
    });
}
setInterval(() => {
    const next = manager.pollNextTask();
    if (next) {
        console.log(`🔄 Executing ${next.id} (${next.sourceId})`);
    }
}, 500);
//# sourceMappingURL=main.js.map