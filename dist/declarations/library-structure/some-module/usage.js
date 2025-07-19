"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const URL = __importStar(require("url"));
// https://www.typescriptlang.org/docs/handbook/modules.html#working-with-other-javascript-libraries
// https://www.typescriptlang.org/docs/handbook/declaration-files/templates.html
// https://basarat.gitbook.io/typescript/library
// https://bobbyhadz.com/blog/typescript-make-types-global
// https://returnofking04.medium.com/typescript-adding-types-for-global-variables-and-functions-5e2cb024f3d6
// https://www.typescriptlang.org/play?#code/CYUwxgNghgTiAEAzArgOzAFwJYHtXwFsBPAGSwCMAKKALngGcMYtUBzASjsebYG4AoUJFgIU6bHkKkK1OqmQFyIGJ3jzFygfwD02+CwzLEUMAmJly8AN4698NVAIguTFqwG778CCDYYAFnIKSjAedvAgAB5MUPQA-C48rADaALph8AC+-DoAVPAAkojwRDjIMN4UMLBE8P6x8AAOMDiNytgg9BGRjTj0IMDwklDwrBA45FAQ8ABusFhQ5D4ANPAAVsiMTdCm8AEgBHXKIAB08AC0AHzwAJplDP5lEINT9DjbJggYRG1dlAZGT5dKCoQbfNrwKYLejsI5wM65bQ5ITQOAOJz0RqfKQWaz8eyeADqCDAIPgAHdmIZ4ABycwUE7YJxlDDwAC88AArAAGXg0-HeECspkgFlBDShAVEklkkymehdOnScgnGbKei4VA01bkZCs1A4VlgepsBBYDACsB4LZqmAavCJNwCexSvQAFX8xxpXTeTngwgVFJl+DAcCg1JmC1pPiN7LUIHJOIZAGFw5QACwAJlhAHkKnBEMd0AhTqwzjSxJhNUhKGA6PSVamMLCrPATu2spboIGm3ivP7rUxkJgcDBKKhxSF2M6vLoAH7wYn+slhwY0sAnKCsEA0pAtQ4jGlN3csRgg0wC+yrvAQWpb5xqYKaS-weeL4P6VAzHAAawQ65ORpyjHdhd0QfdIVpY9PzPYsXyAmAQLob8sGAGdsgJPQl1JfAURESC5mYRYfEhRVCIYetlROJsAGUhWwNgug5VtyRALBWH8DA6E5VZUEcB8ACIAFlYGQASsj5AUARgYxdlo+i3C6Gx+1Y9jOMnZ9+z4pxHT4F8MCgLAIBIXxWACBJHwldDXXfZd8Epc1-ytVAbUoiwTgANSFAoABE4yzIYKnXQdZjchkvIwXy4wE8gJgEyT7HBBAIqijluDceAAB9LJCGcbOwskWG-P9aQbE5jXAH8m1rUDAtKqiKrAKq0zAVYZmnfl7ErCQQ09JrqrreAm1WeI6BSnzVDQH8DXJVABGyfgypFFk4wARl4IA
let myUrl = URL.parse("https://www.typescriptlang.org");
//# sourceMappingURL=usage.js.map