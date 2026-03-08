import Denque from "denque"

// Iterative BFS: Vistor pattern

type TreeNode = {
    value: string
    visited?: boolean
    children?: TreeNode[]
};

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

// Custom logger to support horizontal printing
const logger = {
    line: (msg: any) => {
        process.stdout.write(`${msg} `);
    }
};

// Augmenting console for the requested syntax
(console as any).line = logger.line;

function walkBFS(root: TreeNode, visit: Visitor) {

    const queue = new Denque<TreeNode>();
    queue.push(root);

    while (!queue.isEmpty()) {

        const node = queue.shift()!;

        visit(node);
        // (console as any).line(node.value);

        const children = node.children ?? [];

        for (const child of children) {
            queue.push(child)
        }
    }

    process.stdout.write('\n');
}

function logVisit(node: TreeNode) {
    console.log(node.value);
}

let count = 0;

function countVisit(node: TreeNode) {
    count++
}

// walkBFS(tree, logVisit);

// walkBFS(tree, countVisit);
// console.log(count);


const flat: string[] = []

function flattenVisit(node: TreeNode) {
    flat.push(node.value)
}

walkBFS(tree, flattenVisit);
console.log(flat);

function markVisited(node: TreeNode) {
    node.visited = true
}

const menu: { label: string }[] = []

function buildMenu(node: TreeNode) {
    menu.push({ label: node.value })
}


let found: TreeNode | null = null

function searchVisit(node: TreeNode) {

    if (node.value === "E") {
        found = node
    }

}

walkBFS(tree, searchVisit)


