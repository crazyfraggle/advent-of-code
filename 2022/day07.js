import { lineReader } from "./utils/inputreader.js";
import * as path from "path";

const lines = lineReader(process.argv[2]);

const dirs = { "/": { parent: undefined, size: 0 } };
const files = {};

let currentDir = "/";
lines.forEach((line) => {
    if (line[0] === "$") {
        // command
        const [_, cmd, param] = line.slice(2).match(/(\w+)\s*(.*)/);
        // console.log(`command ${cmd} ${param}`);
        if (cmd === "cd") {
            if (param === "/") {
                currentDir = "/";
            } else {
                currentDir = path.resolve(currentDir, param);
            }
            // console.log(`Change to ${currentDir}`);
        }
    } else {
        // Capture ls output
        // console.log(`ls ${line}`);
        const [p1, name] = line.split(" ");
        const fullName = path.resolve(currentDir, name);
        if (p1 === "dir") {
            dirs[fullName] = { parent: currentDir, size: 0 };
        } else {
            const size = parseInt(p1);
            files[fullName] = { dir: currentDir, size };
            let dir = currentDir;
            while (dir !== "/") {
                dirs[dir].size += size;
                dir = path.resolve(dir, "..");
            }
            dirs["/"].size += size;
        }
    }
});
console.dir(dirs);
console.dir(files);

console.log(
    `Part 1: ${Object.values(dirs)
        .filter((d) => d.size < 100000)
        .reduce((a, b) => a + b.size, 0)}`
);

const totalDiskSpace = 70_000_000;
const freeSpace = totalDiskSpace - dirs["/"].size;
const requiredSpace = 30_000_000 - freeSpace;
console.log(`Required space: ${requiredSpace}`);
const dirsLargeEnough = Object.values(dirs)
    .map((d) => d.size)
    .filter((d) => d >= requiredSpace)
    .sort((a, b) => a - b);
console.dir(dirsLargeEnough);
console.log(
    `Part 2: Smallest dir that would free enough space has ${dirsLargeEnough[0]} bytes`
);
