// Basic Regex Examples
let regex = /dog/; // or new RegExp('dog');
console.log(regex.test('dog')); // true
console.log(regex.test("hot-dog")); // true

// ## Exact match
console.log(/dog/.test("hot-dog")); // true
console.log(/dog/.test("play games")); // false

// ## Special Characters

// Any character can be represented by . (except newline \n)
regex = /.og/;
console.log(regex.test("fog")); // true
console.log(regex.test("dog")); // true

// Backslash: used to treat a special character as literal.
// Here we search for "dog." with an actual dot.
regex = /dog\./;
console.log(regex.test("dog.")); // true
console.log(regex.test("dog1")); // false

// ## Character Set: square brackets represent a set of characters
console.log(/[dfl]og/.test("dog")); // true
console.log(/[dfl]og/.test("fog")); // true
console.log(/[dfl]og/.test("log")); // true

// Note: Within a character set, special characters are not special (no backslash needed)
console.log(/[A-z]/.test("a")); // true
console.log(/[A-z]/.test("Z")); // true

// Negated character set: matches characters NOT in the set
console.log(/[^df]og/.test("dog")); // false
console.log(/[^df]og/.test("fog")); // false
console.log(/[^df]og/.test("log")); // true

// Multiple Repetitions: matches a specific number of occurrences

function isValidMobileNo(no = '+12 123 123 123') {
  return /\+[0-9]{2} [0-9]{3} [0-9]{3}/.test(no);
}

console.log(isValidMobileNo("+12 123 123 123")); // true
console.log(isValidMobileNo("123212")); // false

// Shorthand syntax for one or more occurrences (using +)
// /1+23/.test('124'); // true
// /1+23/.test("111123"); // true
// /1+23/.test("23"); // false

function hasQuestionMarkBeforeEnd(str) {
  return /\?+/.test(str);
}

console.log(hasQuestionMarkBeforeEnd("do u know the question yet?")); // false
console.log(hasQuestionMarkBeforeEnd("do u know the question yet? Yes, I do!")); // true

// Handling alphanumeric: [A-Za-z0-9_] or \W for non-word characters
function isAlphaNumeric(str = "Z") {
  return /\W/.test(str);
}

// Handling digits: [0-9] or \d is equivalent
function isItDigit(digit = "5") {
  return /\d/.test(digit);
}

// Handling whitespaces: space (" "), tab ("\t"), newline ("\n"), carriage return ("\r")
function hasWhitespace(whitespace) {
  return /\s/.test(whitespace);
}

console.log(hasWhitespace("Lorem Ipsum")); // true
console.log(hasWhitespace("Lorem_IpSum")); // false

// Specifying position: must start with "dog"
console.log(/^dog/.test("dog and cat")); // true
console.log(/^dog/.test("cat and dog")); // false

// Dollar sign: should have "dog" at the end
console.log(/dog$/.test("dog and cat")); // false
console.log(/dog$/.test("cat and dog")); // true

// Exact match of the whole string (must start and end exactly)
console.log(/^success#$/.test("Unsuccessful")); // false

function areAllTheDigits(str = "12") {
  return /^[0-9]+$/.test(str);
}

console.log(areAllTheDigits("12")); // true
console.log(areAllTheDigits("digits: 1212")); // false

// exec: find match; returns an array if found, otherwise null.
const fileString = 'fileName.png, fileName2.png, fileName3.png';
const regexp = /fileName[0-9]?\.png/g;

console.log(regexp.exec(fileString));
/*
Expected output (example):
[
  'fileName.png',
  index: 0,
  input: 'fileName.png, fileName2.png, fileName3.png',
  groups: undefined
]
*/

// Example of iterating over all matches (commented out)
// let resultArray;
// while ((resultArray = regexp.exec(fileString)) !== null) {
//   console.log(resultArray[0], regexp.lastIndex);
// }
// Expected output (example):
// fileName.png 12
// fileName2.png 27
// fileName3.png 42

// Grouping with the RegEx
function getDateFromString(dateString) {
  const regexp = /([0-9]{2})-([0-9]{2})-([0-9]{4})/;
  const result = regexp.exec(dateString);
  if (result) {
    return {
      day: result[1],
      month: result[2],
      year: result[3]
    };
  }
}

console.log(getDateFromString('14-05-2018'));
// Expected output:
// { day: "14", month: "05", year: "2018" }

// Nested Groups
function getYearFromString(dateString) {
  const regexp = /[0-9]{2}-[0-9]{2}-([0-9]{2}([0-9]{2}))/;
  const result = regexp.exec(dateString);
  if (result) {
    return {
      year: result[1],
      yearShort: result[2]
    };
  }
}

console.log(getYearFromString('14-05-2018'));
// Expected output: { year: "2018", yearShort: "18" }

// ## Conditional patterns (example commented out)
// function doYearsMatch(firstDateString, secondDateString) {
//   const execResult = /[0-9]{2}-[0-9]{2}-([0-9]{4})/.exec(firstDateString);
//   if (execResult) {
//     const year = execResult[1];
//     const yearShort = year.substr(2, 4);
//     return RegExp(`[0-9]{2}-[0-9]{2}-(${year}|${yearShort})`).test(secondDateString);
//   }
// }

// doYearsMatch('14-05-2018', '12-02-2018'); // true
// doYearsMatch('14-05-2018', '24-04-18');   // true

// Parsing resolution strings
function getResolution(resolutionString) {
  const execResult = /(.*) ?x ?(.*)/.exec(resolutionString);
  if (execResult) {
    return {
      width: execResult[1],
      height: execResult[2]
    };
  }
}
console.log(getResolution('1024x768'));
// Expected output: { width: '1024', height: '768' }
console.log(getResolution('1920 x 1080'));
// Expected output: { width: '1920', height: '1080' }

// ## Sticky flag example (commented out)
// function getDateFromStringSticky(dateString) {
//   const regexp = /([0-9]{2})-([0-9]{2})-([0-9]{4})/y;
//   regexp.lastIndex = 14;
//   const result = regexp.exec(dateString);
//   if (result) {
//     return {
//       day: result[1],
//       month: result[2],
//       year: result[3]
//     };
//   }
// }
// console.log(getDateFromStringSticky("current date: 14-02-2016"));

// ## Unicode flag
console.log(/\u{24}/u.test("$")); // true

// Case-insensitive and global match examples (uncomment as needed)
// console.log(/dog/i.test("doG"));
// console.log(/dog/gi.test("doG"));

// Replace all occurrences in a string
const lorem = "lorem_ipsum";
// Replace only the first occurrence:
// console.log(lorem.replace("_", ' '));
// Replace all occurrences (using the global flag):
console.log(lorem.replace(/_/g, ' '));
