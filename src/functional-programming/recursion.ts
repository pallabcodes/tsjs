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

// without recursion
function fibonacci(n: number, array: number[] = [0, 1]): number[] {
  while (n > 2) {
    const [nextToLast, last] = array.slice(-2);
    // @ts-ignore
    array.push(nextToLast + last);
    n -= 1;
  }
  return array;
}

console.log(fibonacci(12));

const fibo = (num: number, array: number[] = [0, 1]): number[] => {
  if (num <= 2) return array;
  const [nextToLast, last] = array.slice(-2);
  // @ts-ignore
  return fibo(num - 1, [...array, nextToLast + last]);
};
console.log(fibo(12));

// what number is at nth position of fibonacci sequence

const fibonacciPos = (pos: number) => {
  if (pos <= 1) return pos;
  const seq = [0, 1];
  for (let i = 2; i <= pos; i++) {
    const [nextToLast, last] = seq.slice(-2);
    // @ts-ignore
    seq.push(nextToLast + last);
  }
  return seq[pos];
};

console.log(fibonacciPos(8));

const fibPos = (pos: number): number => {
  if (pos < 2) return pos;
  return fibPos(pos - 1) + fibPos(pos - 2);
};

/*
*     recursive call : fibPos(1) return 1
*     recursive call : fibPos(2 - 1 = 1)
*     recursive call : fibPos(3 - 1 = 2)
*     recursive call : fibPos(4 - 1 = 3)
*     recursive call : fibPos(5 - 1 = 4)   +   fibPost(2 - 2 = 0)
*     recursive call : fibPos(6 - 1 = 5)   +   fibPost(4 - 2 = 2)
*     recursive call : fibPos(7 - 1 = 6)   +   fibPost(6 - 2 = 4)
*     recursive call : fibPos(8 - 1 = 7)   +   fibPost(8 - 2 = 6)
* default call : fibPos(pos = 8)
* Global Execution context/main
* */
console.log(fibPos(8));


const getAwsProductIdImages = async (productId: string, s3: unknown, resultArray: any[], data: { isTruncated: boolean, NextContinuationToken: any }): Promise<unknown> => {
  if (data.isTruncated) {
    return await getAwsProductIdImages(productId, s3, resultArray, data.NextContinuationToken);
  }
  return resultArray;
};

const artistByGenre = {
  jazz: [`Miles`, `John`],
  rock: {
    classic: ["Bob", "Eagles"],
    hair: ["bowl", "long"],
    alt: {
      classic: ["pearl", "coldplay"],
      current: ["joy", "fly"]
    }
  },
  unclassified: {
    new: ["camp", "neil"],
    classic: ["seal", "chris"]
  }
};

const getArtistNames = (dataObj: Record<string, any>, arr: any[] = []) => {
  Object.keys(dataObj).forEach(key => {
    if(Array.isArray(dataObj[key])) {
      return dataObj[key].forEach((artist: any) => {
        arr.push(artist);
      })
    }
    getArtistNames(dataObj[key], arr);
  })
  return arr;
}
console.log(getArtistNames(artistByGenre));
