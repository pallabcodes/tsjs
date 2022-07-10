interface  Student {
  fistName: string;
  surName: string;
  age?: number;
  getSalary: (base: number) => number;
  movieEarnings(bonus: number): number
}

let john: Student = {
  fistName: "John",
  surName: "Lena",
  age: 21,
  getSalary: (base: number = 100000) => base * 12,
  movieEarnings(bonus: number): number {
    return this.getSalary(600000) + bonus || 100000;
  }
}
console.log(john.getSalary(500000), john.movieEarnings(400000));


// # interface declaration
