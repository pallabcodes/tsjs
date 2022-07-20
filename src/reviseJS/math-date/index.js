const list = [1, 2, -1.22, -2.44];
console.log(Math.min(null, ...list));
console.log(Math.max(null, ...list));
console.log(Math.abs(-12.22));
// multiply 2 four times is 16 = 2 * 2 * 2 * 2 = 16
console.log(Math.pow(2, 4));

const rounded = 11.11
console.log(Math.ceil(rounded));
console.log(Math.floor(rounded));
console.log(Math.round(rounded));

console.log(Math.abs(rounded));

// console.log( (Math.random() * 1) * 100);
// console.log( (Math.random() * 1) * 100);
// console.log(0.5394410908807037 * 100);
// console.log(Math.floor( (Math.random() * 1) * 100));

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}
// log16 = 2 * 2 * 2 * 2
console.log(getBaseLog(2, 16));
console.log(Math.log(16));


let today = new Date('07-21-2022'); // mm-dd-yyyy
console.log(today);
