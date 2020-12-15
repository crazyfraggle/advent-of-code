// Inefficient initial solution. Works for 2020.
// const input = [11, 18, 0, 20, 1, 7, 16].reverse();
// while (input.length < 2020) {
//   const lastNumber = input[0];
//   const lastUsedIndex = input.indexOf(lastNumber, 1);
//   input.unshift(lastUsedIndex === -1 ? 0 : lastUsedIndex);
// }
// console.log(`The 2020th number is ${input[0]}`);

const input = [11, 18, 0, 20, 1, 7, 16];

const numbersUsed = {};
const target = 30_000_000;
let lastNumber = -1;
for (let i = 0; i < target; i++) {
  if (i % 1000000 === 0) {
    console.log(`We're at ${i}...`);
  }

  if (i < input.length) {
    lastNumber = input[i];
  } else {
    const number =
      numbersUsed[lastNumber][1] === -1
        ? 0
        : numbersUsed[lastNumber][0] - numbersUsed[lastNumber][1];
    lastNumber = number;
  }

  if (numbersUsed[lastNumber]) {
    numbersUsed[lastNumber][1] = numbersUsed[lastNumber][0];
    numbersUsed[lastNumber][0] = i;
  } else {
    numbersUsed[lastNumber] = [i, -1];
  }
}
console.log(`The ${target}th number is ${lastNumber}`);
