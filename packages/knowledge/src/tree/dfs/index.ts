/// <reference lib="esnext" />
/// <reference lib="dom" />

export interface Data {
    value: number;
    children: Data[];
}

let value: Data = {
    value: 1,
    children: [
        { value: 2, children: [{ value: 4, children: [] }, { value: 5, children: [] }] },
        { value: 3, children: [] }
    ]
}

// post-order i.e. left, right and root
function dfsRecursive(node: Data | null) {
    if (!node) return;

    const children = node.children || [];

    for (const child of children) {
        dfsRecursive(child);
    }

    console.log(node.value);
}

// dfsRecursive(value);


function iterativePostOrder(root: Data) {
    const stack: Data[] = [];
    let current: Data | null = root;
    let lastVisited: Data | null = null;

    while (current || stack.length) {

        if (current) {
            stack.push(current);
            current = current.children?.[0] ?? null; // go left
        } else {

            const peek = stack[stack.length - 1];
            const right = peek.children?.[1] ?? null;

            if (right && lastVisited !== right) {
                current = right; // explore right subtree
            } else {
                console.log(peek.value); // process node
                lastVisited = stack.pop()!;
            }

        }
    }
}


// iterativePostOrder(value);

function iterativePostOrderTwoStack(root: Data) {
    if (!root) return;

    const stack1: Data[] = [root];
    const stack2: Data[] = [];

    while (stack1.length) {
        const node = stack1.pop()!;
        stack2.push(node);

        const [left, right] = node.children || [];

        if (left) stack1.push(left);
        if (right) stack1.push(right);
    }

    while (stack2.length) {
        console.log(stack2.pop()!.value);
    }
}

// iterativePostOrderTwoStack(value);

// pre-order i.e. root, left and right

function dfsPreOrder(node: Data | null) {
    if (!node) return;

    // print the current node first and foremost
    console.log(node.value);

    const children = node.children || [];

    // since we're iterating so off course it will follow the left to right order
    for (const child of children) dfsPreOrder(child);
}

// dfsPreOrder(value);

// Iterative DFS for pre-order (explicit stack) with while and for loop
function dfsPreOrderIterative(root: Data) {
    const stack: Data[] = [root]

    while (stack.length) {
        const node = stack.pop()!

        console.log(node.value)

        const children = node.children ?? []

        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}

dfsPreOrderIterative(value);

// Iterative DFS (explicit stack) with nested while loop
function dfsPreOrderIterativeWithNestedWhile(root: Data) {
    const stack: Data[] = [root]

    while (stack.length) {

        const node = stack.pop()!

        console.log(node.value)

        const children = node.children ?? []

        let i = children.length - 1

        while (i >= 0) {
            stack.push(children[i]);
            i--;
        }
    }
}

function iterativePreOrder(root: Data) {
    if (!root) return;

    const stack: Data[] = [root];

    while (stack.length > 0) {

        const node = stack.pop()!;

        console.log(node.value); // process

        const [left = null, right = null] = node.children || [];

        if (right) stack.push(right);
        if (left) stack.push(left);
    }
}

// iterativePreOrder(value);

function inOrder(node: Data | null) {
    if (!node) return;

    // go left and then print root then when the current node done go back to previos node then handle right

    const [left = null, right = null] = node.children || [];

    inOrder(left);

    console.log(node.value);

    inOrder(right);

}

// inOrder(value);



function iterativeInOrder(node: Data) {
    const stack: Data[] = [];
    let current: Data | null = node;

    while (current || stack.length > 0) {

        // go as left as possible
        while (current) {
            stack.push(current);
            current = current.children?.[0] ?? null; // left
        }

        // stack = [3], current = null

        const node = stack.pop()!;

        console.log(node.value); // side-effect

        current = node.children?.[1] ?? null; // right


    }

}

// iterativeInOrder(value);



// Modified InOrder 3 1 2 based on right subtree

function modifiedInOrder(node: Data | null) {
    if (!node) return;

    // go right and then print root then when the current node done go back to previos node then handle left

    const [left = null, right = null] = node.children || [];

    modifiedInOrder(right);

    console.log(node.value);

    modifiedInOrder(left);
}

// modifiedInOrder(value);

// BFS (Breadth First Search) and this is level order traversal
function bfs(root: Data) {
    const queue: Data[] = [root];

    while (queue.length) {
        const node = queue.shift()!;

        console.log(node.value);

        // push all the children of the current node and for of or any ES6 iterations won't iterable on empty iterables 
        for (const child of node.children ?? []) {
            queue.push(child);
        }
    }

}

// bfs(value);


// Generator traversal (pull model)

function* dfsGenerator(node: Data): Generator<number> {
    yield node.value;
    // @ts-ignore: Downlevel iteration is disabled in tsconfig but supported by engine
    for (const child of node.children ?? []) yield* dfsGenerator(child);
}

// @ts-ignore: Downlevel iteration is disabled in tsconfig but supported by engine
for (const v of dfsGenerator(value)) console.log(v);


// Iteative + Generator i.e. a lazy DFS iterator

function* dfsIterGen(root: Data) {
    const stack = [root]

    while (stack.length) {
        const node = stack.pop()!

        yield node.value;

        const children = node.children ?? []

        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}

// @ts-ignore: Downlevel iteration is disabled in tsconfig but supported by engine
for (const v of dfsIterGen(value)) console.log(v);


// Custom iterator

class DFSIterator implements Iterable<number>, Iterator<number> {

    private stack: Data[]

    constructor(root: Data) {
        this.stack = [root]
    }

    next(): IteratorResult<number> {

        if (!this.stack.length) {
            return { done: true, value: undefined }
        }

        const node = this.stack.pop()!

        const children = node.children ?? []

        for (let i = children.length - 1; i >= 0; i--) {
            this.stack.push(children[i])
        }

        return { done: false, value: node.value }
    }

    [Symbol.iterator]() {
        return this
    }
}

// @ts-ignore: Downlevel iteration is disabled in tsconfig but supported by engine
for (const v of new DFSIterator(value)) {
    console.log(v)
}

function dfsNested(root: Data) {
    const stack: Data[] = []
    let current: Data | null = root

    while (current || stack.length) {

        while (current) {
            stack.push(current)

            const children: Data[] = current.children ?? []
            current = children[0] ?? null
        }

        const node = stack.pop()!

        console.log(node.value)

        const children: Data[] = node.children ?? []
        current = children[1] ?? null
    }
}

dfsNested(value);


function* bfsGen(root: Data) {
    const queue = [root]

    while (queue.length) {
        const node = queue.shift()!

        yield node.value

        for (const child of node.children ?? []) {
            queue.push(child)
        }
    }
}