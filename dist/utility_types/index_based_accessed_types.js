"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAddress = updateAddress;
// eslint-disable-next-line @typescript-eslint/no-empty-function
function updateAddress(_id, _newAddress) { }
// eslint-disable-next-line @typescript-eslint/no-unused-vars
let userProperties;
function getProperty(obj, key) {
    return obj[key];
}
const user = { title: 'Fifa', rating: 8 };
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const title = getProperty(user, 'title');
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rating = getProperty(user, 'rating');
// eslint-disable-next-line @typescript-eslint/no-empty-function
document.addEventListener('click', _event => { });
// eslint-disable-next-line @typescript-eslint/no-empty-function
document.addEventListener('keypress', _event => { });
function handleEvent(eventName, callback) {
    // by doing MyEventObjects[K] same as MyEventObjects[keyof MyEventObjects] =
    //  MyMouseEvent | MyKeyboardEvent; thus whether given value is {x: 1, y: 1}/{key: "Enter"}
    // it doesn't throw error since it satisfies one of these MyMouseEvent | MyKeyboardEvent
    if (eventName === 'click') {
        callback({ x: 1, y: 1 });
    }
    else if (eventName === 'keypress') {
        callback({ key: 'Enter' });
    }
}
// eslint-disable-next-line @typescript-eslint/no-empty-function
handleEvent('click', _event => { });
// eslint-disable-next-line @typescript-eslint/no-empty-function
handleEvent('keypress', _event => { });
//# sourceMappingURL=index_based_accessed_types.js.map