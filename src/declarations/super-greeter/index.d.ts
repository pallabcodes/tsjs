// Module:plgin = https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-plugin-d-ts.html

import { greeter } from "./super-greeter"; // import the module which this module addds to

// # editing an existing module from local or third-party library

/* This is the module plugin template file. So, should rename it to index.d.ts (done)
 * and place it in a folder with the same name as the "above module".
 * For example, if you were writing a file for "super-greeter", this
 * file should be 'super-greeter/index.d.ts'
 */

/* Here, declare the same module (i.e. "super-greeter") as the one imported above &
 * then we expand the existing declaration of the GreeterFunction
 */

declare module "super-greeter" {
  // now here can "extend" any property or methods from this imported module i.e. "super-greeter"
  export interface GreeterFunction {
    /* Greets event better */

    hyperGreet(): void;
  }
}
