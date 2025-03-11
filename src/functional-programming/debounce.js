function debouce (fn, delay) {
    let timerId;

    return function (...args) {
        // step 1: remove the current setTimeout

        if (timerId) clearTimeout(timerId);

        // step 2: assign a new timer

        timerId = setTimeout(() => fn(...args), delay);

        // timerId = setTimeout(() => fn.apply(null, ...args), delay);
    }
}

const deboucedLog = ((msg) => {
    console.info(msg);
}, 400);

deboucedLog('Hello');
deboucedLog('World');