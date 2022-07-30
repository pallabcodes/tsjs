# how the javascript works?

Everything in JS happens inside an Execution Context.

The execution context comprises of 2 things:

1. Memory Component also known as Variable Environment - This is where the variables and their values are stored as key:value pairs, this also stores the functions

2. Code Component also known as Thread of Execution - This is where the code is run 1 line at a time.

JavaScript is a synchronous single-threaded language which means it can only run 1 line of code at a time and it cannot move to another line until the first one is done executing.

# How JavaScript code is executed and call stack?

var title = "fifa";
function square (num) {return num \* num }
var square2 = square(2)
var square4 = square(4)

Memory/variable | code/thread of execution
title: undefined  
square: (){}  
square2: undefined
square4: undefined

Memory/variable | code/thread of execution
title: "Fifa"  
square: (){} already stored in memory  
square2: undefined | as function invoked; it makes its own new function execution context & since its an exuctuion context it'll have those two components to allocate memory with a special defaullt valut if used var delcaration i.e. `undefined` and then when running code line by line as it gets the actual value then simply update that to its memory location.
square4: undefined

after the function's execution done and value saved to required place its own function exection context gets automatically deleted

1. When JavaScript code is executed, Execution Context is created and it
   is called Global Execution Context.

2. JavaScript program is executed in TWO PHASES inside Execution Context
   a. MEMORY ALLOCATION PHASE - JavaScript program goes throughout the program and allocate memory of Variables and Functions declared in program.
   b. CODE EXECUTION PHASE - JavaScript program now goes throughout the code line by line and execute the code.

3. A Function is invoked when it is called and it acts as another MINI PROGRAM and creates its own Execution Context.

4. Returns keyword return the Control back to the PREVIOUS Execution-Context where the Function is called and Execution Context of the Function is DELETED.

5. CALL STACK maintains the ORDER of execution of Execution Contexts. It CREATES Execution Context whenever a Program starts or a Function is invoked and it pops out the Execution Context when a Function or Program ENDS.

## Stack

Function can have multiple nested function nested within or vice-versa so
it would create function execution context within function execution context but JS manages that gracefully with a call stack

at the botton of stack, it has Gloal execution context that means whenever
any JS program is run , this call stack is populated with this GEC and then
when a function invoked it pushes a new stack ontop and within that it has its own function exection context and rest are the same and again after then execution is done and control return from where its invoked it gets popped off from stack and garbage collected

# Hoisting

function declaration: it stores the whole function itself to a key thus
when called before it it can get the expected output
