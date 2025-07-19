"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.save = save;
exports.load = load;
const fs_1 = __importDefault(require("fs"));
const storeFile = 'queue.json';
function save(tasks) {
    fs_1.default.writeFileSync(storeFile, JSON.stringify(tasks, null, 2));
}
function load() {
    if (!fs_1.default.existsSync(storeFile))
        return [];
    return JSON.parse(fs_1.default.readFileSync(storeFile, 'utf-8'));
}
//# sourceMappingURL=PersistentStore.js.map