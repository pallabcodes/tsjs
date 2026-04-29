# Phase 1: V8 JIT & Hidden Classes

JavaScript is an untyped, dynamic language. You can add or remove properties from an object at any time. 
In a naive implementation (like early Python or Ruby), this means an object is just a Dictionary (Hash Map). Looking up `obj.x` requires hashing the string `"x"` and doing a memory scan. This is extremely slow and destroys CPU cache locality.

So how does Google's V8 engine run JS so fast? **It cheats.**

## The V8 Engine Pipeline
When you run JS, it doesn't compile directly to Assembly.
1. **Ignition (Interpreter):** V8 parses the JS and compiles it to Bytecode. It executes this bytecode immediately. It's slow, but starts fast.
2. **TurboFan (Optimizing JIT Compiler):** While Ignition runs, V8 profiles your code. If a function is called many times (it becomes "Hot"), TurboFan takes over. It compiles the JS directly into highly optimized **Native Machine Code** (Assembly).

## How TurboFan Cheats: Hidden Classes (Shapes)
Assembly code cannot do Hash Map lookups efficiently. Assembly wants a C-struct with fixed memory offsets (e.g., `Memory Address + 8 bytes`).

To give TurboFan what it wants, V8 dynamically creates **Hidden Classes** (internally called Maps or Shapes) in C++.
If you write:
```javascript
const obj1 = { x: 1, y: 2 };
const obj2 = { x: 3, y: 4 };
```
V8 notices that `obj1` and `obj2` have the exact same properties, added in the exact same order. It assigns them both the same *Hidden Class*. 

## The Trap: Deoptimization
TurboFan relies entirely on these Hidden Classes. It generates Assembly assuming that every object passed into a function will have the same Shape. This is called **Inline Caching**.

But what if you break the rules?
```javascript
const obj3 = { x: 5 };
obj3.y = 6; // Dynamically adding a property later!
```
Even though `obj3` ends up looking like `obj1` (`{x, y}`), because `y` was added *later*, V8 creates a **different** Hidden Class for it.

If you pass `obj3` into a Hot function that TurboFan has already optimized for `obj1`'s shape, TurboFan panics. It throws away the fast Assembly code, falls back to the slow Ignition bytecode (a **Deoptimization**), and your application suddenly drops 100x in performance.

### Systems Engineering Insight
This is why TypeScript is so valuable. It forces you to define strict Shapes (Interfaces). If you instantiate your objects predictably (always defining all properties in the constructor, even if null), V8's JIT compiler will keep your code running at C-like speeds.
