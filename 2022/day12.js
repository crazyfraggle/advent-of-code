import { lineReader } from "./utils/inputreader.js";

let unvisited = [];
let nodes = lineReader(process.argv[2]).map((l, y) =>
    l.split("").map((c, x) => {
        const height =
            c === "S"
                ? 0
                : c === "E"
                ? 25
                : c.charCodeAt(0) - "a".charCodeAt(0);
        const node = {
            c,
            x,
            y,
            height,
            visited: false,
            d: c == "S" ? 0 : Infinity,
        };
        if (c === "S") {
            unvisited.push(node);
        }
        return node;
    })
);
// console.dir(nodes);

const height = nodes.length;
const width = nodes[0].length;

// function findNextCandidate() {
//     // Find unvisited with lowest score
//     for (let y = 0; y < height; y++) {
//         for (let x = 0; x < width; x++) {
//             const n = nodes[y][x];
//             if (n.visited == false && n.d !== Infinity) {
//                 unvisited.push(n);
//             }
//         }
//     }
//     unvisited = unvisited.sort((a, b) => a.d - b.d);
//     console.dir(unvisited);
//     return unvisited[0];
// }

// Check possible neighbors
function calculateNaboos(node, reachable) {
    const updateNabo = (n) => {
        n.d = n.d <= node.d ? n.d : node.d + 1;
        if (unvisited.indexOf(n) == -1) unvisited.push(n);
    };
    if (node.x > 0 && reachable(nodes[node.y][node.x - 1], node)) {
        updateNabo(nodes[node.y][node.x - 1]);
    }
    if (node.x < width - 1 && reachable(nodes[node.y][node.x + 1], node)) {
        updateNabo(nodes[node.y][node.x + 1]);
    }
    if (node.y > 0 && reachable(nodes[node.y - 1][node.x], node)) {
        updateNabo(nodes[node.y - 1][node.x]);
    }
    if (node.y < height - 1 && reachable(nodes[node.y + 1][node.x], node)) {
        updateNabo(nodes[node.y + 1][node.x]);
    }
    node.visited = true;
    unvisited = unvisited.filter((n) => !n.visited).sort((a, b) => a.d - b.d);
    // console.dir(unvisited);
}

let found = undefined;
const reachableFromStart = (t, node) =>
    t.visited == false && t.height <= node.height + 1;

while (!found) {
    const next = unvisited.shift();
    if (next.c === "E") {
        found = next;
    }
    calculateNaboos(next, reachableFromStart);
}
console.log(`Part 1: We got to 'E' in ${found.d} steps`);

///////////////////////
// Part 2

unvisited = [];
// Reset nodes.
nodes = lineReader(process.argv[2]).map((l, y) =>
    l.split("").map((c, x) => {
        const height =
            c === "S"
                ? 0
                : c === "E"
                ? 25
                : c.charCodeAt(0) - "a".charCodeAt(0);
        const node = {
            c,
            x,
            y,
            height,
            visited: false,
            d: c == "E" ? 0 : Infinity,
        };
        if (c === "E") {
            unvisited.push(node);
        }
        return node;
    })
);

const reachableFromAbove = (t, node) =>
    t.visited == false && t.height >= node.height - 1;
found = undefined;
while (!found) {
    const next = unvisited.shift();
    if (next.height === 0) {
        found = next;
        break;
    }
    // console.log("next:", next);

    calculateNaboos(next, reachableFromAbove);
    // console.dir(unvisited);
}

console.log(`Part 2: Shortest trail from 'E' is ${found.d} steps`);
