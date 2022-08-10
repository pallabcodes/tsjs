let i = 0;
do {
  console.log(i);
  i++;
} while (i <= 10);


while (i < 5) {
  console.log(i);
  i++;
}

const binary = [1, 0, 1, 0];
console.log(binary.length);

for (let i = 0; i < binary.length; i++) {
  for (let j = 1; j < binary.length; j++) {
    console.log([binary[i], j]);
  }
}

for (let i = 0; i < 2; i++) {
  console.log(i);
  for (let j = 1; j < 5; j++) {
    console.log([i, j]);
  }
}


for (const binaryKey in binary) {
  console.log(binaryKey);
  console.log(binary[binaryKey]);
}

for (const number of binary) {
  console.log(number);
}
