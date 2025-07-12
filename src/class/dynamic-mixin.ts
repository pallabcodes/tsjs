function Timestamped<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

function Taggable<TBase extends new (...args: any[]) => {}>(Base: TBase) {
  return class extends Base {
    tags: string[] = [];
    addTag(tag: string) { this.tags.push(tag); }
  };
}

class BaseClass {}

const MixedClass = Taggable(Timestamped(BaseClass));
const myMixedObj = new MixedClass();
myMixedObj.addTag('cool');
console.log(myMixedObj.tags, myMixedObj.timestamp);