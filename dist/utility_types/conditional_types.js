"use strict";
function someFunction(value) {
    const someOtherFunc = (someArg) => {
        //  a's value must be 'Type A or Type B'
        const a = someArg;
    };
    return someOtherFunc;
}
// const someFn = someFunction(true);
const someFn = someFunction(1);
const generic = ["READ", "CREATE"];
// now just single function needed
function createLabel(idOrName) {
    throw "unimplemented";
}
let x = createLabel("typescript");
let y = createLabel("golang");
let xy = createLabel(Math.random() ? "hello" : 11);
//# sourceMappingURL=conditional_types.js.map