// compiler-grade visitor approach

// What you’re referring to is the compiler-grade visitor architecture used in systems like:
//
//     TypeScript compiler
//
// Babel
//
// ESLint
//
// React Fiber traversal utilities
//
// These typically support:
//
//     enter / exit phases
//
// node replacement
//
// node removal
//
// skip subtree
//
// context propagation
//
// iterative traversal (no recursion stack overflow)

export type TreeNode<T> = {
    id: string
    value: T
    children?: TreeNode<T>[]
}

export interface TraversalContext<T> {
    parent: TreeNode<T> | null
    depth: number
    index: number
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
    ): VisitResult<T> | void

    exit?(
        node: TreeNode<T>,
        ctx: TraversalContext<T>
    ): VisitResult<T> | void
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
            value: { name: "USA", severity: 2 },
            children: [
                {
                    id: "ny",
                    value: { name: "New York", severity: 5 },
                    children: [
                        {
                            id: "nyc-1",
                            value: { name: "NYC Camera 1", severity: 9 }
                        },
                        {
                            id: "nyc-2",
                            value: { name: "NYC Camera 2", severity: 4 }
                        }
                    ]
                }
            ]
        },
        {
            id: "eu",
            value: { name: "Europe", severity: 1 },
            children: [
                {
                    id: "fr",
                    value: { name: "France", severity: 3 },
                    children: [
                        {
                            id: "paris-1",
                            value: { name: "Paris Camera 1", severity: 7 }
                        }
                    ]
                }
            ]
        }
    ]
}

// traversal (This is very similar to Babel / TypeScript AST walkers)

type StackFrame<T> = {
    node: TreeNode<T>
    parent: TreeNode<T> | null
    depth: number
    index: number
    phase: "enter" | "exit"
}

export function traverseTree<T>(
    root: TreeNode<T>,
    visitor: Visitor<T>
): TreeNode<T> | null {

    const stack: StackFrame<T>[] = [
        {
            node: root,
            parent: null,
            depth: 0,
            index: 0,
            phase: "enter"
        }
    ]

    let rootNode: TreeNode<T> | null = root

    while (stack.length > 0) {

        const frame = stack.pop()

        if (!frame) continue;

        const { node, parent, depth, index, phase } = frame

        const ctx: TraversalContext<T> = {
            parent,
            depth,
            index
        }

        if (phase === "enter") {

            const result: VisitResult<T> | void = visitor.enter?.(node, ctx);

            if (result?.remove) {

                if (parent?.children) {
                    parent.children.splice(index, 1)
                } else {
                    rootNode = null
                }

                continue;
            }

            let currentNode = node

            if (result?.replace) {

                currentNode = result.replace

                if (parent?.children) {
                    parent.children[index] = currentNode
                } else {
                    rootNode = currentNode
                }
            }

            stack.push({
                node: currentNode,
                parent,
                depth,
                index,
                phase: "exit"
            })

            if (!result?.skip && currentNode.children) {

                for (let i = currentNode.children.length - 1; i >= 0; i--) {

                    const child = currentNode.children[i]

                    stack.push({
                        node: child,
                        parent: currentNode,
                        depth: depth + 1,
                        index: i,
                        phase: "enter"
                    })
                }
            }
        } else {

            const result: VisitResult<T> | void =
                visitor.exit?.(node, ctx)

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

// Logging Visitor

export class LoggingVisitor implements Visitor<Camera> {

    enter(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {

        console.log(
            "ENTER",
            "depth:", ctx.depth,
            "node:", node.id,
            node.value.name
        )
    }

    exit(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {

        console.log(
            "EXIT",
            "depth:", ctx.depth,
            "node:", node.id
        )
    }
}

// Transform Visitor (normalize severity values)

export class SeverityTransformVisitor implements Visitor<Camera> {

    enter(node: TreeNode<Camera>, ctx: TraversalContext<Camera>) {

        if (node.value.severity > 8) {

            const newNode: TreeNode<Camera> = {
                ...node,
                value: {
                    ...node.value,
                    severity: 8
                }
            }

            return {
                replace: newNode
            }
        }
    }
}

// Usage

console.log("----- Logging traversal -----")

traverseTree(cameraTree, new LoggingVisitor())

console.log("\n----- Transform traversal -----")

const newTree = traverseTree(
    cameraTree,
    new SeverityTransformVisitor()
)

console.log(JSON.stringify(newTree, null, 2))