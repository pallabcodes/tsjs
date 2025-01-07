// @ts-nocheck
import Comparator from "../../../../../utils/comparator";

/**
 * Represents a node in a linked list.
 */
class LinkedListNode {
    /**
     * Creates an instance of a LinkedListNode.
     * @param {number | null} [value=null] - The value of the node.
     * @param {LinkedListNode | null} [next=null] - The next node in the list.
     */
    constructor(value = null, next = null) {
        /**
         * @type {number | null}
         */
        this.value = value;
        /**
         * @type {LinkedListNode | null}
         */
        this.next = next;
    }

    /**
     * Converts the node value to a string.
     * @param {(value: any) => string} [callback] - A function that takes the node's value and returns a string.
     * @returns {string} The string representation of the node value.
     */
    toString(callback) {
        return typeof callback === 'function' ? callback(this.value) : String(this.value);
    }
}

/**
 * Represents a linked list.
 */
class LinkedList {
    /**
     * Creates an instance of a LinkedList.
     * @param {((a: string | number, b: string | number) => number) | undefined} [comparatorFn] - An optional function used for comparing nodes (e.g., sorting).
     */
    constructor(comparatorFn) {
        // @ts-ignore
        this.head = null;
        this.tail = null;
        this.size = 0;
        // @ts-ignore
        this.compare = new Comparator(comparatorFn);
    }

    /**
     * Adds a new node with the specified value to the beginning of the list.
     * @param {*} value - The value to prepend.
     * @returns {LinkedList} The current linked list instance.
     */
    prepend(value) {
        /**
         * The current code of prepend() properly handles both scenarios:
         * 1. If the list is empty, it sets both the head and tail to the new node.
         * 2. If the list is non-empty, it only updates the head while leaving the tail unchanged.
         */

        // @ts-ignore
        const newNode = new LinkedListNode(value, this.head);  // Create new node with current head as next.
        this.head = newNode;  // Make new node the head of the list.

        if (!this.tail) {
            this.tail = newNode;  // If list was empty, make the new node the tail too.
        }

        return this;
    }

    /**
     * Adds a new node with the specified value to the end of the list.
     * @param {*} value - The value to append.
     * @returns {LinkedList} The current linked list instance.
     */
    append(value) {
        // @ts-ignore
        const newNode = new LinkedListNode(value);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            return this;
        }

        // @ts-ignore
        this.tail?.next = newNode;
        this.tail = newNode;

