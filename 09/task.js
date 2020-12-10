const fs = require("fs");

const data = fs.readFileSync("input.txt", "utf-8");
const nums = data
  .split("\n")
  .filter((line) => !!line)
  .map((a) => parseInt(a));

const lookBack = 25;
let misMatchFound = false;

const hasSumOfTwo = (numbers, candidate) => {
  return numbers.reduce((found, num, idx, arr) => {
    return found || arr.slice(idx + 1).indexOf(candidate - num) !== -1;
  }, false);
};

let candidate = -1;
for (let i = lookBack; !misMatchFound && i < nums.length; i++) {
  const slice = nums.slice(i - lookBack, i);
  candidate = nums[i];
  // console.log(`Slice: ${JSON.stringify(slice)}, candidate: ${candidate}`);
  if (!hasSumOfTwo(slice, candidate)) {
    misMatchFound = true;
    console.log(`Found ${candidate} at position ${i}`);
  }
}

const found = nums.reduce((foundRange, num, idx, arr) => {
  console.log(`So far ${num}, ${idx}  `, JSON.stringify(foundRange));
  // Short circuit if result is found
  if (foundRange.length > 1) {
    return foundRange;
  }
  let sum = 0;
  let i = idx;
  while (sum < candidate) {
    sum += arr[i++];
  }
  console.log(`Sum: ${sum}, Looking for ${candidate}`);
  if (sum === candidate) {
    return arr.slice(idx, i);
  }
  return [];
}, []);

console.log(JSON.stringify(found));
found.sort();
console.log(
  `Smallest find: ${found[0]}, Largest: ${found[found.length - 1]}, Sum: ${
    found[0] + found[found.length - 1]
  }`
);
