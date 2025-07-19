"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeEnum = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const addRoutePrefix = (route) => { };
// eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
const makeEnum = (values) => { };
exports.makeEnum = makeEnum;
(0, exports.makeEnum)(['a']);
(0, exports.makeEnum)(['a', 'b', 'c']);
// @ts-expect-error since it expects at least one value to be provided
(0, exports.makeEnum)([]);
//# sourceMappingURL=index.js.map