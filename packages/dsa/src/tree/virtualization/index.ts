type TreeNode = {
    id: string
    children?: TreeNode[]
}

// 1. input data

const tree: TreeNode[] = [
    {
        id: "SiteA",
        children: [
            { id: "Cam1" },
            { id: "Cam2" },
            {
                id: "Cam3",
                children: [
                    { id: "Sensor1" },
                    { id: "Sensor2" }
                ]
            }
        ]
    },
    {
        id: "SiteB",
        children: [
            { id: "Cam4" },
            { id: "Cam5" }
        ]
    }
]


// SiteA
//  ├ Cam1
//  ├ Cam2
//  └ Cam3
//     ├ Sensor1
//     └ Sensor2

// SiteB
//  ├ Cam4
//  └ Cam5

// 2. Flattened Node Type

type FlatNode = {
    id: string
    depth: number
    parentId: string | null
    hasChildren: boolean
    expanded: boolean
    subtreeSize: number // number of visible descendants
} // This is what the virtualized list will use.


// 3. Virtual Tree Engine

// class VirtualTree {

//     private treeMap = new Map<string, TreeNode>()
//     private flat: FlatNode[] = []
//     private indexMap = new Map<string, number>()

//     constructor(private roots: TreeNode[]) {
//         this.buildTreeMap()
//         this.initializeFlat()
//     }

//     // normalize tree into lookup map
//     private buildTreeMap() {

//         const walk = (node: TreeNode) => {
//             this.treeMap.set(node.id, node)

//             for (const child of node.children ?? [])
//                 walk(child)
//         }

//         for (const root of this.roots)
//             walk(root)

//     }

//     // initialize flat list with only roots
//     private initializeFlat() {

//         this.flat = this.roots.map(root => ({
//             id: root.id,
//             depth: 0,
//             parentId: null,
//             hasChildren: !!root.children?.length,
//             expanded: false
//         }))

//         this.rebuildIndex()

//     }

//     private rebuildIndex() {

//         this.indexMap.clear()

//         this.flat.forEach((node, index) => {
//             this.indexMap.set(node.id, index)
//         })

//     }

//     getFlat() {
//         return this.flat
//     }

//     // flatten subtree for expansion
//     private flattenSubtree(node: TreeNode, depth: number) {

//         const result: FlatNode[] = []

//         const walk = (n: TreeNode, d: number) => {

//             result.push({
//                 id: n.id,
//                 depth: d,
//                 parentId: node.id,
//                 hasChildren: !!n.children?.length,
//                 expanded: false
//             })

//             for (const child of n.children ?? [])
//                 walk(child, d + 1)

//         }

//         for (const child of node.children ?? []) walk(child, depth);
            
//         return result

//     }

//     expand(id: string) {

//         const index = this.indexMap.get(id)

//         if (index === undefined)
//             return

//         const flatNode = this.flat[index]
//         if (!flatNode.hasChildren || flatNode.expanded)
//             return

//         const treeNode = this.treeMap.get(id)!
//         const children = this.flattenSubtree(treeNode, flatNode.depth + 1)

//         this.flat.splice(index + 1, 0, ...children)

//         flatNode.expanded = true

//         this.rebuildIndex()

//     }

//     collapse(id: string) {

//         const index = this.indexMap.get(id)

//         if (index === undefined)
//             return

//         const node = this.flat[index]

//         if (!node.expanded)
//             return

//         const depth = node.depth
//         let removeCount = 0

//         for (let i = index + 1; i < this.flat.length; i++) {

//             if (this.flat[i].depth <= depth)
//                 break

//             removeCount++

//         }

//         this.flat.splice(index + 1, removeCount)

//         node.expanded = false

//         this.rebuildIndex()

//     }

// }

class VirtualTree {

    private treeMap = new Map<string, TreeNode>()
    private flat: FlatNode[] = []
    private indexMap = new Map<string, number>()

    constructor(private roots: TreeNode[]) {
        this.buildTreeMap()
        this.initializeFlat()
    }

    private buildTreeMap() {

        const walk = (node: TreeNode) => {
            this.treeMap.set(node.id, node)

            for (const child of node.children ?? [])
                walk(child)
        }

        for (const root of this.roots) walk(root);

    }

    private initializeFlat() {

        this.flat = this.roots.map(root => ({
            id: root.id,
            depth: 0,
            parentId: null,
            hasChildren: !!root.children?.length,
            expanded: false,
            subtreeSize: 0
        }))

        this.rebuildIndex()

    }

    private rebuildIndex() {

        this.indexMap.clear()

        this.flat.forEach((node, index) => {
            this.indexMap.set(node.id, index)
        })

    }

    getFlat() {
        return this.flat
    }

    private flattenSubtree(node: TreeNode, depth: number) {

        const result: FlatNode[] = []

        const walk = (n: TreeNode, d: number) => {

            result.push({
                id: n.id,
                depth: d,
                parentId: node.id,
                hasChildren: !!n.children?.length,
                expanded: false,
                subtreeSize: 0
            })

            for (const child of n.children ?? [])
                walk(child, d + 1)

        }

        for (const child of node.children ?? [])
            walk(child, depth)

        return result

    }

