let value = "Hi JavaScript";
let value2 = "Hello React";

console.log(value.charAt(6));
console.log(value.charCodeAt(6));
console.log(value.concat(" " + value2));
console.log(value.endsWith("t"));
console.log(value.startsWith("h"));
console.log(String.fromCharCode(114));
console.log(value.includes("t"));
console.log(value.indexOf("i"));
console.log(value.lastIndexOf("i"));
// console.log(value.match());
console.log(value.repeat(2));
console.log(value.replace(/hi/gi, "Greetings"));
console.log(value.search("i"));

// console.log(value.split());
console.log(value.split(''));
console.log(value.split(' '));

console.log(value2.slice(1));
console.log(value2.slice(-1));
console.log(value2.slice(1));
console.log(value2.slice(0, -6));

console.log(value2.substring(0, 1 ));
console.log(value2.substring(1, 5));

console.log(value2.substr(1, 2));
console.log(value2.substr(2));

console.log("  trimming  ".trim());



console.log(1 + "2");
console.log(1 - "22");
console.log("20" * "100");
console.log("100" / "100");

console.log(typeof NaN);
// console.log(NaN + 1, NaN - 1, NaN / 1, NaN * 1);
console.log(undefined  + 1, undefined - 1, undefined * 1, undefined / 2);

// # number

let n = 10.118212;
console.log(n.toFixed(2));
console.log(isNaN(n), Number.isInteger(n));
console.log(parseFloat(n ));
console.log(parseInt(n));
console.log(n.toPrecision(n));
n = 1024;

console.log(n.toExponential());

