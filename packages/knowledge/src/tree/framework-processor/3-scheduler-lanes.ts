/**
 * 3. REACT SCHEDULER & LANES SYSTEM
 * 
 * An advanced implementation that prioritizes updates using bitmask lanes.
 * Architecture: Fiber Reconciler + Lane-aware Scheduler + Two-Phase Commit.
 */

// 1️⃣ Priority Lanes (Bitmasks)
export type Lane = number
export const NoLane = 0b00000
export const SyncLane = 0b00001
export const InputLane = 0b00010
export const DefaultLane = 0b00100
export const TransitionLane = 0b01000
export const IdleLane = 0b10000

export function getHighestPriorityLane(lanes: number): Lane {
  return lanes & -lanes
}

// 2️⃣ Fiber Data Structure
export type EffectTag = "PLACEMENT" | "UPDATE" | "DELETION" | "NONE"

export type Fiber = {
  id: string
  type: string
  props: any
  child: Fiber | null
  sibling: Fiber | null
  return: Fiber | null
  alternate: Fiber | null
  effectTag: EffectTag
  lane: Lane
}

// 3️⃣ Scheduler
export class Scheduler {
  private pendingLanes: number = NoLane
  private nextUnitOfWork: Fiber | null = null
  private deadline: number = 0
  private frameTime: number = 5

  constructor(private reconciler: FiberReconciler) {}

  scheduleUpdate(root: Fiber, lane: Lane) {
    this.pendingLanes |= lane
    if (!this.nextUnitOfWork || lane < this.nextUnitOfWork.lane) {
      this.nextUnitOfWork = root
      this.nextUnitOfWork.lane = lane
    }
    this.workLoopConcurrent()
  }

  private workLoopConcurrent() {
    this.deadline = performance.now() + this.frameTime
    const currentLane = getHighestPriorityLane(this.pendingLanes)
    while (this.nextUnitOfWork && performance.now() < this.deadline) {
      this.nextUnitOfWork = this.reconciler.performUnitOfWork(this.nextUnitOfWork, currentLane)
    }
    if (this.nextUnitOfWork) {
      setTimeout(() => this.workLoopConcurrent(), 1)
    } else {
      this.pendingLanes &= ~currentLane
      this.reconciler.commitRoot()
      if (this.pendingLanes !== NoLane) {
        this.workLoopConcurrent()
      }
    }
  }
}

// 4️⃣ Reconciler
export class FiberReconciler {
  private currentRoot: Fiber | null = null
  private wipRoot: Fiber | null = null

  performUnitOfWork(unitOfWork: Fiber, lane: Lane): Fiber | null {
    console.log(`[Stage3 - LANE ${lane}] Processing: ${unitOfWork.id}`)
    this.reconcileChildren(unitOfWork, unitOfWork.alternate?.child || null)
    if (unitOfWork.child) return unitOfWork.child
    let next: Fiber | null = unitOfWork
    while (next) {
      if (next.sibling) return next.sibling
      next = next.return
    }
    return null
  }

  private reconcileChildren(wip: Fiber, oldChild: Fiber | null) {
    const elements = wip.props.children || []
    let prevSibling: Fiber | null = null
    let index = 0
    while (index < elements.length) {
      const element = elements[index]
      const newFiber: Fiber = {
        id: element.id, type: element.type, props: element.props,
        child: null, sibling: null, return: wip,
        alternate: oldChild, effectTag: oldChild ? "UPDATE" : "PLACEMENT",
        lane: wip.lane
      }
      if (index === 0) wip.child = newFiber
      else if (prevSibling) prevSibling.sibling = newFiber
      prevSibling = newFiber
      index++
    }
  }

  commitRoot() {
    console.log("\n--- STARTING COMMIT PHASE (STAGE 3) ---")
    this.commitWork(this.wipRoot)
    this.currentRoot = this.wipRoot
    this.wipRoot = null
    console.log("--- COMMIT COMPLETE ---\n")
  }

  private commitWork(fiber: Fiber | null) {
    if (!fiber) return
    if (fiber.effectTag === "PLACEMENT") {
      console.log(`[COMMIT] Placement detected: ${fiber.id}`)
    } else if (fiber.effectTag === "UPDATE") {
      console.log(`[COMMIT] Update detected: ${fiber.id}`)
    }
    this.commitWork(fiber.child)
    this.commitWork(fiber.sibling)
  }
}

if (require.main === module) {
  const reconciler = new FiberReconciler()
  const scheduler = new Scheduler(reconciler)
  const root: Fiber = {
    id: "root", type: "root", props: { children: [{ id: "c1", type: "div", props: {} }] },
    child: null, sibling: null, return: null, alternate: null, effectTag: "NONE", lane: NoLane
  }
  scheduler.scheduleUpdate(root, DefaultLane)
}
