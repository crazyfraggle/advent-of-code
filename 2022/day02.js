import { lineReader } from "./utils/inputreader.js";

const lines = lineReader(process.argv[2]);

// A = X = 1 = Rock
// B = Y = 2 = Paper
// C = Z = 3 = Scissors
const outcomes = {
    "A X": 4, // Draw + 1 Point
    "A Y": 8, // Win + 2 points
    "A Z": 3, // Loss + 3 points
    "B X": 1, // Loss + 1 point
    "B Y": 5, // Draw + 2 points
    "B Z": 9, // Win + 3 points
    "C X": 7, // Win + 1 point
    "C Y": 2, // Loss + 2 points
    "C Z": 6, // Draw + 3 points
};
const fixedBattles = {
    "A X": 3, // Lose + 3 points
    "B X": 1, // Lose + 1 point
    "C X": 2, // Lose + 2 points
    "A Y": 4, // Draw + 1 points
    "B Y": 5, // Draw + 2 points
    "C Y": 6, // Draw + 2 points
    "A Z": 8, // Win + 3 points
    "B Z": 9, // Win + 3 points
    "C Z": 7, // Win + 3 points
};
const battles = lines.map((l) => ({
    line: l,
    outcome: outcomes[l],
    fixed: fixedBattles[l],
}));

console.dir(battles);
console.log(
    `Part 1: Total score of battles is ${battles.reduce(
        (t, b) => (t += b.outcome),
        0
    )}`
);
console.log(
    `Part 2: Total score of fixed battles is ${battles.reduce(
        (t, b) => (t += b.fixed),
        0
    )}`
);
