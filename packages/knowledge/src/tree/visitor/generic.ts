// The generic visitor approach

// Types
export interface TreeNode<T> {
    id: string;
    value: T;
    children?: Array<TreeNode<T>>;
}

export interface Visitor<T> {
    visit(node: TreeNode<T>): void
}

export type PriorityNode<T> = {
    node: TreeNode<T>
    priority: number
};

// dataset

export type Camera = {
    name: string
    severity: number
}

export const cameraTree: TreeNode<Camera> = {
    id: "root",
    value: { name: "Global", severity: 0 },
    children: [
        {
            id: "us",
            value: { name: "USA", severity: 2 },
            children: [
                {
                    id: "ny",
                    value: { name: "New York", severity: 5 },
                    children: [
                        {
                            id: "nyc-1",
                            value: { name: "NYC Camera 1", severity: 9 }
                        },
                        {
                            id: "nyc-2",
                            value: { name: "NYC Camera 2", severity: 4 }
                        }
                    ]
                }
            ]
        },
        {
            id: "eu",
            value: { name: "Europe", severity: 1 },
            children: [
                {
                    id: "fr",
                    value: { name: "France", severity: 3 },
                    children: [
                        {
                            id: "paris-1",
                            value: { name: "Paris Camera 1", severity: 7 }
                        }
                    ]
                }
            ]
        }
    ]
}

// 3. The real visitor implementations.
export class LoggingVisitor<T> implements Visitor<T> {

    visit(node: TreeNode<T>): void {
        console.log("Visited node:", node.id, node.value)
    }

}

// Collects nodes into an array.
export class CollectVisitor<T> implements Visitor<T> {

    private result: Array<TreeNode<T>> = []

    visit(node: TreeNode<T>): void {
        this.result.push(node)
    }

    getResult(): TreeNode<T>[] {
        return this.result
    }

}

export class SeverityFilterVisitor implements Visitor<Camera> {

    private minSeverity: number
    private matches: TreeNode<Camera>[] = []

    constructor(minSeverity: number) {
        this.minSeverity = minSeverity
    }

    visit(node: TreeNode<Camera>): void {

        if (node.value.severity >= this.minSeverity) {
            this.matches.push(node)
        }

    }

    getMatches(): TreeNode<Camera>[] {
        return this.matches
    }

}

// DFS recursive (uses the stack implicitly off course)

export function walkDFSRecursive<T>(node: TreeNode<T>, visitor: Visitor<T>): void {

    visitor.visit(node);

    if (!node.children || node.children.length === 0) {
        return
    }

    for (const child of node.children) {
        walkDFSRecursive(child, visitor)
    }
}

// Usage

console.log("----- Logging Visitor -----")

const logger = new LoggingVisitor()

walkDFSRecursive(cameraTree, logger)

console.log("\n----- Collect Visitor -----")

const collector = new CollectVisitor()

walkDFSRecursive(cameraTree, collector)

const allNodes = collector.getResult()

console.log("Collected nodes:", allNodes.length)

console.log("\n----- Severity Filter Visitor -----")

const severityVisitor = new SeverityFilterVisitor(6)

walkDFSRecursive(cameraTree, severityVisitor)

const severeNodes = severityVisitor.getMatches()

console.log("High severity cameras:")

for (const node of severeNodes) {
    console.log(node.id, node.value)
}