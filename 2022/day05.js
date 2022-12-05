import { groupReader } from "./utils/inputreader.js";

const [stackGroup, instructions] = groupReader(process.argv[2]);

let stacks = [];
stackGroup.map((l) =>
    l.match(/.{1,4}/g).forEach((c, idx) => {
        if (stacks[idx] === undefined) {
            stacks[idx] = new Array();
        }
        if (c[0] === "[") {
            stacks[idx].push(c[1]);
        }
    })
);
// console.dir(stacks);

instructions.forEach((inst) => {
    let [_, count, source, target] = inst.match(/move (\d+) from (\d) to (\d)/);
    count = parseInt(count);
    source = parseInt(source) - 1;
    target = parseInt(target) - 1;
    // console.log(`moving ${count} from ${source} to ${target} (${_})`);
    while (count--) {
        stacks[target].unshift(stacks[source].shift());
    }
    // console.dir(stacks);
});

console.log(`Part 1: Top stacks ${stacks.map((s) => s[0]).join("")}`);

// Recompute starter stacks
stacks = [];
stackGroup.map((l) =>
    l.match(/.{1,4}/g).forEach((c, idx) => {
        if (stacks[idx] === undefined) {
            stacks[idx] = new Array();
        }
        if (c[0] === "[") {
            stacks[idx].push(c[1]);
        }
    })
);
// console.dir(stacks);

instructions.forEach((inst) => {
    let [_, count, source, target] = inst.match(/move (\d+) from (\d) to (\d)/);
    count = parseInt(count);
    source = parseInt(source) - 1;
    target = parseInt(target) - 1;
    // console.log(`moving ${count} from ${source} to ${target} (${_})`);
    stacks[target] = [...stacks[source].splice(0, count), ...stacks[target]];
    // console.dir(stacks);
});

console.log(`Part 2: Top stacks ${stacks.map((s) => s[0]).join("")}`);
