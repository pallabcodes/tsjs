// event_loop_demo.js
// Empirically demonstrates the strict prioritization of V8 Microtasks (Promises)
// over libuv Macrotasks (Timers/IO), and how it can cause starvation.

const fs = require('fs');

console.log("1. Script Start (Synchronous Execution)");

// Macrotask 1: Timers (Handled by libuv timer heap)
setTimeout(() => {
    console.log("6. Macrotask: setTimeout (Timer expired)");
}, 0);

// Macrotask 2: I/O (Handled by libuv C Thread Pool)
// We just stat the current directory, which is very fast, but still crosses to C++
fs.stat('.', () => {
    console.log("7. Macrotask: File I/O callback (Thread Pool finished)");
});

// Microtask 1: Promises (Handled natively by V8)
Promise.resolve().then(() => {
    console.log("3. Microtask: Promise 1 resolved");
    
    // We queue ANOTHER Microtask from inside a Microtask
    Promise.resolve().then(() => {
        console.log("4. Microtask: Promise 2 resolved (Queued from Promise 1)");
    });
});

// Microtask 2: process.nextTick (Node-specific, highest priority microtask)
process.nextTick(() => {
    console.log("2. Microtask: process.nextTick (V8 drains this before Promises)");
});

console.log("5. Script End (V8 will now drain Microtasks before asking libuv for Macrotasks)");

/* 
SYSTEMS ENGINEERING INSIGHT:
When you run this script, look at the order of execution.
Even though `setTimeout` and `fs.stat` were called BEFORE the Promises, 
their callbacks execute LAST.

Why? Because V8 has total control over the execution thread. When synchronous 
execution finishes, V8 looks at its internal Microtask queue and drains it 
COMPLETELY (including Microtasks spawned by Microtasks). 

Only when the Microtask queue is empty does V8 ask the C++ `libuv` layer: 
"Do you have any network or timer callbacks ready?"

If you write a recursive Promise loop, `libuv` will starve, and your Node server 
will stop accepting TCP connections.
*/
