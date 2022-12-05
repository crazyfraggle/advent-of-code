import { lineReader } from "./utils/inputreader.js";

const lines = lineReader(process.argv[2]);

const overlaps = lines
    .map((l) => l.split(","))
    .map((elves) =>
        elves.map((elf) => elf.split("-").map((d) => parseInt(d, 10)))
    )
    .filter((elves) => {
        const [elf1, elf2] = elves.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

        return elf1[0] <= elf2[0] && elf1[1] >= elf2[1];
    });

console.log(`Part 1: There are ${overlaps.length} full overlaps`);

const partialOverlaps = lines
    .map((l) => l.split(","))
    .map((elves) =>
        elves.map((elf) => elf.split("-").map((d) => parseInt(d, 10)))
    )
    .filter((elves) => {
        const [elf1, elf2] = elves.sort((a, b) => a[0] - b[0] || b[1] - a[1]);

        return elf1[1] >= elf2[0];
    });

console.log(`Part 2: There are ${partialOverlaps.length} partial overlaps`);
