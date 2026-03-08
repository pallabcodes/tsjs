type NodeId = string

interface TreeNode<T = unknown> {
    id: NodeId
    value: T
    parent: NodeId | null
    children: NodeId[]
}

type TreeEvent<T = any> =
    | { type: "create", node: TreeNode<T> }
    | { type: "attach", parent: NodeId, child: NodeId }
    | { type: "detach", node: NodeId }
    | { type: "remove", node: NodeId }

type Listener<T = any> = (event: TreeEvent<T>) => void

class DynamicTree<T = unknown> {

    private nodes = new Map<NodeId, TreeNode<T>>()
    private listeners: Listener<T>[] = []

    subscribe(listener: Listener<T>) {
        this.listeners.push(listener)
    }

    private emit(event: TreeEvent<T>) {
        for (const l of this.listeners)
            l(event)
    }

    createNode(id: NodeId, value: T) {

        if (this.nodes.has(id))
            throw new Error("node exists")

        const node: TreeNode<T> = {
            id,
            value,
            parent: null,
            children: []
        }

        this.nodes.set(id, node)

        this.emit({ type: "create", node })
    }

    attachChild(parentId: NodeId, childId: NodeId) {

        const parent = this.nodes.get(parentId)!
        const child = this.nodes.get(childId)!

        if (child.parent)
            this.detach(childId)

        parent.children.push(childId)
        child.parent = parentId

        this.emit({ type: "attach", parent: parentId, child: childId })
    }

    detach(nodeId: NodeId) {

        const node = this.nodes.get(nodeId)
        if (!node || !node.parent) return

        const parent = this.nodes.get(node.parent)!

        parent.children = parent.children.filter(c => c !== nodeId)

        node.parent = null

        this.emit({ type: "detach", node: nodeId })
    }

    remove(nodeId: NodeId) {

        const node = this.nodes.get(nodeId)
        if (!node) return

        for (const c of [...node.children])
            this.remove(c)

        this.detach(nodeId)

        this.nodes.delete(nodeId)

        this.emit({ type: "remove", node: nodeId })
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

            for (const child of node.children)
                queue.push(child)
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
}

class DerivedTree<T = unknown> {

    private visible = new Set<NodeId>()

    constructor(
        private source: DynamicTree<T>,
        private predicate: (node: TreeNode<T>) => boolean
    ) {

        this.source.subscribe(this.handleEvent)
        this.initialize()

    }

    private initialize() {
        // In a real implementation, we'd need a way to iterate all nodes.
        // For this demo, we'll reach into the private 'nodes' or use BFS if root is known.
        // Let's assume we can access nodes for initialization.
        const allNodes = (this.source as any).nodes as Map<NodeId, TreeNode<T>>;
        for (const node of allNodes.values()) {
            if (this.predicate(node)) {
                this.visible.add(node.id);
            }
        }
    }

    private handleEvent = (event: TreeEvent<T>) => {

        if (event.type === "create") {

            if (this.predicate(event.node))
                this.visible.add(event.node.id)

        }

        if (event.type === "remove") {

            this.visible.delete(event.node)

        }

    }

    isVisible(id: NodeId) {
        return this.visible.has(id)
    }

}

const tree = new DynamicTree<{ type: string }>()

tree.createNode("root", { type: "root" })
tree.createNode("siteA", { type: "site" })
tree.createNode("siteB", { type: "site" })

tree.createNode("cam1", { type: "camera" })
tree.createNode("cam2", { type: "camera" })
tree.createNode("cam3", { type: "camera" })

tree.attachChild("root", "siteA")
tree.attachChild("root", "siteB")

tree.attachChild("siteA", "cam1")
tree.attachChild("siteA", "cam2")

tree.attachChild("siteB", "cam3");


const cameraTree = new DerivedTree(
    tree,
    node => node.value.type === "camera"
)

console.log("Cam1 visible:", cameraTree.isVisible("cam1"))
console.log("Cam2 visible:", cameraTree.isVisible("cam2"))
console.log("Cam3 visible:", cameraTree.isVisible("cam3"))
console.log("SiteA visible:", cameraTree.isVisible("siteA"))

console.log("\n--- Removing cam2 ---")
tree.remove("cam2")
console.log("Cam2 visible after removal:", cameraTree.isVisible("cam2"))


