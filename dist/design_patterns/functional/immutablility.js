"use strict";
// Immutability:  ensures that once an object is created, it cannot be modified.
const user = { id: 1, name: 'John Doe' };
// user.name = 'Jane Doe'; // Error: Cannot assign to 'name' because it is a read-only property
const updatedUser = { ...user, name: 'Jane Doe' }; // Create a new user instead
//# sourceMappingURL=immutablility.js.map