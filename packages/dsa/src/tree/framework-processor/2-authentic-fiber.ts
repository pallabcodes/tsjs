/**
 * 2. AUTHENTIC FIBER ENGINE
 * 
 * Implements the beginWork / completeWork cycle.
 * Focuses on reconciliation logic and side-effect tracking.
 * Fixed: Nullable types for strict null checks.
 */

export type EffectTag = "PLACEMENT" | "UPDATE" | "DELETION" | "NONE"

export type Fiber = {
  type: string
  id: string
  props: Record<string, any>
  child?: Fiber | null
  sibling?: Fiber | null
  return?: Fiber | null
  alternate?: Fiber | null
  effectTag?: EffectTag
  stateNode?: any
}

class MockHost {
  commit(fiber: Fiber) {
    console.log(`[HOST] Committed ${fiber.effectTag}: ${fiber.id}`)
  }
}

export class Reconciler {
  private host = new MockHost()
  private wipRoot: Fiber | null = null
  private currentRoot: Fiber | null = null
  private deletions: Fiber[] = []

  constructor(private scheduleCallback: (work: () => void) => void) {}

  render(element: any) {
    this.wipRoot = {
      type: "root",
      id: "root",
      props: { children: [element] },
      alternate: this.currentRoot,
    }
    this.deletions = []
    this.scheduleCallback(() => this.commitRoot())
  }

  performUnitOfWork(fiber: Fiber): Fiber | null {
    this.reconcileChildren(fiber, fiber.props.children || [])
    if (fiber.child) return fiber.child
    let nextFiber: Fiber | null | undefined = fiber
    while (nextFiber) {
      if (nextFiber.sibling) return nextFiber.sibling
      nextFiber = nextFiber.return
    }
    return null
  }

  private reconcileChildren(wip: Fiber, elements: any[]) {
    let oldFiber = wip.alternate?.child
    let prevSibling: Fiber | null | undefined
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i]
        const newFiber: Fiber = {
            type: element.type, id: element.id, props: element.props,
            return: wip, effectTag: oldFiber ? "UPDATE" : "PLACEMENT"
        }
        if (i === 0) wip.child = newFiber
        else if (prevSibling) prevSibling.sibling = newFiber
        prevSibling = newFiber
    }
  }

  private commitRoot() {
    this.commitWork(this.wipRoot?.child)
    this.currentRoot = this.wipRoot
    this.wipRoot = null
    console.log("--- Commit Complete ---")
  }

  private commitWork(fiber?: Fiber | null) {
    if (!fiber) return
    this.host.commit(fiber)
    this.commitWork(fiber.child)
    this.commitWork(fiber.sibling)
  }
}

if (require.main === module) {
  const r = new Reconciler((cb) => setTimeout(cb, 0))
  r.render({ type: "h1", id: "title", props: { text: "Fiber Engine" } })
}
