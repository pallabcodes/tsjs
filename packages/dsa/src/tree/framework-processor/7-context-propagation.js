"use strict";
/**
 * 7. REACT CONTEXT PROPAGATION
 *
 * Deconstructing how React propagates context changes without
 * having to re-render every component in between.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContext = createContext;
exports.propagateContextChange = propagateContextChange;
exports.useContext = useContext;
function createContext(defaultValue) {
    const context = {
        _currentValue: defaultValue,
        Provider: null,
    };
    context.Provider = { _context: context };
    return context;
}
function propagateContextChange(workInProgress, context, changedBits) {
    console.log(`[Context] Propagating change for context to children of: ${workInProgress.id}`);
    let fiber = workInProgress.child;
    while (fiber) {
        // 1. Check if this fiber depends on this context
        // 2. If yes, schedule an update on this fiber
        // 3. Continue searching siblings and children
        fiber = fiber.sibling;
    }
}
/**
 * 3️⃣ useContext Implementation
 */
function useContext(context) {
    console.log(`[Context] useContext called for value: ${context._currentValue}`);
    // In reality, this adds the context to the current fiber's 'dependencies' list.
    return context._currentValue;
}
/**
 * USAGE DEMO
 */
const UserContext = createContext({ name: "Guest" });
function App() {
    console.log("[App] Rendering Provider with 'Alice'");
    UserContext._currentValue = { name: "Alice" }; // Mocking Provider value change
}
function Child() {
    const user = useContext(UserContext);
    console.log(`[Child] Received Context: ${user.name}`);
}
if (require.main === module) {
    console.log("--- Initial Context Access ---");
    Child();
    console.log("\n--- Simulating Provider Update ---");
    App();
    console.log("\n--- Child re-accessing context ---");
    Child();
}
//# sourceMappingURL=7-context-propagation.js.map