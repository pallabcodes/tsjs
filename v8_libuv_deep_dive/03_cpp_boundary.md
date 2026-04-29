# Phase 3: The C++/JS Serialization Boundary

A common misconception among intermediate developers is: *"JavaScript is slow, so if I rewrite this function in C++ and use a Node Native Addon, it will be faster."*

At the L7 systems level, you know this is often **false**.

## The Boundary Cost

Just like we saw in the Lua deep dive (The Virtual Stack), C++ and JavaScript do not share the same heap memory layout.
1. V8 JavaScript objects are highly complex structures (Hidden Classes, Garbage Collected, Tagged Pointers).
2. Native C++ uses raw, untagged memory (structs, `std::vector`).

When you call a Native C++ module from Node.js (via N-API or Node-API), the data must cross the boundary.
If you pass a massive JSON object to C++:
1. V8 must pause.
2. The V8 C++ bindings must iterate over the JS object, reading its strings and numbers.
3. It must allocate native C++ memory and copy those values (Serialization).
4. The C++ function runs.
5. The result must be serialized back into a new V8 `JSObject`.

## The Math of Mechanical Sympathy

If your C++ function takes 10 microseconds to run, but serialization takes 50 microseconds, your "optimization" just made the app 6x slower. 

V8's TurboFan JIT compiler is so incredibly fast (generating pure Assembly) that for simple math or array manipulation, pure JavaScript is often faster than crossing the C++ boundary.

### When to use C++ / Rust (WebAssembly) in JS:
You should only cross the boundary if:
1. The computation is massive (e.g., Image Processing, Cryptography) and takes milliseconds/seconds. The serialization cost becomes negligible.
2. You can use **SharedArrayBuffer** or raw `Uint8Array`. Like the Lua FFI, you can pass a pointer to a chunk of raw memory to C++/Rust. Since no JS object serialization is required, the boundary cost drops to near zero.

### IDE Architecture Takeaway
If you build your `rust/mastery/ide` with a Rust core and a TypeScript UI (like VS Code does with Electron/Node), this boundary is your enemy. You cannot serialize the entire text buffer as a JSON string back and forth every time the user types a character. You must pass memory references or use highly optimized delta-updates to minimize boundary crossing.
