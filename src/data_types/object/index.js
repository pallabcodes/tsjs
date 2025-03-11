function throttle(fn, gap = 1000) {

    let lastCall = 0, timerId;

    return function (...args) {
        const now = Date.now();

        if (now - lastCall >= gap) {
            lastCall = now;
            fn.apply(null, args);
        } else if (!timerId) {
            timerId = setTimeout(() => {
                lastCall = Date.now();
                timerId = null;
                fn(...args);
            }, gap - (now - lastCall)); // 5000 - (4800 - 1250) = 1550
        }
    }

}

const throttledLog = throttle(msg => console.log("Throttled:", msg, Date.now()), 1000);

throttledLog("Event 1");
throttledLog("Event 2");