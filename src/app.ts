function foo(arg: unknown) {
  const isThisArgString = typeof arg === "string";
  if (isThisArgString) {
    console.log(arg.toUpperCase());
  }
}

type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function area(shape: Shape): number {
  const is_circle = shape.kind == "circle";
  if (is_circle) {
    return Math.PI * shape.radius ** 2;
  } else {
    return shape.size ** 2;
  }
}

// index signature
type GAttributes = {
  color?: string;
  font?: string;
  [data: `data-${string}`]: string | undefined;
};

const classic: GAttributes = {
  color: "green",
  font: "JetBrains Mono",
  "data-name": "good"
};

function validatePostCode(code: string) {
  const num = parseInt(code);
  console.log(num.toFixed(2));

  if (isNaN(num)) {
    throw new Error("Not a number");
  }
  return num >= 1000 && num <= 9999;
}

try {
  const isValid = validatePostCode("Hello TypeScript");
} catch (err: any) {
  console.log(`failed: `, err.message);
}

function log(value: unknown) {
  if (typeof value === "number") {
    console.log(value.toFixed(2));
  } else {
    console.log(value);
  }
}

log(12.1212);
log("Hello TypeScript");

// https://learntypescript.dev/07/intro - done
// https://www.dhiwise.com/post/advanced-typescript-cheatsheet - done
// https://javascript.plainenglish.io/implement-hybrid-decorator-functions-in-typescript-f6d24bc5abb0 - done
// https://css-tricks.com/understanding-javascript-constructors/ - done
// https://prateeksurana.me/blog/react-library-with-typescript/ - done
// https://medium.com/jspoint/typescript-type-system-81fdb84bba75 - done
// https://medium.com/@KevinBGreene/typescript-type-guards-using-reflect-api-e86bda75d587 - done
// https://medium.com/jspoint/typescript-namespaces-f43cd002c08c - done
// https://medium.com/jspoint/typescript-compilation-the-typescript-compiler-4cb15f7244bc - done
// https://medium.com/jspoint/typescript-module-system-5022cac310f6 - done
// https://fettblog.eu/advanced-typescript-guide/ - done
// https://stackoverflow.com/questions/53710368/how-do-i-add-typescript-types-to-a-javascript-module-without-switching-to-typesc
// https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html
// https://blog.logrocket.com/build-component-library-react-typescript/
// https://techsparx.com/nodejs/typescript/validation.html -- decorators
