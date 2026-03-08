/* =========================
   Persistent Tree + Diff
   ========================= */

type NodeId = string

interface RawNode<T = unknown> {
    id: NodeId
    value: T
    children?: RawNode<T>[]
}

/* Persistent tree node */
class PNode<T = unknown> {
    readonly id: NodeId
    readonly value: T
    readonly children: readonly PNode<T>[]

    constructor(id: NodeId, value: T, children: readonly PNode<T>[] = []) {
        this.id = id
        this.value = value
        this.children = children
    }
}

/* =========================
   Build persistent tree
   ========================= */

function buildTree<T>(raw: RawNode<T>[]): PNode<T>[] {

    const build = (node: RawNode<T>): PNode<T> => {

        const children = (node.children ?? []).map(build)

        return new PNode(node.id, node.value, children)
    }

    return raw.map(build)
}

/* =========================
   BFS traversal
   ========================= */

function bfs<T>(roots: readonly PNode<T>[]): NodeId[] {

    const result: NodeId[] = []
    const queue: PNode<T>[] = [...roots]

    while (queue.length) {

        const node = queue.shift()!

        result.push(node.id)

        for (const child of node.children)
            queue.push(child)
    }

    return result
}

/* =========================
   DFS traversal
   ========================= */

function dfs<T>(roots: readonly PNode<T>[]): NodeId[] {

    const result: NodeId[] = []
    const stack: PNode<T>[] = [...roots].reverse()

    while (stack.length) {

        const node = stack.pop()!

        result.push(node.id)

        for (let i = node.children.length - 1; i >= 0; i--)
            stack.push(node.children[i])
    }

    return result
}

/* =========================
   Flatten tree
   ========================= */

function flatten<T>(roots: readonly PNode<T>[]) {

    const result: { id: NodeId, depth: number }[] = []

    const walk = (node: PNode<T>, depth: number) => {

        result.push({ id: node.id, depth })

        for (const child of node.children)
            walk(child, depth + 1)
    }

    for (const root of roots)
        walk(root, 0)

    return result
}

/* =========================
   Pretty print
   ========================= */

function printTree<T>(roots: readonly PNode<T>[]) {

    const flat = flatten(roots)

    console.log("\nTREE")

    for (const row of flat) {

        const indent = " ".repeat(row.depth * 2)
        console.log(indent + row.id)
    }
}

/* =========================
   Structural sharing update
   ========================= */

function updateNode<T>(
    roots: readonly PNode<T>[],
    id: NodeId,
    newValue: T
): readonly PNode<T>[] {

    const update = (node: PNode<T>): PNode<T> => {

        if (node.id === id)
            return new PNode(node.id, newValue, node.children)

        let changed = false

        const newChildren = node.children.map(child => {

            const updated = update(child)

            if (updated !== child)
                changed = true

            return updated
        })

        if (changed)
            return new PNode(node.id, node.value, newChildren)

        return node
    }

    return roots.map(update)
}

/* =========================
   Insert node (persistent)
   ========================= */

function insertChild<T>(
    roots: readonly PNode<T>[],
    parentId: NodeId,
    newNode: RawNode<T>
): readonly PNode<T>[] {

    const create = (node: RawNode<T>): PNode<T> =>
        new PNode(node.id, node.value, (node.children ?? []).map(create))

    const insert = (node: PNode<T>): PNode<T> => {

        if (node.id === parentId) {

            const newChild = create(newNode)

            return new PNode(node.id, node.value, [...node.children, newChild])
        }

        let changed = false

        const newChildren = node.children.map(child => {

            const updated = insert(child)

            if (updated !== child)
                changed = true

            return updated
        })

        if (changed)
            return new PNode(node.id, node.value, newChildren)

        return node
    }

    return roots.map(insert)
}

/* =========================
   Remove node (persistent)
   ========================= */

function removeNode<T>(
    roots: readonly PNode<T>[],
    id: NodeId
): readonly PNode<T>[] {

    const remove = (node: PNode<T>): PNode<T> | null => {

        if (node.id === id)
            return null

        let changed = false

        const newChildren: PNode<T>[] = []

        for (const child of node.children) {

            const result = remove(child)

            if (!result) {
                changed = true
                continue
            }

            if (result !== child)
                changed = true

            newChildren.push(result)
        }

        if (changed)
            return new PNode(node.id, node.value, newChildren)

        return node
    }

    return roots
        .map(remove)
        .filter(Boolean) as PNode<T>[]
}

/* =========================
   Demo
   ========================= */

const initial: RawNode<any>[] = [
    {
        id: "root",
        value: {},
        children: [
            {
                id: "A",
                value: { name: "A" },
                children: [
                    { id: "C", value: {} },
                    { id: "D", value: {} }
                ]
            },
            {
                id: "B",
                value: {},
                children: [
                    { id: "E", value: {} }
                ]
            }
        ]
    }
]

const tree1 = buildTree(initial)

console.log("INITIAL TREE")
printTree(tree1)

/* update value */
const tree2 = updateNode(tree1, "A", { name: "A updated" })

console.log("\nUPDATED TREE")
printTree(tree2)

/* insert node */
const tree3 = insertChild(tree2, "B", {
    id: "F",
    value: {}
})

console.log("\nAFTER INSERT")
printTree(tree3)

/* remove node */
const tree4 = removeNode(tree3, "C")

console.log("\nAFTER REMOVE")
printTree(tree4)

/* traversals */

console.log("\nBFS:", bfs(tree4))
console.log("DFS:", dfs(tree4))

/* structural sharing demonstration */

console.log(
    "\nShared subtree check:",
    tree1[0].children[1] === tree2[0].children[1]
)