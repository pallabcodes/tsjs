/**
 * Minimal singly linked list node for stack/queue
 */
class ListNode<T> {
    value: T;
    next: ListNode<T> | null = null;
    constructor(value: T) {
        this.value = value;
    }
}

/**
 * Linked list based queue (FIFO)
 */
class LinkedListQueue<T> {
    private head: ListNode<T> | null = null;
    private tail: ListNode<T> | null = null;

    enqueue(value: T) {
        const node = new ListNode(value);
        if (!this.tail) {
            this.head = this.tail = node;
        } else {
            this.tail.next = node;
            this.tail = node;
        }
    }

    dequeue(): T | undefined {
        if (!this.head) return undefined;
        const value = this.head.value;
        this.head = this.head.next;
        if (!this.head) this.tail = null;
        return value;
    }

    isEmpty() {
        return this.head === null;
    }
}

/**
 * Flattens a nested array using a queue implemented with a linked list.
 * This preserves strict left-to-right order (like recursion or stack-based DFS).
 */
export function flattenWithLinkedListQueue(input: unknown[]): unknown[] {
    const queue = new LinkedListQueue<unknown>();
    const result: unknown[] = [];

    // Enqueue all input elements
    for (const item of input) queue.enqueue(item);

    while (!queue.isEmpty()) {
        const elem = queue.dequeue();
        if (Array.isArray(elem)) {
            // Enqueue array elements in order
            for (const item of elem) queue.enqueue(item);
        } else {
            result.push(elem);
        }
    }
    return result;
}

/**
 * Minimal singly linked list based stack (LIFO)
 */
class LinkedListStack<T> {
    private head: ListNode<T> | null = null;

    push(value: T) {
        const node = new ListNode(value);
        node.next = this.head;
        this.head = node;
    }

    pop(): T | undefined {
        if (!this.head) return undefined;
        const value = this.head.value;
        this.head = this.head.next;
        return value;
    }

    isEmpty() {
        return this.head === null;
    }
}

/**
 * Flattens a nested array using a stack implemented with a linked list.
 * This also preserves strict left-to-right order.
 */
export function flattenWithLinkedListStack(input: unknown[]): unknown[] {
    const stack = new LinkedListStack<unknown>();
    const result: unknown[] = [];

    // Push input elements onto stack in reverse order
    for (let i = input.length - 1; i >= 0; i--) {
        stack.push(input[i]);
    }

    while (!stack.isEmpty()) {
        const elem = stack.pop();
        if (Array.isArray(elem)) {
            // Push array elements in reverse order
            for (let i = elem.length - 1; i >= 0; i--) {
                stack.push(elem[i]);
            }
        } else {
            result.push(elem);
        }
    }
    return result;
}


// Example usage:

const nested = [1, [2, [3, [4, 5]], 6], 7];
console.log(flattenWithLinkedListQueue(nested)); // [1, 2, 3, 4, 5, 6, 7]
console.log(flattenWithLinkedListStack(nested)); // [1, 2, 3, 4, 5, 6, 7]