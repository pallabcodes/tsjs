function doubleScores(scores: readonly number[]) {
  // scores parameter itself  has mutated
  // scores.map((score: number, i: number) => scores[i] = score * 2);
  // here, scores parameter has untouched as the iterated item has mutated
  scores.map((score, i) => score * 2);
  return scores;
}

type PersonScore = {
  name: string;
  score: number;
};

const bill: PersonScore = {
  name: 'Bill',
  score: 90,
};

// function doubleScore2(person: PersonScore) {
//   person.score = person.score * 2;
//   return person;
// }

// const doubleBill = doubleScore2(bill);
// no matter from where it's updated; due to having same reference the object will be updated thus
// console.log(bill, doubleBill); // { name: 'Bill', score: 180 }

function doubleScore2(person: Readonly<PersonScore>) {
  return { ...person, score: person.score * 2 };
}

const doubleBill = doubleScore2(bill);
// now, made a new object (it has a new reference pointer)
console.log(bill, doubleBill); // { name: 'Bill', score: 90 }, { name: "Bill", score: 180 }

// # another way of making readonly immutability [this works on compile time]
// const gohan = {
//   name: "Bill",
//   profile: {
//     level: 1,
//   },
//   scores: [90, 65, 80],
// } as const;
//
// gohan.name = "Bob";
// gohan.profile.level = 2;
// gohan.scores.push(100);

// do immutability at "runtime" by using Object.Freeze()
function deepFreeze<T>(obj: T) {
  const propNames = Object.getOwnPropertyNames(obj);
  for (const name of propNames) {
    const value = (obj as any)[name];
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}

const goku = deepFreeze({
  name: 'Goku',
  profile: {
    level: 1,
  },
  scores: [80, 100],
} as const);

// # making a deep immutable type at "runtime"
type Person = {
  name: string;
  profile: {
    level: number;
  };
  scores: number[];
};

type Immutable<T> = {
  readonly [K in keyof T]: Immutable<T[K]>;
};

const goten: Immutable<Person> = deepFreeze({
  name: 'Goten',
  profile: {
    level: 1,
  },
  scores: [80, 100],
});
