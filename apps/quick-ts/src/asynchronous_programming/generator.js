function* numbers() {
    yield 1;
    yield 2;
    yield 3;
    yield 4;
}

// Another generator that delegates to the above generator and then continues
function* combinedSequence() {
    // Delegate to numbers() generator
    yield* numbers();
    // Continue yielding additional values
    yield 5;
    yield 6;
}

// Consuming the generator
for (const num of combinedSequence()) {
    console.log(num);  // Outputs: 1, 2, 3, 4, 5, 6
}

// Example: Lazy Pipeline with Mapping and Filtering


// Step 1: Helper Generators for Mapping and Filtering
function* map(iterable, mapper) {
    for (const item of iterable) {
        yield mapper(item); // now, this mapper very well could be a delegation (i.e. another or helper generator function)
    }
}

function* filter(iterable, predicate) {
    for (const item of iterable) {
        if (predicate(item)) {
            yield item;
        };
    }

}

// Step 2: Composing a Pipeline

// Sample data array
const numbersArray = [1, 2, 3, 4, 5, 6, 7, 8];

// Create a pipeline: filter even numbers and then multiply each by 10
const filtered = filter(numbersArray, (n) => n % 2 === 0);

// Since `filtered` returns an iterator (an iterable), thus can be directly passed as the first argument for map generator function.
const mapped = map(filtered, (n) => n * 10);


// Below iteration ( is same as calling .next()) that triggers generator execution and only then generator function executes its task, nothing runs before that.
for (const value of mapped) {
    console.log(value);  // Outputs: 20, 40, 60, 80
}

// Example: Advanced Composition: Building a Pipeline Function

// A simple pipeline function that composes functions which return iterables
function pipeline(initialData, ...transformers) {
    return transformers.reduce((data, transformer) => transformer(data), initialData);
}

// Define transformations using our map and filter generators
const evenNumbers = (data) => filter(data, (n) => n % 2 === 0);
const timesTen = (data) => map(data, (n) => n * 10);

// Use the pipeline
const processed = pipeline(numbersArray, evenNumbers, timesTen);

for (const value of processed) {
    console.log(value);  // Outputs: 20, 40, 60, 80
}


// Async generators that yields numbers after a delay
async function* asyncNumberStream() {
    let i = 0;
    while (i < 5) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate async delay
        yield i++;
    }
}

// Consuming the async generator using for-await-of
(async () => {
    for await (const num of asyncNumberStream()) {
        console.log("Async Number:", num);
    }
})();

// Generator-Based Asynchronous Control Flow (The "Co" Pattern)

// Simulate an asynchronous task returning a promise
function asyncTask(value) {
    return new Promise((resolve) => {
        setTimeout(() => resolve(value * 2), 1000);
    });
}

// Generator that yields asynchronous tasks
function* taskRunner() {
    const result1 = yield asyncTask(1);
    console.log("Result1:", result1);

    const result2 = yield asyncTask(result1);
    console.log("Result2:", result2);

    return result2;
}

// A simple runner to execute the generator
function runGenerator(genFunc) {
    const iterator = genFunc();

    function iterate(iteration) {
        if (iteration.done) return Promise.resolve(iteration.value);
        return Promise.resolve(iteration.value)
            .then((result) => iterate(iterator.next(result)))
            .catch((err) => iterator.throw(err));
    }

    try {
        return iterate(iterator.next());
    } catch (err) {
        return Promise.reject(err);
    }
}

// Run the generator-based async flow
runGenerator(taskRunner).then((finalResult) => {
    console.log("Final Result:", finalResult);
});

// Data Processing

// Generator function that lazily processes an array of data
function* dataStreamProcessor(data) {
    for (const record of data) {
      // Imagine processing each record (e.g., filtering, transforming)
      yield record;
    }
  }
  
  // Usage:
  const logs = [/* Imagine thousands of log records */ "Log1", "Log2", "Log3"];
  const processor = dataStreamProcessor(logs);
  
  for (const log of processor) {
    console.log("Processing:", log);
  }
  