"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchPost = exports.fetchUser = void 0;
const fetchUser = async (id) => {
    return {
        id,
        firstName: "John",
        lastName: "Doe",
    };
};
exports.fetchUser = fetchUser;
const fetchPost = async (id) => {
    return {
        id,
        title: "Hello World",
        body: "This is a post that is great and is excessively long, much too long for an excerpt.",
    };
};
exports.fetchPost = fetchPost;
//# sourceMappingURL=fetches.js.map