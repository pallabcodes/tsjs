import { createHash } from "crypto";

/* =====================================
   Types
===================================== */

type Hash = string

interface BlobObject {
    type: "blob"
    content: string
}

interface DeltaObject {
    type: "delta"
    base: Hash
    patch: Patch[]
}

type GitObject = BlobObject | DeltaObject

interface Patch {
    type: "copy" | "insert"
    start?: number
    length?: number
    text?: string
}

/* =====================================
   Hash Utility
===================================== */

function sha1(data: string): Hash {

    return createHash("sha1")
        .update(data)
        .digest("hex")

}

/* =====================================
   Delta Builder
   (simple diff algorithm)
===================================== */

function buildDelta(base: string, target: string): Patch[] {

    const patches: Patch[] = [];

    let i = 0;

    while (i < target.length) {

        if (base[i] === target[i]) {

            let start = i

            while (base[i] === target[i] && i < target.length) i++;

            patches.push({
                type: "copy",
                start,
                length: i - start
            })

        } else {

            let start = i

            while (base[i] !== target[i] && i < target.length) i++;

            patches.push({
                type: "insert",
                text: target.slice(start, i)
            })

        }

    }

    return patches;
}

/* =====================================
   Apply Delta
===================================== */

function applyDelta(base: string, patches: Patch[]): string {

    let result = ""

    for (const p of patches) {

        if (p.type === "copy") {

            result += base.slice(p.start!, p.start! + p.length!)

        }

        if (p.type === "insert") {

            result += p.text

        }

    }

    return result
}

/* =====================================
   Object Store
===================================== */

class ObjectStore {

    private store = new Map<Hash, GitObject>()

    write(obj: GitObject): Hash {

        const serialized = JSON.stringify(obj)

        const hash = sha1(serialized)

        if (!this.store.has(hash))
            this.store.set(hash, obj)

        return hash
    }

    read(hash: Hash): GitObject | undefined {
        return this.store.get(hash)
    }

}

/* =====================================
   Packfile System
===================================== */

class Packfile {

    private objects: Hash[] = []

    constructor(private store: ObjectStore) {}

    add(hash: Hash) {
        this.objects.push(hash)
    }

    list() {
        return this.objects
    }

    bfs(start: Hash) {

        const queue: Hash[] = [start]
        const visited = new Set<Hash>()
        const result: Hash[] = []

        while (queue.length) {

            const hash = queue.shift()!

            if (visited.has(hash))
                continue

            visited.add(hash)
            result.push(hash)

            const obj = this.store.read(hash)

            if (obj?.type === "delta")
                queue.push(obj.base)
        }

        return result
    }

}

/* =====================================
   Repository
===================================== */

class Repository {

    private store = new ObjectStore()
    private pack = new Packfile(this.store)

    createBlob(content: string): Hash {

        const blob: BlobObject = {
            type: "blob",
            content
        }

        const hash = this.store.write(blob)

        this.pack.add(hash)

        return hash
    }

    createDelta(baseHash: Hash, newContent: string): Hash {

        const baseObj = this.store.read(baseHash)

        if (!baseObj || baseObj.type !== "blob")
            throw new Error("base must be blob")

        const patch = buildDelta(baseObj.content, newContent)

        const delta: DeltaObject = {
            type: "delta",
            base: baseHash,
            patch
        }

        const hash = this.store.write(delta)

        this.pack.add(hash)

        return hash
    }

    readObject(hash: Hash): string {

        const obj = this.store.read(hash)

        if (!obj)
            throw new Error("missing object")

        if (obj.type === "blob")
            return obj.content

        if (obj.type === "delta") {

            const base = this.readObject(obj.base)

            return applyDelta(base, obj.patch)
        }

        throw new Error("unknown object")
    }

    printPack() {

        console.log("\nPACKFILE OBJECTS")

        for (const h of this.pack.list())
            console.log(h)
    }

    printBFS(start: Hash) {

        console.log("\nBFS through delta chain")

        console.log(this.pack.bfs(start))
    }

}

/* =====================================
   Demo
===================================== */

const repo = new Repository()

/* initial file */

const v1 = repo.createBlob(
    `camera config
resolution=1080
fps=30`
)

/* new version */

const v2 = repo.createDelta(v1,
    `camera config
resolution=4k
fps=30`
)

/* another version */

const v3 = repo.createDelta(v2,
    `camera config
resolution=4k
fps=60`
)

/* read reconstructed file */

console.log("\nReconstructed v3 content")

console.log(repo.readObject(v3))

repo.printPack();

repo.printBFS(v3);