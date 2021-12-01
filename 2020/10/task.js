const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const adapters = ir.lineReader(filename).map((a) => parseInt(a));

adapters.push(0);
adapters.sort((a, b) => a - b);
adapters.push(adapters[adapters.length - 1] + 3);

const diffs = adapters.reduce(
  (acc, num, idx, arr) => {
    if (idx === arr.length - 1) {
      return acc;
    }
    const diffToNext = arr[idx + 1] - num;
    acc[diffToNext] = acc[diffToNext] + 1;
    return acc;
  },
  { 1: 0, 2: 0, 3: 0 }
);
console.log("Diffs:", JSON.stringify(diffs));
console.log(`Task 1 solution: ${diffs[1] * diffs[3]}`);

console.log(JSON.stringify(adapters));

const mutations = adapters
  .reduce(
    (acc, num, idx, arr) => {
      if (idx === arr.length - 1) {
        return acc;
      }
      const diffToNext = arr[idx + 1] - num;
      if (diffToNext === 1) {
        acc[acc.length - 1].push(num);
      } else {
        acc[acc.length - 1].push(num);
        acc.push([]);
      }
      return acc;
    },
    [[]]
  )
  .map((singles) => singles.length)
  .filter((s) => s > 2)
  .map((s) => ({ 3: 2, 4: 4, 5: 7 }[s]))
  .reduce((acc, mutations) => acc * mutations, 1);

console.log(JSON.stringify(mutations));
