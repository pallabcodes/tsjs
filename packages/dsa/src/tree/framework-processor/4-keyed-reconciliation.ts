/**
 * 4. KEYED RECONCILIATION ALGORITHM
 * 
 * Implements React's O(n) list diffing heuristic.
 */

export type Node = {
  key: string
  type: string
  index?: number
}

export type ReconcileResult = {
  reused: string[]
  moved: string[]
  inserted: string[]
  deleted: string[]
}

export function reconcile(oldChildren: Node[], newChildren: Node[]): ReconcileResult {
  const result: ReconcileResult = { reused: [], moved: [], inserted: [], deleted: [] }
  let lastPlacedIndex = 0
  let newIdx = 0
  let oldIdx = 0

  // Phase 1: Sequential Scan
  for (; oldIdx < oldChildren.length && newIdx < newChildren.length; oldIdx++, newIdx++) {
    const oldNode = oldChildren[oldIdx]
    const newNode = newChildren[newIdx]
    if (oldNode.key === newNode.key) {
      result.reused.push(newNode.key)
      lastPlacedIndex = oldIdx
    } else {
      break
    }
  }

  // Phase 2: Map Lookup
  const oldMap = new Map<string, { node: Node, index: number }>()
  for (let i = oldIdx; i < oldChildren.length; i++) {
    oldMap.set(oldChildren[i].key, { node: oldChildren[i], index: i })
  }

  for (; newIdx < newChildren.length; newIdx++) {
    const newNode = newChildren[newIdx]
    const matchedOld = oldMap.get(newNode.key)
    if (matchedOld) {
      oldMap.delete(newNode.key)
      if (matchedOld.index < lastPlacedIndex) {
        result.moved.push(newNode.key)
      } else {
        result.reused.push(newNode.key)
        lastPlacedIndex = matchedOld.index
      }
    } else {
      result.inserted.push(newNode.key)
    }
  }

  oldMap.forEach((matched) => {
    result.deleted.push(matched.node.key)
  })

  return result
}

if (require.main === module) {
  const oldList = [{ key: 'A', type: 'p' }, { key: 'B', type: 'p' }, { key: 'C', type: 'p' }]
  const newList = [{ key: 'A', type: 'p' }, { key: 'C', type: 'p' }, { key: 'B', type: 'p' }]
  console.log("Reconciling [A,B,C] -> [A,C,B]")
  console.log(reconcile(oldList, newList))
}