        return this;
    }

    /**
     * Inserts a new node with the specified value at a given index.
     * @param {*} value - The value to insert.
     * @param {number} rawIndex - The index at which to insert the new node (0-based).
     * @returns {LinkedList} The current linked list instance.
     */
    insert(value, rawIndex) {
        const index = rawIndex < 0 ? 0 : rawIndex;  // Ensure index is non-negative.

        if (index === 0) {
            this.prepend(value);  // If inserting at the beginning, use prepend.
        } else {
            let count = 1;
            let currentNode = this.head;
            const newNode = new LinkedListNode(value);

            while (currentNode) {
                if (count === index) break;
                currentNode = currentNode.next;
                count += 1;
            }

            if (currentNode) {
                newNode.next = currentNode.next;
                currentNode.next = newNode;
            } else {
                if (this.tail) {
                    this.tail.next = newNode;
                    this.tail = newNode;
                } else {
                    this.head = newNode;
                    this.tail = newNode;
                }
            }
        }

        return this;
    }

    /**
   * @return {LinkedListNode}
   */
    deleteHead() {
        if (!this.head) {
            return null;
        }

        const deletedHead = this.head;

        if (this.head.next) {
            this.head = this.head.next;
        } else {
            this.head = null;
            this.tail = null;
        }

        return deletedHead;
    }

    /**
   * @return {LinkedListNode}
   */
    deleteTail() {
        if (!this.tail) {
            // case 1: the linked list is empty so nothing to delete thus return null
            return null;
        };

        const deletedTail = this.tail;

        // case 2: when has single node in the linked lisy
        if (this.head === this.tail) {

            this.head = null;
            this.tail = null;

            return deletedTail;
        }

        // case 3: when there are multiple nodes in the linked list, then iterate to find the `tail`

        let currentNode = this.head;

        while (currentNode.next) {
            if (!currentNode.next.next) {
                currentNode.next = null;
            } else {
                currentNode = currentNode.next;
            }
        }

        this.tail = currentNode;

        return deletedTail
    }

    /**
     * @param {*} value - The value to be removed
     * @returns {LinkedList} The current linked list instance after delete
    */

    // N.B: in case of duplicate values, it will work on first occurance
    delete(value) {

        // I don't know DSA or promgramming

        // 0. Understand the question, and write down all possible smallest inputs

        // 1. Derive the scnarios from all type of possible inputs


        // scnario #1: what if the list is empty ?

        // Case 1: If the list is empty, then return null
        if (!this.head) {
            console.error('No deletion on an empty array, fool');
            return null;
        }

        // scnario #2: what if the value to delete is at the head ?
        // scnario #3: what if the value to delete is in the middle or end ?
        // scnario #4: what if there are multiple occurance of the value ?
        // scnarion #5: Check if the deleted node was the tail and update this.tail accordingly.

        // Case 2: deletable value is at the head (scnarion#2)
        // Case 3: deletable value is at the middle or end (scnarion#3)
        // Case 4: deleteable value is repeated (scnario #4) or the deleteable node is tail then update it

        let deletedNode = null;

        // Scanario 2: Delete nodes matching the value at the head
        while (this.head && this.compare.equal(this.head.value, value)) {
            deletedNode = this.head;
            this.head = this.head.next;
            this.size--;
        }

        // If has a single node, the off course when the above code runs, head will be null


        // So, then check it and then set tail to null and return `deletedNode`

        // 🙏 handle to immediate stage changes as needed though VILA

        if (!this.head) {
            this.tail = null;
            return deletedNode;
        }

        // Scenario 3: Traverse the list to find and delete the node

        let currentNode = this.head;

        while (currentNode.next) {
            if (this.compare.equal(currentNode.next.value, value)) {
                deletedNode = currentNode.next;
                currentNode.next = currentNode.next.next;

                // -> possbile that currentNode.next is null after above assignment

                // 🙏 handle to immediate stage changes as needed though VILA

                if (!currentNode.next) {
                    this.tail = currentNode;
                }

                this.size--;


            } else {
                currentNode = currentNode.next;
            }
        }

        return deletedNode;


    }

    // even though, it seems when does let currentNode = this.head;

    // it is ineeded initially points or share same memory address but then not,

    /**
 * Demonstrates how objects and references behave in JavaScript.
 */
    explainObjectReferenceBehavior() {
        // Step 1: Create an object `og_game` with a nested structure
        const og_game = { val: 1, next: { val: 2, next: null } }; // M1
        console.log("Initial og_game:", og_game);

        // Step 2: Assign `og_game` to a new variable `gaming`
        let gaming = og_game;

        // Both `gaming` and `og_game` now reference the same object in memory.
        // Any changes made to one will reflect in the other.

        // Step 3: Add a new property `og` to `gaming`
        gaming.og = true;

        // Since `gaming` and `og_game` reference the same object,
        // `og_game` also reflects this change.
        console.log("After adding 'og' to gaming:", gaming, og_game);

        // Step 4: Reassign `gaming` to point to `og_game.next`
        gaming = og_game.next;

        // Now, `gaming` references the nested object `{ val: 2, next: null }`.
        console.log("Gaming reassigned to og_game.next:", gaming);

        // Step 5: Add a new property `ps5` to `gaming`
        gaming.ps5 = true;

        // This modifies the nested object inside `og_game`.
        console.log("After adding 'ps5' to gaming:", og_game);

        // Step 6: Delete the `og` property from `og_game`
        delete og_game.og;

        // The `og` property is removed from the original object.
        console.log("After deleting 'og' from og_game:", og_game);

        // Step 7: Verify the state of `gaming`
        // `gaming` still references the nested object with the `ps5` property.
        console.log("Final state of gaming:", gaming);
    }


    /**
    * Reverse a linked list.
    * @returns {LinkedList}
    */

    // Reversing the linked list without creating a new list by rearranging the pointers.

    reverseInPlace() {
        if (!this.head || !this.head.next) {
            // Scenario 1 & 2: Empty list or single node
            return this.head;
        }

        // scnario 3: when linkedlist has multiple nodes

        // Learning/Observations:

        // Use a variable to `track state` (e.g., current progress or result).
        // Modify the variable as needed within the loop or logic flow.
        // Finally, either return it (as the desired outcome) or reset it for reuse in subsequent operations.

        // N.B: so, here used 'state tracking and state reset' to solve this in-place


        let prev = null, current = this.head, next = null;

        while (current) {

            // Save the next node
            next = current.next; // C -> D

            // Reverse the pointer (to understand it better, run this helper fn on an external file or ide i.e. `inPlaceReverseHow` i.e. below)
            current.next = prev; // get me the previous node
            prev = current;

            // Immediately reacted and did what needed to done

            // now, what ? return or continue, what does it mean by continue ?

            // is it the literal `continue` keyword ?

            // well, it could be anything to keep code running

            // so, answer should be with store or action first ?

            // ANSWER: here, stored to keep the iteration


            // Move pointers forward by accessing and using the actual next node i.e. stored on next at first
            current = next;

        }

        // result = 4 -> 3 -> 2 -> 1 (so off course this should be the head now)
        // so the actual head now becomes tail and since current and head shared reference, since current.next is null

        // Update head and tail
        this.tail = this.head;
        this.head = prev;

        return this.head;

    }

    // my implementation after understanding

    // reverse() {

    //     // 1. linked list could be empty or has  a single node, in that case no reversal

    //     if (!this.head || !this.head.next) return null;

    //     // 2. linked list has multiple items

    //     let result = null, currentNode = this.head, next = null;

    //     while (current) {

    //         // save the next node

    //         next = current.next; // 4

    //         // give me the previous node
    //         current.result = result; //  {val: 3 , next: {val: 2 , next: {val: 1, next: null}}}

    //         // save the current node
    //         result = current; // {val: 4 , next: {val: 3 , next: {val: 2 , next: {val: 1, next: null}}}}


    //         // reset and move forward

    //         current = next;

    //     }

    //     // so, now result = 4 -> 3 -> 2 -> 1 so it (or its memory address ) should be head , and to do that just need to pass the `result`

    //     this.head = result;

    //     // tail should be existing this.head (or its memory address) and since it is tail so its next should point to null (so do set that explicitly)

    //     this.tail = this.head;
    //     this.tail.next = null;

    //     return this;

    // }

    inPlaceReverseHow() {
        const current = { val: 2, next: { value: 3, next: { value: 4, next: null } } }

        // console.log(current);

        const prev = { val: 1, next: null };

        current.next = prev;

        const result = current;

        console.log(result);
    }


    reverseNonInPlace() {
        if (!this.head) {
            // Scnario 1: Empty list
            return null;
        }

        // Create a new linked list to hold the reversed nodes
        const reversedList = new LinkedList();
        let current = this.head;

        // Traverse the original list and prepend each node to the reversed list
        while (current) {
            // Create a new node with the current value and point it to the current head of the reversed list


            const newNode = { value: current.value, next: reversedList.head };

            // Update the head of the reversed list to the new node
            reversedList.head = newNode;

            // Move to the next node in the original list
            current = current.next;
        }

        // Set the tail of the reversed list to the original head
        reversedList.tail = this.head;

        // Ensure the new tail does not point to any next node
        reversedList.tail.next = null;


        return reversedList;
    }

    /**
   * @param {Object} findParams
   * @param {*} findParams.value
   * @param {function} [findParams.callback]
   * @return {LinkedListNode}
   */
    find({ value = undefined, callback = undefined }) {

        // Step 1: Check if the list is empty
        if (!this.head) {
            // Scenario 1: Empty list, return null
            return null;
        }



        // Step 2: Start from the head of the list
        let current = this.head;

        // Step 3: Traverse the list to find the node with the given value
        while (current) {
            // If the current node contains the value, return it
            if (current.value === value) {
                return current;
            }

            // Move to the next node in the list
            current = current.next;
        }

        // Step 4: If no matching node is found, return null
        return null;
    }

    /**
 * Finds a node by its value or using a custom callback function.
 *
 * @param {Object} params - The parameters for finding a node.
 * @param {*} params.value - The value to search for in the list (optional).
 * @param {function} [params.callback] - A custom function to check each node (optional).
 * @return {LinkedListNode|null} - The node if found, otherwise null.
 */
    find({ value = undefined, callback = undefined }) {
        // If the list is empty, return null.
        if (!this.head) {
            return null;
        }

        // Start at the head of the list.
        let currentNode = this.head;

        // Traverse the list and check each node.
        while (currentNode) {
            // If a callback is provided, check if it matches the node's value.
            if (callback && callback(currentNode.value)) {
                return currentNode;
            }

            // If a value is provided, compare the node's value with the given value.
            if (value !== undefined && this.compare.equal(currentNode.value, value)) {
                return currentNode;
            }

            // Move to the next node in the list.
            currentNode = currentNode.next;
        }

        // If no node was found, return null.
        return null;
    }

    /**
 * Finds a node by its index.
 *
 * @param {number} index - The index of the node to search for.
 * @return {LinkedListNode|null} - The node at the given index, or null if not found.
 */
    findByIndex(index) {
        // Validate that the index is a non-negative number.
        if (index < 0) {
            return null; // Invalid index.
        }

        // Start at the head of the list.
        let currentNode = this.head;
        let currentIndex = 0;

        // Traverse the list to find the node at the given index.
        while (currentNode) {
            // If the current index matches the requested index, return the current node.
            if (currentIndex === index) {
                return currentNode;
            }

            // Move to the next node and increment the index.
            currentNode = currentNode.next;
            currentIndex++;
        }

        // If the index is out of range (greater than the length of the list), return null.
        return null;
    }



    /**
    * @param {*[]} values - Array of values that need to be converted to linked list.
    * @return {LinkedList}
    */
    fromArray(values) {
        values.forEach((value) => this.append(value));

        return this;
    }

    /**
    * Converts the linked list to an array.
    * @returns {Array<number | null>} An array containing all the node values in the linked list.
    */
    /**
     * Converts the linked list to an array.
     * @returns {Array<number | null>} An array containing all the node values in the linked list.
     */
    toArray() {
        /** @type {Array<number | null>} */
        const nodes = [];
        let currentNode = this.head;
        while (currentNode) {
            nodes.push(currentNode.value);
            currentNode = currentNode.next;
        }
        return nodes;
    }

    /**
    * @param {function} [callback]
    * @return {string}
    */
    toString(callback) {
        // @ts-ignore
        return this.toArray().map((node) => node.toString(callback)).toString();
    }


}

// @ts-ignore
const linkedList = new LinkedList();
console.log(linkedList);

linkedList.prepend(1);
console.log(linkedList.toArray()); // [1]

linkedList.prepend(2);
console.log(linkedList.toArray()); // [2, 1]

linkedList.append(-2);
console.log(linkedList.toArray()); // [2, 1, -2]

linkedList.insert(10, 0);
console.log(linkedList.toArray()); // [10, 2, 1, -2]

linkedList.insert(30, 0);
console.log(linkedList.toArray()); // [30, 10, 2, 1, -2]

linkedList.insert(20, 0);
console.log(linkedList.toArray()); // [20, 30, 10, 2, 1, -2]

// Delete the head node
console.log(linkedList.delete(10));
console.log(linkedList.head);

// Delete the middle node
console.log(linkedList.delete(30));
console.log(linkedList.head);

// Delete the tail node
console.log(linkedList.delete(20));
console.log(linkedList.head);


// Try to delete from an empty list
linkedList.delete(20);
console.log(linkedList.delete(50));