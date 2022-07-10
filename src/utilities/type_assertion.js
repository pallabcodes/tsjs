var getStuff = function (type) {
    switch (type) {
        case "string":
            return "Apple";
        case "number":
            return 2.1245678;
        case "boolean":
            return false;
    }
};
var apple = getStuff("string");
var pi = getStuff("number");
var isApplePi = getStuff("boolean");
console.log(apple.toFixed(2));
console.log(pi.toUpperCase());
console.log(isApplePi + 1);
