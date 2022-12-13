import { groupReader } from "./utils/inputreader.js";
import { sum, multiply } from "./utils/sum.js";

const monkeys = groupReader(process.argv[2]);

function parseMonkey(m) {
    const items = m[1]
        .replace(/\s+/g, "")
        .replace("Startingitems:", "")
        .split(",")
        .map((i) => parseInt(i));
    const operation = m[2].replace("Operation:", "").replace("new", "nn");
    const [_, op, am] = m[2].match(/([\*\+])\s+(old|\d+)/);
    const test = parseInt(m[3].match(/\d+/)[0]);
    const trueTarget = parseInt(m[4].match(/\d+/)[0]);
    const falseTarget = parseInt(m[5].match(/\d+/)[0]);
    return { items, op, am, test, trueTarget, falseTarget, checks: 0 };
}

const p1monkeys = monkeys.map(parseMonkey);
console.dir(p1monkeys);
function operate1(i, op, v) {
    v = v == "old" ? i : parseInt(v);
    if (op == "+") return ((i + v) / 3) | 0;
    return ((i * v) / 3) | 0;
}

function operate2(i, op, v, lcm) {
    v = v == "old" ? i : parseInt(v);
    if (op == "+") return i + v;
    return (i * v) % lcm;
}
function round(mks, operate) {
    // for each monkey, check items and throw
    // count items thrown
    const lcm = multiply(mks.map((m) => m.test));
    for (let m = 0; m < mks.length; m++) {
        const monk = mks[m];
        for (let item = monk.items.shift(); item; item = monk.items.shift()) {
            const nv = operate(item, monk.op, monk.am, lcm);
            mks[
                nv % monk.test == 0 ? monk.trueTarget : monk.falseTarget
            ].items.push(nv);
            monk.checks++;
        }
    }
    // mks.forEach((m,i)=>console.log(`Monkey ${i}; ${m.items.join(',')}`));
}

for (let i = 0; i < 20; i++) {
    round(p1monkeys, operate1);
    //console.dir(p1monkeys);
}

console.dir(p1monkeys);
const p1monkeyBusiness = p1monkeys
    .map((m) => m.checks)
    .sort((a, b) => a - b)
    .slice(-2);

console.log(
    `Part 1: Level of monkey business is ${multiply(p1monkeyBusiness)}`
);

const p2monkeys = monkeys.map(parseMonkey);
for (let i = 0; i < 10000; i++) {
    round(p2monkeys, operate2);
}
const p2monkeyBusiness = p2monkeys
    .map((m) => m.checks)
    .sort((a, b) => a - b)
    .slice(-2);
console.dir(p2monkeyBusiness);
console.log(
    `Part 2: Level of monkey business is ${multiply(p2monkeyBusiness)}`
);
