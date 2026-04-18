// core types
export type TreeNode<T> = {
    id: string
    value: T
    children?: TreeNode<T>[]
}

export type TraversalPhase = "enter" | "exit"

export interface TraversalContext<T> {
    parent: TreeNode<T> | null
    depth: number
    index: number
    path: readonly string[]
}

export interface VisitResult<T> {
    replace?: TreeNode<T>
    remove?: boolean
    skip?: boolean
}

export interface Visitor<T> {
    enter?(
        node: TreeNode<T>,
        ctx: TraversalContext<T>
    ): VisitResult<T> | void | Promise<VisitResult<T> | void>

    exit?(
        node: TreeNode<T>,
        ctx: TraversalContext<T>
    ): VisitResult<T> | void | Promise<VisitResult<T> | void>
}

// pipeline (allows multiple visitors to run in sequence)

export function composeVisitors<T>(visitors: readonly Visitor<T>[]): Visitor<T> {
    return {
        enter(node: TreeNode<T>, ctx: TraversalContext<T>) {
            for (const visitor of visitors) {
                if (!visitor.enter) continue
                const result = visitor.enter(node, ctx)
                if (result && typeof result === "object") {
                    return result as VisitResult<T>
                }
            }
        },
        exit(node: TreeNode<T>, ctx: TraversalContext<T>) {
            for (const visitor of visitors) {
                if (!visitor.exit) continue
                const result = visitor.exit(node, ctx)
                if (result && typeof result === "object") {
                    return result as VisitResult<T>
                }
            }
        }
    }
}

// traversal

type Frame<T> = {
    node: TreeNode<T>
    parent: TreeNode<T> | null
    depth: number
    index: number
    path: string[]
    phase: "enter" | "exit"
}

export function traverse<T>(
    root: TreeNode<T>,
    visitor: Visitor<T>,
    signal?: AbortSignal
): TreeNode<T> | null {
    const stack: Frame<T>[] = [{
        node: root,
        parent: null,
        depth: 0,
        index: 0,
        path: [root.id],
        phase: "enter"
    }]

    let rootNode: TreeNode<T> | null = root

    while (stack.length) {
        if (signal?.aborted) {
            throw new Error("Traversal aborted")
        }

        const frame = stack.pop()!
        const { node, parent, depth, index, path, phase } = frame

        const ctx: TraversalContext<T> = {
            parent,
            depth,
            index,
            path
        }

        if (phase === "enter") {
            const result = visitor.enter?.(node, ctx) as VisitResult<T> | void

            if (result?.remove) {
                if (parent?.children) {
                    parent.children.splice(index, 1)
                } else {
                    rootNode = null
                }
                continue
            }

            let current = node

            if (result?.replace) {
                current = result.replace
                if (parent?.children) {
                    parent.children[index] = current
                } else {
                    rootNode = current
                }
            }

            stack.push({
                node: current,
                parent,
                depth,
                index,
                path,
                phase: "exit"
            })

            if (!result?.skip && current.children) {
                for (let i = current.children.length - 1; i >= 0; i--) {
                    const child = current.children[i]
                    stack.push({
                        node: child,
                        parent: current,
                        depth: depth + 1,
                        index: i,
                        path: [...path, child.id],
                        phase: "enter"
                    })
                }
            }
        } else {
            const result = visitor.exit?.(node, ctx) as VisitResult<T> | void
            if (result?.replace) {
                if (parent?.children) {
                    parent.children[index] = result.replace
                } else {
                    rootNode = result.replace
                }
            }
        }
    }

    return rootNode
}

export async function traverseAsync<T>(
    root: TreeNode<T>,
    visitor: Visitor<T>
): Promise<TreeNode<T> | null> {
    const stack: Frame<T>[] = [{
        node: root,
        parent: null,
        depth: 0,
        index: 0,
        path: [root.id],
        phase: "enter"
    }]

    let rootNode: TreeNode<T> | null = root

    while (stack.length) {
        const frame = stack.pop()!
        const { node, parent, depth, index, path, phase } = frame

        const ctx: TraversalContext<T> = {
            parent,
            depth,
            index,
            path
        }

        if (phase === "enter") {
            const result: VisitResult<T> | void =
                await visitor.enter?.(node, ctx)

            if (result?.remove) continue

            stack.push({
                node,
                parent,
                depth,
                index,
                path,
                phase: "exit" as const
            })

            if (!result?.skip && node.children) {
                for (let i = node.children.length - 1; i >= 0; i--) {
                    const child = node.children[i]
                    stack.push({
                        node: child,
                        parent: node,
                        depth: depth + 1,
                        index: i,
                        path: [...path, child.id],
                        phase: "enter" as const
                    })
                }
            }
        } else {
            await visitor.exit?.(node, ctx)
        }
    }

    return rootNode
}

// Generator Traversal
export function* dfsGenerator<T>(
    root: TreeNode<T>
): Generator<TreeNode<T>, void, unknown> {
    const stack: TreeNode<T>[] = [root]
    while (stack.length) {
        const node = stack.pop()!
        yield node
        const children = node.children ?? []
        for (let i = children.length - 1; i >= 0; i--) {
            stack.push(children[i])
        }
    }
}

// dataset
export type Camera = {
    name: string
    severity: number
}

export const cameraTree: TreeNode<Camera> = {
    id: "root",
    value: { name: "Global", severity: 0 },
    children: [
        {
            id: "us",
            value: { name: "USA", severity: 3 },
            children: [
                {
                    id: "ny",
                    value: { name: "New York", severity: 5 },
                    children: [
                        { id: "nyc1", value: { name: "NYC Cam1", severity: 9 } },
                        { id: "nyc2", value: { name: "NYC Cam2", severity: 4 } }
                    ]
                }
            ]
        },
        {
            id: "eu",
            value: { name: "Europe", severity: 2 },
            children: [
                {
                    id: "fr",
                    value: { name: "France", severity: 6 },
                    children: [
                        { id: "paris1", value: { name: "Paris Cam", severity: 7 } }
                    ]
                }
            ]
        }
    ]
}

// Visitors
export class LoggingVisitor implements Visitor<Camera> {
    enter(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {
        console.log("ENTER", ctx.depth, node.id, node.value.name)
    }
    exit(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {
        console.log("EXIT", ctx.depth, node.id)
    }
}

export class SeverityFilterVisitor implements Visitor<Camera> {
    private min: number
    constructor(min: number) { this.min = min }
    enter(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {
        if (node.value.severity < this.min) {
            return { skip: true }
        }
    }
}

export class MetricsVisitor implements Visitor<Camera> {
    public count = 0
    public maxDepth = 0
    enter(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {
        this.count++
        if (ctx.depth > this.maxDepth) { this.maxDepth = ctx.depth }
    }
}

// Usage
const metrics = new MetricsVisitor()
const visitor = composeVisitors([
    new LoggingVisitor(),
    new SeverityFilterVisitor(3),
    metrics
])

traverse(cameraTree, visitor);
console.log("Nodes visited:", metrics.count)
console.log("Max depth:", metrics.maxDepth)
console.log("\nGenerator traversal")
for (const node of dfsGenerator(cameraTree)) {
    console.log(node.id)
}