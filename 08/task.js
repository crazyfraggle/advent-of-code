const fs = require("fs");

const data = fs.readFileSync("input.txt", "utf-8");
const ops = data.split("\n").filter((line) => !!line);

const machine = ops.map((op) => {
  const match = /(acc|nop|jmp)\s([+-]\d+)/.exec(op);
  return { opCode: match[1], executed: false, val: parseInt(match[2]) };
});

const instructions = {
  acc: (registry, op) => ({ ax: registry.ax + op.val, ip: registry.ip + 1 }),
  jmp: (registry, op) => ({ ax: registry.ax, ip: registry.ip + op.val }),
  nop: (registry, op) => ({ ax: registry.ax, ip: registry.ip + 1 }),
};

let registry = { ax: 0, ip: 0 };
while (!machine[registry.ip].executed) {
  machine[registry.ip].executed = true;
  registry = instructions[machine[registry.ip].opCode](
    registry,
    machine[registry.ip]
  );
}

console.log(
  `Accumulator was ${registry.ax} before loop detected at ${registry.ip}`
);

// Reset machine
machine.forEach((op) => ({
  ...op,
  executed: false,
}));

registry = { ax: 0, ip: 0 };
let trace = [];
while (registry.ip < machine.length) {
  const op = machine[registry.ip];
  trace.push({
    registry,
    op,
    correction: false,
  });

  registry = instructions[op.opCode](registry, op);

  if (trace.some((tr) => tr.registry.ip === registry.ip)) {
    // About to jump to previously executed code.
    // Retrace code to fix
    const lastCorrection = trace.findIndex((tr) => tr.correction);
    if (lastCorrection !== -1) {
      // Slice away everything since the wrongfully corrected operation
      trace = trace.slice(0, lastCorrection);
    }
    let trimmed = trace.pop();
    while (trimmed.op.opCode === "acc") {
      trimmed = trace.pop();
    }

    // Reset registry
    const newOpCode = trimmed.op.opCode === "jmp" ? "nop" : "jmp";
    const correctedOp = {
      ...trimmed.op,
      opCode: newOpCode,
    };
    trace.push({
      registry,
      op: correctedOp,
      correction: true,
    });
    registry = instructions[newOpCode](trimmed.registry, correctedOp);
  }
}

console.log(`Registry after correction: ${JSON.stringify(registry)}`);
