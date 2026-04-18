/* =====================================================
   Types
===================================================== */

type FilePath = string

interface FileEntry {
    path: FilePath
    content: string
}

type FileTree = Map<FilePath, string>

interface Commit {
    id: string
    parent?: string
    tree: FileTree
}

/* =====================================================
   Utility Functions
===================================================== */

function randomId(): string {
    return Math.random().toString(16).slice(2, 10)
}

function cloneTree(tree: FileTree): FileTree {
    return new Map(tree)
}

/* =====================================================
   Repository
===================================================== */

class Repository {

    private commits = new Map<string, Commit>()
    private branches = new Map<string, string>()

    createCommit(tree: FileTree, parent?: string): string {

        const id = randomId()

        this.commits.set(id, {
            id,
            parent,
            tree: cloneTree(tree)
        })

        return id
    }

    createBranch(name: string, commit: string) {
        this.branches.set(name, commit)
    }

    getCommit(id: string): Commit {
        const commit = this.commits.get(id)
        if (!commit) throw new Error("commit not found")
        return commit
    }

    getBranch(name: string): Commit {
        const id = this.branches.get(name)
        if (!id) throw new Error("branch missing")
        return this.getCommit(id)
    }

}

/* =====================================================
   Rename Detection (simple heuristic)
===================================================== */

function detectRenames(
    base: FileTree,
    branch: FileTree
): Map<FilePath, FilePath> {

    const renames = new Map<FilePath, FilePath>()

    for (const [basePath, baseContent] of base) {

        if (branch.has(basePath))
            continue

        for (const [branchPath, branchContent] of branch) {

            if (baseContent === branchContent) {

                renames.set(basePath, branchPath)
            }
        }
    }

    return renames
}

/* =====================================================
   Three-way file merge
===================================================== */

interface MergeResult {
    merged: FileTree
    conflicts: string[]
}

function mergeTrees(
    base: FileTree,
    ours: FileTree,
    theirs: FileTree
): MergeResult {

    const merged = new Map<FilePath, string>()
    const conflicts: string[] = []

    const allPaths = new Set<FilePath>([
        ...base.keys(),
        ...ours.keys(),
        ...theirs.keys()
    ])

    const renameOurs = detectRenames(base, ours)
    const renameTheirs = detectRenames(base, theirs)

    for (const path of allPaths) {

        const baseVal = base.get(path)
        const ourPath = renameOurs.get(path) ?? path
        const theirPath = renameTheirs.get(path) ?? path

        const ourVal = ours.get(ourPath)
        const theirVal = theirs.get(theirPath)

        if (ourVal === theirVal) {

            if (ourVal)
                merged.set(path, ourVal)

            continue
        }

        if (baseVal === ourVal) {

            if (theirVal)
                merged.set(path, theirVal)

            continue
        }

        if (baseVal === theirVal) {

            if (ourVal)
                merged.set(path, ourVal)

            continue
        }

        conflicts.push(path)

        merged.set(
            path,
            `<<<<<<< ours
${ourVal ?? ""}
=======
${theirVal ?? ""}
>>>>>>> theirs`
        )
    }

    return { merged, conflicts }
}

/* =====================================================
   Traversal Utilities
===================================================== */

function bfsFiles(tree: FileTree) {

    const queue = [...tree.keys()]
    const result: string[] = []

    while (queue.length) {

        const path = queue.shift()!
        result.push(path)
    }

    return result
}

function dfsFiles(tree: FileTree) {

    const stack = [...tree.keys()]
    const result: string[] = []

    while (stack.length) {

        const path = stack.pop()!
        result.push(path)
    }

    return result
}

/* =====================================================
   Flatten Tree (visualization)
===================================================== */

function flattenTree(tree: FileTree) {

    const result: { path: string }[] = []

    for (const [path] of tree)
        result.push({ path })

    return result
}

function printTree(tree: FileTree) {

    console.log("\nFILES")

    for (const { path } of flattenTree(tree))
        console.log(path)
}

/* =====================================================
   Demo
===================================================== */

const repo = new Repository()

/* base tree */

const baseTree: FileTree = new Map([
    ["src/app.ts", "console.log('hello')"],
    ["README.md", "project readme"]
])

const baseCommit = repo.createCommit(baseTree)
repo.createBranch("main", baseCommit)

/* ours branch */

const oursTree = cloneTree(baseTree)

oursTree.set("src/app.ts", "console.log('hello world')")
oursTree.set("src/utils.ts", "export const util = true")

const oursCommit = repo.createCommit(oursTree, baseCommit)

/* theirs branch */

const theirsTree = cloneTree(baseTree)

theirsTree.delete("src/app.ts")
theirsTree.set("src/main.ts", "console.log('hello')")

const theirsCommit = repo.createCommit(theirsTree, baseCommit)

/* perform merge */

const { merged, conflicts } = mergeTrees(
    baseTree,
    oursTree,
    theirsTree
)

console.log("\nBASE TREE")
printTree(baseTree)

console.log("\nOURS TREE")
printTree(oursTree)

console.log("\nTHEIRS TREE")
printTree(theirsTree)

console.log("\nMERGED TREE")
printTree(merged)

console.log("\nCONFLICTS:", conflicts)

/* traversals */

console.log("\nBFS:", bfsFiles(merged))
console.log("DFS:", dfsFiles(merged))