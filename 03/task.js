const fs = require("fs");

const data = fs.readFileSync("input3.txt", "utf-8");

const lines = data.split("\n").filter((line) => !!line);

let lineLength = lines[0].length;
let x = 0;
let trees = 0;

function treeHugger(lines, x, y) {
  return lines.reduce((treesHitAcc, line, idx) => {
    if (idx % y !== 0) {
      console.log("SKIP", line);
      return treesHitAcc;
    }

    const loc = ((idx / y) * x) % lineLength;
    if (line[loc] === "#") {
      console.log("HIT ", line, loc);
      return treesHitAcc + 1;
    }

    console.log("MISS", line, loc);
    return treesHitAcc;
  }, 0);
}
console.log(`You hi ${treeHugger(lines, 3, 1)} trees! Ouch!`);

const productOfYourImagination = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2],
].reduce((product, sled) => product * treeHugger(lines, sled[0], sled[1]), 1);
console.log(`Product of trees hit = ${productOfYourImagination}`);
