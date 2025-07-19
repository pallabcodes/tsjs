"use strict";
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
const list1 = [1, 2, 4];
const list2 = [-1, -5, -1, -2]; // sorted or unsorted
function mergeArrays(arr1, arr2) {
    const n = determineShorterArrLen(arr1, arr2);
    // console.log("determine", n);
    const map = {}; // map needed to avoid duplicates
    let result = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < arr2.length; j++) {
            console.log('outer: ', arr1[i], 'inner: ', arr2[j], arr2[j] < arr1[i]);
            // only care for the smaller value(s) against the outer i.e. arr[i]
            if (arr2[j] < arr1[i] && !(arr2[j] in map)) {
                console.info('✅inerting in map: ', arr2[j]);
                result.push(arr2[j]);
                console.log('AFTER PUSH: ', result);
                map[arr2[j]] = arr2[j];
            }
        } // inner
        if (!(arr1[i] in map)) {
            console.log(`EXITING->${i}`, result);
            result = result.sort((a, b) => a - b);
            console.log('RESULT SORTED (IN CASE)', result, map);
            result.push(arr1[i]);
            map[arr1[i]] = arr1[i];
            console.log('AFTER: ', result, map);
        }
    }
    // console.info("processing: ", result);
    // now, the remaining elements in arr2 surely bigger so just add
    for (let k = 0; k < arr2.length; k++) {
        if (!(arr2[k] in map))
            result.push(arr2[k]);
    }
    return result;
}
function determineShorterArrLen(arr1, arr2) {
    return arr1.length < arr2.length ? arr1.length : arr2.length;
}
console.log(mergeArrays(list1, list2));
//# sourceMappingURL=example.js.map