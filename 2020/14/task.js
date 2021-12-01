const ir = require("../inputreader");
const filename = process.argv[2] || "testdata.txt";

const lines = ir.lineReader(filename);

const mask0base = 0xfffffffffn;
const mask1base = 0x000000000n;

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
    const [_, address, val] = memRe.exec(line);
    memory[address] = (BigInt(val) & mask0) | mask1;
  }
}
console.table(memory);
const total = memory.reduce((sum, cell) => (sum = sum + cell), 0n);
console.log("Sum of memory cells:", total);

// Part 2

function explodeAddress(address, mask) {
  const binaryAddress = BigInt(address).toString(2);
  let outputAddresses = [new Array(36).fill("0")];
  binaryAddress.split("").forEach((d, idx, arr) => {
    outputAddresses[0][36 - arr.length + idx] = d;
  });
  // console.log(address, mask, JSON.stringify(outputAddresses));
  mask.split("").forEach((bitOp, idx) => {
    if (bitOp === "1") {
      outputAddresses.forEach((oa) => (oa[idx] = "1"));
    } else if (bitOp === "X") {
      const newAddresses = [];
      outputAddresses.forEach((oa) => {
        oa[idx] = "0";
        const na = oa.slice();
        na[idx] = "1";
        newAddresses.push(na);
      });
      outputAddresses = outputAddresses.concat(newAddresses);
    }
  });
  // console.log(address, mask, JSON.stringify(outputAddresses));
  outputAddresses = outputAddresses.map((oa) => parseInt(oa.join(""), 2));
  // console.log(address, mask, JSON.stringify(outputAddresses));
  return outputAddresses;
}

const mem2 = {};
let mask = "000000000000000000000000000000000000";
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (maskRe.test(line)) {
    [_, mask] = line.split(" = ");
    // console.log("mask", mask);
  } else {
    const [_, address, val] = memRe.exec(line);
    explodeAddress(address, mask).forEach((addr) => {
      mem2[addr] = parseInt(val);
    });
  }
}
// console.table(mem2);
const writtenCells = Object.keys(mem2);
console.log("Number of written cells:", writtenCells.length);
let tot2 = 0;
writtenCells.forEach((cell) => {
  tot2 += mem2[cell];
});
console.log("Sum of memory cells:", tot2);
