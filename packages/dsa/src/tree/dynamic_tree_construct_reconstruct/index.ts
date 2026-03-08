type NodeId = string

interface TreeNode<T = unknown> {
    id: NodeId
    value: T
    parent: NodeId | null
    children: NodeId[]
}

class DynamicTree<T = unknown> {

    private nodes = new Map<NodeId, TreeNode<T>>()

    constructor() { }

    // create node
    createNode(id: NodeId, value: T) {

        if (this.nodes.has(id))
            throw new Error(`Node ${id} already exists`)

        this.nodes.set(id, {
            id,
            value,
            parent: null,
            children: []
        })
    }

    // attach child
    attachChild(parentId: NodeId, childId: NodeId) {

        const parent = this.nodes.get(parentId)
        const child = this.nodes.get(childId)

        if (!parent || !child)
            throw new Error("Parent or child missing")

        if (child.parent)
            this.detach(childId)

        child.parent = parentId
        parent.children.push(childId)
    }

    // detach node from parent
    detach(nodeId: NodeId) {

        const node = this.nodes.get(nodeId)
        if (!node || !node.parent)
            return

        const parent = this.nodes.get(node.parent)!

        parent.children = parent.children.filter(id => id !== nodeId)

        node.parent = null
    }

    // move node
    move(nodeId: NodeId, newParentId: NodeId) {

        this.detach(nodeId)
        this.attachChild(newParentId, nodeId)

    }

    // remove subtree
    remove(nodeId: NodeId) {

        const node = this.nodes.get(nodeId)
        if (!node) return

        for (const child of [...node.children])
            this.remove(child)

        this.detach(nodeId)
        this.nodes.delete(nodeId)

    }

    // BFS traversal
    bfs(startId: NodeId): NodeId[] {

        const queue: NodeId[] = [startId]
        const result: NodeId[] = []

        while (queue.length > 0) {

            const current = queue.shift()!

            result.push(current)

            const node = this.nodes.get(current)!

            for (const child of node.children)
                queue.push(child)

        }

        return result
    }

    // DFS traversal
    dfs(startId: NodeId): NodeId[] {

        const stack: NodeId[] = [startId]
        const result: NodeId[] = []

        while (stack.length > 0) {

            const current = stack.pop()!

            result.push(current)

            const node = this.nodes.get(current)!

            for (let i = node.children.length - 1; i >= 0; i--)
                stack.push(node.children[i])

        }

        return result
    }

    // flatten tree (for UI)
    flatten(startId: NodeId) {

        const result: { id: NodeId, depth: number }[] = []

        const walk = (id: NodeId, depth: number) => {

            result.push({ id, depth })

            const node = this.nodes.get(id)!

            for (const child of node.children)
                walk(child, depth + 1)

        }

        walk(startId, 0)

        return result
    }

    // print tree for debugging
    print(startId: NodeId) {

        const list = this.flatten(startId)

        console.log("\nTREE")

        for (const item of list) {

            const indent = " ".repeat(item.depth * 2)

            console.log(indent + item.id)

        }

    }

}

const tree = new DynamicTree()

tree.createNode("root", {})
tree.createNode("A", {})
tree.createNode("B", {})
tree.createNode("C", {})
tree.createNode("D", {})
tree.createNode("E", {})

tree.attachChild("root", "A")
tree.attachChild("root", "B")

tree.attachChild("A", "C")
tree.attachChild("A", "D")

tree.attachChild("B", "E");