"use strict";
/**
 * 8. REACT SUSPENSE & ERROR BOUNDARIES
 *
 * Deconstructing the "unwind" phase: how React catches promises
 * and errors to show Fallbacks or Error UI.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorBoundaryTag = exports.SuspenseTag = void 0;
exports.renderComponent = renderComponent;
// 1️⃣ Suspense Symbols
exports.SuspenseTag = 13;
exports.ErrorBoundaryTag = 4;
/**
 * 2️⃣ The "Throwing Promises" Pattern
 *
 * When a component calls a resource that isn't ready, it throws
 * a promise. React catches this in a try-catch block wrapping 'render'.
 */
function renderComponent(wip, Component) {
    try {
        return Component();
    }
    catch (thrownValue) {
        const value = thrownValue;
        if (value && typeof value.then === "function") {
            // It's a Promise! This is Suspense.
            console.log(`[Suspense] Caught promise from: ${wip.id}. Unwinding...`);
            handleSuspense(wip, value);
        }
        else {
            // It's a real Error! This is an Error Boundary.
            console.log(`[Error] Caught error from: ${wip.id}. Unwinding...`);
            handleError(wip, value);
        }
    }
}
/**
 * 3️⃣ The Unwind Phase
 *
 * React walks UP the return pointer (parent chain) from the crashing fiber
 * to find the nearest boundary (Suspense or ErrorBoundary).
 */
function handleSuspense(fiber, promise) {
    let boundary = fiber.return || null;
    while (boundary) {
        if (boundary.tag === exports.SuspenseTag) {
            console.log(`[Suspense] Found boundary at: ${boundary.id}`);
            // 1. Mark boundary for re-render
            // 2. promise.then(() => scheduleUpdate(boundary))
            return;
        }
        boundary = boundary.return || null;
    }
    throw new Error("Suspense boundary not found!");
}
function handleError(fiber, error) {
    let boundary = fiber.return || null;
    while (boundary) {
        if (boundary.tag === exports.ErrorBoundaryTag) {
            console.log(`[Error] Found boundary at: ${boundary.id}`);
            // 1. Capture error
            // 2. Switch boundary to error-state
            return;
        }
        boundary = boundary.return || null;
    }
    throw error; // No boundary found, crash the app
}
/**
 * USAGE DEMO
 */
const cache = new Map();
function fetchData(id) {
    if (cache.has(id))
        return cache.get(id);
    const promise = new Promise((res) => setTimeout(() => {
        cache.set(id, "Success Data");
        res(true);
    }, 10));
    throw promise; // Suspend!
}
function AsyncComponent() {
    const data = fetchData("1");
    console.log(`[Component] Data: ${data}`);
    return data;
}
if (require.main === module) {
    const boundary = { id: "suspense-boundary", tag: exports.SuspenseTag, return: null };
    const fiber = { id: "async-node", memoizedState: null, alternate: null, return: boundary };
    console.log("--- First Render (Suspend) ---");
    renderComponent(fiber, AsyncComponent);
    console.log("\n--- After Promise Resolves (Mock) ---");
    setTimeout(() => {
        console.log("--- Second Render (Success) ---");
        renderComponent(fiber, AsyncComponent);
    }, 20);
}
//# sourceMappingURL=8-suspense-logic.js.map