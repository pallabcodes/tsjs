// basic

function loop(start: number, end: number = 5) {
  console.log(start);
  if (start < end) {
    loop(start + 1, end);
  }
}

/*
* recursive call : pushState: recurse(4)  popState : returns 5
* recursive call : pushState: recurse(3)  popState : returns 4
* recursive call : pushState: recurse(2)  popState : returns 3
* recursive call : pushState: recurse(1)  popState : returns 2
* default   call : pushState: recurse(1)  popState : returns 1
* main / global execution context()
* */
loop(1, 5);

function loopReverse(n: number): void {
  console.log(n);
  if (n > 0) {
    loopReverse(n - 1);
  }
}


/*
* pushState: recurse(1)  popState : returns 1
* pushState: recurse(2)  popState : returns 2
* pushState: recurse(3)  popState : returns 3
* pushState: recurse(4)  popState : returns 4
* pushState: recurse(5)  popState : returns 5
* main / global execution context()
* */
loopReverse(5);

function sum(n: number): number {
  if (n <= 1) {
    return n;
  }
  return n + sum(n - 1);
}
/*
    * recursive call: n = 1 so : popState: return  1
    * recursive call: pushState 2 + sum( 2 - 1) : popState: return 2 + 1 = 3
    * recursive call: pushState 3 + sum( 3 - 1) : popState: return  3 + 3 = 6
    * recursive call: pushState 4 + sum( 4 - 1) : popState: return  4 + 6 = 10
    * default call: pushState 5 + sum( 5 - 1) : popState: return  5 + 10 = 15
    * */

sum(7);

function arraySum(numbers: Array<number>): number {
  if (numbers.length === 1) {
    return numbers[0]!;
  } else {
    /*
    * pushState: [5] : popState = number[0] i.e. 5
    * * 4 + [5] : popState: 4 + 5 = 9
    * * 2 + [4, 5 ] : popState: 2 + 9 = 11
    * 1 + [2, 4, 5] : popState: 1 + 11 = 12
    * */
    return numbers[0]! + arraySum(numbers.slice(1));
  }
}

console.log(arraySum([1, 2, 4, 5]));


// advanced
