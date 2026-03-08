type NodeId = string

interface TreeNode<T = unknown> {
    id: NodeId
    value: T
    parent: NodeId | null
    children: NodeId[]
}

interface RawNode<T = unknown> {
    id: NodeId
    value: T
    children?: RawNode<T>[]
}

type Patch<T> =
    | { type: "create", node: RawNode<T>, parent: NodeId | null }
    | { type: "remove", id: NodeId }
    | { type: "move", id: NodeId, newParent: NodeId }
    | { type: "update", id: NodeId, value: T }

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

            this.nodes.set(node.id, entry)

            if (parent) {
                const p = this.nodes.get(parent)!
                p.children.push(node.id)
            }

            if (node.children)
                this.build(node.children, node.id)
        }
    }

    getNode(id: NodeId) {
        return this.nodes.get(id)
    }

    bfs(start: NodeId) {

        const result: NodeId[] = []
        const queue: NodeId[] = [start]

        while (queue.length) {

            const id = queue.shift()!
            result.push(id)

            const node = this.nodes.get(id)!

            for (const c of node.children)
                queue.push(c)
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

    flatten(start: NodeId) {

        const result: { id: NodeId, depth: number }[] = []

        const walk = (id: NodeId, depth: number) => {

            result.push({ id, depth })

            const node = this.nodes.get(id)!

            for (const c of node.children)
                walk(c, depth + 1)
        }

        walk(start, 0)

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

    create(node: RawNode<T>, parent: NodeId | null) {

        const entry: TreeNode<T> = {
            id: node.id,
            value: node.value,
            parent,
            children: []
        }

        this.nodes.set(node.id, entry)

        if (parent) {
            const p = this.nodes.get(parent)!
            p.children.push(node.id)
        }

        if (node.children)
            for (const child of node.children)
                this.create(child, node.id)
    }

    remove(id: NodeId) {

        const node = this.nodes.get(id)
        if (!node) return

        for (const c of [...node.children])
            this.remove(c)

        if (node.parent) {

            const parent = this.nodes.get(node.parent)!
            parent.children = parent.children.filter(x => x !== id)
        }

        this.nodes.delete(id)
    }

    move(id: NodeId, newParent: NodeId) {

        const node = this.nodes.get(id)!
        const oldParent = this.nodes.get(node.parent!)

        if (oldParent)
            oldParent.children = oldParent.children.filter(c => c !== id)

        const parent = this.nodes.get(newParent)!
        parent.children.push(id)

        node.parent = newParent
    }

    update(id: NodeId, value: T) {

        const node = this.nodes.get(id)
        if (node)
            node.value = value
    }

}

function diffTrees<T>(
    oldTree: Tree<T>,
    newRaw: RawNode<T>[]
): Patch<T>[] {

    const patches: Patch<T>[] = []

    const newIndex = new Map<NodeId, { parent: NodeId | null, node: RawNode<T> }>()

    const index = (nodes: RawNode<T>[], parent: NodeId | null) => {

        for (const n of nodes) {

            newIndex.set(n.id, { parent, node: n })

            if (n.children)
                index(n.children, n.id)
        }
    }

    index(newRaw, null)

    // detect create or update
    for (const [id, entry] of newIndex) {

        const old = oldTree.getNode(id)

        if (!old) {

            patches.push({
                type: "create",
                node: entry.node,
                parent: entry.parent
            })

            continue
        }

        if (JSON.stringify(old.value) !== JSON.stringify(entry.node.value)) {

            patches.push({
                type: "update",
                id,
                value: entry.node.value
            })
        }

        if (old.parent !== entry.parent && entry.parent) {

            patches.push({
                type: "move",
                id,
                newParent: entry.parent
            })
        }
    }

    // detect removals
    for (const id of oldTree.bfs("root")) {

        if (!newIndex.has(id) && id !== "root") {

            patches.push({
                type: "remove",
                id
            })
        }
    }

    return patches
}


function applyPatches<T>(tree: Tree<T>, patches: Patch<T>[]) {

    for (const p of patches) {

        if (p.type === "create")
            tree.create(p.node, p.parent)

        if (p.type === "remove")
            tree.remove(p.id)

        if (p.type === "move")
            tree.move(p.id, p.newParent)

        if (p.type === "update")
            tree.update(p.id, p.value)
    }

}


const oldData = [
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

const newData = [
    {
        id: "root",
        value: {},
        children: [
            {
                id: "A",
                value: { name: "A updated" },
                children: [
                    { id: "C", value: {} }
                ]
            },
            {
                id: "B",
                value: {},
                children: [
                    { id: "E", value: {} },
                    { id: "D", value: {} }
                ]
            }
        ]
    }
]

const tree = new Tree(oldData)

console.log("OLD TREE")
tree.print("root")

const patches = diffTrees(tree, newData)

console.log("\nPATCHES")
console.log(patches)

applyPatches(tree, patches)

console.log("\nNEW TREE")
tree.print("root")