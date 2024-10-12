// Pattern Matching: is often not directly available in TypeScript but can be mimicked using discriminated unions.

type Shape = 
    | { kind: 'circle'; radius: number }
    | { kind: 'square'; side: number };

function area(shape: Shape): number {
    switch (shape.kind) {
        case 'circle':
            return Math.PI * shape.radius ** 2;
        case 'square':
            return shape.side ** 2;
    }
}

// Usage
const circleArea = area({ kind: 'circle', radius: 5 }); // circleArea is 78.54
