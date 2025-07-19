"use strict";
// 🗓️ Async Generator + Heap: Weekly Scheduler Example
// Suppose you want to process jobs that should run every week, but you want to:
class MinHeap {
    constructor(cmp) {
        this.cmp = cmp;
        this.data = [];
    }
    insert(val) { this.data.push(val); this._up(this.data.length - 1); }
    extract() {
        if (!this.data.length)
            return undefined;
        const top = this.data[0];
        const end = this.data.pop();
        if (this.data.length) {
            this.data[0] = end;
            this._down(0);
        }
        return top;
    }
    peek() { return this.data[0]; }
    size() { return this.data.length; }
    _up(i) {
        while (i > 0) {
            const p = Math.floor((i - 1) / 2);
            if (this.cmp(this.data[i], this.data[p]) >= 0)
                break;
            [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
            i = p;
        }
    }
    _down(i) {
        const n = this.data.length;
        while (true) {
            let min = i, l = 2 * i + 1, r = 2 * i + 2;
            if (l < n && this.cmp(this.data[l], this.data[min]) < 0)
                min = l;
            if (r < n && this.cmp(this.data[r], this.data[min]) < 0)
                min = r;
            if (min === i)
                break;
            [this.data[i], this.data[min]] = [this.data[min], this.data[i]];
            i = min;
        }
    }
}
class RetryQueue {
    constructor() {
        this.q = [];
    }
    enqueue(item) { this.q.push(item); }
    dequeue() { return this.q.shift(); }
    size() { return this.q.length; }
}
class UndoStack {
    constructor() {
        this.s = [];
    }
    push(item) { this.s.push(item); }
    pop() { return this.s.pop(); }
    size() { return this.s.length; }
}
// --- Async job sources (simulate APIs/DBs) ---
async function* paymentJobSource() {
    let i = 1;
    while (i <= 2) {
        await new Promise(res => setTimeout(res, 3000));
        yield {
            id: `payment-${i}`,
            runAt: Date.now() + 1000 * i,
            priority: 10,
            type: 'payment',
            payload: { amount: 100 * i, user: `user${i}` },
            retries: 2
        };
        i++;
    }
}
async function* rideJobSource() {
    let i = 1;
    while (i <= 2) {
        await new Promise(res => setTimeout(res, 2000));
        yield {
            id: `ride-${i}`,
            runAt: Date.now() + 2000 * i,
            priority: 8,
            type: 'ride',
            payload: { rider: `rider${i}`, destination: `dest${i}` },
            retries: 1
        };
        i++;
    }
}
async function* bookingJobSource() {
    let i = 1;
    while (i <= 2) {
        await new Promise(res => setTimeout(res, 2500));
        yield {
            id: `booking-${i}`,
            runAt: Date.now() + 1500 * i,
            priority: 7,
            type: 'booking',
            payload: { guest: `guest${i}`, room: `room${i}` },
            retries: 1
        };
        i++;
    }
}
// --- Merge async iterators ---
async function* mergeAsync(...iters) {
    const readers = iters.map(it => it[Symbol.asyncIterator]());
    let doneCount = 0;
    while (doneCount < readers.length) {
        const results = await Promise.all(readers.map(r => r.next()));
        doneCount = results.filter(r => r.done).length;
        for (let i = 0; i < results.length; i++) {
            if (!results[i].done)
                yield results[i].value;
        }
    }
}
// --- Real-world handlers (mocked) ---
async function handlePayment(job) {
    console.log(`💳 Processing payment of $${job.payload.amount} for ${job.payload.user}`);
    if (Math.random() < 0.3)
        throw new Error('Payment gateway error');
}
async function handleRide(job) {
    console.log(`🚗 Assigning ride for ${job.payload.rider} to ${job.payload.destination}`);
    if (Math.random() < 0.3)
        throw new Error('No drivers available');
}
async function handleBooking(job) {
    console.log(`🏨 Booking room ${job.payload.room} for ${job.payload.guest}`);
    if (Math.random() < 0.3)
        throw new Error('Room unavailable');
}
async function handleReport(job) {
    console.log(`📊 Generating report...`);
}
async function handleBackup(job) {
    console.log(`💾 Backing up data...`);
}
// --- Main scheduler logic ---
async function* weeklyJobRunner(heap) {
    while (heap.size()) {
        const now = Date.now();
        const next = heap.peek();
        if (!next)
            break;
        if (next.runAt > now) {
            await new Promise(res => setTimeout(res, next.runAt - now));
        }
        const job = heap.extract();
        yield job;
        // Reschedule for next week
        heap.insert({ ...job, runAt: job.runAt + 7 * 24 * 60 * 60 * 1000 });
    }
}
// --- Example usage ---
(async () => {
    const heap = new MinHeap((a, b) => a.runAt !== b.runAt ? a.runAt - b.runAt : b.priority - a.priority);
    const retryQueue = new RetryQueue();
    const undoStack = new UndoStack();
    // Seed jobs
    heap.insert({ id: 'weekly-report', runAt: Date.now() + 2000, priority: 1, type: 'report', payload: {}, retries: 2 });
    heap.insert({ id: 'weekly-backup', runAt: Date.now() + 4000, priority: 2, type: 'backup', payload: {}, retries: 1 });
    // Dynamically add jobs from async sources
    (async () => {
        for await (const job of mergeAsync(paymentJobSource(), rideJobSource(), bookingJobSource())) {
            console.log(`🆕 Dynamically scheduling job: ${job.id}`);
            heap.insert(job);
        }
    })();
    // Main processing loop
    for await (const job of weeklyJobRunner(heap)) {
        try {
            switch (job.type) {
                case 'payment':
                    await handlePayment(job);
                    break;
                case 'ride':
                    await handleRide(job);
                    break;
                case 'booking':
                    await handleBooking(job);
                    break;
                case 'report':
                    await handleReport(job);
                    break;
                case 'backup':
                    await handleBackup(job);
                    break;
                default: console.log(`Unknown job type: ${job.type}`);
            }
            // On success, push to undo stack
            undoStack.push(job);
        }
        catch (err) {
            console.log(`❌ Job ${job.id} failed: ${err}`);
            if (job.retries && job.retries > 0) {
                job.retries -= 1;
                retryQueue.enqueue({ ...job, runAt: Date.now() + 5000 }); // retry in 5s
            }
        }
        // Process retry queue if any
        while (retryQueue.size()) {
            const retryJob = retryQueue.dequeue();
            heap.insert(retryJob);
        }
        // Optionally, undo last job (simulate rollback)
        if (undoStack.size() && Math.random() < 0.1) {
            const undone = undoStack.pop();
            console.log(`↩️ Undoing job: ${undone?.id}`);
            // Here you could add real rollback logic per job type
        }
    }
})();
//# sourceMappingURL=advanced.js.map