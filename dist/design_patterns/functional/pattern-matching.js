"use strict";
// Pattern Matching: is often not directly available in TypeScript but can be mimicked using discriminated unions.
function area(shape) {
    switch (shape.kind) {
        case 'circle':
            return Math.PI * shape.radius ** 2;
        case 'square':
            return shape.side ** 2;
    }
}
// Usage
const circleArea = area({ kind: 'circle', radius: 5 }); // circleArea is 78.54
//# sourceMappingURL=pattern-matching.js.map