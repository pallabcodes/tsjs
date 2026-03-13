/* =====================================================
   Types
===================================================== */

type EditType = "equal" | "insert" | "delete"

interface DiffOp {
    type: EditType
    text: string
}

/* =====================================================
   Myers Diff Algorithm
===================================================== */

function myersDiff(a: string[], b: string[]): DiffOp[] {

    const N = a.length
    const M = b.length
    const max = N + M

    const v = new Map<number, number>()
    const trace: Map<number, number>[] = []

    v.set(1, 0)

    for (let d = 0; d <= max; d++) {

        const snapshot = new Map(v)
        trace.push(snapshot)

        for (let k = -d; k <= d; k += 2) {

            let x: number

            if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
                x = v.get(k + 1) ?? 0
            } else {
                x = (v.get(k - 1) ?? 0) + 1
            }

            let y = x - k

            while (x < N && y < M && a[x] === b[y]) {
                x++
                y++
            }

            v.set(k, x)

            if (x >= N && y >= M)
                return buildScript(trace, a, b)
        }
    }

    return []
}

/* =====================================================
   Build edit script
===================================================== */

function buildScript(
    trace: Map<number, number>[],
    a: string[],
    b: string[]
): DiffOp[] {

    let x = a.length
    let y = b.length

    const edits: DiffOp[] = []

    for (let d = trace.length - 1; d >= 0; d--) {

        const v = trace[d]
        const k = x - y

        let prevK

        if (k === -d || (k !== d && (v.get(k - 1) ?? 0) < (v.get(k + 1) ?? 0))) {
            prevK = k + 1
        } else {
            prevK = k - 1
        }

        const prevX = v.get(prevK) ?? 0
        const prevY = prevX - prevK

        while (x > prevX && y > prevY) {
            edits.push({ type: "equal", text: a[x - 1] })
            x--
            y--
        }

        if (d === 0)
            break

        if (x === prevX) {
            edits.push({ type: "insert", text: b[prevY] })
        } else {
            edits.push({ type: "delete", text: a[prevX] })
        }

        x = prevX
        y = prevY
    }

    return edits.reverse()
}

/* =====================================================
   Patch apply
===================================================== */

function applyPatch(base: string[], diff: DiffOp[]): string[] {

    const result: string[] = []

    let index = 0

    for (const op of diff) {

        if (op.type === "equal") {
            result.push(base[index])
            index++
        }

        if (op.type === "delete") {
            index++
        }

        if (op.type === "insert") {
            result.push(op.text)
        }
    }

    return result
}

/* =====================================================
   Visualization
===================================================== */

function printDiff(diff: DiffOp[]) {

    console.log("\nDIFF RESULT\n")

    for (const op of diff) {

        if (op.type === "equal")
            console.log("  " + op.text)

        if (op.type === "insert")
            console.log("+ " + op.text)

        if (op.type === "delete")
            console.log("- " + op.text)
    }
}

/* =====================================================
   Diff Graph BFS (educational)
===================================================== */

interface GraphNode {
    x: number
    y: number
}

function bfsDiffGraph(a: string[], b: string[]) {

    const queue: GraphNode[] = [{ x: 0, y: 0 }]
    const visited = new Set<string>()

    const nodes: GraphNode[] = []

    while (queue.length) {

        const node = queue.shift()!
        const key = node.x + "," + node.y

        if (visited.has(key))
            continue

        visited.add(key)
        nodes.push(node)

        if (node.x < a.length)
            queue.push({ x: node.x + 1, y: node.y })

        if (node.y < b.length)
            queue.push({ x: node.x, y: node.y + 1 })

        if (node.x < a.length && node.y < b.length && a[node.x] === b[node.y])
            queue.push({ x: node.x + 1, y: node.y + 1 })
    }

    return nodes
}

/* =====================================================
   DFS Diff Graph (educational)
===================================================== */

function dfsDiffGraph(a: string[], b: string[]) {

    const stack: GraphNode[] = [{ x: 0, y: 0 }]
    const visited = new Set<string>()
    const nodes: GraphNode[] = []

    while (stack.length) {

        const node = stack.pop()!
        const key = node.x + "," + node.y

        if (visited.has(key))
            continue

        visited.add(key)
        nodes.push(node)

        if (node.x < a.length)
            stack.push({ x: node.x + 1, y: node.y })

        if (node.y < b.length)
            stack.push({ x: node.x, y: node.y + 1 })

        if (node.x < a.length && node.y < b.length && a[node.x] === b[node.y])
            stack.push({ x: node.x + 1, y: node.y + 1 })
    }

    return nodes
}

/* =====================================================
   Demo
===================================================== */

const oldText = `
camera config
resolution=1080
fps=30
codec=h264
`.trim().split("\n")

const newText = `
camera config
resolution=4k
fps=60
codec=h265
`.trim().split("\n")

console.log("OLD TEXT\n", oldText)
console.log("\nNEW TEXT\n", newText)

/* run diff */

const diff = myersDiff(oldText, newText)

printDiff(diff)

/* apply patch */

const reconstructed = applyPatch(oldText, diff)

console.log("\nRECONSTRUCTED\n", reconstructed)

/* BFS / DFS graph traversal */

console.log("\nBFS DIFF GRAPH NODES")
console.log(bfsDiffGraph(oldText, newText))

console.log("\nDFS DIFF GRAPH NODES")
console.log(dfsDiffGraph(oldText, newText))