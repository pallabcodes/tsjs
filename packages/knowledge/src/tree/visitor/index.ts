import Denque from "denque"

// Iterative BFS: Visitor pattern

interface TreeNode {
    value: string;
    visited?: boolean;
    children?: TreeNode[];
}

const tree: TreeNode = {
    value: "A",
    children: [
        {
            value: "B",
            children: [
                {value: "E"},
                {value: "F"}
            ]
        },
        {value: "C"},
        {value: "D"}
    ]
};

type Visitor = (node: TreeNode) => void;

// --- Example Visitors ---

/** Prints node values side-by-side */
const printVisit: Visitor = (node) => {
    process.stdout.write(`${node.value} `);
};

/** Logs each node value on a new line */
const logVisit: Visitor = (node) => {
    console.log(node.value);
};

/** Example: Flatten the tree into an array */
const flat: string[] = [];
const flattenVisit: Visitor = (node) => {
    flat.push(node.value);
};

/** Example: Search for a specific value */
let found: TreeNode | null = null;
const searchVisit: Visitor = (node) => {
    if (node.value === "E") {
        found = node;
    }
};

/** Example: Mark nodes as visited */
const markVisited: Visitor = (node) => {
    node.visited = true;
};


// --- BFS Implementation ---

function walkBFS(root: TreeNode, visit: Visitor) {
    const queue = new Denque<TreeNode>();
    queue.push(root);

    while (!queue.isEmpty()) {
        const node = queue.shift()!;
        visit(node);

        const children = node.children ?? [];
        for (const child of children) {
            queue.push(child);
        }
    }
    process.stdout.write('\n');
}

// --- Execution Examples ---

console.log("Breadth-First Search (Horizontal):");
walkBFS(tree, printVisit);

console.log("\nFlattened BFS Result:");
walkBFS(tree, flattenVisit);
console.log(flat);

console.log("\nSearching for node 'E'...");
walkBFS(tree, searchVisit);
console.log(found ? `Found: ${(found as TreeNode).value}` : "Not found");



