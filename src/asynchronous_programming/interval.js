// Example health check in every 5 seconds

const healthCheck = () => {
    try {

        // starts the current health check
        console.log("Performing health check at", new Date().toLocaleTimeString());
        const randomValue = Math.random();
        
        // Simulate a possible error:
        if (randomValue < 0.1) {
            throw new Error("Random health check failure!");
        }

        // Process health check result

    } catch (error) {
        console.error("Health check error:");
        
        // If a critical error occurs, clear the interval to stop further checks
        clearInterval(healthCheckInterval);

    }
};


function promiseInterval(fn, ms) {
  let stopped = false;
  async function loop() {
    while (!stopped) {
      await fn();
      await new Promise(res => setTimeout(res, ms));
    }
  }
  loop();
  return () => { stopped = true; };
}

// Usage:
const stop = promiseInterval(async () => {
  console.log("Async interval at", new Date().toLocaleTimeString());
  if (Math.random() < 0.1) {
    console.log("Stopping interval due to random event!");
    stop();
  }
}, 2000);

function robustInterval(fn, ms, maxRetries = 3) {
  let stopped = false;
  let retries = 0;
  async function loop() {
    while (!stopped) {
      try {
        await fn();
        retries = 0;
      } catch (err) {
        console.error("Interval error:", err);
        retries++;
        if (retries >= maxRetries) {
          console.error("Max retries reached. Stopping interval.");
          stopped = true;
        }
      }
      await new Promise(res => setTimeout(res, ms));
    }
  }
  loop();
  return () => { stopped = true; };
}

// Usage:
const stopRobust = robustInterval(async () => {
  console.log("Robust interval at", new Date().toLocaleTimeString());
  if (Math.random() < 0.2) throw new Error("Random failure!");
}, 3000);

function abortableInterval(fn, ms, signal) {
  async function loop() {
    while (!signal.aborted) {
      await fn();
      await new Promise(res => setTimeout(res, ms));
    }
  }
  loop();
}

// Usage:
const controller = new AbortController();
abortableInterval(() => {
  console.log("Abortable interval at", new Date().toLocaleTimeString());
}, 4000, controller.signal);

// To stop:
setTimeout(() => controller.abort(), 12000);

function dynamicInterval(fn, getDelay) {
  let stopped = false;
  async function loop() {
    while (!stopped) {
      await fn();
      const delay = getDelay();
      await new Promise(res => setTimeout(res, delay));
    }
  }
  loop();
  return () => { stopped = true; };
}

// Usage:
let base = 1000;
const stopDynamic = dynamicInterval(() => {
  console.log("Dynamic interval at", new Date().toLocaleTimeString());
  base += 500;
}, () => base);