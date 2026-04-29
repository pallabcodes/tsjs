// jit_deopt_demo.js
// Empirically demonstrates the 10x-100x speed penalty when V8 Deoptimizes 
// compiled Assembly back to interpreted Bytecode due to polymorphic object shapes.

// Run this with Node.js: node jit_deopt_demo.js

function calculate_area(shape) {
    // V8 TurboFan will compile this to fast assembly assuming 'shape' 
    // always has the exact same memory layout.
    return shape.x * shape.y;
}

function run_benchmark(name, objects) {
    const iterations = 50_000_000;
    
    // Warm up phase: Let V8 profile the code and run the TurboFan JIT compiler
    for (let i = 0; i < 10000; i++) {
        calculate_area(objects[0]);
    }

    // Benchmark phase
    const start = performance.now();
    let sum = 0;
    for (let i = 0; i < iterations; i++) {
        // We cycle through the objects array
        sum += calculate_area(objects[i % objects.length]);
    }
    const end = performance.now();
    
    console.log(`[${name}] Time: ${(end - start).toFixed(2)} ms`);
    return sum;
}

// --- SCENARIO 1: Monomorphic (Fast) ---
// Both objects have the exact same "Hidden Class" (Shape).
// Created with identical properties in the identical order.
const fast_obj1 = { x: 10, y: 20 };
const fast_obj2 = { x: 15, y: 25 };

console.log("--- V8 JIT Optimization Demo ---");
run_benchmark("Monomorphic (Fast Assembly)", [fast_obj1, fast_obj2]);


// --- SCENARIO 2: Polymorphic (Slow - Deoptimization) ---
// These objects look the same, but they have DIFFERENT Hidden Classes.
const slow_obj1 = { x: 10, y: 20 };

const slow_obj2 = { x: 15 };
slow_obj2.y = 25; // Dynamically added later! Shape is altered.

const slow_obj3 = { y: 25, x: 15 }; // Initialized in wrong order! Shape is altered.

// When TurboFan sees slow_obj2, it realizes its Assembly code is invalid for this Shape.
// It throws away the Assembly and falls back to the slow Ignition Interpreter.
run_benchmark("Polymorphic (Slow Bytecode)", [slow_obj1, slow_obj2, slow_obj3]);

/* 
SYSTEMS ENGINEERING INSIGHT:
If you run this, the "Polymorphic" test will be significantly slower, even though 
the actual math is exactly the same.
This proves that JS performance is largely dictated by how predictably you lay out 
memory. Always initialize your objects predictably!
*/
