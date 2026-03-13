import { createHash } from "crypto";

// types

type Hash = string;

interface Blob {
    type: "blob";
    content: string;
}

interface TreeEntry {
    name: string;
    hash: Hash;
}

interface Tree {
    type: "tree";
    entries: TreeEntry[];
}

interface Commit {
    type: "commit";
    tree: Hash;
    parent?: Hash;
    message: string;
}

type GitObject = Blob | Tree | Commit;

// Object Store (content-addressable)

class ObjectStore {

    private store = new Map<Hash, GitObject>()

    write(obj: GitObject): Hash {

        const serialized = JSON.stringify(obj);

        const hash = createHash("sha1")
            .update(serialized)
            .digest("hex")

        if (!this.store.has(hash)) this.store.set(hash, obj);

        return hash
    }

    read(hash: Hash): GitObject | undefined {
        return this.store.get(hash)
    }

}

// Git Repository

class Repository {

    private store = new ObjectStore();

    /* ---------- blobs ---------- */

    createBlob(content: string): Hash {

        const blob: Blob = {
            type: "blob",
            content
        }

        return this.store.write(blob)
    }

    /* ---------- trees ---------- */

    createTree(entries: TreeEntry[]): Hash {

        const tree: Tree = {
            type: "tree",
            entries
        }

        return this.store.write(tree)
    }

    /* ---------- commit ---------- */

    createCommit(tree: Hash, message: string, parent?: Hash): Hash {

        const commit: Commit = {
            type: "commit",
            tree,
            parent,
            message
        }

        return this.store.write(commit)
    }

    /* =====================================
       Traversal utilities
    ===================================== */

    bfsTree(root: Hash) {

        const result: Hash[] = []
        const queue: Hash[] = [root]

        while (queue.length) {

            const hash = queue.shift()!

            result.push(hash)

            const obj = this.store.read(hash)

            if (obj?.type === "tree") {

                for (const entry of obj.entries)
                    queue.push(entry.hash)
            }
        }

        return result
    }

    dfsTree(root: Hash) {

        const result: Hash[] = []
        const stack: Hash[] = [root]

        while (stack.length) {

            const hash = stack.pop()!

            result.push(hash)

            const obj = this.store.read(hash)

            if (obj?.type === "tree") {

                for (let i = obj.entries.length - 1; i >= 0; i--)
                    stack.push(obj.entries[i].hash)
            }
        }

        return result
    }

    /* =====================================
       Flatten tree
    ===================================== */

    flattenTree(root: Hash) {

        const result: { hash: Hash, depth: number }[] = []

        const walk = (hash: Hash, depth: number) => {

            result.push({ hash, depth })

            const obj = this.store.read(hash)

            if (obj?.type === "tree") {

                for (const entry of obj.entries)
                    walk(entry.hash, depth + 1)
            }
        }

        walk(root, 0)

        return result
    }

    printTree(root: Hash) {

        const flat = this.flattenTree(root)

        console.log("\nTREE")

        for (const row of flat) {

            const indent = " ".repeat(row.depth * 2)

            console.log(indent + row.hash)
        }
    }

}

// Usage

const repo = new Repository();

/* create blobs */

const blob1 = repo.createBlob("hello world");
const blob2 = repo.createBlob("camera config");
const blob3 = repo.createBlob("analytics settings");

/* create tree */

const siteTree = repo.createTree([
    {name: "cam1.txt", hash: blob1},
    {name: "cam2.txt", hash: blob2}
]);

const rootTree = repo.createTree([
    {name: "siteA", hash: siteTree},
    {name: "config.txt", hash: blob3}
]);

/* create commit */

const commit1 = repo.createCommit(rootTree, "initial commit");

console.log("Initial commit:", commit1);

/* traversals */

console.log("\nBFS traversal");
console.log(repo.bfsTree(rootTree));

console.log("\nDFS traversal");
console.log(repo.dfsTree(rootTree));

/* print tree */

repo.printTree(rootTree)

/* =====================================
   Modify a file (new blob)
===================================== */

const newBlob = repo.createBlob("hello world updated");

const newSiteTree = repo.createTree([
    {name: "cam1.txt", hash: newBlob},
    {name: "cam2.txt", hash: blob2}
]);

const newRootTree = repo.createTree([
    {name: "siteA", hash: newSiteTree},
    {name: "config.txt", hash: blob3}
]);

const commit2 = repo.createCommit(newRootTree, "update camera")

console.log("\nSecond commit:", commit2)

repo.printTree(newRootTree);
