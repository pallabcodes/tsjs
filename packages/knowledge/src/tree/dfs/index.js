var value = {
    value: 1,
    children: [
        { value: 2, children: [{ value: 4, children: [] }, { value: 5, children: [] }] },
        { value: 3, children: [] }
    ]
};
// post-order i.e. left, right and root
function dfsRecursive(node) {
    if (!node)
        return;
    var children = node.children || [];
    for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
        var child = children_1[_i];
        dfsRecursive(child);
    }
    console.log(node.value);
}
// dfsRecursive(value);
function iterativePostOrder(root) {
    var _a, _b, _c, _d;
    var stack = [];
    var current = root;
    var lastVisited = null;
    while (current || stack.length) {
        if (current) {
            stack.push(current);
            current = (_b = (_a = current.children) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null; // go left
        }
        else {
            var peek = stack[stack.length - 1];
            var right = (_d = (_c = peek.children) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : null;
            if (right && lastVisited !== right) {
                current = right; // explore right subtree
            }
            else {
                console.log(peek.value); // process node
                lastVisited = stack.pop();
            }
        }
    }
}
// iterativePostOrder(value);
function iterativePostOrderTwoStack(root) {
    if (!root)
        return;
    var stack1 = [root];
    var stack2 = [];
    while (stack1.length) {
        var node = stack1.pop();
        stack2.push(node);
        var _a = node.children || [], left = _a[0], right = _a[1];
        if (left)
            stack1.push(left);
        if (right)
            stack1.push(right);
    }
    while (stack2.length) {
        console.log(stack2.pop().value);
    }
}
// iterativePostOrderTwoStack(value);
// pre-order i.e. root, left and right
function dfsPreOrder(node) {
    if (!node)
        return;
    // print the current node first and foremost
    console.log(node.value);
    var children = node.children || [];
    // since we're iterating so off course it will follow the left to right order
    for (var _i = 0, children_2 = children; _i < children_2.length; _i++) {
        var child = children_2[_i];
        dfsPreOrder(child);
    }
}
// dfsPreOrder(value);
// Iterative DFS for pre-order (explicit stack) with while and for loop
function dfsPreOrderIterative(root) {
    var _a;
    var stack = [root];
    while (stack.length) {
        var node = stack.pop();
        console.log(node.value);
        var children = (_a = node.children) !== null && _a !== void 0 ? _a : [];
        for (var i = children.length - 1; i >= 0; i--) {
            stack.push(children[i]);
        }
    }
}
dfsPreOrderIterative(value);
// Iterative DFS (explicit stack) with nested while loop
function dfsPreOrderIterativeWithNestedWhile(root) {
    var _a;
    var stack = [root];
    while (stack.length) {
        var node = stack.pop();
        console.log(node.value);
        var children = (_a = node.children) !== null && _a !== void 0 ? _a : [];
        var i = children.length - 1;
        while (i >= 0) {
            stack.push(children[i]);
            i--;
        }
    }
}
function iterativePreOrder(root) {
    if (!root)
        return;
    var stack = [root];
    while (stack.length > 0) {
        var node = stack.pop();
        console.log(node.value); // process
        var _a = node.children || [], _b = _a[0], left = _b === void 0 ? null : _b, _c = _a[1], right = _c === void 0 ? null : _c;
        if (right)
            stack.push(right);
        if (left)
            stack.push(left);
    }
}
// iterativePreOrder(value);
function inOrder(node) {
    if (!node)
        return;
    // go left and then print root then when the current node done go back to previos node then handle right
    var _a = node.children || [], _b = _a[0], left = _b === void 0 ? null : _b, _c = _a[1], right = _c === void 0 ? null : _c;
    inOrder(left);
    console.log(node.value);
    inOrder(right);
}
// inOrder(value);
function iterativeInOrder(node) {
    var _a, _b, _c, _d;
    var stack = [];
    var current = node;
    while (current || stack.length > 0) {
        // go as left as possible
        while (current) {
            stack.push(current);
            current = (_b = (_a = current.children) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : null; // left
        }
        // stack = [3], current = null
        var node_1 = stack.pop();
        console.log(node_1.value); // side-effect
        current = (_d = (_c = node_1.children) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : null; // right
    }
}
// iterativeInOrder(value);
// Modified InOrder 3 1 2 based on right subtree
function modifiedInOrder(node) {
    if (!node)
        return;
    // go right and then print root then when the current node done go back to previos node then handle left
    var _a = node.children || [], _b = _a[0], left = _b === void 0 ? null : _b, _c = _a[1], right = _c === void 0 ? null : _c;
    modifiedInOrder(right);
    console.log(node.value);
    modifiedInOrder(left);
}
// modifiedInOrder(value);
function bfs(root) {
    var _a;
    var queue = [root];
    while (queue.length) {
        var node = queue.shift();
        console.log(node.value);
        var children = (_a = node.children) !== null && _a !== void 0 ? _a : [];
        // push all the children of the current node
        for (var _i = 0, children_3 = children; _i < children_3.length; _i++) {
            var child = children_3[_i];
            queue.push(child);
        }
    }
}
console.clear();
bfs(value);