    expand(id: string) {

        const index = this.indexMap.get(id)
        if (index === undefined) return

        const flatNode = this.flat[index]

        if (!flatNode.hasChildren || flatNode.expanded)
            return

        const treeNode = this.treeMap.get(id)!
        const children = this.flattenSubtree(treeNode, flatNode.depth + 1)

        this.flat.splice(index + 1, 0, ...children)

        flatNode.expanded = true
        flatNode.subtreeSize = children.length

        this.updateParentSizes(flatNode.parentId, children.length)

        this.rebuildIndex()

    }

    collapse(id: string) {

        const index = this.indexMap.get(id)
        if (index === undefined) return

        const node = this.flat[index]

        if (!node.expanded) return

        const removeCount = node.subtreeSize

        this.flat.splice(index + 1, removeCount)

        this.updateParentSizes(node.parentId, -removeCount)

        node.expanded = false
        node.subtreeSize = 0

        this.rebuildIndex()

    }

    private updateParentSizes(parentId: string | null, delta: number) {

        while (parentId) {

            const parentIndex = this.indexMap.get(parentId)

            if (parentIndex === undefined)
                break

            const parentNode = this.flat[parentIndex]

            parentNode.subtreeSize += delta

            parentId = parentNode.parentId

        }

    }

}

// 4. Visualization Helper


// function printFlat(flat: FlatNode[]) {

//     console.log("\nVISIBLE TREE")

//     for (const node of flat) {

//         const indent = " ".repeat(node.depth * 2)

//         console.log(indent + node.id)

//     }

// }

function printFlat(flat: FlatNode[]) {

    console.log("\nVISIBLE TREE")

    for (const node of flat) {

        const indent = " ".repeat(node.depth * 2)

        console.log(indent + node.id +` (subtree=${node.subtreeSize})`);

    }

}


// 5. Running Example
const engine = new VirtualTree(tree)
printFlat(engine.getFlat());


// 6. Expand "SiteA"
engine.expand("SiteA")
printFlat(engine.getFlat())

// 7. Collapse "SiteA"
engine.collapse("SiteA")
printFlat(engine.getFlat())

// 8. Expand "SiteB"

engine.expand("SiteB")
printFlat(engine.getFlat())


// VISIBLE TREE
// SiteA
// SiteB
// Cam4
// Cam5

// index id depth
// 0 SiteA 0
// 1 SiteB 0
// 2 Cam4 1
// 3 Cam5 1


// SiteA → 0
// SiteB → 1
// Cam4 → 2
// Cam5 → 3

// indexMap.get("SiteB") → O(1)


// 🔟 Why This Is Efficient

// Operations:

// operation	complexity
// expand	O(subtree size)
// collapse	O(subtree size)
// lookup	O(1)
// scroll	O(visible rows)

// This scales to 10k + nodes easily.


// 11️⃣ How Virtualization Uses This

// UI pipeline:

// Tree
// ↓
// VirtualTree engine(above code)
// ↓
// flat array
// ↓
// viewport slice
// ↓
// React render

// Example viewport slice:

// const visible = flat.slice(startIndex, endIndex)

// Only visible rows rendered.

// 12️⃣ Example of Visible Window
// flat array size: 10,000
// viewport: 20 rows

// Render:

// rows 500 → 520

// DOM stays tiny.


// 13️⃣ This Is the Architecture Used By

// Large UI systems such as:

// monitoring dashboards

// IDE file explorers

// camera / device trees

// logs viewers

// and virtualization libraries like TanStack Virtual.

// 14️⃣ Key Takeaway

// Efficient virtual trees depend on three structures:

// normalized tree map
//     +
//     flat visible list
//         +
//         index lookup map

// Expand / collapse becomes simple array splice operations.

// -- optimizations

// 9️⃣ Internal Data Structures

// Flat array:

// index id depth subtree
// 0 SiteA 0 0
// 1 SiteB 0 2
// 2 Cam4 1 0
// 3 Cam5 1 0

// Index map:

// SiteA → 0
// SiteB → 1
// Cam4 → 2
// Cam5 → 3

// Lookup:

// indexMap.get("SiteB") → O(1)
// 🔟 Complexity
// operation	cost
// expand	O(subtree)
// collapse	O(1)
// lookup	O(1)
// scroll render	O(visible rows)

// Even with 100k nodes, collapse is instant.

function getVisible(flat: FlatNode[], start: number, size: number) {
    return flat.slice(start, start + size)
}


// Example:

// flat size = 10000
// viewport = 20

// Only 20 nodes rendered.


// 12️⃣ Final Architecture

// Production virtual tree systems use:

// normalized tree map
//     +
//     flat visible array
//         +
//         index map
//             +
//             subtree sizes
//                 +
//                 virtual viewport

// This supports:

// 100k + nodes
// instant expand / collapse
// smooth scrolling