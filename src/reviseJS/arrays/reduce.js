// basic usage
function sum(numbers = [1, 2, 4, 5]) {
  // acc : 1 and item 2 > returns acc + item = 3
  // acc : 3 and item 4 > returns acc + item = 7
  // acc : 7 and item 5 > returns acc + item = 12
  return numbers.reduce((acc, item) => acc + item);
}
function sumWithInitialValue(numbers = [1, 2, 4, 5]) {
  // acc : 0 and item 1 > returns acc + item = 1
  // acc : 1 and item 2 > returns acc + item = 3
  // acc : 3 and item 4 > returns acc + item = 7
  // acc : 7 and item 5 > returns acc + item = 12
  return numbers.reduce((acc, item) => acc + item, 0);
}

console.log(sum());

function getRandomNo() {
  return Math.random();
}

function rounding(value) {
  return Math.round(value);
}

// left to right move is compose by using reduce  whereas right to left with reduceRight is pipe
function compose(...fns) {
  return fns.reduce((fn, item) => {
    // console.log("acc: ", fn(), " item: ", item);
    return `result: ${item(fn() * 100)}`;
  });
}

// left to right move:  fist get the value from left-most getRandomNo then rounding fn
// console.log(compose(getRandomNo, rounding));
// console.log(compose(getRandomNo, rounding));


