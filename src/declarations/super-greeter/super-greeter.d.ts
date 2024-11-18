// https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-d-ts.html#testing-your-types

// commonjs pattern

/*
const maxInterval = 12;
function getArrayLength(arr) {
  return arr.length;
}
module.exports = { maxInterval, getArrayLength  };
*/

// now above with .d.ts file below

export default function getArrayLength(arr: any[]): number;
export const maxInterval: 12;

/* above thing if "esModuleInterop": false
declare function getArrayLength(arr: any[]): number;
declare namespace getArrayLength {
  declare const maxInterval: 12;
}
export = getArrayLength;
*/

//# defining "Type(s)" with generic in modules as below:

export type ArrayMetaData<ArrType> = { length: number; firstObject: ArrType | undefined };
export function getArrayMetadata<ArrType>(arr: ArrType[]): ArrayMetaData<ArrType>;

// # define "namespace" in module as below

// This represents the JavaScript/TypeScript class which would be available at runtime
export class API {
  constructor(baseURL: string);
  getInfo(opts: API.InfoRequest): API.InfoResponse;
}

// This namespace is merged with the API class and allows for consumers, and this file
// to have types which are nested away in their own sections.
declare namespace API {
  export interface InfoRequest {
    id: string;
  }
  export interface InfoResponse {
    width: number;
    height: number;
  }
}

export interface GreeterFunction {
  (name: string): void;
  (time: number): void;
}

export const greeter: GreeterFunction;

/*
// # library structure

  myLib
    +---- start.js
    +---- foo.js   
    +---- bar
          +----- start.js
          +----- baz.js


// # declarations file should as below:

   @types/myLib
      +---- index.d.ts
      +---- foo.d.ts
      +---- bar
            +---- index.d.ts
            +---- baz.d.ts


// and how it will be imported

var a = require("myLib");
var b = require("myLib/foo");
var c = require("myLib/bar");
var d = require("myLib/bar/baz");



## Testing types

If you are planning on submitting these changes to DefinitelyTyped for everyone to also use, then we recommend you:

Create a new folder in node_modules/@types/[libname]
Create an index.d.ts in that folder, and copy the example in
See where your usage of the module breaks, and start to fill out the index.d.ts
When you’re happy, clone DefinitelyTyped/DefinitelyTyped and follow the instructions in the README.
Otherwise

Create a new file in the root of your source tree: [libname].d.ts
Add declare module "[libname]" { }
Add the template inside the braces of the declare module, and see where your usage breaks

*/
