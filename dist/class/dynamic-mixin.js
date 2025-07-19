"use strict";
function Timestamped(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.timestamp = Date.now();
        }
    };
}
function Taggable(Base) {
    return class extends Base {
        constructor() {
            super(...arguments);
            this.tags = [];
        }
        addTag(tag) { this.tags.push(tag); }
    };
}
class BaseClass {
}
const MixedClass = Taggable(Timestamped(BaseClass));
const myMixedObj = new MixedClass();
myMixedObj.addTag('cool');
console.log(myMixedObj.tags, myMixedObj.timestamp);
//# sourceMappingURL=dynamic-mixin.js.map