// creation

console.log(Array.of(1, 2, [3, [4, 5]]));

console.log(Array.from([1, 2, [3, [4, 5]]]));

const strToArray = Array.from("hello");
console.info(strToArray);

// element lookup : find, findIndex, includes

console.info(strToArray.includes('h')); // true
console.info(strToArray.includes('H')); // false

console.log(strToArray.findIndex((item) => item === 'e'));
console.log(strToArray.findIndex((item) => item === 'z'));
console.log(strToArray.findIndex((item) => item === 'E'));


console.log(strToArray.find((item) => item === 'e'));
console.log(strToArray.find((item) => item === 'E'));

// transformation

const mapping = strToArray.map((item) => {
    if (item === 'h') return item.toUpperCase();
    return item;
})

console.info(mapping);


function capitalize(element, idx, src) {
    console.log(idx);

    if (element === 'h') return item.toUpperCase();

    return element;
}



const mapping2 = strToArray.map(capitalize)

console.info(mapping2);

const users = [
    { id: 1, active: true },
    { id: 2, active: false },
    { id: 3, active: true }
];

const activeUsers = users.filter(user => user.active);
console.log(activeUsers);


const orders = [10, 20, 30];
const total = orders.reduce((acc, cur) => acc + cur, 0);
console.log(total); // 60


const sentences = ['Hello world', 'ES6 is awesome'];
const words = sentences.flatMap(sentence => sentence.split(' '));
console.log(words); // ['Hello', 'world', 'ES6', 'is', 'awesome']


const nested = [1, [2, [3, [4]]]];
console.log(nested.flat(2)); // [1, 2, [3, [4]]]


const products = [
    { id: 1, price: 20, available: true },
    { id: 2, price: 40, available: false },
    { id: 3, price: 30, available: true }
];

const totalAvailableCost = products
    .filter(p => p.available)
    .map(p => p.price)
    .reduce((total, price) => total + price, 0);

console.log(totalAvailableCost); // 50


// iteration

const logs = ['Log1', 'Log2', 'Log3'];
logs.forEach((log, idx) => console.log(`Index ${idx}: ${log}`));

for (const item of [1, 2, 3]) {
    if (item === 2) continue; // Skip item 2
    console.log(item);
}