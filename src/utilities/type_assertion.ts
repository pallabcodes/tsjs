let getStuff = (type: string): any => {
  switch (type) {
    case "string":
      return `Apple`;
    case "number" :
      return 2.1245678;
    case "boolean":
      return false;
  }
};

// is keyword used for asserting function's return type

type User = { name: string; userId: number };
function isUser<T extends User>(obj: T) : T[] | T['name'] {
  return obj.name
}

function getUserName(obj: any)  {
  return (obj as User).userId
}


function isUser2(obj: unknown): obj is User {
  return (
    typeof obj === "object" && obj != null && typeof Reflect.get(obj, 'name') === "string" && typeof Reflect.get(obj, 'userId') === "number"
  );
}

let apple = (<string>getStuff("string"));
// let apple = (<string>getStuff("string")).toUpperCase();
let pi = (getStuff("number") as number);
// let pi = (getStuff("number") as number).toFixed(2);
let isApplePi = getStuff("boolean") as boolean;
// let isApplePi = (getStuff("boolean") as boolean)['toString'];

// wrong
// console.log(apple.toFixed(2));
// console.log(pi.toUpperCase());
// console.log(isApplePi  + 1);

// right
console.log(apple.toUpperCase());
console.log(pi.toFixed(2));
console.log(isApplePi);

