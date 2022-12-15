import { lineReader } from "./utils/inputreader.js";

const lines = lineReader(process.argv[2]).map((l) =>
    l.split(" -> ").map((p) => p.split(",").map((c) => parseInt(c)))
);
console.dir(lines);
const [minX, maxX, maxY] = lines.reduce(
    (a, l) =>
        l.reduce(
            (aa, p) => [
                Math.min(aa[0], p[0]),
                Math.max(aa[1], p[0]),
                Math.max(aa[2], p[1]),
            ],
            a
        ),
    [Infinity, -Infinity, 0]
);
console.log(`MinX: ${minX}, MaxX: ${maxX}, MaxY: ${maxY}`);

const cave = new Array(maxY + 1)
    .fill(0)
    .map((l) => new Array(maxX + 2).fill("."));

function drawLine(cave, line) {
    let start = line[0];
    for (let i = 1; i < line.length; i++) {
        const end = line[i];
        if (start[0] == end[0]) {
            // Vertical line
            for (
                let y = Math.min(start[1], end[1]);
                y <= Math.max(start[1], end[1]);
                y++
            ) {
                cave[y][start[0]] = "#";
            }
        } else {
            // Horisontal line
            for (
                let x = Math.min(start[0], end[0]);
                x <= Math.max(start[0], end[0]);
                x++
            ) {
                cave[start[1]][x] = "#";
            }
        }
        start = end;
    }
}

lines.forEach((line) => drawLine(cave, line));

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

function drawCave(cave, minX) {
    // console.clear();
    cave.forEach((l) => {
        console.log(
            l
                .slice(minX)
                .map((c) => c || ".")
                .join("")
        );
    });
}

function traceSand(cave) {
    let atRest = false;
    let fallenOff = false;
    let x = 500,
        y = 0;
    while (!atRest && !fallenOff) {
        if (y >= maxY) {
            fallenOff = true;
        } else if (cave[y + 1][x] == ".") {
            cave[y][x] = ".";
            cave[y + 1][x] = "o";
        } else if (cave[y + 1][x - 1] == ".") {
            cave[y][x] = ".";
            cave[y + 1][x - 1] = "o";
            x--;
        } else if (cave[y + 1][x + 1] == ".") {
            cave[y][x] = ".";
            cave[y + 1][x + 1] = "o";
            x++;
        } else {
            atRest = true;
        }

        y++;
    }
    return fallenOff;
}

let sands = 0;
while (!traceSand(cave)) {
    sands++;
    // drawCave(cave, minX);
    // await sleep(25);
}

console.log(`Part 1: Sands ${sands}`);

const cave2 = new Array(maxY + 3).fill(0).map((l) => new Array(1000).fill("."));

lines.forEach((line) => drawLine(cave2, line));

function traceSand2(cave) {
    let atRest = false;
    let blocked = false;
    let x = 500,
        y = 0;
    while (!atRest && !blocked) {
        if (y >= maxY + 1) {
            atRest = true;
        } else if (cave[y + 1][x] == ".") {
            cave[y][x] = ".";
            cave[y + 1][x] = "o";
        } else if (cave[y + 1][x - 1] == ".") {
            cave[y][x] = ".";
            cave[y + 1][x - 1] = "o";
            x--;
        } else if (cave[y + 1][x + 1] == ".") {
            cave[y][x] = ".";
            cave[y + 1][x + 1] = "o";
            x++;
        } else if (x == 500 && y == 0) {
            blocked = true;
            console.log(`Blocked at ${x}, ${y}`);
        } else {
            atRest = true;
        }

        y++;
    }
    return blocked;
}
sands = 1;
while (!traceSand2(cave2)) {
    sands++;
    // await sleep(25);
}
drawCave(cave2, minX);
console.log(`Part 2: Sands ${sands}`);
