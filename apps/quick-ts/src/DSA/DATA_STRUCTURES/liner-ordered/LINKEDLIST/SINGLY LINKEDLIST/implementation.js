delete(value) {
    // Case 1: Empty list check is handled
    if (!this.head) {
        console.error('No deletion on an empty array, fool');
        return null;
    }
    
    // Need to implement these scenarios:
    // scnario #2: what if the value to delete is at the head ?
    if (this.head.data === value) {
        this.head = this.head.next;
        return true;
    }
    
    // scnario #3: what if the value to delete is in the middle or end ?
    // scnario #4: what if there are multiple occurance of the value ?
    let current = this.head;
    while (current.next) {
        if (current.next.data === value) {
            // Found the value, bypass the node
            current.next = current.next.next;
            return true;
        }
        current = current.next;
    }
    
    // Value not found
    return false;
}