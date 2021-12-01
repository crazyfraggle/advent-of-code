const { exit } = require("process");
const { start } = require("repl");
const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const directions = ir.lineReader(filename);

const dirRe = /^([NSEWLRF])(\d+)$/;
console.log(JSON.stringify(directions));
const dirs = directions.map((d) => {
  const m = dirRe.exec(d);
  return { dir: m[1], val: parseInt(m[2]) };
});
console.log(JSON.stringify(dirs));
const startPos = { N: 0, S: 0, E: 0, W: 0, facing: 90 };
const compass = ["N", "E", "S", "W"];
const endPos = dirs.reduce((acc, d) => {
  const newPos = { ...acc };
  const compassDirection = compass[(acc.facing / 90) & 3];
  switch (d.dir) {
    case "N":
    case "E":
    case "S":
    case "W":
      newPos[d.dir] = acc[d.dir] + d.val;
      break;
    case "F":
      newPos[compassDirection] = acc[compassDirection] + d.val;
      break;
    case "R":
      newPos.facing = acc.facing + d.val;
      break;
    case "L":
      newPos.facing = acc.facing - d.val;
      break;
    default:
      console.error("No way!");
      exit;
  }
  console.log(JSON.stringify(newPos));

  return newPos;
}, startPos);

console.log(
  `Taxicab distance travelled R1: ${
    Math.abs(endPos.N - endPos.S) + Math.abs(endPos.E - endPos.W)
  }`
);

// Part 2

const waypoint = [1, 10, 0, 0];
const endPos2 = dirs.reduce((acc, d) => {
  const newPos = { ...acc };

  switch (d.dir) {
    case "N":
      waypoint[0] = waypoint[0] + d.val;
      break;
    case "E":
      waypoint[1] = waypoint[1] + d.val;
      break;
    case "S":
      waypoint[2] = waypoint[2] + d.val;
      break;
    case "W":
      waypoint[3] = waypoint[3] + d.val;
      break;
    case "F":
      newPos.N = acc.N + waypoint[0] * d.val;
      newPos.E = acc.E + waypoint[1] * d.val;
      newPos.S = acc.S + waypoint[2] * d.val;
      newPos.W = acc.W + waypoint[3] * d.val;
      break;
    case "R":
      for (let r = d.val; r > 0; r -= 90) {
        waypoint.unshift(waypoint.pop());
      }
      break;
    case "L":
      for (let r = d.val; r > 0; r -= 90) {
        waypoint.push(waypoint.shift());
      }
      break;
    default:
      console.error("No way!");
      exit;
  }
  console.log(JSON.stringify(newPos), JSON.stringify(waypoint));

  return newPos;
}, startPos);

console.log(
  `Taxicab distance travelled R2: ${
    Math.abs(endPos2.N - endPos2.S) + Math.abs(endPos2.E - endPos2.W)
  }`
);
