/**
 * WALKER PATTERN
 * 
 * Separates tree structure, traversal engine, and processing logic (handlers/plugins).
 */

// 1️⃣ Input Dataset Definition
export type Node = {
  type: string
  value?: number
  children?: Node[]
}

export const tree: Node = {
  type: "Add",
  children: [
    { type: "Number", value: 5 },
    {
      type: "Multiply",
      children: [
        { type: "Number", value: 2 },
        { type: "Number", value: 3 }
      ]
    }
  ]
}

// 4️⃣ Handler Interface
export type Handlers = {
  [type: string]: (node: Node) => void
}

// 5️⃣ Walker Implementation (Basic Recursive DFS)
export function walk(node: Node, handlers: Handlers) {
    const handler = handlers[node.type];

  if (handler) {
    handler(node)
  }

  for (const child of node.children ?? []) {
    walk(child, handlers)
  }
}

// 6️⃣ Enter / Exit Walker
export type WalkerHandlers = {
  [type: string]: {
    enter?: (node: Node) => void
    exit?: (node: Node) => void
  }
}

export function walkWithPhases(node: Node, handlers: WalkerHandlers) {
  const handler = handlers[node.type]

  handler?.enter?.(node)

  for (const child of node.children ?? []) {
    walkWithPhases(child, handlers)
  }

  handler?.exit?.(node)
}

// 8️⃣ Walker with State (e.g., Depth tracking)
export function walkWithState(node: Node, handlers: WalkerHandlers, depth = 0) {
  const handler = handlers[node.type]

  // We can pass depth or other context to handlers if needed
  // Here we just use depth in the traversal itself
  handler?.enter?.(node)

  for (const child of node.children ?? []) {
    walkWithState(child, handlers, depth + 1)
  }

  handler?.exit?.(node)
}

// 9️⃣ Walker Plugin System
export function walkWithPlugins(node: Node, plugins: WalkerHandlers[]) {
  // Enter phase for all plugins
  for (const p of plugins) {
    p[node.type]?.enter?.(node)
  }

  // Recurse
  for (const child of node.children ?? []) {
    walkWithPlugins(child, plugins)
  }

  // Exit phase for all plugins (usually in reverse order)
  for (let i = plugins.length - 1; i >= 0; i--) {
    plugins[i][node.type]?.exit?.(node)
  }
}

// 11️⃣ Iterative Walker (Stack Version)
export function walkIterative(root: Node, handlers: WalkerHandlers) {
  const stack: Node[] = [root]

  while (stack.length) {
    const node = stack.pop()!
    
    // Note: Iterative versions typically only handle 'enter' easily
    // or requires a more complex stack to handle 'exit'
    handlers[node.type]?.enter?.(node)

    const children = node.children ?? []
    // Push children in reverse order to maintain left-to-right processing
    for (let i = children.length - 1; i >= 0; i--) {
      stack.push(children[i])
    }
  }
}

/**
 * ADVANCED WALKER PATTERNS
 */

// 12️⃣ Path Object & Control Flow
export class Path {
  public node: Node
  public parentPath: Path | null
  public _skipped = false
  public _stopped = false

  constructor(node: Node, parentPath: Path | null = null) {
    this.node = node
    this.parentPath = parentPath
  }

  // Skip traversal of current node's children
  skip() {
    this._skipped = true
  }

  // Stop the entire traversal immediately
  stop() {
    this._stopped = true
    let p: Path | null = this
    while (p) {
      p._stopped = true
      p = p.parentPath
    }
  }

  // Helper to replace node (requires parent to have children array)
  replaceWith(newNode: Node) {
    if (!this.parentPath) throw new Error("Cannot replace root node via path yet")
    const children = this.parentPath.node.children ?? []
    const index = children.indexOf(this.node)
    if (index !== -1) {
      children[index] = newNode
      this.node = newNode
    }
  }
}

export type PathHandlers = {
  [type: string]: {
    enter?: (path: Path) => void
    exit?: (path: Path) => void
  }
}

export function walkWithPath(node: Node, handlers: PathHandlers, parentPath: Path | null = null): boolean {
  const path = new Path(node, parentPath)
  const handler = handlers[node.type]

  handler?.enter?.(path)

  if (path._stopped) return true // Cascade stop signal
  if (path._skipped) return false

  for (const child of node.children ?? []) {
    const stopped = walkWithPath(child, handlers, path)
    if (stopped) return true
  }

  handler?.exit?.(path)
  return path._stopped
}

// 13️⃣ Async Walker
export async function walkAsync(node: Node, handlers: {
  [type: string]: {
    enter?: (node: Node) => Promise<void> | void
    exit?: (node: Node) => Promise<void> | void
  }
}) {
  const handler = handlers[node.type]

  await handler?.enter?.(node)

  for (const child of node.children ?? []) {
    await walkAsync(child, handlers)
  }

  await handler?.exit?.(node)
}

/**
 * USAGE EXAMPLES
 */

if (require.main === module) {
  console.log("--- Basic Walker ---")
  walk(tree, {
    Add: () => console.log("add node"),
    Number: (node) => console.log("number:", node.value),
    Multiply: () => console.log("multiply node")
  })

  console.log("\n--- Enter/Exit Walker ---")
  walkWithPhases(tree, {
    Add: {
      enter: () => console.log("enter add"),
      exit: () => console.log("exit add")
    },
    Number: {
      enter: (node) => console.log("number", node.value)
    }
  })

  console.log("\n--- Path Walker with Control Flow ---")
  walkWithPath(tree, {
    Multiply: {
      enter: (path) => {
        console.log("Found Multiply, skipping its children!")
        path.skip()
      }
    },
    Number: {
      enter: (path) => console.log("Path Number:", path.node.value)
    }
  })

  console.log("\n--- Async Walker ---")
  walkAsync(tree, {
    Number: {
      enter: async (node) => {
        await new Promise(r => setTimeout(r, 10))
        console.log("Async number:", node.value)
      }
    }
  }).then(() => console.log("Async traversal complete"))
}
