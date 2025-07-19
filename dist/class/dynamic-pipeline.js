"use strict";
class Pipeline {
    constructor() {
        this.stages = [];
    }
    addStage(stage) { this.stages.push(stage); }
    run(input) {
        return this.stages.reduce((acc, fn) => fn(acc), input);
    }
}
// Usage
const pipeline = new Pipeline();
pipeline.addStage(x => x + 1);
pipeline.addStage(x => x * 2);
console.log(pipeline.run(3)); // (3+1)*2 = 8
//# sourceMappingURL=dynamic-pipeline.js.map