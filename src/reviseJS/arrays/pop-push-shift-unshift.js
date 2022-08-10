// // ## pop
// const plants = ['broccoli', 'cauliflower', 'cabbage', 'kale', 'tomato'];
//
// console.log(plants.pop());
// // expected output: "tomato"
//
// console.log(plants);
// // expected output: Array ["broccoli", "cauliflower", "cabbage", "kale"]
//
// plants.pop();
//
// console.log(plants);
// // expected output: Array ["broccoli", "cauliflower", "cabbage"]
//
// // using call, apply or bind or array like objects
// // const myFish = {
// //   0: 'angel',
// //   1: 'clown',
// //   2: 'mandarin',
// //   3: 'sturgeon',
// //   length: 4,
// // };
// // here being tricked to think it as array, and thus it works here
// // const popped = Array.prototype.pop.call(myFish); // same syntax when using apply()
// // console.log(myFish); // { 0: 'angel', 1: 'clown', 2: 'mandarin', length: 3 }
// // console.log(popped); // 'sturgeon'
//
//
// // const collection = {
// //   length: 0,
// //   addElements(...elements) {
// //     // obj.length will be incremented automatically
// //     // every time an element is added.
// //
// //     // Returning what push returns; that is
// //     // the new value of length property.
// //     return [].push.call(this, ...elements);
// //   },
// //   removeElement() {
// //     // obj.length will be decremented automatically
// //     // every time an element is removed.
// //
// //     // Returning what pop returns; that is
// //     // the removed element.
// //     return [].pop.call(this);
// //   }
// // }
//
// // collection.addElements(10, 20, 30);
// // console.log(collection.length);  // 3
// // collection.removeElement();
// // console.log(collection.length);  // 2
//
// // ## push
// // const animals = ['pigs', 'goats', 'sheep'];
//
// // const count = animals.push('cows');
// // console.log(count);
// // expected output: 4
// // console.log(animals);
// // expected output: Array ["pigs", "goats", "sheep", "cows"]
//
// // animals.push('chickens', 'cats', 'dogs');
// // console.log(animals);
// // expected output: Array ["pigs", "goats", "sheep", "cows", "chickens", "cats", "dogs"]
//
//
// // let obj = {
// //   length: 0,
// //
// //   addElem(elem) {
// //     // obj.length is automatically incremented
// //     // every time an element is added.
// //     [].push.call(this, elem)
// //   }
// // }
//
// // Let's add some empty objects just to illustrate.
// // obj.addElem({})
// // obj.addElem({})
// // console.log(obj.length)
// // → 2
//
//
// // # reverse
// // const obj = {0: 1, 1: 2, 2: 3, length: 3};
// // console.log(obj); // {0: 1, 1: 2, 2: 3, length: 3}
//
// // Array.prototype.reverse.call(obj); //same syntax for using apply()
// // console.log(obj); // {0: 3, 1: 2, 2: 1, length: 3}
//
//
// # shift
// const array1 = [1, 2, 3];
//
// const firstElement = array1.shift();
//
// console.log(array1);
// // expected output: Array [2, 3]
//
// console.log(firstElement);
// // expected output: 1
//
//
// const myFish = ['angel', 'clown', 'mandarin', 'surgeon'];
//
// console.log('myFish before:', JSON.stringify(myFish));
// // myFish before: ['angel', 'clown', 'mandarin', 'surgeon']
//
// const shifted = myFish.shift();
//
// console.log('myFish after:', myFish);
// // myFish after: ['clown', 'mandarin', 'surgeon']
//
// console.log('Removed this element:', shifted);
// // Removed this element: angel
//
//
// const names = ["Andrew", "Edward", "Paul", "Chris" ,"John"];
//
// while (typeof (i = names.shift()) !== 'undefined') {
//   console.log(i);
// }
// // Andrew, Edward, Paul, Chris, John
//
