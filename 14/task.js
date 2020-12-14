const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const lines = ir.lineReader(filename);

const mask0base = 0xfffffffff;
const mask1base = 0x000000000;

let mask0 = mask0base;
let mask1 = mask1base;

// mask = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX1XXXX0X
// mem[8] = 11
const maskRe = /mask = [X01]{36}/;
const memRe = /mem\[(\d+)\] = (\d+)/;
const memory = [];
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (maskRe.test(line)) {
    const [_, mask] = line.split(" = ");
    console.log("mask", mask);
    mask0 = BigInt(parseInt(mask.replace(/X/g, "1"), 2));
    mask1 = BigInt(parseInt(mask.replace(/X/g, "0"), 2));
  } else {
    const [_, pos, val] = memRe.exec(line);
    memory[pos] = (BigInt(val) & mask0) | mask1;
  }
}
console.table(memory);
const total = memory.reduce((sum, cell) => (sum = sum + cell), 0n);
console.log("Sum of memory cells:", total);
