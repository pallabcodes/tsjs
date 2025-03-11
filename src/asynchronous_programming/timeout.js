function longRunningTask() {
    console.info(`Task started at: ${new Date().toLocaleTimeString()}`);

    const taskDuration = Math.random() * 4000 + 2000;

    setTimeout(() => {
        console.info(`current task finished at:${ new Date().toLocaleTimeString()}`)

        // now, wait for fixed 1000ms then start the next `longRunningTask`

        setTimeout(longRunningTask, 1000);

    }, taskDuration);

}


longRunningTask();