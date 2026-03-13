/**
 * 1. BASIC HYBRID PROCESSOR
 * 
 * Combines Walker, Iterator, and Scheduler patterns.
 * Demonstrates basic time-slicing and iterative DFS.
 */

export type FiberNode = {
  type: string
  id: string
  child?: FiberNode
  sibling?: FiberNode
  return?: FiberNode 
  processed?: boolean
}

export function performUnitOfWork(unitOfWork: FiberNode): FiberNode | null {
  console.log(`[Basic] Working on node: ${unitOfWork.id}`)
  unitOfWork.processed = true

  if (unitOfWork.child) return unitOfWork.child

  let nextNode: FiberNode | undefined = unitOfWork
  while (nextNode) {
    if (nextNode.sibling) return nextNode.sibling
    nextNode = nextNode.return
  }
  return null
}

export class Scheduler {
  private nextUnitOfWork: FiberNode | null = null
  private deadline: number = 0
  private frameTime: number = 5

  constructor(root: FiberNode) {
    this.nextUnitOfWork = root
  }

  public start() {
    this.scheduleWork()
  }

  private scheduleWork() {
    setTimeout(() => {
      this.deadline = performance.now() + this.frameTime
      this.workLoop()
    }, 0)
  }

  private workLoop() {
    while (this.nextUnitOfWork && performance.now() < this.deadline) {
      this.nextUnitOfWork = performUnitOfWork(this.nextUnitOfWork)
    }

    if (this.nextUnitOfWork) {
      console.log("--- Yielding ---")
      this.scheduleWork()
    } else {
      console.log("--- Traversal Complete ---")
    }
  }
}

// Demo Helper
function createMassiveTree(depth: number, width: number): FiberNode {
  const root: FiberNode = { type: "root", id: "root" }
  let currentParent = root
  for (let d = 0; d < depth; d++) {
    let firstChild: FiberNode | undefined
    let prevSibling: FiberNode | undefined
    for (let w = 0; w < width; w++) {
      const node: FiberNode = { type: "item", id: `d${d}-w${w}`, return: currentParent }
      if (!firstChild) { firstChild = node; currentParent.child = node; }
      if (prevSibling) prevSibling.sibling = node
      prevSibling = node
    }
    currentParent = firstChild!
  }
  return root
}

if (require.main === module) {
  const rootNode = createMassiveTree(5, 3)
  const scheduler = new Scheduler(rootNode)
  scheduler.start()
}
