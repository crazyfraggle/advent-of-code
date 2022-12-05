import { groupReader } from "./utils/inputreader.js";

const groups = groupReader(process.argv[2]);

const calories = groups.map((foods) =>
    foods.reduce((calories, food) => (calories += parseInt(food, 10)), 0)
);

console.log(
    `Part 1: The elf carrying the most calories has ${Math.max(
        ...calories
    )} calories`
);

const top3total = calories
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce((a, b) => a + b);
console.log(
    `Part 2: The top 3 calorycarrying elves has a total of ${top3total} calories`
);
