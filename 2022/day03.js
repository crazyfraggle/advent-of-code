import { lineReader } from "./utils/inputreader.js";
import { sum } from "./utils/sum.js";

const charToPriority = (c) =>
    c >= "a" && c <= "z"
        ? c.charCodeAt(0) - "a".charCodeAt(0) + 1
        : c.charCodeAt(0) - "A".charCodeAt(0) + 27;

const lines = lineReader(process.argv[2]);

const cc = lines
    .map((l) => ({
        l1: new Set(
            l
                .slice(0, l.length / 2)
                .split("")
                .map(charToPriority)
        ),
        l2: new Set(
            l
                .slice(l.length / 2)
                .split("")
                .map(charToPriority)
        ),
    }))
    .map(({ l1, l2 }) => {
        let priority = 0;
        for (const p of l1) {
            if (l2.has(p)) {
                priority = p;
                break;
            }
        }
        return priority;
    });

console.log(`Part 1: Sum of priorities: ${sum(cc)}`);

const groups = new Array();
while (lines.length > 0) {
    groups.push(lines.splice(0, 3));
}

const groupPriorities = groups
    .map((g) => ({
        elf1: new Set(g[0].split("").map(charToPriority)),
        elf2: new Set(g[1].split("").map(charToPriority)),
        elf3: new Set(g[2].split("").map(charToPriority)),
    }))
    .map(({ elf1, elf2, elf3 }) => {
        for (const p of elf1) {
            if (elf2.has(p) && elf3.has(p)) {
                return p;
            }
        }
    });

console.log(`Part 2: Sum of group priorities is ${sum(groupPriorities)}`);
