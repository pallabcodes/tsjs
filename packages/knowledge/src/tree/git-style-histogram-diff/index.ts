/* =====================================================
   Types
===================================================== */

type EditType = "equal" | "insert" | "delete"

interface DiffOp {
    type: EditType
    text: string
}

/* =====================================================
   Build frequency histogram
===================================================== */

function buildHistogram(lines: string[]) {

    const map = new Map<string, number>()

    for (const line of lines)
        map.set(line, (map.get(line) ?? 0) + 1)

    return map
}

/* =====================================================
   Find best anchor (lowest frequency match)
===================================================== */

function findBestAnchor(
    a: string[],
    b: string[]
) {

    const hist = buildHistogram([...a, ...b])

    let bestScore = Infinity
    let best: { aIndex: number; bIndex: number } | null = null

    for (let i = 0; i < a.length; i++) {

        for (let j = 0; j < b.length; j++) {

            if (a[i] === b[j]) {

                const score = hist.get(a[i]) ?? Infinity

                if (score < bestScore) {
                    bestScore = score
                    best = { aIndex: i, bIndex: j }
                }
            }
        }
    }

    return best
}

/* =====================================================
   Simple fallback diff
===================================================== */

function simpleDiff(a: string[], b: string[]): DiffOp[] {

    const result: DiffOp[] = []

    let i = 0
    let j = 0

    while (i < a.length && j < b.length) {

        if (a[i] === b[j]) {

            result.push({ type: "equal", text: a[i] })
            i++
            j++

        } else {

            result.push({ type: "delete", text: a[i] })
            result.push({ type: "insert", text: b[j] })

            i++
            j++
        }
    }

    while (i < a.length)
        result.push({ type: "delete", text: a[i++] })

    while (j < b.length)
        result.push({ type: "insert", text: b[j++] })

    return result
}

/* =====================================================
   Histogram Diff Recursive Algorithm
===================================================== */

function histogramDiff(
    a: string[],
    b: string[]
): DiffOp[] {

    const anchor = findBestAnchor(a, b)

    if (!anchor)
        return simpleDiff(a, b)

    const result: DiffOp[] = []

    const left = histogramDiff(
        a.slice(0, anchor.aIndex),
        b.slice(0, anchor.bIndex)
    )

    result.push(...left)

    result.push({
        type: "equal",
        text: a[anchor.aIndex]
    })

    const right = histogramDiff(
        a.slice(anchor.aIndex + 1),
        b.slice(anchor.bIndex + 1)
    )

    result.push(...right)

    return result
}

/* =====================================================
   Apply patch
===================================================== */

function applyPatch(base: string[], diff: DiffOp[]) {

    const result: string[] = []

    let index = 0

    for (const op of diff) {

        if (op.type === "equal") {
            result.push(base[index])
            index++
        }

        if (op.type === "delete")
            index++

        if (op.type === "insert")
            result.push(op.text)
    }

    return result
}

/* =====================================================
   Visualization
===================================================== */

function printDiff(diff: DiffOp[]) {

    console.log("\nHISTOGRAM DIFF RESULT\n")

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
   Demo
===================================================== */

const oldText = `
camera config
resolution=1080
fps=30
codec=h264
bitrate=2mb
`.trim().split("\n")

const newText = `
camera config
resolution=4k
fps=60
codec=h265
bitrate=4mb
`.trim().split("\n")

console.log("OLD TEXT")
console.log(oldText)

console.log("\nNEW TEXT")
console.log(newText)

/* run histogram diff */

const diff = histogramDiff(oldText, newText)

printDiff(diff)

/* apply patch */

const reconstructed = applyPatch(oldText, diff)

console.log("\nRECONSTRUCTED TEXT")
console.log(reconstructed)