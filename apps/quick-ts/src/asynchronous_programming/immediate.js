// console.log('Start');

// process.nextTick(() => {
//   console.log('nextTick callback');
// });

// setTimeout(() => {
//   console.log('setTimeout callback');
// }, 0);

// setImmediate(() => {
//   console.log('setImmediate callback');
// });

// console.log('End');

// // start - end - nextTick callback - setTimeout callback - setImmediate callback

// function processLargeDataset(dataset) {
//   let index = 0;
//   const chunkSize = 100; // Process 100 items per chunk

//   function processChunk() {
//     const end = Math.min(index + chunkSize, dataset.length);
    
//     for (; index < end; index++) {
//       // Simulate processing each item
//       console.log(`Processing item ${dataset[index]}`);
//     }

//     if (index < dataset.length) {
//       // Yield control: schedule the next chunk to run in the Check phase
//       setImmediate(processChunk);
//     } else {
//       console.log("Completed processing all items.");
//     }
//   }

//   processChunk();
// }

// const largeDataset = Array.from({ length: 1000 }, (_, i) => i + 1);
// processLargeDataset(largeDataset);
  


// // const fs = require("fs");

// // const handler = (err, data) => {
// //     if (err) {
// //         return console.error("Error reading file:", err);
// //     }
// //     console.log("File read complete. Scheduling post-processing...");

// //     // Schedule immediate processing after I/O events
// //     setImmediate(() => {
// //         // Process file data after ensuring all I/O callbacks have been handled
// //         console.log("Processing file data:", data.slice(0, 50) + "...");
// //     });
// // }

// // fs.readFile("example.txt", "utf8", handler);
