"use strict";
const shallow = [1, 2, 4, 5];
let copied = Array.from(shallow);
copied = [...shallow];
copied = shallow.slice();
copied = [];
copied = Object.assign(copied, shallow); // copying to/target, copying from/source
const deepCopyFunction = (inObject) => {
    let outObject, value, key;
    if (typeof inObject !== "object" || inObject === null) {
        return inObject; // Return the value if inObject is not an object
    }
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        value = inObject[key];
        // Recursively (deep) copy for nested objects, including arrays
        // @ts-ignore
        outObject[key] = deepCopyFunction(value);
    }
    return outObject;
};
let originalArray = [37, 3700, { hello: "world" }];
console.log("Original array:", ...originalArray); // 37 3700 Object { hello: "world" }
let shallowCopiedArray = originalArray.slice(); // copy the whole array
let deepCopiedArray = deepCopyFunction(originalArray);
originalArray[1] = 0; // Will affect the original only
console.log(`originalArray[1] = 0 // Will affect the original only`);
// @ts-ignore
originalArray[2].hello = "moon"; // Will affect the original and the shallow copy
console.log(`originalArray[2].hello = "moon" // Will affect the original array and the shallow copy`);
console.log("Original array:", ...originalArray); // 37 0 Object { hello: "moon" }
console.log("Shallow copy:", ...shallowCopiedArray); // 37 3700 Object { hello: "moon" }
console.log("Deep copy:", ...deepCopiedArray); // 37 3700 Object { hello: "world" }
//# sourceMappingURL=shallowVsdeep.js.map