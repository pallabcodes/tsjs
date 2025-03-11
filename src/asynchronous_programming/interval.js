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


const healthCheckInterval = setInterval(healthCheck, 5000);