/* ======================================
   CRDT Tree Implementation
====================================== */

type NodeId = string
type ActorId = string
type Timestamp = number

interface CRDTNode<T = unknown> {
    id: NodeId
    value: T
    parent: NodeId | null
    children: Set<NodeId>
    tombstone: boolean
    clock: Timestamp
    actor: ActorId
}

interface Operation<T = unknown> {
    type: "insert" | "remove" | "move" | "update"
    id: NodeId
    parent?: NodeId | null
    value?: T
    actor: ActorId
    clock: Timestamp
}

class CRDTTree<T = unknown> {
    private nodes = new Map<NodeId, CRDTNode<T>>()
    private actor: ActorId
    private clock = 0

    constructor(actor: ActorId) {
        this.actor = actor
    }

    private nextClock() {
        this.clock++
        return this.clock
    }

    insert(id: NodeId, parent: NodeId | null, value: T): Operation<T> {
        const op: Operation<T> = {
            type: "insert",
            id,
            parent,
            value,
            actor: this.actor,
            clock: this.nextClock()
        }
        this.apply(op)
        return op
    }

    remove(id: NodeId): Operation<T> {
        const op: Operation<T> = {
            type: "remove",
            id,
            actor: this.actor,
            clock: this.nextClock()
        }
        this.apply(op)
        return op
    }

    move(id: NodeId, parent: NodeId): Operation<T> {
        const op: Operation<T> = {
            type: "move",
            id,
            parent,
            actor: this.actor,
            clock: this.nextClock()
        }
        this.apply(op)
        return op
    }

    update(id: NodeId, value: T): Operation<T> {
        const op: Operation<T> = {
            type: "update",
            id,
            value,
            actor: this.actor,
            clock: this.nextClock()
        }
        this.apply(op)
        return op
    }

    apply(op: Operation<T>) {
        const existing = this.nodes.get(op.id)

        if (op.type === "insert") {
            if (!existing) {
                const node: CRDTNode<T> = {
                    id: op.id,
                    value: op.value!,
                    parent: op.parent ?? null,
                    children: new Set(),
                    tombstone: false,
                    clock: op.clock,
                    actor: op.actor
                }
                this.nodes.set(op.id, node)
                if (op.parent) {
                    const parent = this.nodes.get(op.parent)
                    if (parent) parent.children.add(op.id)
                }
            }
        }

        if (!existing) return
        if (op.clock < existing.clock) return

        existing.clock = op.clock

        if (op.type === "remove") {
            existing.tombstone = true
            const parent = existing.parent
            if (parent) {
                const p = this.nodes.get(parent)
                p?.children.delete(op.id)
            }
        }

        if (op.type === "move") {
            if (existing.parent) {
                const oldParent = this.nodes.get(existing.parent)
                oldParent?.children.delete(op.id)
            }
            existing.parent = op.parent!
            const newParent = this.nodes.get(op.parent!)
            newParent?.children.add(op.id)
        }

        if (op.type === "update") {
            existing.value = op.value!
        }
    }

    merge(ops: Operation<T>[]) {
        for (const op of ops) this.apply(op)
    }

    bfs(root: NodeId) {
        const result: NodeId[] = []
        const queue: NodeId[] = [root]
        while (queue.length) {
            const id = queue.shift()!
            const node = this.nodes.get(id)
            if (!node || node.tombstone) continue
            result.push(id)
            for (const child of node.children) queue.push(child)
        }
        return result
    }

    dfs(root: NodeId) {
        const result: NodeId[] = []
        const stack: NodeId[] = [root]
        while (stack.length) {
            const id = stack.pop()!
            const node = this.nodes.get(id)
            if (!node || node.tombstone) continue
            result.push(id)
            const children = [...node.children]
            for (let i = children.length - 1; i >= 0; i--) stack.push(children[i])
        }
        return result
    }

    flatten(root: NodeId) {
        const result: { id: NodeId, depth: number }[] = []
        const walk = (id: NodeId, depth: number) => {
            const node = this.nodes.get(id)
            if (!node || node.tombstone) return
            result.push({ id, depth })
            for (const c of node.children) walk(c, depth + 1)
        }
        walk(root, 0)
        return result
    }

    print(root: NodeId) {
        const flat = this.flatten(root)
        console.log("\nTREE")
        for (const row of flat) {
            const indent = " ".repeat(row.depth * 2)
            console.log(indent + row.id)
        }
    }
}

/* ======================================
   Demo: Two users editing concurrently
====================================== */

const userA = new CRDTTree<{}>("A")
const userB = new CRDTTree<{}>("B")

/* initial root */
const initOp = userA.insert("root", null, {})
userB.apply(initOp)

/* user A adds nodes */
const opsA = [
    userA.insert("site1", "root", {}),
    userA.insert("cam1", "site1", {}),
]

/* user B concurrently adds different nodes */
const opsB = [
    userB.insert("site2", "root", {}),
    userB.insert("cam2", "site2", {}),
]

/* simulate network merge */
userA.merge(opsB)
userB.merge(opsA)

/* both trees converge */
console.log("\nUser A tree")
userA.print("root")

console.log("\nUser B tree")
userB.print("root")

/* concurrent move */
const moveA = userA.move("cam1", "site2")
userB.apply(moveA)

console.log("\nAfter move")
userA.print("root")
userB.print("root")

/* traversals */
console.log("\nBFS:", userA.bfs("root"))
console.log("DFS:", userA.dfs("root"))