// by using var by time setTimeout/async function ready to be executed
// it has reached the final value which is what gets printed

// closure: keep track of the given argument current and previously and able to modify that value as required

function closure(n) {
  setTimeout(() => {
    console.log(n);
  }, n * 1000);
}

function a() {
  for (var i = 0; i < 2; i++) {
    // if used let then it keeps iterated value within block scope like { 0: 1 } { 1: 1} {2: 2} so when logged it gets back right value
    // now, with each loop it will invoke this function by taking iterator as argument
    closure(i);
  }
}

a();


/*
*                 web api : closure(2)
*                 web api : closure(1)
*                 web api : closure(0)
* a()
* main
* */




// one level
let list = [11, 1, 4, 5];
list.push([-1, -2]);
list.push([ [ -1100, -1110 ] ]);

console.log(list[list.length - 1].length, list[list.length - 1]);
console.log(list[list.length - 1][0]);
console.log(...list[list.length - 1][0]);

// simply copy to a new array via Array.from(list) or [...list]
console.log(list);
// with this it can only flatten one level
console.log([].concat(...list));



// flatten purpose: will take two arguments (arr, depth) then return a flattened array
/*
* recursive: flatten(  [  [ [ 1000, 1001 ]  ]   ], 1) : result [1, 2,  5, 6, 7, 8, 9, 10, [ [ 1000, 1001 ]  ]  ]
* recursive: flatten([5, 6, [7, 8], 9, 10], 1) : result [1, 2,  5, 6, 7, 8, 9, 10]
* recursive: flatten([4, 5], 1) : result [1, 2, 4, 5]
* recursive: flatten([1, 2], 1) : result [1, 2]
* default: flatten(arr, 1)
* main
* */

function flatten(arr = [], depth = 1) {
  let stored = [];

  // loop from
  arr.forEach((item, i) => {
    console.log(Array.isArray(item));
    if(Array.isArray(item) && depth > 0) {
      console.log(item);
    // check if the item is array or not and its total length

    //  take everything from stored then the return value of ...flatten(item, depth - 1)
    // stored.push(...flatten(item , depth - 1));
    } else {
      stored.push(item);
    }
  });
  // loop to
  console.log(stored);
  return stored;
}

let arr = [
  0,
  [1, 2],
  [4, [-11], [-2, -12], [50, 51], [], [[[[]]]] ],
  [5, 6, [7, 8], 9, 10],
  [ [ [ 1000, 1001 ]  ] ],
];

console.log(flatten(arr));


let arr1 = [
  0,
  [1, 2],
  [5, 6, [7, 8], 9, 10],
  [10, 11]
];

// loop + recursion
const flat = (arr, depth = 1) => {
  let result = [];
  arr.forEach((ar) => {
    if (Array.isArray(ar) && depth > 0) {
      result.push(...flat(ar, depth - 1));
    } else {
      result.push(ar);
    }
  });
  return result;
}

flat(arr1);


// recursive : normal & mixed

/*
* # normal
* function loop (n) {
* if(n === 0) return n;
* return loop(n - 1)
* }
loop(5)
*
* # fibonacci
* const fibPos = (pos = 8) => {
  if (pos < 2) return pos;
  return fibPos(pos - 1) + fibPos(pos - 2);
}


*
* # mixed recursion
* function mixed (obj, key) {
* Object.entries(([key, value]) => {
* mixed(value, key)
*
* })
* }
*
* */
