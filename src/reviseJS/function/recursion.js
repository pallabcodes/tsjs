function countdown(value) {
  if (value > 0) {
    console.log(value);
    /*
    * return countdown(value - 1)
    * return countdown(value - 1)
    * return countdown(value - 1) + countdown( value - 1);
    * return value + countdown(value - 1)
    * return  [].concat(...countdown(n - 1))
    * return {}.entries(([key, value]) =>  countdown(value) );
    * */
    return countdown(value - 1);
  } else {
    return value;
  }
}

countdown(10);

function factorial(number) {
  if (number <= 0) {
    return 1;
  } else {
    return (number * factorial(number - 1));
  }
}

console.log(factorial(4));

// # tail optimization
function size([x, ...rest], count = 0) {
  // [x, ...rest] = []; // x = undefined and rest []
  console.log(x);
  console.log(rest);
  return x === undefined ? count : size(rest, count + 1);
}

size([1, 2, 3], 0);

function loopingReverse(start, end) {
  if (start !== end) {
    loopingReverse(start + 1, end);
  }
  /*
  * 5
  * 4
  * 3
  * 2
  * 1
  * 0
  *  */
  console.log(start);
}

loopingReverse(0, 5);

function reverse(str) {
  if (!str.length) return "";
  return str[str.length - 1] + reverse(str.slice(0, str.length - 1));

}

console.log(reverse("hello"));

function looping(start = 0, end = 5) {
  if (end !== start) {
    looping(start, end - 1);
  }
  /*
* 0
* 1
* 2
* 3
* 4
* 5
* */
  console.log(end);
}

looping(0, 5);

const array = [1, 2, 11, 22];

// rightly loop
function reversingArray(arr, start, end) {
  if (start !== end) {
    reversingArray(arr, start + 1, end);
  }
  console.log(`${start}: ${arr[start]}`);
}

reversingArray(array, 0, array.length - 1);

// rightly loop
function loopingArray(arr, start, end) {
  if (end !== start) {
    loopingArray(arr, start, end - 1);
  }
  console.log(`${end}: ${arr[end]}`);
}

loopingArray(array, 0, array.length - 1);

function sum(n) {
  if (n <= 1) {
    return n;
  }
  return n + sum(n - 1);
}

console.log(sum(7));


const list = [ 1, [2, 5], [6, 7, [8, 9], 10], [ [11, 12] ]];
const listSet = new Set(list);

console.log(listSet, Array.isArray(listSet));
console.log(Array.isArray([...listSet]));

console.log([].concat(...list));
console.log(Object.keys(list));
console.log(JSON.stringify(Object.entries(list)));

list.reduce((acc, item) => {
  console.log(item);
  if (Array.isArray(item)) {
    console.log(item);
    return [...acc, item];
  } else {
    return [...acc, item];
  }
}, [])

const mySet = new Set();
console.log(mySet);
console.log([...mySet], Array.from(mySet));

function flattenReduce(arr) {
  return arr.reduce((acc, item) => {
    console.log(acc);
    if(Array.isArray(item)) {
    //  first log the items i.e. typeof array
      console.log(item);
    //  simply call the function again with the current iterator that would be an array
    flattenReduce(item)
    } else {
      // take everything from prev acc and aad the current item which should a number
      mySet.add(item);
      return mySet
      // return [ item, ...acc]
    }
  }, mySet)
}

flattenReduce(list);
console.log(mySet);



