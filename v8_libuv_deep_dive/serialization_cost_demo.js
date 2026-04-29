// serialization_cost_demo.js
// Simulates the architectural difference between crossing the JS/C++ boundary 
// via serialization (JSON) vs raw memory sharing (SharedArrayBuffer).

function run_demo() {
    const iterations = 50_000;
    
    // Simulate a complex object we want to send to a C++ add-on
    const complex_object = {
        id: 12345,
        matrix: Array(100).fill(0).map(() => Math.random()),
        metadata: { timestamp: Date.now(), active: true }
    };

    console.log("--- Serialization Boundary (N-API / JSON simulation) ---");
    const start_serial = performance.now();
    for (let i = 0; i < iterations; i++) {
        // Simulating the work V8/N-API must do to parse the object into C++
        const serialized = JSON.stringify(complex_object); 
        // ... C++ work happens here ...
        const deserialized = JSON.parse(serialized);
    }
    const end_serial = performance.now();
    console.log(`Time spent crossing boundary: ${(end_serial - start_serial).toFixed(2)} ms`);

    // ----------------------------------------------------------------------
    
    console.log("\n--- Zero-Copy Boundary (SharedArrayBuffer) ---");
    // Allocate 400 bytes of raw memory (100 Float32s)
    const sab = new SharedArrayBuffer(400); 
    const raw_memory_view = new Float32Array(sab);
    
    // Pre-fill the memory
    for(let i=0; i<100; i++) raw_memory_view[i] = Math.random();

    const start_raw = performance.now();
    for (let i = 0; i < iterations; i++) {
        // C++ and JS are literally looking at the exact same RAM addresses.
        // There is ZERO serialization. 
        // We just pass the memory pointer to the C++ addon.
        
        // Simulating C++ instantly accessing index 50
        const cpp_read = raw_memory_view[50]; 
    }
    const end_raw = performance.now();
    console.log(`Time spent crossing boundary: ${(end_raw - start_raw).toFixed(2)} ms`);
}

run_demo();

/*
SYSTEMS ENGINEERING INSIGHT:
If you run this, you will see the Zero-Copy approach is magnitudes faster.

When building a high-performance Rust IDE with a JS frontend:
NEVER do this: `Rust.parse(document.getText())` (Massive String Serialization)
DO THIS: Keep the text buffer in a SharedArrayBuffer. Rust and JS read the 
exact same memory at the exact same time. The boundary disappears.
*/
