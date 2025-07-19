"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.programModeEnumMap = exports.programModeEnumMapFreeze = exports.fakeDataDefaults = void 0;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getUnion = (result) => {
    switch (result.type) {
        case 'a':
            return result.a;
        case 'b':
            return result.b;
        case 'c':
            return result.c;
        default:
            throw new Error('NOT IMPLEMENTED');
    }
};
const fruits = ['apple', 'banana', 'orange'];
// type tests = [Expect<Equal<EventType, 'click' | 'focus' | 'keydown'>>];
function walkToTheOffice(action) {
    const transitions = {
        grabACoffee: 'late',
        keepWalking: 'on time',
    };
    const result = transitions[action];
    console.log(result);
}
walkToTheOffice('grabACoffee'); // late
walkToTheOffice('keepWalking'); // on time
exports.fakeDataDefaults = {
    String: 'Default string',
    Int: 1,
    Float: 1.14,
    Boolean: false,
    ID: 'id',
};
// N.B: problem with this approach (as an alternative for as const) is that it only for first level in case non-primitive which is why "whatever gets a string as datatype while it should get `12` as datatype "
exports.programModeEnumMapFreeze = Object.freeze({
    GROUP: 'group',
    // ANNOUNCEMENT: 'announcement',
    // ONE_ON_ONE: '1on1',
    // SELF_DIRECTED: 'selfDirected',
    // PLANNED_ONE_ON_ONE: 'planned1on1',
    PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
    cool: {
        whatever: '12',
    },
});
// N.B: wheres as const works on any level on nesting correctly (not just like Object.freeze which only works on first level)
exports.programModeEnumMap = {
    GROUP: 'group',
    ANNOUNCEMENT: 'announcement',
    ONE_ON_ONE: '1on1',
    SELF_DIRECTED: 'selfDirected',
    PLANNED_ONE_ON_ONE: 'planned1on1',
    PLANNED_SELF_DIRECTED: 'plannedSelfDirected',
    ANOTHER: {
        whatever: '12',
    },
};
const frontendToBackendEnumMap = {
    singleModule: 'SINGLE_MODULE',
    multiModule: 'MULTI_MODULE',
    sharedModule: 'SHARED_MODULE',
};
//# sourceMappingURL=index.js.map