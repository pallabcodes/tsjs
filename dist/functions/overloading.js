"use strict";
function addData(data1, data2) {
    return data1 + data2;
}
console.log(addData("Hello ", "GeeksForGeeks"));
console.log(addData(20, 30));
// function overloading within class
class Data {
    displayData(data) {
        if (typeof (data) === 'number')
            return data.toString();
        if (typeof (data) === 'string')
            return data.length;
    }
    ;
}
let object = new Data();
console.log(`The result is  ${object.displayData(124456)} `);
let stringData = "GeeksForGeeks";
console.log(`string length is ${stringData} is ${object.displayData(stringData)}`);
//# sourceMappingURL=overloading.js.map