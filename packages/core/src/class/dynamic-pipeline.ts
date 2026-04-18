type PipeStage = (input: any) => any;

class Pipeline {
  private stages: PipeStage[] = [];
  addStage(stage: PipeStage) { this.stages.push(stage); }
  run(input: any) {
    return this.stages.reduce((acc, fn) => fn(acc), input);
  }
}

// Usage
const pipeline = new Pipeline();
pipeline.addStage(x => x + 1);
pipeline.addStage(x => x * 2);
console.log(pipeline.run(3)); // (3+1)*2 = 8