/**
 * ZIPPER PATTERN
 * 
 * A technique for navigating and editing trees efficiently without rebuilding
 * the entire structure by maintaining localized focus and path context.
 */

// 1️⃣ Data Structure Definitions
export type Node = {
  value: number
  children?: Node[]
}

export type Context = {
  parent: Node
  left: Node[]
  right: Node[]
  up: Context | null
}

export type Zipper = {
  node: Node
  context: Context | null
}

// 4️⃣ Creating a Zipper
export function fromTree(tree: Node): Zipper {
  return {
    node: tree,
    context: null
  }
}

// 5️⃣ Move Down (navigate to child)
export function down(zipper: Zipper, index = 0): Zipper | null {
  const children = zipper.node.children ?? []

  if (!children[index]) return null

  const left = children.slice(0, index)
  const right = children.slice(index + 1)

  return {
    node: children[index],
    context: {
      parent: zipper.node,
      left,
      right,
      up: zipper.context
    }
  }
}

// 6️⃣ Move Right (next sibling)
export function right(zipper: Zipper): Zipper | null {
  const ctx = zipper.context
  if (!ctx || ctx.right.length === 0) return null

  const [next, ...rest] = ctx.right

  return {
    node: next,
    context: {
      parent: ctx.parent,
      left: [...ctx.left, zipper.node],
      right: rest,
      up: ctx.up
    }
  }
}

// 7️⃣ Move Left (previous sibling)
export function left(zipper: Zipper): Zipper | null {
  const ctx = zipper.context
  if (!ctx || ctx.left.length === 0) return null

  const newLeft = [...ctx.left]
  const prev = newLeft.pop()!

  return {
    node: prev,
    context: {
      parent: ctx.parent,
      left: newLeft,
      right: [zipper.node, ...ctx.right],
      up: ctx.up
    }
  }
}

// 8️⃣ Move Up (reconstruct parent and move context up)
export function up(zipper: Zipper): Zipper | null {
  const ctx = zipper.context
  if (!ctx) return null

  const newChildren = [
    ...ctx.left,
    zipper.node,
    ...ctx.right
  ]

  return {
    node: {
      ...ctx.parent,
      children: newChildren
    },
    context: ctx.up
  }
}

// 9️⃣ Update Current Node
export function update(zipper: Zipper, fn: (node: Node) => Node): Zipper {
  return {
    ...zipper,
    node: fn(zipper.node)
  }
}

// 🔟 Helper: Root (reconstruct the entire tree from current focus)
export function root(zipper: Zipper): Node {
  let moveUp = up(zipper)
  if (!moveUp) return zipper.node
  
  let current = moveUp
  while (true) {
    const next = up(current)
    if (!next) return current.node
    current = next
  }
}

/**
 * USAGE EXAMPLE
 */

// Sample Tree
export const tree: Node = {
  value: 10,
  children: [
    {
      value: 20,
      children: [{ value: 50 }, { value: 60 }]
    },
    { value: 30 },
    {
      value: 40,
      children: [{ value: 70 }]
    }
  ]
}

if (require.main === module) {
  console.log("Starting Zipper Demonstration...")
  
  let z = fromTree(tree)
  
  // Navigate to 60 (down to 20, then down to second child 60)
  console.log("Moving down to 20...")
  z = down(z)!
  
  console.log("Moving down to 60...")
  z = down(z, 1)!
  console.log("Current Node Value:", z.node.value) // 60
  
  // Update 60 to 600
  console.log("Updating 60 -> 600...")
  z = update(z, n => ({ ...n, value: 600 }))
  
  // Return to root
  const modifiedTree = root(z)
  console.log("\nReconstructed Tree Root Value:", modifiedTree.value)
  console.log("Modified Node (depth 2):", modifiedTree.children?.[0].children?.[1].value) // 600
  
  // Check siblings
  console.log("\nNavigating siblings of 600...")
  z = left(z)!
  console.log("Sibling to the left:", z.node.value) // 50
}
