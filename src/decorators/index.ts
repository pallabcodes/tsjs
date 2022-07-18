// decorators are to TypeScript what annotation are to JAVA: adding extra functionality to class/method/prop/accessor

// ## evaluation order when there are multiple decorators
/*
There can be more than one decorator per line of text, and you can have as many decorators as you like
The rules for evaluating - the execution order - of multiple decorators are:

1. The expressions for each decorator are evaluated top-to-bottom.
2. The results are then called as functions from bottom-to-top.

The expression, "expression for each decorator", refers to what follows the @ character is an expression
which evaluates to a decorator function. For the decorators which do not require parentheses, the decorator name directly maps to a decorator function, and therefore the expression is simply the function name.

For decorator factories, the expression means to evaluate the invocation of the outer function, which returns the inner function.
That happens from top-to-bottom in the order they appear in the text. The actual decorator functions are then executed from bottom-to-top.
* */

// @decorator1 @deccorator2 @deccorator4 @deccorator5
// @deccorator6(param1, param2)
// class MultiDecoratorClass {}


