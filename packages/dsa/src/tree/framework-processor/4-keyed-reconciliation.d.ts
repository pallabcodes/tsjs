/**
 * 4. KEYED RECONCILIATION ALGORITHM
 *
 * Implements React's O(n) list diffing heuristic.
 */
export type Node = {
    key: string;
    type: string;
    index?: number;
};
export type ReconcileResult = {
    reused: string[];
    moved: string[];
    inserted: string[];
    deleted: string[];
};
export declare function reconcile(oldChildren: Node[], newChildren: Node[]): ReconcileResult;
