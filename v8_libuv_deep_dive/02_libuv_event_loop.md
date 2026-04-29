# Phase 2: `libuv` and the Event Loop

When Ryan Dahl created Node.js, he wanted to use V8, but V8 doesn't know how to talk to a network or a file system. So he wrote a C library called `libuv` to act as the bridge between V8 and the OS Kernel.

## The Dual Architecture of Node.js

Node.js is not entirely single-threaded. It is a hybrid:
1. **The V8 Thread:** A single OS thread that executes your JavaScript code.
2. **The `libuv` Layer:** A C library that handles the Event Loop and OS Syscalls.

### Network I/O (epoll)
For network requests (`http.get`), Node.js behaves exactly like Erlang or Python `asyncio`. 
`libuv` sets the socket to non-blocking, hands it to the Linux kernel via `epoll_ctl`, and yields. The V8 thread continues executing other JavaScript. When the kernel fires an interrupt, `libuv` pushes a callback onto the Event Loop queue for V8 to execute.

### The Cheat: The Hidden Thread Pool
What about File System I/O (`fs.readFile`)? 
Historically, Linux `epoll` did not support regular files (only sockets/pipes). So `libuv` cheats. 
When you call `fs.readFile`, `libuv` pushes that task to a **hidden C Thread Pool** (default size: 4 threads). One of those background C threads makes the blocking `read()` syscall. When it finishes, it queues the callback for the main V8 thread.

If you read 5 massive files simultaneously in Node.js, the 5th file will block until one of the 4 background threads finishes. (This is why `UV_THREADPOOL_SIZE` is a critical environment variable for heavy Node.js infra).

## Microtasks vs Macrotasks

The Event Loop is not a single queue; it is a series of prioritized phases.
The most critical architectural distinction is between:
1. **Macrotasks (Timers, I/O):** Handled by `libuv`. These are queued when `setTimeout` fires or `epoll` returns data.
2. **Microtasks (Promises, `queueMicrotask`):** Handled natively by V8.

**The Golden Rule:** 
V8 will *completely drain* the Microtask queue immediately after the current JS execution finishes, *before* it allows `libuv` to process the next Macrotask. 

If you have a recursive Promise chain, you will starve the `libuv` Event Loop. Your server will stop accepting network requests, even though it's "asynchronous," because V8 never yields control back to `libuv`.
