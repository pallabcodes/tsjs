/* =========================================
   Git Commit DAG Implementation
========================================= */

type Hash = string

interface Commit {
    hash: Hash
    message: string
    parents: Hash[]
}

function randomHash(): Hash {
    return Math.random().toString(16).slice(2, 10)
}

/* =========================================
   Repository
========================================= */

class Repository {

    private commits = new Map<Hash, Commit>()
    private branches = new Map<string, Hash>()

    /* ------------------------------
       create commit
    ------------------------------ */

    createCommit(message: string, parents: Hash[] = []): Hash {

        const hash = randomHash()

        const commit: Commit = {
            hash,
            message,
            parents
        }

        this.commits.set(hash, commit)

        return hash
    }

    /* ------------------------------
       create branch
    ------------------------------ */

    createBranch(name: string, commit: Hash) {
        this.branches.set(name, commit)
    }

    getBranch(name: string) {
        return this.branches.get(name)
    }

    /* ------------------------------
       commit on branch
    ------------------------------ */

    commit(branch: string, message: string): Hash {

        const parent = this.branches.get(branch)

        if (!parent)
            throw new Error("branch not found")

        const newCommit = this.createCommit(message, [parent])

        this.branches.set(branch, newCommit)

        return newCommit
    }

    /* ------------------------------
       merge branches
    ------------------------------ */

    merge(targetBranch: string, sourceBranch: string): Hash {

        const target = this.branches.get(targetBranch)
        const source = this.branches.get(sourceBranch)

        if (!target || !source)
            throw new Error("missing branch")

        const mergeCommit = this.createCommit(
            `merge ${sourceBranch} into ${targetBranch}`,
            [target, source]
        )

        this.branches.set(targetBranch, mergeCommit)

        return mergeCommit
    }

    /* =========================================
       BFS traversal of commit graph
    ========================================= */

    bfs(start: Hash): Hash[] {

        const result: Hash[] = []
        const queue: Hash[] = [start]
        const visited = new Set<Hash>()

        while (queue.length) {

            const hash = queue.shift()!

            if (visited.has(hash))
                continue

            visited.add(hash)
            result.push(hash)

            const commit = this.commits.get(hash)

            if (!commit)
                continue

            for (const parent of commit.parents)
                queue.push(parent)
        }

        return result
    }

    /* =========================================
       DFS traversal
    ========================================= */

    dfs(start: Hash): Hash[] {

        const result: Hash[] = []
        const stack: Hash[] = [start]
        const visited = new Set<Hash>()

        while (stack.length) {

            const hash = stack.pop()!

            if (visited.has(hash))
                continue

            visited.add(hash)
            result.push(hash)

            const commit = this.commits.get(hash)

            if (!commit)
                continue

            for (const parent of commit.parents)
                stack.push(parent)
        }

        return result
    }

    /* =========================================
       Find merge base (lowest common ancestor)
    ========================================= */

    findMergeBase(a: Hash, b: Hash): Hash | null {

        const ancestorsA = new Set<Hash>()

        const stackA = [a]

        while (stackA.length) {

            const hash = stackA.pop()!

            if (ancestorsA.has(hash))
                continue

            ancestorsA.add(hash)

            const commit = this.commits.get(hash)

            if (commit)
                for (const p of commit.parents)
                    stackA.push(p)
        }

        const stackB = [b]

        while (stackB.length) {

            const hash = stackB.pop()!

            if (ancestorsA.has(hash))
                return hash

            const commit = this.commits.get(hash)

            if (commit)
                for (const p of commit.parents)
                    stackB.push(p)
        }

        return null
    }

    /* =========================================
       Print commit DAG
    ========================================= */

    printGraph() {

        console.log("\nCOMMITS")

        for (const [hash, commit] of this.commits) {

            console.log(
                hash,
                "->",
                commit.parents.join(", "),
                "|",
                commit.message
            )
        }

        console.log("\nBRANCHES")

        for (const [name, hash] of this.branches)
            console.log(name, "->", hash)
    }

}

/* =========================================
   Demo
========================================= */

const repo = new Repository()

/* initial commit */

const root = repo.createCommit("initial commit")

repo.createBranch("main", root)

/* commits on main */

const c1 = repo.commit("main", "add camera module")
const c2 = repo.commit("main", "add analytics")

/* create feature branch */

repo.createBranch("feature", c1)

/* feature commits */

const f1 = repo.commit("feature", "new UI")
const f2 = repo.commit("feature", "improve UI")

/* merge feature into main */

const mergeCommit = repo.merge("main", "feature")

repo.printGraph()

/* traversals */

console.log("\nBFS from merge commit")

console.log(repo.bfs(mergeCommit))

console.log("\nDFS from merge commit")

console.log(repo.dfs(mergeCommit))

/* find merge base */

const mergeBase = repo.findMergeBase(
    repo.getBranch("main")!,
    repo.getBranch("feature")!
)

console.log("\nMerge base:", mergeBase);