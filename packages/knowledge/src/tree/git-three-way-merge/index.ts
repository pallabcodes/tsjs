// Types

type NodeId = string

interface RawNode<T = unknown> {
    id: NodeId
    value: T
    children?: RawNode<T>[]
}

interface TreeNode<T = unknown> {
    id: NodeId
    value: T
    parent: NodeId | null
    children: NodeId[]
}

type Conflict<T> = {
    id: NodeId
    base?: T
    ours?: T
    theirs?: T
}

// Tree Implementation

class Tree<T = unknown> {

    private nodes = new Map<NodeId, TreeNode<T>>()

    constructor(raw: RawNode<T>[]) {
        this.build(raw)
    }

    private build(raw: RawNode<T>[], parent: NodeId | null = null) {

        for (const node of raw) {

            const entry: TreeNode<T> = {
                id: node.id,
                value: node.value,
                parent,
                children: []
            }

            this.nodes.set(node.id, entry);

            if (parent) {
                const p = this.nodes.get(parent)!
                p.children.push(node.id)
            }

            if (node.children) this.build(node.children, node.id)
        }
    }

    getNode(id: NodeId) {
        return this.nodes.get(id)
    }

    setNode(id: NodeId, node: TreeNode<T>) {
        this.nodes.set(id, node)
    }

    /* =====================================
       Traversals
    ===================================== */

    bfs(start: NodeId) {

        const result: NodeId[] = []
        const queue: NodeId[] = [start]

        while (queue.length) {

            const id = queue.shift()!
            result.push(id)

            const node = this.nodes.get(id)!

            for (const c of node.children) queue.push(c);
        }

        return result
    }

    dfs(start: NodeId) {

        const result: NodeId[] = []
        const stack = [start]

        while (stack.length) {

            const id = stack.pop()!
            result.push(id)

            const node = this.nodes.get(id)!

            for (let i = node.children.length - 1; i >= 0; i--)
                stack.push(node.children[i])
        }

        return result
    }

    /* =====================================
       Flatten tree
    ===================================== */

    flatten(start: NodeId) {

        const result: { id: NodeId, depth: number }[] = []

        const walk = (id: NodeId, depth: number) => {

            result.push({id, depth});

            const node = this.nodes.get(id)!

            for (const c of node.children)
                walk(c, depth + 1)
        }

        walk(start, 0);

        return result
    }

    print(start: NodeId) {

        const flat = this.flatten(start)

        console.log("\nTREE")

        for (const row of flat) {

            const indent = " ".repeat(row.depth * 2)

            console.log(indent + row.id)
        }
    }

}

// Three-way merge algorithm

function threeWayMerge<T>(
    base: Tree<T>,
    ours: Tree<T>,
    theirs: Tree<T>,
    root: NodeId
) {

    const merged = new Tree<T>([]);
    const conflicts: Conflict<T>[] = [];

    const ids = new Set<NodeId>();

    const collect = (tree: Tree<T>) => {
        for (const id of tree.bfs(root)) ids.add(id)
    };

    collect(base);
    collect(ours);
    collect(theirs);

    for (const id of ids) {

        const b = base.getNode(id)
        const o = ours.getNode(id)
        const t = theirs.getNode(id)

        const baseVal = b?.value
        const ourVal = o?.value
        const theirVal = t?.value

        if (JSON.stringify(ourVal) === JSON.stringify(theirVal)) {
            if (o) merged.setNode(id, o);
            continue;
        }

        if (JSON.stringify(baseVal) === JSON.stringify(ourVal)) {
            if (t) merged.setNode(id, t);
            continue;
        }

        if (JSON.stringify(baseVal) === JSON.stringify(theirVal)) {
            if (o) merged.setNode(id, o);
            continue;
        }

        conflicts.push({
            id,
            base: baseVal,
            ours: ourVal,
            theirs: theirVal
        })

        if (o) merged.setNode(id, o);

    }

    return { merged, conflicts }
}


// Usage example

const baseData: RawNode<any>[] = [
    {
        id: "root",
        value: {},
        children: [
            {
                id: "A",
                value: {name: "A"},
                children: [
                    {id: "C", value: {}}
                ]
            },
            {
                id: "B",
                value: {},
                children: []
            }
        ]
    }
];

const oursData: RawNode<any>[] = [
    {
        id: "root",
        value: {},
        children: [
            {
                id: "A",
                value: {name: "A ours"},
                children: [
                    {id: "C", value: {}}
                ]
            },
            {
                id: "B",
                value: {},
                children: [
                    {id: "D", value: {}}
                ]
            }
        ]
    }
];

const theirsData: RawNode<any>[] = [
    {
        id: "root",
        value: {},
        children: [
            {
                id: "A",
                value: {name: "A theirs"},
                children: [
                    {id: "C", value: {}}
                ]
            },
            {
                id: "B",
                value: {},
                children: []
            }
        ]
    }
];

const baseTree = new Tree(baseData);
const ourTree = new Tree(oursData);
const theirTree = new Tree(theirsData);


console.log("BASE")
baseTree.print("root")

console.log("\nOURS")
ourTree.print("root")

console.log("\nTHEIRS")
theirTree.print("root")

const {merged, conflicts} = threeWayMerge(
    baseTree,
    ourTree,
    theirTree,
    "root"
);

console.log("\nMERGED")
merged.print("root")

console.log("\nCONFLICTS")
console.log(conflicts);


// Traversals
console.log("\nBFS:", ourTree.bfs("root"))
console.log("DFS:", ourTree.dfs("root"))

