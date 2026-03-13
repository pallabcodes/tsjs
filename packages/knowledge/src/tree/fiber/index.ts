type TreeNode = {
    id: string
    children?: TreeNode[]
}

const dataset: TreeNode[] = [
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



type PointerNode = {
    id: string

    parent: PointerNode | null
    child: PointerNode | null
    sibling: PointerNode | null

    expanded: boolean
}


// parent → parent node
// child → first child
// sibling → next sibling


class PointerTree {

    private nodeMap = new Map<string, PointerNode>()
    private rootNodes: PointerNode[] = []

    constructor(data: TreeNode[]) {
        this.buildTree(data)
    }

    private buildTree(data: TreeNode[]) {

        const build = (node: TreeNode, parent: PointerNode | null): PointerNode => {

            const pNode: PointerNode = {
                id: node.id,
                parent,
                child: null,
                sibling: null,
                expanded: false
            }

            this.nodeMap.set(node.id, pNode)

            let prevChild: PointerNode | null = null

            for (const child of node.children ?? []) {

                const childNode = build(child, pNode)

                if (!pNode.child)
                    pNode.child = childNode

                if (prevChild)
                    prevChild.sibling = childNode

                prevChild = childNode

            }

            return pNode

        }

        for (const root of data) {
            const node = build(root, null)
            this.rootNodes.push(node)
        }

    }

    expand(id: string) {
        const node = this.nodeMap.get(id)
        if (node) node.expanded = true
    }

    collapse(id: string) {
        const node = this.nodeMap.get(id)
        if (node) node.expanded = false
    }

    insertChild(parentId: string, newNode: TreeNode) {

        const parent = this.nodeMap.get(parentId)
        if (!parent) return

        const node: PointerNode = {
            id: newNode.id,
            parent,
            child: null,
            sibling: null,
            expanded: false
        }

        this.nodeMap.set(node.id, node)

        if (!parent.child) {
            parent.child = node
            return
        }

        let last = parent.child

        while (last.sibling)
            last = last.sibling

        last.sibling = node

    }

    removeNode(id: string) {

        const node = this.nodeMap.get(id)
        if (!node) return

        const parent = node.parent

        if (!parent) return

        if (parent.child === node) {
            parent.child = node.sibling
        } else {

            let prev = parent.child

            while (prev && prev.sibling !== node)
                prev = prev.sibling

            if (prev)
                prev.sibling = node.sibling

        }

        this.nodeMap.delete(id)

    }

    // flatten visible nodes for rendering
    getVisible(): { id: string, depth: number }[] {

        const result: { id: string, depth: number }[] = []

        const traverse = (node: PointerNode, depth: number) => {

            result.push({ id: node.id, depth })

            if (node.expanded && node.child)
                traverse(node.child, depth + 1)

            if (node.sibling)
                traverse(node.sibling, depth)

        }

        for (const root of this.rootNodes)
            traverse(root, 0)

        return result

    }

}


function printVisible(list: { id: string, depth: number }[]) {

    console.log("\nVISIBLE TREE")

    for (const node of list) {

        const indent = " ".repeat(node.depth * 2)

        console.log(indent + node.id)

    }

}


const tree = new PointerTree(dataset)

printVisible(tree.getVisible());



// VISIBLE TREE
// SiteA
// SiteB

tree.expand("SiteA")
printVisible(tree.getVisible())


// SiteA
//  Cam1
//  Cam2
//  Cam3
// SiteB


tree.expand("Cam3")
printVisible(tree.getVisible())

// SiteA
//  Cam1
//  Cam2
//  Cam3
//   Sensor1
//   Sensor2
// SiteB


tree.insertChild("SiteA", { id: "CamNew" });
printVisible(tree.getVisible());

// SiteA
//  Cam1
//  Cam2
//  Cam3
//   Sensor1
//   Sensor2
//  CamNew
// SiteB


tree.removeNode("Cam2");
printVisible(tree.getVisible());


// SiteA
//  Cam1
//  Cam3
//   Sensor1
//   Sensor2
//  CamNew
// SiteB


function next(node: PointerNode | null): PointerNode | null {

    if (node?.child)
        return node.child

    while (node) {

        if (node.sibling)
            return node.sibling

        node = node.parent

    }

    return null
} // This is essentially how React Fiber walks trees.


