/* =====================================================
   Types
===================================================== */

type EditType = "equal" | "insert" | "delete"

interface DiffOp {
    type: EditType
    text: string
}

/* =====================================================
   Utility: count line frequencies
===================================================== */

function countLines(lines: string[]): Map<string, number> {

    const map = new Map<string, number>()

    for (const line of lines)
        map.set(line, (map.get(line) ?? 0) + 1)

    return map
}

/* =====================================================
   Find unique common lines
===================================================== */

function findUniqueCommon(
    a: string[],
    b: string[]
) {

    const countA = countLines(a)
    const countB = countLines(b)

    const positions: { aIndex: number; bIndex: number }[] = []

    const bMap = new Map<string, number>()

    for (let i = 0; i < b.length; i++)
        if (countB.get(b[i]) === 1)
            bMap.set(b[i], i)

    for (let i = 0; i < a.length; i++) {

        const line = a[i]

        if (countA.get(line) === 1 && bMap.has(line))
            positions.push({ aIndex: i, bIndex: bMap.get(line)! })
    }

    return positions
}

/* =====================================================
   Longest Increasing Subsequence
===================================================== */

function LIS(pairs: { aIndex: number; bIndex: number }[]) {

    const n = pairs.length
    const dp = new Array(n).fill(1)
    const prev = new Array(n).fill(-1)

    let maxLen = 0
    let maxIndex = -1

    for (let i = 0; i < n; i++) {

        for (let j = 0; j < i; j++) {

            if (
                pairs[j].bIndex < pairs[i].bIndex &&
                dp[j] + 1 > dp[i]
            ) {
                dp[i] = dp[j] + 1
                prev[i] = j
            }
        }

        if (dp[i] > maxLen) {
            maxLen = dp[i]
            maxIndex = i
        }
    }

    const result: typeof pairs = []

    while (maxIndex !== -1) {
        result.push(pairs[maxIndex])
        maxIndex = prev[maxIndex]
    }

    return result.reverse()
}

/* =====================================================
   Myers fallback diff
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

    while (i < a.length) {
        result.push({ type: "delete", text: a[i++] })
    }

    while (j < b.length) {
        result.push({ type: "insert", text: b[j++] })
    }

    return result
}

/* =====================================================
   Patience diff recursive core
===================================================== */

function patienceDiff(a: string[], b: string[]): DiffOp[] {

    const pairs = findUniqueCommon(a, b)

    if (pairs.length === 0)
        return simpleDiff(a, b)

    const anchors = LIS(pairs)

    const result: DiffOp[] = []

    let aStart = 0
    let bStart = 0

    for (const anchor of anchors) {

        const left = patienceDiff(
            a.slice(aStart, anchor.aIndex),
            b.slice(bStart, anchor.bIndex)
        )

        result.push(...left)

        result.push({
            type: "equal",
            text: a[anchor.aIndex]
        })

        aStart = anchor.aIndex + 1
        bStart = anchor.bIndex + 1
    }

    const right = patienceDiff(
        a.slice(aStart),
        b.slice(bStart)
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

    console.log("\nPATiENCE DIFF RESULT\n")

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
`.trim().split("\n")

const newText = `
camera config
resolution=4k
fps=60
codec=h265
`.trim().split("\n")

console.log("OLD TEXT")
console.log(oldText)

console.log("\nNEW TEXT")
console.log(newText)

/* run patience diff */

const diff = patienceDiff(oldText, newText)

printDiff(diff)

/* apply patch */

const reconstructed = applyPatch(oldText, diff)

console.log("\nRECONSTRUCTED TEXT")
console.log(reconstructed);