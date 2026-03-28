// Immutability:  ensures that once an object is created, it cannot be modified.

interface User {
    readonly id: number;
    readonly name: string;
}

const user: User = { id: 1, name: 'John Doe' };
// user.name = 'Jane Doe'; // Error: Cannot assign to 'name' because it is a read-only property

const updatedUser = { ...user, name: 'Jane Doe' }; // Create a new user instead


