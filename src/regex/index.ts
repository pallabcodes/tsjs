let regex = /dog/; // or new RegEx('dog');
regex.test('dog'); // true
regex.test("hot-dog"); // true

// ## exact match
/dog/.test("hot-dog"); // true
/dog/.test("play games"); // false

// ## Special Characters

// Any character represented by . except the newline character \n\

regex = /.og/;
regex.test("fog"); // true
regex.test('dog'); // true

// Backslash:: used to switch the meaning of a special character to just a regular one, thanks to this we can search "." as dot rather than as special character
regex = /dog\./;
regex.test("dog."); // true
regex.test('dog1'); // false

// ## Character Set: it represented by square brackets; this pattern matches one character that might be one of the character from within the brackets
/[dfl]og/.test("dog"); // true
/[dfl]og/.test("fog"); // true
/[dfl]og/.test("log"); // true

// note: within the character set special character are not special so no backslash needed
/[A-z]/.test("a"); // true
/[A-z]/.test("Z"); // true

// negate character: match everything else other than the characters within bracket
/[^df]og/.test("dog"); // false
/[^df]og/.test("fog"); // false
/[^df]og/.test("log"); // true

// Multiple Repetitions: matches exactly how many times the number of occurrence of some expression would appear?
// {2}, {0, 2}
function isValidMobileNo(no: string = '+12 123 123 123') {
  return /\+[0-9]{2} [0-9]{3} [0-9]{3}/.test(no);
}

isValidMobileNo("+12 123 123 123"); // true
isValidMobileNo("123212") // false

// shorthand syntax for multiple repetitions : here 1 has to appear at least once
// /1+23/.test('124'); // true
// /1+23/.test("111123"); // true
// /1+23/.test("23"); // false

function hasQuestionMarkBeforeEnd(str: string) {
  return /\?.+/.test(str);
}

hasQuestionMarkBeforeEnd("do u know the question yet?"); // false
hasQuestionMarkBeforeEnd("do u know the question yet? Yes,  I do! "); // true

// handing alphanumeric :: [A-Za-z0-9_] or  \W is same
function isAlphaNumeric(string: string = "Z") {
  return /\W/.test(string);
}
// handing digits : [0 - 9 ] or \d is same
function isItDigit(digit: string = "5") {
  return /\d/.test(digit);
}

// handing whitespaces : space: " ", tab: "/t", newline: "\n", carriage return: "\r"
function hasWhitespace(whitespace: string) {
  return /\s/.test(whitespace);
}

hasWhitespace(`Lorem Ipsum`); // true
hasWhitespace(`Lorem_IpSum`); // false

// specifying position :: here it must start with dog string
/^dog/.test(`dog and cat`); // true
/^dog/.test(`cat and dog `); // false

// dollar sign :: here it should have dog at end
/dog$/.test(`dog and cat`); // false
/dog$/.test(`cat and dog`); // true

// false string expression has to start and with the exact value
/^success#$/.test("Unsuccessful"); // false

function areAllTheDigits(str: string = "12") {
  return /^[0-9]+$/.test(str);
}

areAllTheDigits("12"); // true
areAllTheDigits("digits: 1212"); // false

// exec : find match if found return array else null
const string = 'fileName.png, fileName2.png, fileName3.png';
const regexp = /fileName[0-9]?.png/g;

regexp.exec(string);
/*
expected output:
[
  0: "fileName.png",
  index: 0,
  input: "fileName.png, fileName2.png, fileName3.png"
]
 */

// let resultArray;
// while (resultArray = regexp.exec(string) !== null) {
//   console.log(resultArray[0], regexp.lastIndex);
// }

// expected output ::
// filename.png 12
// filename.png 27
// filename.png 42

// Grouping with the RegEx
function getDateFromString(dateString: string) {
  const regexp = /([0-9]{2})-([0-9]{2})-([0-9]{4})/;
  const result = regexp.exec(dateString);
  if(result) {
    return {
      day: result[1],
      month: result[2],
      year: result[3]
    }
  }
}

getDateFromString('14-05-2018');

// expected output::
// {
//   day: "14",
//   month: "05", year: "2016"
// }

// Nested Groups
function getYearFromString(dateString: string) {
  const regexp = /[0-9]{2}-[0-9]{2}-([0-9]{2}([0-9]{2}))/;
  const result = regexp.exec(dateString);
  if(result) {
    return {
      year: result[1],
      yearShort: result[2]
    }
  }
}

getYearFromString('14-05-2018');
// expected output :: { year: "2018", yearShort: "18" }

// ## conditional patterns::
// function doYearsMatch(firstDateString: string, secondDateString: string) {
//   const execResult = /[0-9]{2}-[0-9]{2}-([0-9]{4})/.exec(firstDateString);
//   if(execResult) {
//     const year = execResult[1];
//     const yearShort = year.substr(2,4);
//     return RegExp(`[0-9]{2}-[0-9]{2}-(${year}|${yearShort})`).test(secondDateString);
//   }
// }

// doYearsMatch('14-05-2018', '12-02-2018'); // true
// doYearsMatch('14-05-2018', '24-04-18');   // true


function getResolution(resolutionString:string) {
  const execResult = /(.*) ?x ?(.*)/.exec(resolutionString);
  if(execResult) {
    return {
      width: execResult[1],
      height: execResult[2]
    }
  }
}
getResolution('1024x768');
// { width: '1024',  height: '768' }
getResolution('1920 x 1080');
// { width: '1920',  height: '1080' }

// ## sticky flag :: start searching at a certain index
// function getDateFromString(dateString: string) {
//   const regexp = /([0-9]{2})-([0-9]{2})-({[0-9]{4})/y;
//   regexp.lastIndex = 14;
//   const result = regexp.exec(dateString);
//   if(result) {
//     return {
//       day:result[1],
//       month: result[2],
//       year: result[3]
//     }
//   }
// }
// getDateFromString("current date: 14-02-2016");

// ## unicode flag
/\u{24}/u.test("$"); // true

// case-insensitive and global match
// /dog/i.test("doG"); // // /dog/gi.test("doG")

// replace all occurrences from string
const lorem = "lorem_ipsum";
// lorem.repeat("_", ' '); // just replace the first match it finds
// now with global flag find all matches  then replace with space
lorem.replace(/_/g, ' ');