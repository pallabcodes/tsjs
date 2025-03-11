createPromise(0).then(response => response).then(data => data * 10).then(multiplied => console.log(`multiplied: ${multiplied}`));

console.log("start");


Promise.resolve(2).then(() => console.log(2));


function createPromise (delay = 0) {
    return new Promise ((resolve) => {
        console.log(`This console.log is sync, so it will print first`);
        setTimeout(() => {
            resolve(10);
        }, delay);
        
    });
}

// createPromise(0).then(response => console.log("response: ", response));



console.log("end");